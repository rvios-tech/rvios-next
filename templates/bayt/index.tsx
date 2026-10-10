"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/site/Img";
import { IconArrow, IconBag, IconPlus, IconSearch } from "@/components/site/Icons";
import { gsap, ScrollTrigger } from "@/lib/fx";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";

export function Header() {
  const { def, L, t, setDrawer, count, num, base, setCat } = useStore();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => ref.current?.classList.toggle("solid", s.scroll() > 40) }); return () => st.kill(); }, []);
  return (
    <header className="b-hdr" ref={ref}><Link href={base} className="b-logo"><StoreEmblem slug={def.slug} size={32} color={def.accent} /><b>{L(def.name)}</b></Link>
      <nav className="b-nav">{def.cats.map((c, i) => <Link key={i} href={base} onClick={() => setCat(i)}>{L(c)}</Link>)}</nav>
      <div className="b-act"><button className="icb" aria-label="search"><IconSearch /></button><button className="icb" onClick={() => setDrawer(true)} aria-label={t.cart}><IconBag />{count > 0 && <span className="n">{num(count)}</span>}</button></div></header>
  );
}

export function Footer() {
  const { def, L, C, lang } = useStore();
  return (
    <footer className="b-foot"><div className="b-prom">{C<[string, string][]>("promise").map((x) => <div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div>
      <div className="b-frow"><span className="b-logo"><StoreEmblem slug={def.slug} size={28} color={def.accent} /><b>{L(def.name)}</b></span><span>{lang === "ar" ? "الرياض، حي النرجس" : "Al-Narjis, Riyadh"}</span><span>© 2026</span></div></footer>
  );
}

/** Product card with fabric swatches that re-tint the product photo. */
export function Card({ p, i = 0 }: { p: Product; i?: number }) {
  const { L, t, price, add, base, fb, badge } = useStore();
  const [sw, setSw] = useState(0);
  return (
    <article className="b-card" data-reveal style={{ ["--d" as string]: (i % 4) * 0.07 + "s" }}>
      <Link href={`${base}/p/${p.id}`} className="b-ci" data-cursor={t.view} style={{ ["--f" as string]: "" }}>
        <div style={{ position: "absolute", inset: 0, filter: sw ? `sepia(.25) hue-rotate(${sw * 28}deg) saturate(${1 + sw * 0.15})` : undefined, transition: "filter .6s" }}><Img id={p.img} w={800} fb={fb(p)} /></div>
        {p.badge && <span className="b-tag">{badge(p.badge)}</span>}</Link>
      <div className="b-cb"><div><h3>{L(p.name)}</h3><span className="b-pr">{price(p.price)}{p.old && <> <s>{price(p.old)}</s></>}</span></div>
        {p.swatches && <div className="b-sw">{p.swatches.map((c, k) => <button key={c} style={{ ["--c" as string]: c }} className={k === sw ? "on" : ""} onClick={() => setSw(k)} aria-label={c} />)}</div>}
        <button className="b-add" onClick={() => add(p.id, p.variant ? L(p.variant.options[sw] ?? p.variant.options[0]) : "")} aria-label={t.add}><IconPlus /></button></div>
    </article>
  );
}

export function Home() {
  const { def, L, C, t, price, add, base, cat, setCat, lang, fb } = useStore();
  const P = def.products; const list = cat == null ? P : P.filter((p) => p.cat === cat);
  const root = useRef<HTMLDivElement>(null); const [pop, setPop] = useState<number | null>(null);
  const hots: [number, number, string][] = [[58, 36, "p1"], [44, 70, "p3"], [74, 58, "p4"], [62, 12, "p2"]];
  useEffect(() => {
    const el = root.current!; const st = { trigger: el.querySelector(".b-hero"), start: "top top", end: "bottom top", scrub: true };
    const tws = [
      gsap.fromTo(el.querySelector("#bframe"), { clipPath: "inset(0 0 0 0 round 400px 400px 24px 24px)" }, { clipPath: "inset(0 0 0 0 round 24px 24px 24px 24px)", ease: "none", scrollTrigger: st }),
      gsap.to(el.querySelector("#bframe img"), { scale: 1.12, yPercent: 6, ease: "none", scrollTrigger: st }),
    ];
    gsap.from(el.querySelector(".b-chip"), { x: lang === "ar" ? 60 : -60, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.6 });
    return () => tws.forEach((x) => { x.scrollTrigger?.kill(); x.kill(); });
  }, [lang]);
  const pick = (c: number | null) => { setCat(c); setTimeout(() => scrollToEl(document.getElementById("bgrid"), -90), 60); };
  return (
    <div ref={root}>
      <section className="b-hero"><div className="b-hero-txt"><span className="b-kick ya">EST. 2019 — RIYADH</span><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>
        <a href="#broom" className="b-btn mag" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("broom")); }}>{C("explore")} <IconArrow /></a></div>
        <div className="b-hero-img"><div className="b-frame" id="bframe"><Img id="1586023492125-27b2c045efd7" w={1600} eager /></div><div className="b-chip" data-reveal style={{ ["--d" as string]: ".4s" }}><Img id={P[0].img} w={200} fb="ك" /><div><b>{L(P[0].name)}</b><span>{price(P[0].price)}</span></div></div></div></section>
      <section className="b-room" id="broom"><div className="b-room-h"><h2 className="t-h" data-split>{C("room")}</h2><p>{C("roomSub")}</p></div>
        <div className="b-room-img" data-clip><Img id="1493663284031-b7e3aefcae8e" w={2000} />
          {hots.map((h, i) => { const p = P.find((x) => x.id === h[2])!; const pos = { top: h[0] + "%", insetInlineStart: h[1] + "%" }; return (
            <span key={i}><button className={`b-hot ${pop === i ? "on" : ""}`} style={pos} onClick={() => setPop(pop === i ? null : i)} aria-label={L(p.name)}><IconPlus /></button>
              <div className={`b-pop ${pop === i ? "on" : ""}`} style={pos}><Img id={p.img} w={300} fb={fb(p)} /><div><b>{L(p.name)}</b><span>{price(p.price)}</span><div className="b-pa"><Link href={`${base}/p/${p.id}`}>{t.view}</Link><button onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}>{t.add}</button></div></div></div></span>); })}</div></section>
      <section className="b-rooms"><div className="b-sec-h"><h2 className="t-h" data-split>{C("rooms")}</h2></div>
        <div className="b-hs" data-lenis-prevent-horizontal>{C<string[]>("roomsL").map((r, i) => <a key={r} href="#bgrid" onClick={(e) => { e.preventDefault(); pick(null); }} className="b-rc" data-cursor={t.shop}><Img id={["1578500494198-246f612d3b3d", "1532372320572-cda25653a26d", "1578749556568-bc2c40e68b61", "1507473885765-e6ed057f782c"][i]} w={900} /><span><b className="t-h">{r}</b><i className="ya">0{i + 1}</i></span></a>)}</div></section>
      <section className="b-mats"><div className="b-sec-h"><h2 className="t-h" data-split>{C("mats")}</h2></div>
        <div className="b-mat-g">{C<[string, string][]>("matsL").map((m, i) => <div key={m[0]} className="b-mat" data-tilt="6" style={{ ["--c" as string]: ["#C8A27A", "#D9D0C1", "#EEE8DE", "#5B3B28"][i] }}><i /><b>{m[0]}</b><span>{m[1]}</span></div>)}</div></section>
      <section className="b-grid-s" id="bgrid"><div className="b-sec-h"><h2 className="t-h" data-split>{C("picks")}</h2>
        <div className="b-filter"><button className={cat == null ? "on" : ""} onClick={() => setCat(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)}</button>)}</div></div>
        <div className="b-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div></section>
    </div>
  );
}
