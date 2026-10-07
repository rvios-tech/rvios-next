"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/site/Img";
import { IconBag, IconPlus } from "@/components/site/Icons";
import { gsap, marquee, ScrollTrigger } from "@/lib/fx";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";

const FLV = ["#6B3E26", "#D9B98A", "#9CC28B", "#D4436A", "#E3A048", "#B5703E"];

export function Header() {
  const { def, L, C, t, setDrawer, count, num, base, setOnAdd } = useStore();
  const cartRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOnAdd(() => { if (cartRef.current) gsap.fromTo(cartRef.current, { scale: 1.18 }, { scale: 1, duration: 0.7, ease: "elastic.out(1,.3)" }); }); return () => setOnAdd(null); }, [setOnAdd]);
  return (
    <>
      <div className="s-ann">{C("ann")}</div>
      <header className="s-hdr"><Link href={base} className="s-logo"><StoreEmblem slug={def.slug} size={42} color={def.accent} /><b>{L(def.name)}</b></Link>
        <nav className="s-nav">{def.cats.map((c, i) => <a key={i} href={`#sg-${i}`} onClick={(e) => { const el = document.getElementById(`sg-${i}`); if (el) { e.preventDefault(); scrollToEl(el, -140); } }}>{L(c)}</a>)}</nav>
        <button className="s-cart" id="scart" ref={cartRef} onClick={() => setDrawer(true)}><IconBag /><span>{t.cart}</span>{count > 0 && <b>{num(count)}</b>}</button></header>
    </>
  );
}

export function Footer() {
  const { def, L, lang } = useStore();
  return <footer className="s-foot"><div className="s-foot-in"><h2 className="t-h">{L(def.name)} <span>🧁</span></h2><p>{lang === "ar" ? "مطبخ منزلي في إب، نخبز بالطلب كل يوم." : "A home kitchen in Ibb, baking to order every day."}</p>
    <div className="s-frow"><span>{lang === "ar" ? "السبت إلى الخميس، ٨ص إلى ٨م" : "Sat to Thu, 8am to 8pm"}</span><span>Instagram · TikTok</span></div></div></footer>;
}

/** Card with fly-to-cart: the product image flies into the cart button. */
export function Card({ p }: { p: Product; i?: number }) {
  const { L, price, add, base, fb, badge } = useStore();
  const ref = useRef<HTMLElement>(null);
  const fly = () => {
    const src = ref.current?.querySelector("img"), cart = document.getElementById("scart");
    if (src && cart) {
      const r1 = src.getBoundingClientRect(), r2 = cart.getBoundingClientRect(); const f = src.cloneNode() as HTMLImageElement;
      Object.assign(f.style, { position: "fixed", left: r1.left + "px", top: r1.top + "px", width: r1.width + "px", height: r1.height + "px", borderRadius: "50%", zIndex: "500", objectFit: "cover", pointerEvents: "none" });
      document.body.appendChild(f);
      gsap.to(f, { left: r2.left + r2.width / 2 - 20, top: r2.top + r2.height / 2 - 20, width: 40, height: 40, duration: 0.8, ease: "power3.in", onComplete: () => f.remove() });
    }
    add(p.id, p.variant ? L(p.variant.options[0]) : "");
  };
  return (
    <article className="s-item" data-reveal ref={ref}><Link href={`${base}/p/${p.id}`} className="s-ii"><Img id={p.img} w={600} fb={fb(p)} />{p.badge && <span className={`s-st ${p.badge}`}>{badge(p.badge)}</span>}</Link>
      <div className="s-ib"><h3><Link href={`${base}/p/${p.id}`}>{L(p.name)}</Link></h3><p>{L(p.desc)}</p><div className="s-ir"><b>{price(p.price)}{p.old && <> <s>{price(p.old)}</s></>}</b><button className="s-add" onClick={fly} aria-label="+"><IconPlus /></button></div></div></article>
  );
}

