"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
/* Composer — builds a full storefront from a config: design tokens (CSS) + a list of sections.
   Used by the 12 newer templates; each one picks its own hero, card style, header and sections. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/site/Img";
import { IconArrow, IconBag, IconCheck, IconHeart, IconPlus, IconSearch } from "@/components/site/Icons";
import { gsap, marquee } from "@/lib/fx";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { TemplateModule } from "@/lib/store/module";
import type { Product, StoreDef } from "@/lib/store/types";
import type { Bi } from "@/lib/u";

export type HeroV = "split" | "center" | "stack" | "banner" | "collage" | "search" | "product" | "diag";
export type CardV = "classic" | "tall" | "circle" | "soft" | "dense" | "book" | "bubble" | "overlay" | "framed" | "menu";
export type Section =
  | { k: "hero"; v: HeroV; img: string; imgs?: string[] }
  | { k: "marquee" }
  | { k: "cats"; v: "tiles" | "pills" | "circles"; imgs?: string[] }
  | { k: "grid"; title: Bi; filter?: boolean }
  | { k: "feature"; img: string; title: Bi; body: Bi; flip?: boolean }
  | { k: "usp" }
  | { k: "deal"; pid: string }
  | { k: "single" }
  | { k: "news" }
  | { k: "slider"; title: Bi }
  | { k: "bento"; title: Bi; imgs: string[] }
  | { k: "split"; title: Bi; body: Bi; imgs: string[] }
  | { k: "stats" }
  | { k: "steps"; title: Bi }
  | { k: "faq"; title: Bi };
export type CxConfig = {
  def: StoreDef; header: "bar" | "pill" | "center" | "split"; card: CardV; sections: Section[];
  logo: string; foot: Bi; ann?: Bi;
};

/* ---------- shared bits ---------- */
const firstOpt = (p: Product, L: (o: never) => string) => (p.variant ? L(p.variant.options[0] as never) : "");
function useGo() { return (id: string) => scrollToEl(document.getElementById(id), -100); }

function makeHeader(cfg: CxConfig) {
  return function Header() {
    const { def, L, t, setDrawer, count, num, base, setCat } = useStore(); const go = useGo();
    return (
      <>
        {cfg.ann && <div className="cx-ann">{L(cfg.ann)}</div>}
        <header className={`cx-hdr h-${cfg.header}`}>
          <Link href={base} className="cx-logo"><StoreEmblem slug={def.slug} size={40} color={def.accent} /><b>{L(def.name)}</b></Link>
          <nav className="cx-nav">{def.cats.map((c, i) => <a key={i} href="#cxg" onClick={(e) => { e.preventDefault(); setCat(i); setTimeout(() => go("cxg"), 50); }}>{L(c)}</a>)}</nav>
          <div className="cx-act"><button className="icb" aria-label="search"><IconSearch /></button><button className="icb cx-cart" onClick={() => setDrawer(true)} aria-label={t.cart}><IconBag />{count > 0 && <span className="n">{num(count)}</span>}</button></div>
        </header>
      </>
    );
  };
}

function makeFooter(cfg: CxConfig) {
  return function Footer() {
    const { def, L } = useStore();
    return <footer className="cx-foot"><div className="cx-foot-big">{L(def.name)}</div><div className="cx-frow"><span>{L(cfg.foot)}</span><span>Instagram · WhatsApp</span><span>© 2026</span></div></footer>;
  };
}

