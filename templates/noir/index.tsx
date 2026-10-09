"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Img } from "@/components/site/Img";
import { IconBag, IconPlus, IconSearch } from "@/components/site/Icons";
import { GLSL_NOISE, gsap, marquee, shader } from "@/lib/fx";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";
import { U } from "@/lib/u";

export function Header() {
  const { def, L, C, t, setDrawer, count, num, base, setCat } = useStore();
  return (
    <>
      <div className="n-ann">{C("ann")}</div>
      <header className="n-hdr">
        <nav className="n-nav">{def.cats.slice(0, 3).map((c, i) => <Link key={i} href={base} onClick={() => setCat(i)}>{L(c)}</Link>)}</nav>
        <Link className="n-logo" href={base}><StoreEmblem slug={def.slug} size={34} color={def.accent} /><span>{L(def.name)}</span><small className="ya">RIYADH · EST 1998</small></Link>
        <div className="n-act"><button className="icb" aria-label="search"><IconSearch /></button><button className="icb" onClick={() => setDrawer(true)} aria-label={t.cart}><IconBag />{count > 0 && <span className="n">{num(count)}</span>}</button></div>
      </header>
    </>
  );
}

export function Footer() {
  const { def, L, lang } = useStore();
  return <footer className="n-foot"><div className="n-foot-big">{L(def.name)}</div><div className="n-foot-row"><span>{lang === "ar" ? "الرياض، طريق الملك فهد" : "King Fahd Rd, Riyadh"}</span><span className="ya">alsabaa.com</span><span>© 2026</span></div></footer>;
}

export function Card({ p, i = 0 }: { p: Product; i?: number }) {
  const { L, t, price, add, base, fb, badge } = useStore();
  return (
    <article className="n-card" data-reveal style={{ ["--d" as string]: (i % 4) * 0.08 + "s" }}>
      <Link href={`${base}/p/${p.id}`} className="n-arch" data-cursor={t.view}><Img id={p.img} w={800} fb={fb(p)} />{p.badge && <span className="n-tag">{badge(p.badge)}</span>}</Link>
      <div className="n-meta"><span className="ya n-idx">{String(i + 1).padStart(2, "0")}</span><h3>{L(p.name)}</h3><div className="n-pr">{price(p.price)}{p.old && <> <s>{price(p.old)}</s></>}</div>
        <button className="n-add" onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}>{t.add}</button></div>
    </article>
  );
}

