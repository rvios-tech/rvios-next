/* Unified-backend JSON → the platform's data shapes. Shared by the browser repo (unified.ts) and
   server rendering (unified-server.ts), so a store renders identically on both sides. */
import type { MCategory, MProduct, MStore, PlanId } from "./types";

export type Json = Record<string, unknown>;

export const toStore = (s: Json): MStore => ({
  slug: s.slug as string, nameAr: s.name as string, nameEn: "", color: (s.color as string) ?? "#C1272D",
  whatsapp: (s.whatsapp as string) ?? "", email: "", templateId: (s.template as string) ?? "essential",
  planId: ((s.planTier as PlanId) ?? "free"), customDomain: (s.customDomain as string) ?? null, status: "active", createdAt: (s.createdAt as string) ?? "",
  logo: (s.logo as string) ?? "", banner: (s.banner as string) ?? "", showcase: (s.showcase as string) ?? "",
  tagline: (s.tagline as string) ?? "", about: (s.about as string) ?? "", city: (s.city as string) ?? "",
  appearance: (s.appearance as MStore["appearance"]) ?? {},
  address: (s.address as string) ?? "", hours: (s.hours as string) ?? "", payMethods: (s.payMethods as string) ?? "",
  payNote: (s.payNote as string) ?? "", deliveryNote: (s.deliveryNote as string) ?? "",
});

export const toProduct = (p: Json): MProduct => {
  const axes = (p.axes as { name: string; values: { value: string }[] }[]) ?? [];
  const old = p.oldPrice as number | null;
  return {
    id: p.id as string, categoryId: (p.categoryId as string) ?? null, nameAr: p.name as string, nameEn: "",
    descAr: ((p.description as string) || (p.summary as string)) ?? "", descEn: "",
    price: Number(p.price), oldPrice: old ?? null, img: (p.image as string) ?? "",
    // the templates show one option row — the first axis (size, colour…) carries the choice
    variantLabel: axes[0]?.name, variantOptions: axes[0]?.values.map((v) => v.value),
    stock: (p.qty as number) ?? null, badge: old && old > Number(p.price) ? "sale" : null, visible: true,
  };
};

export type Catalogue = { store: MStore; categories: MCategory[]; products: MProduct[] };

export const toCatalogue = (c: Json): Catalogue => ({
  store: toStore(c.store as Json),
  categories: ((c.categories as Json[]) ?? []).map((x) => ({ id: x.id as string, nameAr: x.name as string, nameEn: "" })),
  products: ((c.products as Json[]) ?? []).map(toProduct),
});
