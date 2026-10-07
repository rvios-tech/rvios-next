"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CATALOG } from "@/lib/catalog";
import { useStore } from "@/lib/store/engine";
import type { TemplateModule } from "@/lib/store/module";
import type { Plan, Product } from "@/lib/store/types";
import { getLenis, scrollTop } from "@/lib/lenis";
import { useFx } from "@/lib/useFx";
import { initHoverReveal } from "@/lib/fx";
import { Img } from "../site/Img";
import { StoreChrome, StoreInfo } from "./StoreInfo";
import { LogoMark } from "../site/Logo";
import { IconArrow, IconBag, IconChat, IconCheck, IconX } from "../site/Icons";
import { useSite } from "../site/Providers";

/** Wraps every store page: template class, header, footer, platform branding (free plan), cart drawer, demo bar. */
export function StoreShell({ mod, route, children }: { mod: TemplateModule; route: string; children: ReactNode }) {
  const { def, plan, lang, t } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollTop(); }, [route]);
  useFx(ref, lang, [route, plan]);
  useEffect(() => initHoverReveal(), []);
  return (
    <div key={lang + plan}>
      <div ref={ref} className={`tpl tpl-${def.id} route-${route}`} style={def.accent ? ({ ["--acc" as string]: def.accent, ["--cur" as string]: def.accent } as React.CSSProperties) : undefined}>
        <mod.Header />
        <main>{children}</main>
        <StoreInfo />
        <mod.Footer />
        {plan === "free" && <div className="e-built"><Link href="/"><span className="ya" style={{ fontSize: 11, letterSpacing: ".12em" }}>POWERED BY</span> <LogoMark /> <span className="ya">RVIOS</span></Link></div>}
      </div>
      <CartDrawer />
      <DemoBar />
      <StoreChrome route={route} />
    </div>
  );
}

export function CartDrawer() {
  const { drawer, setDrawer, cart, prod, L, t, price, num, setQty, plan, applyCoupon, coupon, sub, total, base, fb, count } = useStore();
  const [code, setCode] = useState(""); const [bad, setBad] = useState(false);
  useEffect(() => { const l = getLenis(); drawer ? l?.stop() : l?.start(); }, [drawer]);
  return (
    <div className={`drawer ${drawer ? "open" : ""}`}>
      <div className="ov" onClick={() => setDrawer(false)} />
      <div className="pan">
        <div className="dh"><b className="t-h">{t.cart} <small style={{ opacity: 0.5, fontSize: ".6em" }}>({num(count)})</small></b><button className="icb" onClick={() => setDrawer(false)} aria-label="close"><IconX /></button></div>
        <div className="items" data-lenis-prevent>
          {cart.length ? cart.map((i, k) => { const p = prod(i.id)!; return (
            <div className="it" key={k}><Img id={p.img} w={240} fb={fb(p)} /><div><b>{L(p.name)}</b><small>{i.opt} {price(p.price)}</small></div>
              <div className="qty"><button onClick={() => setQty(k, -1)}>−</button><span>{num(i.qty)}</span><button onClick={() => setQty(k, 1)}>+</button></div></div>); })
            : <div className="emp">{t.empty}</div>}
        </div>
        {cart.length > 0 && (
          <div className="df">
            {plan !== "free" && <><div className="cpn"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder={`${t.coupon} — RVIOS10`} dir="ltr" /><button onClick={() => setBad(!applyCoupon(code))}>{t.apply}</button></div><small style={{ color: "var(--acc)" }}>{coupon ? t.couponOk : bad ? t.couponBad : ""}</small></>}
            <div className="row"><span>{t.subtotal}</span><span>{price(sub)}</span></div>
            <div className="row"><span>{t.delivery}</span><span>{t.deliveryVal}</span></div>
            <div className="row t"><span>{t.total}</span><span>{price(total)}</span></div>
            <Link className="e-btn" href={`${base}/checkout`} onClick={() => setDrawer(false)}>{t.checkout} <IconArrow /></Link>
          </div>
        )}
      </div>
    </div>
  );
}

