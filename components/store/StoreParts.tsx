"use client";
import Link from "next/link";
import { PLATFORM_ORIGIN } from "@/lib/config";
import { OrderReview, ProductReviews } from "./Reviews";
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
import { SocialBar } from "./StoreSocial";
import { AnnounceBar, PolicyLinks, WaFloat } from "./StoreExtras";
import { BODY_FONTS, DISPLAY_FONTS } from "@/lib/store/fonts";
import { LogoMark } from "../site/Logo";
import { IconArrow, IconBag, IconChat, IconCheck, IconX } from "../site/Icons";
import { useSite } from "../site/Providers";

/** Wraps every store page: template class, header, footer, platform branding (free plan), cart drawer, demo bar. */
export function StoreShell({ mod, route, children }: { mod: TemplateModule; route: string; children: ReactNode }) {
  const { def, plan, lang, t } = useStore();
  // the merchant's fonts from "شكل المتجر" — the template's own when none is picked
  const displayFont = def.look?.fonts.display ? DISPLAY_FONTS[def.look.fonts.display] : undefined;
  const bodyFont = def.look?.fonts.body ? BODY_FONTS[def.look.fonts.body] : undefined;
  const social = def.look?.social ?? {};
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollTop(); }, [route]);
  useFx(ref, lang, [route, plan]);
  useEffect(() => initHoverReveal(), []);
  return (
    <div key={lang + plan}>
      <div ref={ref} className={`tpl tpl-${def.id} route-${route}`} data-body={bodyFont ? "" : undefined} style={{
        ...(def.accent ? { ["--acc" as string]: def.accent, ["--cur" as string]: def.accent } : {}),
        ...(displayFont ? { ["--f-disp" as string]: displayFont } : {}),
        ...(bodyFont ? { ["--f-body" as string]: bodyFont } : {}),
      } as React.CSSProperties}>
        <AnnounceBar />
        <mod.Header />
        <main>{children}</main>
        <StoreInfo />
        <mod.Footer />
        <PolicyLinks />
        {def.merchant && social.placement !== undefined && social.placement !== "info" && <SocialBar accounts={social} title={lang === "ar" ? "تابعنا على" : "Follow us on"} edit />}
        {/* every free store links the platform — on a store host "/" is the store itself, so the address is absolute */}
        {plan === "free" && <div className="e-built"><a href={`${PLATFORM_ORIGIN}/`} title="أنشئ متجرك الإلكتروني مجانًا مع RVIOS Store"><span className="ya" style={{ fontSize: 11, letterSpacing: ".12em" }}>POWERED BY</span> <LogoMark /> <span className="ya">RVIOS</span></a></div>}
      </div>
      <CartDrawer />
      <WaFloat />
      <DemoBar />
      <StoreChrome route={route} />
    </div>
  );
}

