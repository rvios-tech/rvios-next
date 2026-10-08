"use client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useRepo } from "@/lib/data";
import type { Product, StoreDef } from "@/lib/store/types";
import { DEFS, defBySlug } from "@/templates/defs";
import { MODULES } from "@/templates/registry";
import { StoreProvider, useStore } from "@/lib/store/engine";
import { CheckoutPage, OrderDone, ProductPage, StoreShell } from "./StoreParts";

type View = { v: "home" } | { v: "p"; id: string } | { v: "checkout" } | { v: "order"; id: string };

function Inner({ view }: { view: View }) {
  const { def, prod, base } = useStore(); const mod = MODULES[def.id]; const router = useRouter();
  let body;
  if (view.v === "p") { const p = prod(view.id) ?? def.products[0]; body = <ProductPage p={p} Card={mod.Card} />; }
  else if (view.v === "checkout") body = <CheckoutPage onPlaced={(id) => router.push(`${base}/order/${id}`)} />;
  else if (view.v === "order") body = <OrderDone id={decodeURIComponent(view.id)} />;
  else body = <mod.Home />;
  return <StoreShell mod={mod} route={view.v + ("id" in view ? view.id : "")}>{body}</StoreShell>;
}

/** Rendered by each route; the provider lives in the store layout so cart & plan persist across pages. */
export function StoreRoot({ view }: { slug?: string; view: View }) {
  return <Inner view={view} />;
}

/** Merges live merchant data (repo) over the chosen template. Merchant products are mapped onto the
    template's product slots so every template layout works with any catalogue. */
export function StoreLayoutClient({ slug, children }: { slug: string; children: React.ReactNode }) {
  const known = defBySlug(slug);
  const { data, loaded } = useRepo((r) => r.storeBySlug(slug), [slug]);
  const def = useMemo<StoreDef | null>(() => {
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
      ...tpl, slug, plan: data.store.planId, accent: data.store.color, whatsapp: data.store.whatsapp,
      name: { ar: data.store.nameAr, en: data.store.nameEn || data.store.nameAr },
      cats: cats.map((c) => ({ ar: c.nameAr, en: c.nameEn || c.nameAr })),
      products: [...slots, ...extra, ...tpl.products.filter((bp) => bp.hidden)],
    };
  }, [data, known, slug]);
  if (!def) return loaded ? <div className="dz-loading"><p>404</p></div> : <div className="dz-loading"><span className="dz-spin" /></div>;
  return <StoreProvider def={def}>{children}</StoreProvider>;
}