/** Floating preview bar: back to platform, template store, plan simulator, language, buy. */
export function DemoBar() {
  const { def, plan, setPlan, t, L } = useStore(); const { toggleLang, lang } = useSite();
  return (
    <div className="demobar">
      <Link className="lg-mini" href="/"><LogoMark /><span className="ya" style={{ fontSize: 10 }}>RVIOS</span></Link><span className="sep" />
      <Link href="/templates">{t.templates}</Link><span className="sep" />
      <span style={{ padding: "0 6px" }}>{L(def.tplName)} · <b className="ltr">{def.price ? "$" + def.price : t.free}</b></span>
      <select value={plan} onChange={(e) => setPlan(e.target.value as Plan)} aria-label={t.plan}>{(["free", "pro", "biz"] as Plan[]).map((p) => <option key={p} value={p}>{t.plan}: {t[p]}</option>)}</select>
      <button onClick={toggleLang}>{lang === "ar" ? "EN" : "ع"}</button>
      <Link href={`/templates#${def.id}`} style={{ background: "#FFDAA7", color: "#1b0f0e", fontWeight: 600 }}>{t.buy}</Link>
    </div>
  );
}

/** Shared product page (templates restyle it through their CSS). */
export function ProductPage({ p, Card }: { p: Product; Card: TemplateModule["Card"] }) {
  const { def, L, t, price, num, add, setDrawer, plan, fb, lang } = useStore();
  const crops = ["", "&crop=focalpoint&fp-x=.35&fp-y=.4&fp-z=1.6", "&crop=focalpoint&fp-x=.65&fp-y=.55&fp-z=2", "&crop=focalpoint&fp-x=.5&fp-y=.7&fp-z=1.4"];
  const [ci, setCi] = useState(0); const [opt, setOpt] = useState(p.variant ? L(p.variant.options[0]) : ""); const [qty, setQ] = useState(1); const [added, setAdded] = useState(false);
  const rel = def.products.filter((x) => x.id !== p.id && !x.hidden).slice(0, 4);
  return (
    <div className="e-page"><div className="e-pdp">
      <div className="e-gal"><Img id={p.img} w={1400} fb={fb(p)} extra={crops[ci]} className="main" alt={L(p.name)} eager />
        <div className="th">{crops.map((c, i) => <button key={i} className={ci === i ? "on" : ""} onClick={() => setCi(i)} aria-label={String(i + 1)}><Img id={p.img} w={300} fb={fb(p)} extra={c} /></button>)}</div></div>
      <div className="e-info"><small style={{ opacity: 0.6 }}>{L(def.cats[p.cat])}</small><h1 className="t-h">{L(p.name)}</h1>
        <div className="pr">{price(p.price)}{p.old && <s>{price(p.old)}</s>}</div>
        {p.variant && <div className="e-opt"><label>{L(p.variant.label)}</label><div className="ch">{p.variant.options.map((o) => <button key={L(o)} className={opt === L(o) ? "on" : ""} onClick={() => setOpt(L(o))}>{L(o)}</button>)}</div></div>}
        {p.specs && <div className="e-specs">{p.specs.map((s) => <div key={s[2]}><small>{s[lang === "ar" ? 0 : 1]}</small><b>{s[2]}</b></div>)}</div>}
        <div className="e-buy"><div className="qty"><button onClick={() => setQ((q) => Math.max(1, q - 1))}>−</button><span>{num(qty)}</span><button onClick={() => setQ((q) => q + 1)}>+</button></div>
          <button className="e-btn mag" onClick={() => { add(p.id, opt, qty); setAdded(true); setTimeout(() => setDrawer(true), 250); }}>{added ? <IconCheck /> : <IconBag />} {t.add}</button></div>
        {plan === "biz" && p.stock && <div className="e-stock"><i />{t.left.replace("{n}", num(p.stock))}</div>}
        <div className="e-acc"><details open><summary>{t.desc}</summary><p>{L(p.desc)}</p></details><details><summary>{t.ship}</summary><p>{t.shipTxt}</p></details></div>
      </div></div>
      <section className="e-rel"><h2 className="t-h">{t.related}</h2><div className="t-grid">{rel.map((x, i) => <Card key={x.id} p={x} i={i} />)}</div></section>
    </div>
  );
}