export function CartDrawer() {
  const { def, drawer, setDrawer, cart, prod, L, t, price, num, setQty, plan, applyCoupon, coupon, sub, total, base, fb, count } = useStore();
  const [code, setCode] = useState(""); const [bad, setBad] = useState(false); const [cpn, setCpn] = useState(false);
  useEffect(() => { const l = getLenis(); drawer ? l?.stop() : l?.start(); }, [drawer]);
  return (
    <div className={`drawer ${drawer ? "open" : ""}`} aria-hidden={!drawer} style={def.accent ? ({ ["--acc" as string]: def.accent } as React.CSSProperties) : undefined}>
      <div className="ov" onClick={() => setDrawer(false)} />
      <aside className="pan" role="dialog" aria-label={t.cart}>
        <header className="dh"><div className="dh-t"><b className="t-h">{t.cart}</b>{count > 0 && <span className="cd-cnt">{num(count)}</span>}</div><button className="icb" onClick={() => setDrawer(false)} aria-label="close"><IconX /></button></header>
        <div className="items" data-lenis-prevent>
          {cart.length ? cart.map((i, k) => { const p = prod(i.id); if (!p) return null; return (
            <div className="cd-it" key={k}>
              <Link className="cd-th" href={`${base}/p/${p.id}`} onClick={() => setDrawer(false)}><Img id={p.img} w={240} fb={fb(p)} /></Link>
              <div className="cd-inf"><b>{L(p.name)}</b>{i.opt && <span className="cd-opt">{i.opt}</span>}<span className="cd-up">{price(p.price)}</span>
                <div className="cd-qty"><button onClick={() => setQty(k, -1)} aria-label="−">−</button><span>{num(i.qty)}</span><button onClick={() => setQty(k, 1)} aria-label="+">+</button></div></div>
              <div className="cd-end"><b>{price(p.price * i.qty)}</b><button className="cd-rm" onClick={() => setQty(k, -i.qty)}>{t.remove}</button></div>
            </div>); })
            : <div className="emp"><span className="emp-ic"><IconBag /></span><b>{t.empty}</b><button className="e-btn ghost" onClick={() => setDrawer(false)}>{t.cont}</button></div>}
        </div>
        {cart.length > 0 && (
          <footer className="df">
            {plan !== "free" && (cpn
              ? <><div className="cpn"><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="RVIOS10" dir="ltr" aria-label={t.coupon} /><button onClick={() => setBad(!applyCoupon(code))}>{t.apply}</button></div>{(coupon || bad) && <small className={coupon ? "ok" : "bad"}>{coupon ? t.couponOk : t.couponBad}</small>}</>
              : <button className="cpn-open" onClick={() => setCpn(true)}>{t.coupon}؟</button>)}
            <div className="rows"><div className="row"><span>{t.subtotal}</span><span>{price(sub)}</span></div>
              <div className="row"><span>{t.delivery}</span><span className="mut">{t.deliveryVal}</span></div>
              <div className="row t"><span>{t.total}</span><span>{price(total)}</span></div></div>
            <Link className="e-btn" href={`${base}/checkout`} onClick={() => setDrawer(false)}>{t.checkout} <IconArrow /></Link>
            <button className="df-cont" onClick={() => setDrawer(false)}>{t.cont}</button>
          </footer>
        )}
      </aside>
    </div>
  );
}

/** Floating preview bar: back to platform, template store, plan simulator, language, buy. */
export function DemoBar() {
  const { def, plan, setPlan, t, L } = useStore(); const { toggleLang, lang } = useSite();
  // Inside the live-preview iframe the modal already shows name, price and the pick button.
  const [framed, setFramed] = useState(false);
  useEffect(() => { try { setFramed(window.self !== window.top); } catch { setFramed(true); } }, []);
  // the template preview bar is for demo stores only — a merchant's customers never see it
  if (framed || def.merchant) return null;
  return (
    <div className="demobar">
      <Link className="lg-mini" href="/"><LogoMark /><span className="ya" style={{ fontSize: 10 }}>RVIOS</span></Link><span className="sep" />
      <Link href="/templates">{t.templates}</Link><span className="sep" />
      <span style={{ padding: "0 6px", whiteSpace: "nowrap" }}>{L(def.tplName)} · <b className="ltr">{def.price ? "$" + def.price : t.free}</b></span>
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
  const rel = def.products.filter((x) => x.id !== p.id && !x.hidden && !x.dup && (!p.srcId || x.srcId !== p.srcId)).slice(0, 4);
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
        <ProductReviews productId={p.srcId} />
      </div></div>
      <section className="e-rel"><h2 className="t-h">{t.related}</h2><div className="t-grid">{rel.map((x, i) => <Card key={x.id} p={x} i={i} />)}</div></section>
    </div>
  );
}

