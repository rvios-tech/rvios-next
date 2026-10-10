/* Merchant data over the chosen template — pure, so the server renders exactly what the browser
   shows (and search engines see the merchant's store, not an empty shell). Merchant products are
   mapped onto the template's product slots so every template layout works with any catalogue. */
import type { Catalogue } from "../data/unified-map";
import type { Product, StoreDef } from "./types";
import { DEFS } from "@/templates/defs";

export function mergeStore(slug: string, data: Catalogue | null, known?: StoreDef): StoreDef | null {
  if (!data) return known ?? null;
  const tpl = DEFS.find((d) => d.id === data.store.templateId) ?? known ?? DEFS.find((d) => d.id === "essential")!;
  // categories follow the products: a store with no products shows the template's samples, so it
  // shows the template's categories too — sample products point at those, and a template may read any of them
  const tplCats = tpl.cats.map((c, k) => ({ id: "_" + k, nameAr: c.ar, nameEn: c.en }));
  const cats = data.products.length && data.categories.length ? data.categories : data.products.length ? [tplCats[0]] : tplCats;
  const idx = (cid: string | null) => Math.max(0, cats.findIndex((c) => c.id === cid));
  const mine: Product[] = data.products.map((p) => ({ id: p.id, srcId: p.id, cat: idx(p.categoryId), name: { ar: p.nameAr, en: p.nameEn || p.nameAr }, desc: { ar: p.descAr, en: p.descEn || p.descAr },
    price: p.price, old: p.oldPrice ?? undefined, img: p.img, stock: p.stock ?? undefined, badge: p.badge ?? undefined,
    variant: p.variantOptions?.length ? { label: { ar: p.variantLabel || "الخيار", en: p.variantLabel || "Option" }, options: p.variantOptions } : undefined }));
  const n = mine.length;
  const slots = n ? tpl.products.filter((bp) => !bp.hidden).map((bp, i) => ({ ...mine[i % n], id: bp.id, cat: Math.min(mine[i % n].cat, cats.length - 1) })) : tpl.products;
  const extra = mine.slice(slots.length);
  return {
    ...tpl, slug, merchant: true, plan: data.store.planId, accent: data.store.color, whatsapp: data.store.whatsapp,
    name: { ar: data.store.nameAr, en: data.store.nameEn || data.store.nameAr },
    cats: cats.map((c) => ({ ar: c.nameAr, en: c.nameEn || c.nameAr })),
    products: [...slots, ...extra, ...tpl.products.filter((bp) => bp.hidden)],
  };
}

/**
 * The one URL id for a merchant product. Few products repeat across the template's slots, so the
 * same product answers at several /p/<slot> URLs — the first slot is canonical, the rest point at it.
 */
export function canonicalSlot(def: StoreDef, slotId: string): string | null {
  const p = def.products.find((x) => x.id === slotId);
  if (!p?.srcId) return null;
  return def.products.find((x) => x.srcId === p.srcId)!.id;
}
