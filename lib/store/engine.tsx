"use client";
/* Storefront engine — cart, coupon, orders, plan preview and helpers shared by every template. */
import { useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useSite } from "@/components/site/Providers";
import { num as fmt, type Bi, type Lang } from "../u";
import { ES, type ES_T } from "./strings";
import { repo } from "../data";
import type { Opt, Plan, Product, StoreDef } from "./types";
import { StoreCtx } from "./ctx";
export { useStoreMaybe } from "./ctx";

export type CartLine = { id: string; opt: string; qty: number };
/** رقم الطلب: عددي في الوضع التجريبي، ومرجعي (RS-XXXXX) في الباكند الموحّد */
type Order = { id: number | string; total: number; lines: CartLine[] };
export type StoreCtxValue = {
  def: StoreDef; lang: Lang; t: ES_T; plan: Plan; setPlan: (p: Plan) => void;
  cart: CartLine[]; add: (id: string, opt?: string, qty?: number) => void; setQty: (k: number, d: number) => void;
  count: number; sub: number; total: number; coupon: boolean; applyCoupon: (c: string) => boolean;
  drawer: boolean; setDrawer: (o: boolean) => void; cat: number | null; setCat: (c: number | null) => void;
  placeOrder: (customer: { name: string; phone: string; city: string; address: string; notes?: string }) => Promise<number | string>; orders: Record<string, Order>;
  L: (o: Bi | Opt) => string; C: <T = string>(k: string) => T; price: (n: number) => string; num: (n: number) => string; prod: (id: string) => Product | undefined; fb: (p: Product) => string;
  badge: (b?: Product["badge"]) => string; base: string; onAdd: ((id: string) => void) | null; setOnAdd: (f: ((id: string) => void) | null) => void;
};
export const useStore = () => { const c = useContext(StoreCtx); if (!c) throw new Error("useStore outside StoreProvider"); return c; };

export function StoreProvider({ def, children }: { def: StoreDef; children: ReactNode }) {
  const { lang, toast } = useSite();
  const t = ES[lang];
  const key = `rv-cart-${def.slug}`;
  const [plan, setPlan] = useState<Plan>(def.plan);
  useEffect(() => setPlan(def.plan), [def.plan]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [cat, setCat] = useState<number | null>(null);
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [onAdd, setOnAddS] = useState<((id: string) => void) | null>(null);
  const setOnAdd = useCallback((f: ((id: string) => void) | null) => setOnAddS(() => f), []);
  useEffect(() => { try { const c = localStorage.getItem(key); if (c) setCart(JSON.parse(c)); const o = localStorage.getItem(key + "-orders"); if (o) setOrders(JSON.parse(o)); } catch {} }, [key]);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(cart)); }, [cart, key]);

  const prod = useCallback((id: string) => def.products.find((p) => p.id === id), [def]);
  const L = useCallback((o: Bi | Opt) => (typeof o === "string" ? o : o[lang] ?? o.ar), [lang]);
  const add = useCallback((id: string, opt = "", qty = 1) => {
    setCart((c) => { const ex = c.find((i) => i.id === id && i.opt === opt); return ex ? c.map((i) => (i === ex ? { ...i, qty: i.qty + qty } : i)) : [...c, { id, opt, qty }]; });
    const p = def.products.find((x) => x.id === id); if (p) toast(`${t.added}: ${p.name[lang]}`);
    onAdd?.(id);
  }, [def, lang, t, toast, onAdd]);
  const setQty = (k: number, d: number) => setCart((c) => c.map((l, i) => (i === k ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));
  const sub = cart.reduce((a, i) => a + (prod(i.id)?.price ?? 0) * i.qty, 0);
  const total = Math.round(sub * (coupon ? 0.9 : 1));
  const placeOrder = async (customer: { name: string; phone: string; city: string; address: string; notes?: string }) => {
    const res = await repo.placeOrder({ slug: def.slug, customer, coupon: coupon ? "RVIOS10" : undefined,
      items: cart.map((i) => { const p = prod(i.id); return { productId: p?.srcId ?? i.id, option: i.opt, qty: i.qty, name: p?.name.ar, price: p?.price }; }) });
    const o = { id: res.number, total: res.total, lines: cart };
    const next = { ...orders, [res.number]: o }; setOrders(next); localStorage.setItem(key + "-orders", JSON.stringify(next));
    setCart([]); setCoupon(false); return res.number;
  };
  const value: StoreCtxValue = {
    def, lang, t, plan, setPlan, cart, add, setQty, count: cart.reduce((a, i) => a + i.qty, 0), sub, total, coupon,
    // كوبون لا يحتسبه الخادم لا يُقبل — خصم يراه العميل ولا يُطبَّق أسوأ من غيابه
    applyCoupon: (c) => { const ok = repo.coupons && c.trim().toUpperCase() === "RVIOS10"; if (ok) setCoupon(true); return ok; },
    drawer, setDrawer, cat, setCat, placeOrder, orders, L,
    C: <T,>(k: string) => { const v = def.copy[k] as Record<string, unknown> | unknown; return (v && typeof v === "object" && !Array.isArray(v) && "ar" in (v as object) ? (v as Record<string, unknown>)[lang] ?? (v as Record<string, unknown>).ar : v) as T; },
    price: (n) => `${fmt(n, lang)} ${t.currency}`, num: (n) => fmt(n, lang), prod, fb: (p) => p.name[lang].trim().charAt(0),
    badge: (b) => (b === "sale" ? t.sale : b === "new" ? t.newIn : t.best), base: `/s/${def.slug}`,
    onAdd, setOnAdd,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