export function CheckoutPage({ onPlaced }: { onPlaced: (id: number | string) => void }) {
  const { cart, prod, L, t, price, num, coupon, sub, total, base, placeOrder, fb, count } = useStore();
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (!cart.length) return <div className="e-page"><div className="e-done"><span className="emp-ic"><IconBag /></span><h1 className="t-h">{t.empty}</h1><br /><Link className="e-btn" href={base}>{t.cont}</Link></div></div>;
  return (
    <div className="e-page"><div className="e-co">
      <div className="e-co-main"><Link className="e-back" href={base}>{t.cont}</Link><h1 className="t-h">{t.checkout}</h1><p className="e-co-sub">{t.coSub}</p>
        <form noValidate onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget; if (Array.from(f.querySelectorAll<HTMLInputElement>("[required]")).some((i) => !i.value.trim())) { setErr(t.required); return; }
          const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? "";
          setBusy(true); setErr(""); try { onPlaced(await placeOrder({ name: v("n"), phone: v("p"), city: v("c"), address: v("a"), notes: v("o") })); } catch (x) { setErr((x as Error).message); setBusy(false); } }}>
          <fieldset><legend>{t.contactSec}</legend>
            <label>{t.name} *<input required name="n" autoComplete="name" /></label>
            <label>{t.phone} *<input required name="p" inputMode="tel" autoComplete="tel" dir="ltr" /></label></fieldset>
          <fieldset><legend>{t.addrSec}</legend>
            <label>{t.city} *<input required name="c" autoComplete="address-level2" /></label>
            <label>{t.address} *<input required name="a" autoComplete="street-address" /></label>
            <label className="full">{t.notes}<textarea name="o" rows={3} /></label></fieldset>
          {err && <div className="e-err" role="alert">{err}</div>}
          <button className="e-btn" type="submit" disabled={busy}>{busy ? "…" : t.place}</button>
          <p className="df-note">{t.secure}</p></form></div>
      <aside className="e-sum"><b className="e-sum-h">{t.summary} <small>({num(count)})</small></b>
        <div className="e-sum-items">{cart.map((i, k) => { const p = prod(i.id); if (!p) return null; return (
          <div className="co-it" key={k}><div className="co-th"><Img id={p.img} w={160} fb={fb(p)} /><span className="co-q">{num(i.qty)}</span></div><div className="co-nm"><b>{L(p.name)}</b>{i.opt && <small>{i.opt}</small>}</div><span className="co-pr">{price(p.price * i.qty)}</span></div>); })}</div>
        <div className="ln"><span>{t.subtotal}</span><span>{price(sub)}</span></div>
        <div className="ln"><span>{t.delivery}</span><span className="mut">{t.deliveryVal}</span></div>
        {coupon && <div className="ln ok"><span>{t.couponOk}</span></div>}
        <div className="ln t"><span>{t.total}</span><span>{price(total)}</span></div></aside></div></div>
  );
}

export function OrderDone({ id }: { id: string }) {
  const { t, num, orders, price, base, def, L } = useStore();
  const o = orders[id];
  return (
    <div className="e-page"><div className="e-done"><div className="ok"><IconCheck /></div><small style={{ opacity: 0.6 }}>{t.orderNo} #{/^\d+$/.test(id) ? num(Number(id)) : id}</small><h1 className="t-h">{t.pending}</h1>
      <ol className="e-tl">{t.track.map((x, i) => <li key={x} className={`${i <= 1 ? "on" : ""} ${i === 1 ? "cur" : ""}`}>{x}</li>)}</ol>
      <a className="e-btn" href={`https://wa.me/${def.whatsapp ?? ""}?text=${encodeURIComponent(`${t.orderNo} #${id} — ${L(def.name)}`)}`} target="_blank" rel="noopener noreferrer"><IconChat /> {t.wa}</a>
      <p style={{ marginTop: 16, opacity: 0.6 }}>{o ? `${t.total}: ${price(o.total)}` : ""}</p>{!/^\d+$/.test(id) && <OrderReview orderRef={id} />}<br /><Link className="e-btn ghost" href={base}>{t.cont}</Link></div></div>
  );
}

export const tplMeta = (id: string) => CATALOG.find((c) => c.id === id)!;
