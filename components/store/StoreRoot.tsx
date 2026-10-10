"use client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useRepo } from "@/lib/data";
import type { StoreDef } from "@/lib/store/types";
import type { Catalogue } from "@/lib/data/unified-map";
import { mergeStore } from "@/lib/store/merge";
import { defBySlug } from "@/templates/defs";
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

/** Live merchant data (repo) over the chosen template (lib/store/merge.ts). `initial` is the
    catalogue the server already fetched — the first paint (and the HTML search engines read) is the
    merchant's store; the browser then keeps it fresh. */
export function StoreLayoutClient({ slug, initial, children }: { slug: string; initial?: Catalogue | null; children: React.ReactNode }) {
  const known = defBySlug(slug);
  const { data, loaded } = useRepo((r) => r.storeBySlug(slug), [slug], initial ?? undefined);
  const def = useMemo<StoreDef | null>(() => mergeStore(slug, data, known), [data, known, slug]);
  if (!def) return loaded ? <div className="dz-loading"><p>404</p></div> : <div className="dz-loading"><span className="dz-spin" /></div>;
  return <StoreProvider def={def}>{children}</StoreProvider>;
}