function makeCard(cfg: CxConfig) {
  return function Card({ p, i = 0 }: { p: Product; i?: number }) {
    const { def, L, t, price, add, base, fb, badge } = useStore();
    const buy = () => add(p.id, firstOpt(p, L as never));
    const href = `${base}/p/${p.id}`;
    if (cfg.card === "menu") return (
      <article className="cx-card c-menu" data-reveal style={{ ["--d" as string]: (i % 4) * 0.05 + "s" }}>
        <Link href={href} className="cx-ci"><Img id={p.img} w={400} fb={fb(p)} /></Link>
        <div className="cx-cb"><h3><Link href={href}>{L(p.name)}</Link></h3><p>{L(p.desc)}</p><div className="cx-row"><b>{price(p.price)}</b><button className="cx-add" onClick={buy} aria-label={t.add}><IconPlus /></button></div></div>
      </article>);
    if (cfg.card === "dense") return (
      <article className="cx-card c-dense" data-reveal>
        <Link href={href} className="cx-ci"><Img id={p.img} w={400} fb={fb(p)} /></Link>
        <div className="cx-cb"><small>{L(def.cats[p.cat])} · SKU {p.id.toUpperCase()}-{(p.price % 997).toString().padStart(3, "0")}</small><h3><Link href={href}>{L(p.name)}</Link></h3>
          <div className="cx-chips">{(p.specs ?? []).map((s) => <span key={s[2]}>{s[2]}</span>)}</div></div>
        <div className="cx-side"><b>{price(p.price)}</b>{p.old && <s>{price(p.old)}</s>}<button className="cx-btn sm" onClick={buy}>{t.add}</button></div>
      </article>);
    const alt = p.alt ?? (p.img.startsWith("http") ? p.img : `https://images.unsplash.com/photo-${p.img}?auto=format&fit=crop&w=800&q=80&crop=focalpoint&fp-x=.5&fp-y=.42&fp-z=1.55`);
    return (
      <article className={`cx-card c-${cfg.card}`} data-reveal style={{ ["--d" as string]: (i % 4) * 0.07 + "s" }}>
        <Link href={href} className="cx-ci" data-cursor={t.view}><Img id={p.img} w={800} fb={fb(p)} /><Img id={alt} w={800} fb={fb(p)} className="cx-alt" />{p.badge && <span className={`cx-tag ${p.badge}`}>{badge(p.badge)}</span>}
          <Heart />
          {cfg.card === "overlay" && <span className="cx-ov"><b>{L(p.name)}</b><em>{price(p.price)}</em></span>}
          {cfg.card !== "overlay" && cfg.card !== "circle" && <button className="cx-quick" onClick={(e) => { e.preventDefault(); buy(); }}><IconPlus width={16} /> {t.add}</button>}</Link>
        {cfg.card !== "overlay" && <div className="cx-cb"><small className="cx-cat-l">{L(def.cats[p.cat] ?? def.cats[0])}</small><h3><Link href={href}>{L(p.name)}</Link></h3><div className="cx-row"><span className="cx-pr">{price(p.price)}{p.old && <s>{price(p.old)}</s>}</span><button className="cx-add" onClick={buy} aria-label={t.add}><IconPlus /></button></div></div>}
      </article>
    );
  };
}

function Heart() {
  const [on, setOn] = useState(false);
  return <button className={`cx-heart ${on ? "on" : ""}`} onClick={(e) => { e.preventDefault(); setOn((v) => !v); }} aria-label="wishlist"><IconHeart width={18} /></button>;
}

