"use client";
/* Demo repository: stores created through /create live in localStorage, so the whole journey
   (choose template → plan → create → visit the live store → order) works without a backend. */
import { DEFS } from "@/templates/defs";
import type { CreateStoreInput, MCategory, MProduct, MStore, PlaceOrderInput, Repo } from "./types";

type Entry = { store: MStore; categories: MCategory[]; products: MProduct[]; orders: number };
type DB = { stores: Record<string, Entry> };
const KEY = "rv-demo-stores-v2";
const listeners = new Set<() => void>();
let cache: DB | null = null;
const read = (): DB => { if (cache) return cache; try { cache = JSON.parse(localStorage.getItem(KEY) ?? "") as DB; } catch { cache = { stores: {} }; } if (!cache?.stores) cache = { stores: {} }; return cache; };
const write = (fn: (d: DB) => void) => { const d = read(); fn(d); cache = { ...d }; localStorage.setItem(KEY, JSON.stringify(cache)); listeners.forEach((l) => l()); };
if (typeof window !== "undefined") window.addEventListener("storage", (e) => { if (e.key === KEY) { cache = null; listeners.forEach((l) => l()); } });
const wait = <T,>(v: T, ms = 120) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const demoRepo: Repo = {
  mode: "demo",
  coupons: true,
  subscribe: (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
  slugTaken: async (slug) => wait(!!read().stores[slug] || DEFS.some((d) => d.slug === slug), 250),
  createStore: async (i: CreateStoreInput) => {
    const tpl = DEFS.find((d) => d.id === i.templateId) ?? DEFS.find((d) => d.id === "essential")!;
    const store: MStore = { slug: i.slug, nameAr: i.nameAr, nameEn: i.nameEn ?? "", color: i.color, whatsapp: i.whatsapp, email: i.email, templateId: tpl.id, planId: i.planId, billing: i.billing, customDomain: i.planId === "free" ? null : i.customDomain || null, status: i.planId === "free" ? "active" : "pending_payment", createdAt: new Date().toISOString() };
    // a new store starts with the template's sample catalogue so it looks complete on day one
    const categories = tpl.cats.map((c, k) => ({ id: "c" + k, nameAr: c.ar, nameEn: c.en }));
    const products: MProduct[] = tpl.products.filter((p) => !p.hidden).map((p) => ({ id: p.id, categoryId: "c" + p.cat, nameAr: p.name.ar, nameEn: p.name.en, descAr: p.desc.ar, descEn: p.desc.en, price: p.price, oldPrice: p.old ?? null, img: p.img, variantLabel: p.variant?.label.ar, variantOptions: p.variant?.options.map((o) => (typeof o === "string" ? o : o.ar)), stock: p.stock ?? null, badge: p.badge ?? null, visible: true }));
    write((d) => { d.stores[i.slug] = { store, categories, products, orders: 0 }; });
    return wait(store, 900);
  },
  storeBySlug: async (slug) => { const e = read().stores[slug]; return e ? { store: e.store, categories: e.categories, products: e.products } : null; },
  placeOrder: async (inp: PlaceOrderInput) => {
    const sub = inp.items.reduce((a, i) => a + (i.price ?? 0) * i.qty, 0);
    const total = inp.coupon?.toUpperCase() === "RVIOS10" ? Math.round(sub * 0.9) : sub;
    let number = 2041; write((d) => { const e = d.stores[inp.slug]; if (e) { e.orders += 1; number = 2040 + e.orders; } });
    return wait({ number, total });
  },
};