export function Home() {
  const { def, L, C, t, price, add, base, cat, setCat, lang } = useStore();
  const P = def.products; const list = cat == null ? P : P.filter((p) => p.cat === cat);
  const root = useRef<HTMLDivElement>(null);
  const tiers = C<[string, string][]>("tiers"), words = C<string[]>("marquee");
  useEffect(() => {
    const el = root.current!; const rtl = lang === "ar";
    const sm = shader(el.querySelector<HTMLCanvasElement>("#smoke")!, GLSL_NOISE + `void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.);float n=fbm(p*1.6+vec2(t*.05,-t*.08)+fbm(p*2.2-t*.06)*.8);float d=distance(uv,m);float glow=smoothstep(.55,0.,d)*.35;float smoke=smoothstep(-.2,.9,n)*(1.-uv.y*.55);vec3 col=mix(c3,c1,smoke*.75+glow);col+=c2*pow(smoke,3.)*.35;gl_FragColor=vec4(col,1.);}`, { colors: ["#6b4f2a", "#e8c98f", "#0b0908"], scale: 0.5 });
    const st = { trigger: el.querySelector(".n-hero"), start: "top top", end: "bottom top", scrub: true };
    const tws = [
      gsap.to(el.querySelector(".n-l.a"), { xPercent: rtl ? 18 : -18, ease: "none", scrollTrigger: st }),
      gsap.to(el.querySelector(".n-l.b"), { xPercent: rtl ? -18 : 18, ease: "none", scrollTrigger: st }),
      gsap.to(el.querySelector(".n-h1"), { "--long": 600, ease: "none", scrollTrigger: st }),
      gsap.fromTo(el.querySelector("#bottle"), { scale: 0.86 }, { scale: 1.08, ease: "none", scrollTrigger: st }),
    ];
    const mq = marquee(el.querySelector<HTMLElement>("#nmq")!, 0.04);
    const track = el.querySelector<HTMLElement>("#ntrack")!; const dist = () => Math.max(0, track.scrollWidth - innerWidth + 80);
    if (innerWidth > 860) tws.push(gsap.to(track, { x: () => (rtl ? dist() : -dist()), ease: "none", scrollTrigger: { trigger: el.querySelector(".n-coll"), start: "top top", end: () => "+=" + dist(), pin: el.querySelector(".n-coll-pin"), scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => { (el.querySelector("#nprog") as HTMLElement).style.transform = `scaleX(${s.progress})`; } } }));
    gsap.from(el.querySelector("#bottle"), { opacity: 0, y: 80, duration: 1.8, ease: "power4.out", delay: 0.2 });
    return () => { sm.destroy(); mq(); tws.forEach((x) => { x.scrollTrigger?.kill(); x.kill(); }); };
  }, [lang]);
  const pick = (c: number | null) => { setCat(c); setTimeout(() => scrollToEl(document.getElementById("nrows"), -200), 60); };
  return (
    <div ref={root}>
      <section className="n-hero"><canvas className="n-smoke" id="smoke" /><div className="n-vign" />
        <h1 className="n-h1"><span className="n-l a" data-split>{C("h1a")}</span><span className="n-l b" data-split>{C("h1b")}</span></h1>
        <div className="n-bottle" id="bottle"><Img id={P[0].img} w={1200} fb="ع" eager data-speed="-1.2" /></div>
        <div className="n-hero-foot"><p data-reveal>{C("heroSub")}</p><a className="n-btn mag" href="#coll" data-cursor="↓" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("coll")); }}>{C("discover")}</a></div>
        <div className="n-scroll ya">SCROLL</div></section>
      <div className="n-mq"><div className="n-mq-row" id="nmq">{[...words, ...words, ...words, ...words].map((w, i) => <span key={i} style={{ display: "contents" }}><span>{w}</span><i>✦</i></span>)}</div></div>
      <section className="n-coll" id="coll"><div className="n-coll-pin">
        <div className="n-coll-head"><span className="ya">THE COLLECTION</span><h2 data-split>{C("coll")}</h2><p>{C("collSub")}</p><div className="n-prog"><i id="nprog" /></div></div>
        <div className="n-track" id="ntrack">{P.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div></div></section>
      <section className="n-notes"><div className="n-wrap"><span className="ya n-kick">NOTES</span><h2 data-split>{C("notes")}</h2>
        <div className="n-pyr">{tiers.map((x, i) => <div key={i} className="n-tier" data-hover-img={U(["1615634260167-c8cdede054de", "1490750967868-88aa4486c946", "1610375461246-83df859d849d"][i], 600)} style={{ ["--w" as string]: 60 + i * 20 + "%" }}><span className="ya">0{i + 1}</span><b>{x[0]}</b><em>{x[1]}</em></div>)}</div></div></section>
      <section className="n-story"><div className="n-story-img" data-clip><Img id="1563170351-be82bc888aa4" w={1400} fb="ع" data-speed="1" /></div>
        <div className="n-story-txt"><span className="ya n-kick">SINCE 1998</span><blockquote data-split>{C("story")}</blockquote><p data-reveal>{C("storyTxt")}</p></div></section>
      <section className="n-gift"><div className="n-gift-card" data-tilt="10" data-spot style={{ ["--spot" as string]: "rgba(200,164,106,.18)", ["--spot-b" as string]: "rgba(200,164,106,.8)" }}>
        <Img id={P[4].img} w={1000} fb="ص" /><div className="n-gift-txt"><span className="ya n-kick">LIMITED</span><h2 data-split>{C("gift")}</h2><p>{C("giftTxt")}</p><div className="n-pr big">{price(P[4].price)} <s>{price(P[4].old!)}</s></div>
          <button className="n-btn solid mag" onClick={() => add("p5")}>{t.add}</button></div></div></section>
      <section className="n-list"><div className="n-wrap"><div className="n-list-head"><h2 data-split>{C("all")}</h2>
        <div className="n-filter"><button className={cat == null ? "on" : ""} onClick={() => pick(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => pick(i)}>{L(c)}</button>)}</div></div>
        <ul className="n-rows" id="nrows">{list.map((p, i) => <li key={p.id} data-hover-img={U(p.img, 600)}><Link href={`${base}/p/${p.id}`}><span className="ya">{String(i + 1).padStart(2, "0")}</span><b>{L(p.name)}</b><em>{L(def.cats[p.cat])}</em><span className="n-pr">{price(p.price)}</span></Link><button className="n-plus" onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")} aria-label={t.add}><IconPlus /></button></li>)}</ul></div></section>
    </div>
  );
}
