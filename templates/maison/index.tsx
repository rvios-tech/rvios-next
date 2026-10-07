"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/site/Img";
import { IconArrow, IconHeart, IconPlus, IconSearch } from "@/components/site/Icons";
import { gsap, marquee, ScrollTrigger } from "@/lib/fx";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import { useSite } from "@/components/site/Providers";
import type { Product } from "@/lib/store/types";

export function Header() {
  const { def, L, t, setDrawer, count, num, base, setCat } = useStore();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const home = document.querySelector(".route-home");
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => ref.current?.classList.toggle("solid", s.scroll() > 80 || !home) });
    ref.current?.classList.toggle("solid", !home);
    return () => st.kill();
  }, []);
  return (
    <header className="m-hdr" ref={ref}>
      <nav className="m-nav">{def.cats.map((c, i) => <Link key={i} href={base} onClick={() => setCat(i)}>{L(c)}</Link>)}</nav>
      <Link className="m-logo" href={base}><StoreEmblem slug={def.slug} size={30} color={def.accent} /><span className="ya">{def.name.en.toUpperCase()}</span></Link>
      <div className="m-act"><button className="icb" aria-label="search"><IconSearch /></button><button className="icb" aria-label="wishlist"><IconHeart /></button><button className="m-cart" onClick={() => setDrawer(true)}>{t.cart} ({num(count)})</button></div>
    </header>
  );
}

export function Footer() {
  const { C, lang } = useStore(); const { toast } = useSite();
  return (
    <footer className="m-foot">
      <div className="m-news"><h3 className="t-h">{C("news")}</h3><p>{C("newsSub")}</p><form onSubmit={(e) => { e.preventDefault(); toast("✓"); (e.currentTarget.querySelector("input") as HTMLInputElement).value = ""; }}><input placeholder={C("email")} dir="ltr" /><button>{C("join")}</button></form></div>
      <div className="m-word ya">DAR AL-SHAL</div>
      <div className="m-frow"><span>{lang === "ar" ? "عدن، كريتر" : "Crater, Aden"}</span><span className="ya">daralshal.com</span><span>Instagram · TikTok</span></div>
    </footer>
  );
}

export function Card({ p, i = 0, big = false }: { p: Product; i?: number; big?: boolean }) {
  const { L, t, price, add, base, fb, badge } = useStore();
  return (
    <article className={`m-card ${big ? "big" : ""}`} data-reveal style={{ ["--d" as string]: (i % 3) * 0.08 + "s" }}>
      <Link href={`${base}/p/${p.id}`} className="m-img" data-cursor={t.view}>
        <Img id={p.img} w={big ? 1200 : 800} fb={fb(p)} /><Img id={p.alt || p.img} w={big ? 1200 : 800} fb={fb(p)} className="alt" />
        {p.badge && <span className="m-tag">{badge(p.badge)}</span>}
        <button className="m-quick" onClick={(e) => { e.preventDefault(); add(p.id, p.variant ? L(p.variant.options[0]) : ""); }}><IconPlus /> {t.add}</button>
      </Link>
      <div className="m-meta"><h3>{L(p.name)}</h3><span>{price(p.price)}{p.old && <> <s>{price(p.old)}</s></>}</span></div>
    </article>
  );
}

