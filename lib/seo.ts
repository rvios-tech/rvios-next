/* Store SEO: titles, descriptions, canonical URLs, share cards and schema.org data, all from the
   merchant's real store. One canonical host per store — its custom domain, else <slug>.rvios.store —
   so the same store reachable at several addresses is indexed once. */
import type { Metadata } from "next";
import { storeUrl } from "./config";
import { getCatalogue, getRatings, type StoreSeo } from "./data/unified-server";
import { canonicalSlot, mergeStore } from "./store/merge";
import type { Product, StoreDef } from "./store/types";
import { defBySlug } from "@/templates/defs";

const clip = (s: string, n = 160) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const absolute = (u: string) => (/^https?:\/\//.test(u) ? u : "");

/** Demo template stores are showcases with sample products — kept out of search results. */
const NOINDEX: Metadata["robots"] = { index: false, follow: true };

export interface StoreContext { def: StoreDef; seo: StoreSeo; base: string }

/** The merchant store for a slug, merged with its template — null for demo stores or when unavailable. */
export async function storeContext(slug: string): Promise<StoreContext | null> {
  const r = await getCatalogue(slug);
  if (r.status !== "ok") return null;
  const def = mergeStore(slug, r.data, defBySlug(slug));
  return def ? { def, seo: r.seo, base: storeUrl(slug, r.seo.customDomain) } : null;
}

export async function storeMetadata(slug: string): Promise<Metadata> {
  const ctx = await storeContext(slug);
  if (!ctx) {
    const demo = defBySlug(slug);
    return { title: demo ? `${demo.name.ar} — ${demo.name.en}` : "RVIOS Store", robots: NOINDEX };
  }
  const { seo, base } = ctx;
  const description = clip(seo.tagline || seo.about || `تسوّق من ${seo.name}${seo.city ? ` — ${seo.city}` : ""}`);
  const image = absolute(seo.banner) || absolute(seo.logo) || absolute(ctx.def.products.find((p) => p.srcId)?.img ?? "");
  return {
    title: { absolute: seo.tagline ? `${seo.name} — ${clip(seo.tagline, 60)}` : seo.name },
    description,
    alternates: { canonical: base + "/" },
    openGraph: { type: "website", url: base + "/", siteName: seo.name, title: seo.name, description, locale: "ar", ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title: seo.name, description, ...(image ? { images: [image] } : {}) },
    icons: absolute(seo.logo) ? { icon: seo.logo } : undefined,
  };
}

export async function productMetadata(slug: string, slot: string): Promise<Metadata> {
  const ctx = await storeContext(slug);
  const p = ctx?.def.products.find((x) => x.id === slot);
  if (!ctx || !p) return storeMetadata(slug);
  const canonical = canonicalSlot(ctx.def, slot);
  // a store without products shows the template's sample products — not the merchant's, not indexed
  if (!canonical) return { title: `${p.name.ar} — ${ctx.seo.name}`, robots: NOINDEX };
  const url = `${ctx.base}/p/${canonical}`;
  const title = `${p.name.ar} — ${ctx.seo.name}`;
  const description = clip(p.desc.ar || `${p.name.ar} من ${ctx.seo.name}`);
  const image = absolute(p.img);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: ctx.seo.name, title, description, locale: "ar", ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

/** schema.org Store (home page) */
export function storeJsonLd({ seo, base }: StoreContext) {
  return {
    "@context": "https://schema.org", "@type": "Store", name: seo.name, url: base + "/",
    ...(seo.tagline || seo.about ? { description: clip(seo.tagline || seo.about, 300) } : {}),
    ...(absolute(seo.logo) ? { logo: seo.logo, image: absolute(seo.banner) || seo.logo } : {}),
    ...(seo.whatsapp ? { telephone: `+${seo.whatsapp.replace(/\D/g, "")}` } : {}),
    ...(seo.city || seo.country ? { address: { "@type": "PostalAddress", ...(seo.city ? { addressLocality: seo.city } : {}), ...(seo.country ? { addressCountry: seo.country } : {}) } } : {}),
    currenciesAccepted: seo.currency,
  };
}

/** schema.org Product with its offer (and rating when buyers reviewed it) */
export async function productJsonLd(ctx: StoreContext, p: Product, slug: string) {
  const canonical = canonicalSlot(ctx.def, p.id);
  if (!canonical || !p.srcId) return null;
  const rating = await getRatings(slug, p.srcId);
  return {
    "@context": "https://schema.org", "@type": "Product", name: p.name.ar,
    ...(p.desc.ar ? { description: clip(p.desc.ar, 500) } : {}),
    ...(absolute(p.img) ? { image: [p.img] } : {}),
    brand: { "@type": "Brand", name: ctx.seo.name },
    offers: {
      "@type": "Offer", url: `${ctx.base}/p/${canonical}`, price: p.price, priceCurrency: ctx.seo.currency,
      availability: p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: ctx.seo.name },
    },
    ...(rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.average, reviewCount: rating.count } } : {}),
  };
}

/** JSON-LD script body — `<` escaped so merchant text can never close the script tag */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