/* ---------- sections ---------- */
function HeroExtras() {
  const { C, lang } = useStore(); const chips = C<[string, string][] | undefined>("chips"); const spin = C<string | undefined>("spin");
  return (
    <>
      {chips && <div className="cx-chips-f">{chips.map((c, i) => <span key={i} className={`cx-fchip f${i}`}><i>{c[0]}</i>{c[1]}</span>)}</div>}
      <a href="#cxg" className="cx-spin" aria-label="shop" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("cxg"), -100); }}>
        <svg viewBox="0 0 120 120"><defs><path id={`c-${lang}`} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs><text><textPath href={`#c-${lang}`}>{(spin ?? (lang === "ar" ? "تسوّق الآن • تسوّق الآن • تسوّق الآن •" : "SHOP NOW • SHOP NOW • SHOP NOW •"))}</textPath></text></svg><i>↓</i></a>
    </>
  );
}
function Hero({ s, cfg }: { s: Extract<Section, { k: "hero" }>; cfg: CxConfig }) {
  return <div className="cx-hwrap">{HeroInner({ s, cfg })}<HeroExtras /></div>;
}
function HeroInner({ s, cfg }: { s: Extract<Section, { k: "hero" }>; cfg: CxConfig }) {
  const { def, C, L, price, add, t, setCat } = useStore(); const go = useGo();
  const cta = <a href="#cxg" className="cx-btn mag" onClick={(e) => { e.preventDefault(); go("cxg"); }}>{C("cta")} <IconArrow /></a>;
  const P = def.products;
  const [q, setQ] = useState("");
  switch (s.v) {
    case "center":
      return <section className="cx-hero v-center"><div className="cx-hbg" data-speed="1.2"><Img id={s.img} w={1800} eager /></div><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>{cta}</div></section>;
    case "stack":
      return <section className="cx-hero v-stack"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><div className="cx-strip">{(s.imgs ?? [s.img]).map((im, i) => <div key={i} className="cx-si" data-clip style={{ ["--d" as string]: i * 0.1 + "s" }}><Img id={im} w={700} /></div>)}</div><div className="cx-hrow"><p data-reveal>{C("sub")}</p>{cta}</div></section>;
    case "banner":
      return <section className="cx-hero v-banner"><div className="cx-bn"><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>{cta}</div><div className="cx-bimg"><Img id={s.img} w={1200} eager /></div><i className="cx-deco d1" /><i className="cx-deco d2" /><i className="cx-deco d3" /></div></section>;
    case "collage":
      return <section className="cx-hero v-collage"><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>{cta}</div><div className="cx-col">{(s.imgs ?? [s.img]).slice(0, 3).map((im, i) => <div key={i} className={`cx-ci${i}`} data-tilt="8"><Img id={im} w={800} eager /></div>)}</div></section>;
    case "search":
      return <section className="cx-hero v-search"><div className="cx-hbg"><Img id={s.img} w={1800} eager /></div><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>
        <form className="cx-finder" onSubmit={(e) => { e.preventDefault(); go("cxg"); }}><select aria-label="brand">{C<string[]>("brands").map((b) => <option key={b}>{b}</option>)}</select><select aria-label="model">{C<string[]>("models").map((b) => <option key={b}>{b}</option>)}</select><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={C("partQ")} /><button className="cx-btn">{IconSearchEl}{C("find")}</button></form></div></section>;
    case "product": {
      const p = P[0];
      return <section className="cx-hero v-product"><span className="cx-giant">{C("giant")}</span><div className="cx-pimg" data-tilt="12"><Img id={p.img} w={1400} eager /></div><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p><div className="cx-hrow"><b className="cx-big">{price(p.price)}</b><button className="cx-btn mag" onClick={() => add(p.id, firstOpt(p, L as never))}>{t.add} <IconBag /></button></div></div></section>;
    }
    case "diag":
      return <section className="cx-hero v-diag"><div className="cx-hbg"><Img id={s.img} w={1800} eager /></div><div className="cx-slash" /><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>{cta}</div></section>;
    default:
      return <section className="cx-hero v-split"><div className="cx-hc"><span className="cx-kick">{C("kick")}</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p><div className="cx-hrow">{cta}<a className="cx-link" href="#cxg" onClick={(e) => { e.preventDefault(); setCat(null); go("cxg"); }}>{t.all}</a></div></div><div className="cx-himg" data-clip><Img id={s.img} w={1400} eager /></div></section>;
  }
}
const IconSearchEl = <IconSearch width={18} />;

function Cats({ s }: { s: Extract<Section, { k: "cats" }> }) {
  const { def, L, setCat, C } = useStore(); const go = useGo();
  const pick = (i: number) => { setCat(i); setTimeout(() => go("cxg"), 50); };
  return (
    <section className={`cx-sec cx-cats v-${s.v}`}><h2 className="t-h cx-h" data-split>{C("catsT")}</h2>
      <div className="cx-cg">{def.cats.map((c, i) => <button key={i} className="cx-cat" onClick={() => pick(i)} data-cursor={L(c)}>{s.v !== "pills" && <Img id={s.imgs?.[i] ?? def.products.find((p) => p.cat === i)?.img ?? def.products[0].img} w={600} />}<span>{L(c)}</span></button>)}</div></section>
  );
}

function Grid({ s, Card }: { s: Extract<Section, { k: "grid" }>; Card: TemplateModule["Card"] }) {
  const { def, L, t, cat, setCat } = useStore();
  const list = def.products.filter((p) => !p.hidden && (cat == null || p.cat === cat));
  return (
    <section className="cx-sec" id="cxg"><div className="cx-gh"><h2 className="t-h cx-h" data-split>{L(s.title)}</h2>
      {s.filter !== false && <div className="cx-filter"><button className={cat == null ? "on" : ""} onClick={() => setCat(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)}</button>)}</div>}</div>
      <div className="cx-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div></section>
  );
}

