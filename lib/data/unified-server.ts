/* Server-side catalogue fetch for store pages (unified mode). Cached per request with React's
   `cache` (layout, page and metadata share one call) and across requests for 60s (ISR), so a store
   page is server-rendered with the merchant's real data — what search engines and link previews see. */
import { cache } from "react";
import { toCatalogue, type Catalogue, type Json } from "./unified-map";

const API = (process.env.UNIFIED_API_URL || process.env.NEXT_PUBLIC_UNIFIED_API_URL || "").replace(/\/+$/, "");
export const unifiedServerOn = !!API;

/** what metadata needs beyond the render shapes */
export interface StoreSeo {
  name: string; tagline: string; about: string; logo: string; banner: string; city: string;
  whatsapp: string; currency: string; country: string; customDomain: string | null;
}

export type ServerCatalogue =
  | { status: "ok"; data: Catalogue; seo: StoreSeo }
  | { status: "moved"; slug: string }
  | { status: "missing" }
  | { status: "unavailable" };

export const getCatalogue = cache(async (slug: string): Promise<ServerCatalogue> => {
  if (!API) return { status: "unavailable" };
  try {
    const res = await fetch(`${API}/shop/storefront/${encodeURIComponent(slug)}/catalogue`, { next: { revalidate: 60, tags: [`store:${slug}`] } });
    if (res.status === 404 || res.status === 410) return { status: "missing" };
    if (!res.ok) return { status: "unavailable" };
    const c = (await res.json()) as Json;
    if (typeof c.moved === "string") return { status: "moved", slug: c.moved };
    const s = c.store as Json;
    const str = (k: string) => (typeof s[k] === "string" ? (s[k] as string) : "");
    return {
      status: "ok",
      data: toCatalogue(c),
      seo: {
        name: str("name"), tagline: str("tagline"), about: str("about"), logo: str("logo"), banner: str("banner"), city: str("city"),
        whatsapp: str("whatsapp"), currency: str("currencyCode") || "SAR", country: str("country"), customDomain: (s.customDomain as string) || null,
      },
    };
  } catch {
    // backend unreachable: the page still renders and the browser loads the store itself
    return { status: "unavailable" };
  }
});

/** published reviews summary for a product (real id) — for rich results; null when none */
export const getRatings = cache(async (slug: string, productId: string): Promise<{ average: number; count: number } | null> => {
  if (!API) return null;
  try {
    const res = await fetch(`${API}/shop/storefront/${encodeURIComponent(slug)}/products/${encodeURIComponent(productId)}/reviews`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const r = (await res.json()) as { average?: number; count?: number };
    return r.count ? { average: Number(r.average), count: r.count } : null;
  } catch { return null; }
});
