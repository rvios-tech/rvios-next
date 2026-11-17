"use client";
/* Storefront engine — cart, coupon, orders, plan preview and helpers shared by every template. */
import { customerToken } from "./customer";
import { useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useSite } from "@/components/site/Providers";
import { num as fmt, type Bi, type Lang } from "../u";
import { ES, type ES_T } from "./strings";
import { repo } from "../data";
import type { Opt, Plan, Product, StoreDef } from "./types";
import { StoreCtx } from "./ctx";
import { track } from "./pixels";
export { useStoreMaybe } from "./ctx";

export type CartLine = { id: string; opt: string; qty: number };
/** قسيمة طبّقها العميل — قيمتها من الخادم، والطلب يعيد حسابها هناك */
export type AppliedCoupon = { code: string; kind: "percent" | "amount" | "ship"; value: number; maxDiscount: number; minSubtotal: number };
/** الخصم على المجموع كما يحسبه الخادم (couponDiscount) — «توصيل مجاني» سطرٌ لا رقم: الرسم يُحدَّد مع المتجر */
export const couponOff = (c: AppliedCoupon, sub: number) => {
  if (c.kind === "ship") return 0;
  if (c.kind === "amount") return Math.min(sub, c.value);
  const d = Math.floor((sub * Math.min(100, c.value)) / 100);
  return Math.min(sub, c.maxDiscount > 0 ? Math.min(d, c.maxDiscount) : d);
};
/** رقم الطلب: عددي في الوضع التجريبي، ومرجعي (RS-XXXXX) في الباكند الموحّد */
type Order = { id: number | string; total: number; lines: CartLine[] };
export type StoreCtxValue = {
  def: StoreDef; lang: Lang; t: ES_T; plan: Plan; setPlan: (p: Plan) => void;
  cart: CartLine[]; add: (id: string, opt?: string, qty?: number) => void; setQty: (k: number, d: number) => void;
  count: number; sub: number; total: number; discount: number; coupon: AppliedCoupon | null; couponLabel: string;
  /** يعيد رسالة الخطأ، أو null حين يُطبَّق */
  applyCoupon: (c: string) => Promise<string | null>; clearCoupon: () => void; couponField: boolean;
  /** المفضلة — معرّفات منتجات القالب، محفوظة في متصفح الزائر لكل متجر */
  wish: string[]; toggleWish: (id: string) => void;
  drawer: boolean; setDrawer: (o: boolean) => void; cat: number | null; setCat: (c: number | null) => void;
  placeOrder: (customer: { name: string; phone: string; city: string; address: string; notes?: string }, spend?: { walletUsed?: number; pointsUsed?: number }) => Promise<number | string>; orders: Record<string, Order>;
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
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [wish, setWish] = useState<string[]>([]);
  useEffect(() => { try { const w = localStorage.getItem(key + "-wish"); if (w) setWish(JSON.parse(w)); } catch {} }, [key]);
  const [cat, setCat] = useState<number | null>(null);
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [onAdd, setOnAddS] = useState<((id: string) => void) | null>(null);
  const setOnAdd = useCallback((f: ((id: string) => void) | null) => setOnAddS(() => f), []);
  useEffect(() => { try { const c = localStorage.getItem(key); if (c) setCart(JSON.parse(c)); const o = localStorage.getItem(key + "-orders"); if (o) setOrders(JSON.parse(o)); } catch {} }, [key]);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(cart)); }, [cart, key]);

  const prod = useCallback((id: string) => def.products.find((p) => p.id === id), [def]);
  const L = useCallback((o: Bi | Opt) => (typeof o === "string" ? o : o[lang] ?? o.ar), [lang]);
  const add = useCallback((id: string, opt = "", qty = 1) => {
    // a merchant store with no products yet shows the template's samples — they can't be ordered
    const sample = def.merchant ? def.products.find((x) => x.id === id && !x.srcId) : undefined;
    if (sample) { toast(t.sample); return; }
    setCart((c) => { const ex = c.find((i) => i.id === id && i.opt === opt); return ex ? c.map((i) => (i === ex ? { ...i, qty: i.qty + qty } : i)) : [...c, { id, opt, qty }]; });
    const p = def.products.find((x) => x.id === id); if (p) toast(`${t.added}: ${p.name[lang]}`);
    if (p && def.merchant) track("add", { value: p.price * qty, currency: def.currencyCode, id: p.srcId ?? p.id, name: p.name.ar, qty });
    onAdd?.(id);
  }, [def, lang, t, toast, onAdd]);
  const setQty = (k: number, d: number) => setCart((c) => c.map((l, i) => (i === k ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));
  const sub = cart.reduce((a, i) => a + (prod(i.id)?.price ?? 0) * i.qty, 0);
  const discount = coupon ? couponOff(coupon, sub) : 0;
  const total = Math.max(0, sub - discount);
  // سلة نزلت دون الحد الأدنى لا تحمل القسيمة — وإلا رفضها الخادم عند الطلب
  useEffect(() => { if (coupon && coupon.minSubtotal > 0 && sub < coupon.minSubtotal) setCoupon(null); }, [coupon, sub]);
  const placeOrder = async (customer: { name: string; phone: string; city: string; address: string; notes?: string }, spend?: { walletUsed?: number; pointsUsed?: number }) => {
    if (def.merchant && cart.some((i) => !prod(i.id)?.srcId)) throw new Error(t.sample);
    // العميل المسجّل الدخول: الطلب في حسابه، وله الدفع من محفظته ومكافآته
    const token = def.merchant && def.accounts ? customerToken(def.slug) : "";
    const res = await repo.placeOrder({ slug: def.slug, customer, coupon: coupon?.code, ...(token ? { token, ...spend } : {}),
      items: cart.map((i) => { const p = prod(i.id); return { productId: p?.srcId ?? i.id, option: i.opt, qty: i.qty, name: p?.name.ar, price: p?.price }; }) });
    const o = { id: res.number, total: res.total, lines: cart };
    track("purchase", { value: res.total, currency: def.currencyCode, ref: String(res.number), items: cart.map((i) => { const p = prod(i.id); return { id: p?.srcId ?? i.id, name: p?.name.ar ?? "", price: p?.price ?? 0, qty: i.qty }; }) });
    const next = { ...orders, [res.number]: o }; setOrders(next); localStorage.setItem(key + "-orders", JSON.stringify(next));
    setCart([]); setCoupon(null); return res.number;
  };
  const value: StoreCtxValue = {
    def, lang, t, plan, setPlan, cart, add, setQty, count: cart.reduce((a, i) => a + i.qty, 0), sub, total, discount, coupon,
    couponLabel: !coupon ? "" : coupon.kind === "ship" ? t.freeShip : coupon.kind === "amount" ? `${t.discount} ${fmt(coupon.value, lang)} ${t.currency}` : `${t.discount} ${fmt(coupon.value, lang)}${lang === "ar" ? "٪" : "%"}`,
    // متجر التاجر: حين يملك قسيمة مفعّلة · معاينة القالب: في الباقات المدفوعة (الرمز التجريبي)
    couponField: def.merchant ? !!def.coupons : plan !== "free",
    // الخصم من الخادم وحده — خصم يراه العميل ولا يُطبَّق أسوأ من غيابه
    applyCoupon: async (c) => {
      const code = c.trim(); if (!code) return t.couponBad;
      if (def.merchant && repo.checkCoupon) {
        try { const r = await repo.checkCoupon(def.slug, code, sub); setCoupon({ code: r.code, kind: r.kind, value: r.value, maxDiscount: r.maxDiscount, minSubtotal: r.minSubtotal }); return null; }
        catch (e) { return (e as Error).message || t.couponBad; }
      }
      if (repo.coupons && code.toUpperCase() === "RVIOS10") { setCoupon({ code: "RVIOS10", kind: "percent", value: 10, maxDiscount: 0, minSubtotal: 0 }); return null; }
      return t.couponBad;
    },
    clearCoupon: () => setCoupon(null),
    wish,
    // الأثر الجانبي (رسالة، حدث إعلاني، حفظ) خارج دالة التحديث: React يستدعيها أثناء الرسم
    toggleWish: (id) => {
      const on = !wish.includes(id);
      const next = on ? [id, ...wish].slice(0, 100) : wish.filter((x) => x !== id);
      setWish(next);
      try { localStorage.setItem(key + "-wish", JSON.stringify(next)); } catch {}
      const p = def.products.find((x) => x.id === id);
      if (on && p) { toast(`${t.wished}: ${p.name[lang]}`); if (def.merchant) track("wish", { value: p.price, currency: def.currencyCode, id: p.srcId ?? p.id, name: p.name.ar }); }
    },
    drawer, setDrawer, cat, setCat, placeOrder, orders, L,
    C: <T,>(k: string) => { if (def.look?.hidden.includes(k) && def.id !== "essential") return "" as T; const v = def.copy[k] as Record<string, unknown> | unknown; return (v && typeof v === "object" && !Array.isArray(v) && "ar" in (v as object) ? (v as Record<string, unknown>)[lang] ?? (v as Record<string, unknown>).ar : v) as T; },
    price: (n) => `${fmt(n, lang)} ${t.currency}`, num: (n) => fmt(n, lang), prod, fb: (p) => p.name[lang].trim().charAt(0),
    badge: (b) => (b === "sale" ? t.sale : b === "new" ? t.newIn : t.best), base: `/s/${def.slug}`,
    onAdd, setOnAdd,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