function Feature({ s }: { s: Extract<Section, { k: "feature" }> }) {
  const { L } = useStore();
  return <section className={`cx-sec cx-feat ${s.flip ? "flip" : ""}`}><div className="cx-fimg" data-clip><Img id={s.img} w={1400} data-speed="0.8" /></div><div className="cx-ftxt"><h2 className="t-h" data-split>{L(s.title)}</h2><p data-reveal>{L(s.body)}</p></div></section>;
}

function Usp() {
  const { C } = useStore();
  return <section className="cx-sec cx-usp">{C<[string, string, string][]>("usp").map((u, i) => <div key={i} data-reveal data-spot style={{ ["--d" as string]: i * 0.06 + "s" }}><i>{u[0]}</i><b>{u[1]}</b><span>{u[2]}</span></div>)}</section>;
}

function Deal({ s }: { s: Extract<Section, { k: "deal" }> }) {
  const { prod, L, C, price, add, fb } = useStore(); const p = prod(s.pid)!;
  const [tm, setTm] = useState("00:00:00");
  useEffect(() => { const end = new Date(); end.setHours(23, 59, 59); const f = () => { const d = Math.max(0, +end - +new Date()); setTm([d / 36e5, (d % 36e5) / 6e4, (d % 6e4) / 1e3].map((x) => String(Math.floor(x)).padStart(2, "0")).join(":")); }; f(); const i = setInterval(f, 1000); return () => clearInterval(i); }, []);
  return <section className="cx-sec"><div className="cx-deal" data-spot><div><span className="cx-kick">{C("dealT")}</span><h2 className="t-h">{L(p.name)}</h2><div className="cx-timer ya">{tm}</div><div className="cx-hrow"><b className="cx-big">{price(p.price)}</b>{p.old && <s>{price(p.old)}</s>}<button className="cx-btn" onClick={() => add(p.id, firstOpt(p, L as never))}><IconBag /></button></div></div><div className="cx-dimg"><Img id={p.img} w={900} fb={fb(p)} /></div></div></section>;
}