export function Home() {
  const { def, L, C, add, num, price, lang, fb } = useStore();
  const P = def.products.filter((p) => !p.hidden);
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0); const [picks, setPicks] = useState<number[]>([]);
  const rib = C<string[]>("rib"), flavors = C<string[]>("flavors");
  const floaters = [P[0], P[2], P[3], P[1], P[5]];
  useEffect(() => {
    const el = root.current!; const offs: (() => void)[] = [];
    offs.push(marquee(el.querySelector<HTMLElement>("#sr1")!, 0.05, 1), marquee(el.querySelector<HTMLElement>("#sr2")!, 0.04, -1));
    gsap.from(el.querySelectorAll(".s-float"), { scale: 0, rotate: -30, duration: 1.2, stagger: 0.1, ease: "back.out(1.8)", delay: 0.2 });
    // draggable floaters with an elastic spring-back
    el.querySelectorAll<HTMLElement>("[data-drag]").forEach((d, i) => {
      const bob = gsap.to(d, { y: "+=" + (14 + i * 4), duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" });
      let sx = 0, sy = 0, dx = 0, dy = 0, down = false;
      const pd = (e: PointerEvent) => { down = true; sx = e.clientX - dx; sy = e.clientY - dy; d.setPointerCapture(e.pointerId); d.classList.add("grab"); d.querySelector(".s-hint")?.remove(); };
      const pm = (e: PointerEvent) => { if (!down) return; dx = e.clientX - sx; dy = e.clientY - sy; gsap.set(d, { x: dx, rotate: dx * 0.08 }); d.style.translate = `0 ${dy}px`; };
      const pu = () => { down = false; d.classList.remove("grab"); gsap.to(d, { x: 0, rotate: 0, duration: 1.2, ease: "elastic.out(1,.35)" }); const o = { v: dy }; gsap.to(o, { v: 0, duration: 1.2, ease: "elastic.out(1,.35)", onUpdate: () => { d.style.translate = `0 ${o.v}px`; } }); dx = 0; dy = 0; };
      d.addEventListener("pointerdown", pd); d.addEventListener("pointermove", pm); d.addEventListener("pointerup", pu);
      offs.push(() => { bob.kill(); d.removeEventListener("pointerdown", pd); d.removeEventListener("pointermove", pm); d.removeEventListener("pointerup", pu); });
    });
    def.cats.forEach((_, i) => { const st = ScrollTrigger.create({ trigger: el.querySelector(`#sg-${i}`), start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setTab(i) }); offs.push(() => st.kill()); });
    return () => offs.forEach((f) => f());
  }, [lang, def.cats]);
  const pickFlavor = (f: number) => {
    if (picks.length >= 6) return; setPicks((p) => [...p, f]);
    requestAnimationFrame(() => { const sl = root.current!.querySelectorAll(".s-slot")[picks.length]; gsap.fromTo(sl, { scale: 0.3, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.5)" }); });
  };
  const left = 6 - picks.length;
  return (
    <div ref={root}>
      <section className="s-hero"><div className="s-hero-txt"><div className="s-info">{C<[string, string][]>("info").map((x) => <span key={x[1]}>{x[0]} {x[1]}</span>)}</div>
        <h1 className="t-h"><span data-split>{C("h1")}</span><em data-split>{C("h1b")}</em></h1><p data-reveal>{C("sub")}</p>
        <a href="#menu" className="s-btn mag" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("menu")); }}>{C("order")} 🍪</a></div>
        <div className="s-play">{floaters.map((p, i) => <div key={p.id} className={`s-float f${i}`} data-drag><Img id={p.img} w={500} fb={fb(p)} />{i === 0 && <span className="s-hint">{C("drag")}</span>}</div>)}<div className="s-sun" /></div></section>
      <div className="s-ribbons"><div className="s-rib r1"><div id="sr1">{[...rib, ...rib, ...rib, ...rib].map((w, i) => <span key={i} style={{ display: "contents" }}><span>{w}</span><i>✿</i></span>)}</div></div>
        <div className="s-rib r2"><div id="sr2">{[...rib, ...rib, ...rib, ...rib].map((w, i) => <span key={i} style={{ display: "contents" }}><span>{w}</span><i>●</i></span>)}</div></div></div>
      <section className="s-menu" id="menu"><div className="s-mtabs">{def.cats.map((c, i) => <button key={i} className={tab === i ? "on" : ""} onClick={() => scrollToEl(document.getElementById(`sg-${i}`), -140)}>{L(c)}</button>)}</div>
        <h2 className="t-h s-mh" data-split>{C("menu")}</h2>
        {def.cats.map((c, i) => <div key={i} className="s-grp" id={`sg-${i}`}><h3 className="t-h">{L(c)}</h3><div className="s-list">{P.filter((p) => p.cat === i).map((p) => <Card key={p.id} p={p} />)}</div></div>)}</section>
      <section className="s-box"><div className="s-box-txt"><h2 className="t-h" data-split>{C("box")}</h2><p>{C("boxSub")}</p>
        <div className="s-flv">{flavors.map((f, i) => <button key={f} style={{ ["--c" as string]: FLV[i] }} onClick={() => pickFlavor(i)}><i />{f}</button>)}</div>
        <div className="s-box-row"><b>{left ? C<string>("boxLeft").replace("{n}", num(left)) : C("boxDone")}</b><button className="s-reset" onClick={() => setPicks([])}>{C("reset")}</button>
          <button className="s-btn" disabled={left > 0} onClick={() => { add("box", picks.map((f) => flavors[f]).join("، ")); setPicks([]); gsap.fromTo(root.current!.querySelector(".s-crate"), { rotate: -4 }, { rotate: 0, duration: 0.8, ease: "elastic.out(1,.3)" }); }}>{C("boxAdd")} · {price(9000)}</button></div></div>
        <div className="s-crate">{Array.from({ length: 6 }, (_, i) => { const f = picks[i]; return <span key={i} className={`s-slot ${f != null ? "on" : ""}`} style={{ ["--c" as string]: f == null ? "transparent" : FLV[f] }}>{f == null ? "" : flavors[f].charAt(0)}</span>; })}</div></section>
    </div>
  );
}
