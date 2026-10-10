import { NextResponse, type NextRequest } from "next/server";
import { STORE_DOMAIN } from "@/lib/config";
import { isRegion, regionOfCountry, REGION_COOKIE, REGION_PIN_COOKIE, type Region } from "@/lib/contact";

/**
 * Store hosts → their storefront:
 *   <slug>.rvios.store  → /s/<slug>
 *   mystore.com         → /s/<slug>  (a paid store's custom domain, resolved by the unified backend)
 *
 * The platform's own hosts (NEXT_PUBLIC_PLATFORM_HOSTS) and local development are served as is.
 * Custom-domain lookups are cached per instance: 5 minutes for a hit, 1 for a miss.
 */
const API = (process.env.UNIFIED_API_URL || process.env.NEXT_PUBLIC_UNIFIED_API_URL || "").replace(/\/+$/, "");
const PLATFORM = new Set(
  (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? `localhost,127.0.0.1,${STORE_DOMAIN},www.${STORE_DOMAIN},store.rvios.com`)
    .split(",").map((h) => h.trim().toLowerCase()).filter(Boolean),
);
const cache = new Map<string, { slug: string | null; until: number }>();

async function slugForDomain(host: string): Promise<string | null> {
  const hit = cache.get(host);
  if (hit && hit.until > Date.now()) return hit.slug;
  let slug: string | null = null;
  try {
    const r = await fetch(`${API}/shop/storefront/domain/resolve?host=${encodeURIComponent(host)}`, { cache: "no-store" });
    if (r.ok) slug = ((await r.json()) as { slug?: string }).slug ?? null;
  } catch { /* backend unreachable: serve the platform rather than an error */ }
  cache.set(host, { slug, until: Date.now() + (slug ? 300_000 : 60_000) });
  return slug;
}

const toStore = (req: NextRequest, slug: string) => {
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/s/")) return NextResponse.next();
  url.pathname = `/s/${slug}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
};

/**
 * The visitor's country, from a header the host sets after its own GeoIP lookup — never from the
 * browser: Vercel, then Cloudflare, then CloudFront, and x-country-code for any other proxy.
 * null when absent (local dev): the saved or default region stays.
 */
// cf-ipcountry أولًا: خلف وكيل Cloudflare يرى Vercel عنوان خادم Cloudflare لا الزائر، فترويسته
// تصف موقع Cloudflare. ترويسة Cloudflare نفسها تصف الزائر، وتغيب حين لا وكيل فتُستعمل ترويسة Vercel.
const GEO_HEADERS = ["cf-ipcountry", "x-vercel-ip-country", "cloudfront-viewer-country", "x-country-code"];
const countryOf = (req: NextRequest) => {
  for (const h of GEO_HEADERS) { const v = req.headers.get(h); if (v && /^[A-Za-z]{2}$/.test(v)) return v; }
  return null;
};

/**
 * Region of the RVIOS contact number on the platform's pages: pinned by hand (?region=) first,
 * then detected. Written to a cookie the <head> script reads — the HTML itself never varies by
 * country, so cached pages can't hand one country's number to another (see lib/contact.ts).
 */
function withRegion(req: NextRequest, res: NextResponse) {
  const asked = req.nextUrl.searchParams.get("region");
  const secure = req.nextUrl.protocol === "https:";
  if (isRegion(asked)) res.cookies.set(REGION_PIN_COOKIE, asked, { path: "/", maxAge: 31_536_000, sameSite: "lax", secure });
  const pinned = req.cookies.get(REGION_PIN_COOKIE)?.value;
  const cc = countryOf(req);
  const region: Region | null = isRegion(asked) ? asked : isRegion(pinned) ? pinned : cc ? regionOfCountry(cc) : null;
  // no Set-Cookie unless it changed: a response without one stays cacheable at any CDN
  if (region && req.cookies.get(REGION_COOKIE)?.value !== region) res.cookies.set(REGION_COOKIE, region, { path: "/", maxAge: 2_592_000, sameSite: "lax", secure });
  return res;
}

export async function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (host.endsWith("." + STORE_DOMAIN)) {
    const slug = host.slice(0, -(STORE_DOMAIN.length + 1));
    if (slug && slug !== "www") return toStore(req, slug);
  }
  if (API && host && !PLATFORM.has(host) && !host.endsWith(".localhost") && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const slug = await slugForDomain(host.replace(/^www\./, ""));
    if (slug) return toStore(req, slug);
  }
  return withRegion(req, NextResponse.next());
}
// `[.]`, not `\.`: in a plain string "\." is just "." — the matcher became `.*..*` (every path)
// and the middleware only ran on `/`, so `<slug>.rvios.store/p/…` was never rewritten.
export const config = { matcher: ["/((?!_next|favicon|logo[.]svg|.*[.].*).*)"] };