export function Home() {
  const { def, L, C, t, price, add, cat, setCat, lang, fb } = useStore();
  const P = def.products; const list = cat == null ? P : P.filter((p) => p.cat === cat);
  const root = useRef<HTMLDivElement>(null); const [pop, setPop] = useState<number | null>(null);
  const mq = C<string[]>("mq");
  const hot: [number, number, string][] = [[38, 30, "p1"], [56, 62, "p4"], [70, 22, "p3"]];
  useEffect(() => {
    const el = root.current!; const rtl = lang === "ar"; const st = { trigger: el.querySelector(".m-hero"), start: "top top", end: "bottom top", scrub: true };
    const tws = [
      gsap.fromTo(el.querySelector("#mhero"), { clipPath: "inset(14% 22% 8% 22% round 300px 300px 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0 0)", ease: "none", scrollTrigger: st }),
      gsap.to(el.querySelector("#mhero img"), { scale: 1.15, ease: "none", scrollTrigger: st }),
      gsap.to(el.querySelector(".m-hero-txt"), { yPercent: -40, opacity: 0.2, ease: "none", scrollTrigger: st }),
    ];
    const m = marquee(el.querySelector<HTMLElement>("#mmq")!, 0.05);
    const tr = el.querySelector<HTMLElement>("#mlt")!; const dist = () => Math.max(0, tr.scrollWidth - innerWidth + 60);
    if (innerWidth > 860) tws.push(gsap.to(tr, { x: () => (rtl ? dist() : -dist()), ease: "none", scrollTrigger: { trigger: el.querySelector("#mlook"), start: "top top", end: () => "+=" + dist(), pin: el.querySelector(".m-look-pin"), scrub: 1, invalidateOnRefresh: true } }));
    return () => { m(); tws.forEach((x) => { x.scrollTrigger?.kill(); x.kill(); }); };
  }, [lang]);
  const pick = (c: number | null) => { setCat(c); setTimeout(() => scrollToEl(document.getElementById("mgrid"), -90), 60); };
  return (
    <div ref={root}>
      <section className="m-hero"><div className="m-hero-img" id="mhero"><Img id="1515886657613-9f3515b0c78f" w={1800} eager /></div>
        <div className="m-hero-txt"><span className="ya m-season">AW—26</span><h1 className="t-h" data-split>{C("h1")}</h1></div>
        <div className="m-hero-side"><p data-reveal>{C("sub")}</p><a href="#mgrid" className="m-link mag" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("mgrid"), -90); }}>{C("shop")} <IconArrow /></a></div>
        <div className="m-vert ya">{C("season")} — DAR AL-SHAL — {C("season")} —</div></section>
      <div className="m-mq"><div id="mmq" className="m-mq-row">{[...mq, ...mq, ...mq, ...mq].map((w, i) => <span key={i} style={{ display: "contents" }}><span>{w}</span><i>—</i></span>)}</div></div>
      <section className="m-cats"><div className="m-sec-h"><h2 className="t-h" data-split>{C("cats")}</h2><span className="ya">01</span></div>
        <div className="m-cat-grid">{def.cats.map((c, i) => <a key={i} href="#mgrid" onClick={(e) => { e.preventDefault(); pick(i); }} className="m-cat" data-cursor={t.shop}><Img id={[P[0].img, P[1].img, P[3].img, P[7].img][i]} w={900} /><span><b>{L(c)}</b><i className="ya">0{i + 1}</i></span></a>)}</div></section>
      <section className="m-look" id="mlook"><div className="m-look-pin"><div className="m-look-track" id="mlt">
        <div className="m-look-head"><span className="ya">02 — LOOKBOOK</span><h2 className="t-h">{C("look")}</h2><p>{C("lookSub")}</p></div>
        {(def.looks ?? []).map((l, i) => <figure key={l} className={`m-look-item ${i % 2 ? "low" : ""}`}><Img id={l} w={1000} /><figcaption><span className="ya">LOOK {String(i + 1).padStart(2, "0")}</span><span>{L(P[i % P.length].name)}</span></figcaption></figure>)}</div></div></section>
      <section className="m-grid-sec" id="mgrid"><div className="m-sec-h"><h2 className="t-h" data-split>{C("newIn")}</h2>
        <div className="m-filter"><button className={cat == null ? "on" : ""} onClick={() => setCat(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)}</button>)}</div></div>
        <div className="m-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} big={i % 5 === 0} />)}</div></section>
      <section className="m-stl"><div className="m-stl-img" data-clip><Img id="1490481651871-ab68de25d43d" w={1600} />
        {hot.map((h, i) => { const p = P.find((x) => x.id === h[2])!; const pos = { top: h[0] + "%", insetInlineStart: h[1] + "%" }; return (
          <span key={i}><button className="m-hot" style={pos} onClick={() => setPop(pop === i ? null : i)} aria-label={L(p.name)}><i /></button>
            <div className={`m-pop ${pop === i ? "on" : ""}`} style={pos}><Img id={p.img} w={300} fb={fb(p)} /><div><b>{L(p.name)}</b><span>{price(p.price)}</span><button onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}>{t.add}</button></div></div></span>); })}</div>
        <div className="m-stl-txt"><span className="ya">03</span><h2 className="t-h" data-split>{C("stl")}</h2><p>{C("stlSub")}</p><blockquote data-reveal>{C("quote")}</blockquote></div></section>
    </div>
  );
}
