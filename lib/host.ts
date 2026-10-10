/* Which site a request is for — the platform itself or one store — from its Host header.
   Mirrors middleware.ts: <slug>.rvios.store, a paid store's custom domain, or a platform host. */
import { headers } from "next/headers";
import { STORE_DOMAIN } from "./config";

const API = (process.env.UNIFIED_API_URL || process.env.NEXT_PUBLIC_UNIFIED_API_URL || "").replace(/\/+$/, "");
const PLATFORM = new Set(
  (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? `localhost,127.0.0.1,${STORE_DOMAIN},www.${STORE_DOMAIN},store.rvios.com`)
    .split(",").map((h) => h.trim().toLowerCase()).filter(Boolean),
);

export type HostSite = { kind: "platform"; origin: string } | { kind: "store"; slug: string; origin: string };

export async function hostSite(): Promise<HostSite> {
  const h = await headers();
  const raw = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim().toLowerCase();
  const host = raw.split(":")[0];
  const proto = h.get("x-forwarded-proto") ?? (host === "localhost" || host === "127.0.0.1" ? "http" : "https");
  const origin = `${proto}://${raw}`;
  if (host.endsWith("." + STORE_DOMAIN)) {
    const slug = host.slice(0, -(STORE_DOMAIN.length + 1));
    if (slug && slug !== "www") return { kind: "store", slug, origin };
  }
  if (API && host && !PLATFORM.has(host) && !host.endsWith(".localhost") && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    try {
      const r = await fetch(`${API}/shop/storefront/domain/resolve?host=${encodeURIComponent(host.replace(/^www\./, ""))}`, { next: { revalidate: 300 } });
      if (r.ok) { const { slug } = (await r.json()) as { slug: string }; if (slug) return { kind: "store", slug, origin }; }
    } catch { /* treat as the platform */ }
  }
  return { kind: "platform", origin };
}

/** every live store, for the platform's sitemap */
export async function liveStores(): Promise<{ slug: string; updatedAt: string; customDomain: string | null }[]> {
  if (!API) return [];
  try {
    const r = await fetch(`${API}/shop/storefront/sitemap/list`, { next: { revalidate: 3600 } });
    return r.ok ? ((await r.json()) as { slug: string; updatedAt: string; customDomain: string | null }[]) : [];
  } catch { return []; }
}