export function CheckoutPage({ onPlaced }: { onPlaced: (id: number) => void }) {
  const { cart, prod, L, t, price, num, coupon, total, base, placeOrder } = useStore();
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (!cart.length) return <div className="e-page"><div className="e-done"><h1 className="t-h">{t.empty}</h1><br /><Link className="e-btn" href={base}>{t.cont}</Link></div></div>;
  return (
    <div className="e-page"><div className="e-co"><div><h1 className="t-h">{t.checkout}</h1>
      <form noValidate onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget; if (Array.from(f.querySelectorAll<HTMLInputElement>("[required]")).some((i) => !i.value.trim())) { setErr(t.required); return; }
        const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? "";
        setBusy(true); try { onPlaced(await placeOrder({ name: v("n"), phone: v("p"), city: v("c"), address: v("a"), notes: v("o") })); } catch (x) { setErr((x as Error).message); setBusy(false); } }}>
        <input required name="n" placeholder={`${t.name} *`} autoComplete="name" /><input required name="p" placeholder={`${t.phone} *`} inputMode="tel" autoComplete="tel" />
        <input required name="c" placeholder={`${t.city} *`} /><input required name="a" placeholder={`${t.address} *`} /><textarea className="full" name="o" rows={3} placeholder={t.notes} />
        <div className="full" style={{ color: "var(--acc)", fontSize: 14, minHeight: 20 }}>{err}</div><button className="e-btn full" type="submit" disabled={busy}>{busy ? "…" : t.place}</button></form></div>
      <aside className="e-sum">{cart.map((i, k) => { const p = prod(i.id)!; return <div className="ln" key={k}><span>{L(p.name)}{i.opt ? ` · ${i.opt}` : ""} × {num(i.qty)}</span><span>{price(p.price * i.qty)}</span></div>; })}
        <div className="ln" style={{ borderTop: "1px solid var(--line)", marginTop: 10, paddingTop: 16 }}><span>{t.delivery}</span><span>{t.deliveryVal}</span></div>
        {coupon && <div className="ln" style={{ color: "var(--acc)" }}><span>{t.couponOk}</span></div>}
        <div className="ln" style={{ fontWeight: 700, fontSize: 19 }}><span>{t.total}</span><span>{price(total)}</span></div></aside></div></div>
  );
}

export function OrderDone({ id }: { id: number }) {
  const { t, num, orders, price, base, def, L } = useStore();
  const o = orders[id];
  return (
    <div className="e-page"><div className="e-done"><div className="ok"><IconCheck /></div><small style={{ opacity: 0.6 }}>{t.orderNo} #{num(id)}</small><h1 className="t-h">{t.pending}</h1>
      <ol className="e-tl">{t.track.map((x, i) => <li key={x} className={`${i <= 1 ? "on" : ""} ${i === 1 ? "cur" : ""}`}>{x}</li>)}</ol>
      <a className="e-btn" href={`https://wa.me/${def.whatsapp ?? ""}?text=${encodeURIComponent(`${t.orderNo} #${id} — ${L(def.name)}`)}`} target="_blank" rel="noopener noreferrer"><IconChat /> {t.wa}</a>
      <p style={{ marginTop: 16, opacity: 0.6 }}>{o ? `${t.total}: ${price(o.total)}` : ""}</p><br /><Link className="e-btn ghost" href={base}>{t.cont}</Link></div></div>
  );
}

export const tplMeta = (id: string) => CATALOG.find((c) => c.id === id)!;
