import { NextResponse, type NextRequest } from "next/server";
import { STORE_DOMAIN } from "@/lib/config";

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
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|favicon|logo.svg|.*\..*).*)"] };
