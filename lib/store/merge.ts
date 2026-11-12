/* Merchant data over the chosen template — pure, so the server renders exactly what the browser
   shows (and search engines see the merchant's store, not an empty shell). Merchant products are
   mapped onto the template's product slots so every template layout works with any catalogue. */
import type { Catalogue } from "../data/unified-map";
import type { Product, StoreDef } from "./types";
import { DEFS } from "@/templates/defs";
import { applyListOverrides } from "./copy-lists";

export function mergeStore(slug: string, data: Catalogue | null, known?: StoreDef): StoreDef | null {
  if (!data) return known ?? null;
  const tpl = DEFS.find((d) => d.id === data.store.templateId) ?? known ?? DEFS.find((d) => d.id === "essential")!;
  // categories follow the products: a store with no products shows the template's samples, so it
  // shows the template's categories too — sample products point at those, and a template may read any of them
  // A merchant's own categories: only those holding a product (the backend rolls sub-categories up
  // into their top parent). Uncategorised products get an "other" tab instead of borrowing the first
  // category; a catalogue with no categories gets one neutral tab, never the template's sample names.
  const tplCats = tpl.cats.map((c, k) => ({ id: "_" + k, nameAr: c.ar, nameEn: c.en }));
  const own = data.categories.filter((c) => data.products.some((p) => p.categoryId === c.id));
  const orphans = data.products.some((p) => !p.categoryId || !own.some((c) => c.id === p.categoryId));
  const OTHER = { id: "_other", nameAr: own.length ? "منتجات أخرى" : "كل المنتجات", nameEn: own.length ? "More products" : "All products" };
  const cats = !data.products.length ? tplCats : own.length ? (orphans ? [...own, OTHER] : own) : [OTHER];
  const idx = (cid: string | null) => { const k = cats.findIndex((c) => c.id === cid); return k < 0 ? cats.length - 1 : k; };
  const mine: Product[] = data.products.map((p) => ({ id: p.id, srcId: p.id, cat: idx(p.categoryId), name: { ar: p.nameAr, en: p.nameEn || p.nameAr }, desc: { ar: p.descAr, en: p.descEn || p.descAr },
    price: p.price, old: p.oldPrice ?? undefined, img: p.img, stock: p.stock ?? undefined, badge: p.badge ?? undefined,
    variant: p.variantOptions?.length ? { label: { ar: p.variantLabel || "الخيار", en: p.variantLabel || "Option" }, options: p.variantOptions } : undefined }));
  const n = mine.length;
  // Essential is a plain grid: each product once (in its editor, deleting a card must remove it). Others need their layout's slots filled.
  const essential = tpl.id === "essential";
  const bases = tpl.products.filter((bp) => !bp.hidden);
  // a product repeated to fill a layout slot is marked `dup`: it still dresses the hero/bento spots,
  // but grids, category filters and counts show each product once
  const slots = !n ? tpl.products : (essential ? mine.slice(0, bases.length).map((m, i) => ({ m, bp: bases[i] })) : bases.map((bp, i) => ({ m: mine[i % n], bp }))).map(({ m, bp }, i) => ({ ...m, id: bp.id, cat: Math.min(m.cat, cats.length - 1), ...(!essential && i >= n ? { dup: true } : {}) }));
  const extra = mine.slice(slots.length);
  const look = data.store.appearance ?? {};
  const text = (v: string) => ({ ar: v, en: v });
  const essentialCopy = essential && Object.fromEntries(Object.entries({
    // the merchant's own words — the template's sample copy is about its coffee demo store
    h1: data.store.nameAr, sub: data.store.tagline ?? "", story: "عن المتجر", storyTxt: data.store.about ?? "", city: data.store.city ?? "",
    ...look.copy,
  }).map(([k, v]) => [k, text(v)]));
  return {
    ...tpl, slug, merchant: true,
    // other templates: the merchant's words replace the template's own text, key by key (lists and objects stay the template's)
    // القوائم (المزايا، الشريط، الضمانات…) تُعدَّل عنصرًا عنصرًا بمفاتيح `<key>_<i>` — copy-lists.ts
    copy: essential ? { ...tpl.copy, ...essentialCopy } : applyListOverrides({ ...tpl.copy, ...Object.fromEntries(Object.entries(look.copy ?? {}).filter(([k]) => typeof tpl.copy[k] === "string" || (tpl.copy[k] && typeof tpl.copy[k] === "object" && "ar" in (tpl.copy[k] as object))).map(([k, v]) => [k, text(v)])) }, look.copy),
    look: { logo: data.store.logo ?? "", heroImg: essential ? data.store.banner ?? "" : "", storyImg: essential ? data.store.showcase ?? "" : "", hidden: look.hidden ?? [], images: look.images ?? {}, fonts: look.fonts ?? {}, social: look.social ?? {}, extras: look.extras ?? {} },
    info: {
      about: data.store.about || data.store.tagline || "", address: [data.store.address, data.store.city].filter(Boolean).join("، "), hours: data.store.hours ?? "",
      phone: data.store.whatsapp ? `+${data.store.whatsapp}` : "", payMethods: (data.store.payMethods || "cod").split(",").filter(Boolean),
      payNote: data.store.payNote ?? "", deliveryNote: data.store.deliveryNote ?? "",
    }, plan: data.store.planId, accent: data.store.color, whatsapp: data.store.whatsapp,
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