/** Single-product brand: one hero product with a full buy box, features and FAQ. */
function Single() {
  const { def, L, C, t, price, add } = useStore(); const p = def.products[0];
  const [opt, setOpt] = useState(p.variant ? L(p.variant.options[0]) : ""); const [img, setImg] = useState(0);
  const gallery = [p.img, ...def.products.slice(1, 4).map((x) => x.img)];
  return (
    <section className="cx-sec cx-single" id="cxg">
      <div className="cx-sg"><div className="cx-sgm"><Img id={gallery[img]} w={1400} /></div><div className="cx-sgt">{gallery.map((g, i) => <button key={i} className={i === img ? "on" : ""} onClick={() => setImg(i)}><Img id={g} w={300} /></button>)}</div></div>
      <div className="cx-buy"><span className="cx-kick">{C("kick")}</span><h2 className="t-h">{L(p.name)}</h2><b className="cx-big">{price(p.price)}</b>
        {p.variant && <div className="cx-opt"><label>{L(p.variant.label)}</label><div>{p.variant.options.map((o) => <button key={L(o)} className={opt === L(o) ? "on" : ""} onClick={() => setOpt(L(o))}>{L(o)}</button>)}</div></div>}
        <button className="cx-btn wide mag" onClick={() => add(p.id, opt)}>{t.add} <IconBag /></button>
        <ul className="cx-feats">{C<string[]>("feats").map((f) => <li key={f}><IconCheck width={16} />{f}</li>)}</ul>
        <div className="cx-faq">{C<[string, string][]>("faq").map((f, i) => <details key={i} open={i === 0}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</div></div>
    </section>
  );
}

function News() {
  const { C } = useStore(); const [done, setDone] = useState(false);
  return <section className="cx-sec"><div className="cx-news"><h2 className="t-h" data-split>{C("newsT")}</h2><form onSubmit={(e) => { e.preventDefault(); setDone(true); }}><input placeholder={C("email")} dir="ltr" /><button className="cx-btn">{done ? "✓" : C("join")}</button></form></div></section>;
}

function Marquee() {
  const { C } = useStore(); const ref = useRef<HTMLDivElement>(null); const words = C<string[]>("mq");
  useEffect(() => marquee(ref.current!, 0.045), []);
  return <div className="cx-mq"><div ref={ref}>{[...words, ...words, ...words, ...words].map((w, i) => <span key={i} style={{ display: "contents" }}><span>{w}</span><i>✦</i></span>)}</div></div>;
}

function Slider({ s, Card }: { s: Extract<Section, { k: "slider" }>; Card: TemplateModule["Card"] }) {
  const { def, L, lang } = useStore(); const tr = useRef<HTMLDivElement>(null); const [pg, setPg] = useState(0);
  const list = def.products.filter((p) => !p.hidden && (p.badge === "best" || p.badge === "new")).concat(def.products.filter((p) => !p.hidden && !p.badge)).slice(0, 10);
  const go = (d: number) => { const el = tr.current!; el.scrollBy({ left: (lang === "ar" ? -d : d) * el.clientWidth * 0.8, behavior: "smooth" }); };
  return (
    <section className="cx-sec cx-slider"><div className="cx-gh"><h2 className="t-h cx-h" data-split>{L(s.title)}</h2>
      <div className="cx-arrows"><button onClick={() => go(-1)} aria-label="prev">→</button><button onClick={() => go(1)} aria-label="next">←</button></div></div>
      <div className="cx-track" ref={tr} data-lenis-prevent-horizontal onScroll={(e) => { const el = e.currentTarget; setPg(Math.abs(el.scrollLeft) / Math.max(1, el.scrollWidth - el.clientWidth)); }}>{list.map((p, i) => <div key={p.id} className="cx-slide"><Card p={p} i={i} /></div>)}</div>
      <div className="cx-prog"><i style={{ transform: `scaleX(${Math.max(0.08, pg)})` }} /></div></section>
  );
}
function Bento({ s }: { s: Extract<Section, { k: "bento" }> }) {
  const { def, L, setCat, t } = useStore(); const go = useGo();
  return (
    <section className="cx-sec"><h2 className="t-h cx-h" data-split>{L(s.title)}</h2>
      <div className="cx-bento">{def.cats.slice(0, 4).map((c, i) => <button key={i} className={`cx-bx b${i}`} data-spot onClick={() => { setCat(i); setTimeout(() => go("cxg"), 50); }} data-cursor={t.shop}>
        <Img id={s.imgs[i] ?? def.products[i].img} w={i ? 800 : 1200} /><span><small>0{i + 1}</small><b>{L(c)}</b><i>{def.products.filter((p) => p.cat === i).length}</i></span></button>)}</div></section>
  );
}
function Split({ s }: { s: Extract<Section, { k: "split" }> }) {
  const { L } = useStore();
  return (
    <section className="cx-sec cx-split"><div className="cx-stick"><h2 className="t-h" data-split>{L(s.title)}</h2><p data-reveal>{L(s.body)}</p></div>
      <div className="cx-scol">{s.imgs.map((im, i) => <div key={i} className="cx-sim" data-clip><Img id={im} w={1100} data-speed={i % 2 ? "0.6" : "-0.4"} /></div>)}</div></section>
  );
}
const GEN = {
  stats: { ar: [["4", "سنوات خبرة", "+"], ["12", "منتجاً مختاراً", "+"], ["98", "رضا العملاء", "%"], ["48", "ساعة للتوصيل", ""]], en: [["4", "years of craft", "+"], ["12", "curated products", "+"], ["98", "happy customers", "%"], ["48", "hour delivery", ""]] },
  steps: { ar: [["اختر منتجك", "تصفّح وأضف للسلة بسهولة."], ["أكّد طلبك", "يصلنا الطلب فوراً ونؤكده معك."], ["استلم بسرعة", "توصيل لباب بيتك."]], en: [["Pick your product", "Browse and add to cart."], ["Confirm your order", "We receive it instantly and confirm with you."], ["Receive it fast", "Delivered to your door."]] },
  faqs: { ar: [["كيف أطلب؟", "أضف المنتجات للسلة وأكمل الطلب، وسنتواصل معك لتأكيده."], ["ما طرق الدفع؟", "الدفع عند الاستلام، أو محفظة جيب، أو تحويل الكريمي."], ["هل يمكن الاستبدال؟", "نعم، خلال ٧ أيام بحالته الأصلية."]], en: [["How do I order?", "Add items to the cart and check out; we'll contact you to confirm."], ["Payment methods?", "Cash on delivery, Jaib wallet or Al-Kuraimi transfer."], ["Can I exchange?", "Yes, within 7 days in original condition."]] },
};
function useGen<T>(k: keyof typeof GEN) { const { C, lang } = useStore(); return (C<T | undefined>(k) ?? (GEN[k][lang] as unknown as T)); }
function Stats() {
  const stats = useGen<[string, string, string?][]>("stats");
  return <section className="cx-sec cx-stats">{stats.map((x, i) => <div key={i} data-reveal style={{ ["--d" as string]: i * 0.08 + "s" }}><b className="ya"><span data-count={x[0]}>0</span>{x[2] ?? ""}</b><span>{x[1]}</span></div>)}</section>;
}
function Steps({ s }: { s: Extract<Section, { k: "steps" }> }) {
  const { L } = useStore(); const steps = useGen<[string, string][]>("steps");
  return <section className="cx-sec"><h2 className="t-h cx-h" data-split>{L(s.title)}</h2><ol className="cx-steps">{steps.map((x, i) => <li key={i} data-reveal data-spot style={{ ["--d" as string]: i * 0.08 + "s" }}><span className="ya">0{i + 1}</span><b>{x[0]}</b><p>{x[1]}</p></li>)}</ol></section>;
}
function Faq({ s }: { s: Extract<Section, { k: "faq" }> }) {
  const { L } = useStore(); const faqs = useGen<[string, string][]>("faqs");
  return <section className="cx-sec cx-faqs"><h2 className="t-h cx-h" data-split>{L(s.title)}</h2><div>{faqs.map((f, i) => <details key={i} open={i === 0}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</div></section>;
}

/* ---------- factory ---------- */
export function makeTemplate(cfg: CxConfig): TemplateModule {
  const Card = makeCard(cfg);
  function Home() {
    const root = useRef<HTMLDivElement>(null); const { lang } = useStore();
    useEffect(() => {
      const el = root.current; if (!el) return;
      const hero = el.querySelector(".cx-hero"); const tws: gsap.core.Tween[] = [];
      const ims = el.querySelectorAll(".cx-hero .cx-himg, .cx-hero .cx-bimg, .cx-hero .cx-col > div, .cx-hero .cx-pimg, .cx-hero .cx-si");
      tws.push(gsap.fromTo(ims, { clipPath: "inset(18% 18% 18% 18% round 40px)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, duration: 1.6, ease: "expo.out", stagger: 0.1, clearProps: "clipPath" }));
      tws.push(gsap.from(el.querySelectorAll(".cx-fchip, .cx-spin"), { scale: 0, opacity: 0, rotate: -20, duration: 1.1, ease: "back.out(1.8)", stagger: 0.12, delay: 0.6 }));
      if (hero) {
        tws.push(gsap.to(el.querySelectorAll(".cx-hero .cx-himg .im, .cx-hero .cx-hbg .im, .cx-hero .cx-bimg .im"), { scale: 1.16, yPercent: 6, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } }));
        tws.push(gsap.to(el.querySelectorAll(".cx-hero .cx-hc"), { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } }));
      }
      el.querySelectorAll<HTMLElement>(".cx-sec .cx-h").forEach((h) => tws.push(gsap.fromTo(h, { letterSpacing: "0.04em" }, { letterSpacing: "0em", ease: "none", scrollTrigger: { trigger: h, start: "top bottom", end: "top 40%", scrub: true } })));
      return () => tws.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    }, [lang]);
    return (
      <div ref={root} className={`cx cx-${cfg.def.id}`}>
        {cfg.sections.map((s, i) => {
          switch (s.k) {
            case "hero": return <Hero key={i} s={s} cfg={cfg} />;
            case "marquee": return <Marquee key={i} />;
            case "cats": return <Cats key={i} s={s} />;
            case "grid": return <Grid key={i} s={s} Card={Card} />;
            case "feature": return <Feature key={i} s={s} />;
            case "usp": return <Usp key={i} />;
            case "deal": return <Deal key={i} s={s} />;
            case "single": return <Single key={i} />;
            case "news": return <News key={i} />;
            case "slider": return <Slider key={i} s={s} Card={Card} />;
            case "bento": return <Bento key={i} s={s} />;
            case "split": return <Split key={i} s={s} />;
            case "stats": return <Stats key={i} />;
            case "steps": return <Steps key={i} s={s} />;
            case "faq": return <Faq key={i} s={s} />;
          }
        })}
      </div>
    );
  }
  return { Header: makeHeader(cfg), Footer: makeFooter(cfg), Card, Home };
}
