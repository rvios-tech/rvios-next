"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Img } from "@/components/site/Img";
import { IconArrow, IconCart, IconPlus, IconSearch } from "@/components/site/Icons";
import { gsap, shader } from "@/lib/fx";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";

/** ⌘K command palette — instant product search. */
function CommandK({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { def, L, C, price, base, fb } = useStore(); const router = useRouter();
  const [q, setQ] = useState(""); const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => inp.current?.focus(), 50); } }, [open]);
  const r = def.products.filter((p) => !p.hidden && (L(p.name) + " " + p.name.en).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={`v-cmd ${open ? "on" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="v-cmd-box" data-lenis-prevent>
        <div className="v-cmd-in"><IconSearch /><input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder={C("cmdk")} /><kbd className="ya">ESC</kbd></div>
        {r.length ? r.map((p) => <a key={p.id} className="v-r" href={`${base}/p/${p.id}`} onClick={(e) => { e.preventDefault(); onClose(); router.push(`${base}/p/${p.id}`); }}><Img id={p.img} w={120} fb={fb(p)} /><span><b>{L(p.name)}</b><small>{L(def.cats[p.cat])}</small></span><em>{price(p.price)}</em></a>) : <p className="v-nores">{C("noRes")}</p>}
      </div>
    </div>
  );
}

export function Header() {
  const { def, L, C, t, setDrawer, count, num, base, setCat } = useStore();
  const [k, setK] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setK(true); } if (e.key === "Escape") setK(false); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <>
      <header className="v-hdr"><Link href={base} className="v-logo"><StoreEmblem slug={def.slug} size={30} color={def.accent} /><span>{L(def.name)}</span></Link>
        <button className="v-k" onClick={() => setK(true)}><IconSearch /><span>{C("cmdk")}</span><kbd className="ya">⌘K</kbd></button>
        <nav className="v-nav">{def.cats.map((c, i) => <Link key={i} href={base} onClick={() => setCat(i)}>{L(c)}</Link>)}</nav>
        <button className="icb v-cart" onClick={() => setDrawer(true)} aria-label={t.cart}><IconCart />{count > 0 && <span className="n">{num(count)}</span>}</button></header>
      <CommandK open={k} onClose={() => setK(false)} />
    </>
  );
}

export function Footer() {
  const { def, L, C, lang } = useStore();
  return (
    <footer className="v-foot"><div className="v-trust">{C<[string, string][]>("trust").map((x) => <div key={x[0]} data-spot><b>{x[0]}</b><span>{x[1]}</span></div>)}</div>
      <div className="v-frow"><span className="v-logo"><StoreEmblem slug={def.slug} size={28} color={def.accent} /><span>{L(def.name)}</span></span><span className="ya">techplus.ye</span><span>{lang === "ar" ? "تعز، شارع جمال" : "Jamal St, Taiz"}</span></div></footer>
  );
}

export function Card({ p, i = 0 }: { p: Product; i?: number }) {
  const { def, L, t, price, add, base, fb, badge, plan, num } = useStore();
  return (
    <article className="v-card" data-spot data-reveal style={{ ["--d" as string]: (i % 4) * 0.06 + "s" }}>
      <Link href={`${base}/p/${p.id}`} className="v-ci"><Img id={p.img} w={700} fb={fb(p)} />{p.badge && <span className={`v-tag ${p.badge}`}>{badge(p.badge)}</span>}</Link>
      <div className="v-cb"><small>{L(def.cats[p.cat])}</small><h3><Link href={`${base}/p/${p.id}`}>{L(p.name)}</Link></h3>
        <div className="v-chips">{(p.specs ?? []).map((s) => <span key={s[2]} className="ya">{s[2]}</span>)}</div>
        {plan === "biz" && p.stock && <div className="v-stock"><span>{t.left.replace("{n}", num(p.stock))}</span><i style={{ ["--w" as string]: p.stock * 12 + "%" }} /></div>}
        <div className="v-row"><div className="v-pr">{price(p.price)}{p.old && <s>{price(p.old)}</s>}</div><button className="v-plus" onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")} aria-label={t.add}><IconPlus /></button></div></div>
    </article>
  );
}

export function Home() {
  const { def, L, C, t, price, base, cat, setCat, lang } = useStore();
  const P = def.products; const list = cat == null ? P : P.filter((p) => p.cat === cat);
  const root = useRef<HTMLDivElement>(null), tabs = useRef<HTMLDivElement>(null), ind = useRef<HTMLSpanElement>(null);
  const [timer, setTimer] = useState("00:00:00");
  useLayoutEffect(() => { const on = tabs.current?.querySelector<HTMLElement>(".on"); if (on && ind.current) { ind.current.style.width = on.offsetWidth + "px"; ind.current.style.transform = `translateX(${on.offsetLeft}px)`; } }, [cat, lang]);
  useEffect(() => {
    const el = root.current!;
    const g = shader(el.querySelector<HTMLCanvasElement>("#vgl")!, `void main(){vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;float hz=-.12;vec3 col=c3;
      if(uv.y<hz){float z=.35/(hz-uv.y);vec2 p=vec2(uv.x*z,z+t*.6);vec2 g=abs(fract(p)-.5);float l=min(g.x,g.y);float gl=smoothstep(.04,0.,l)*.9;float fog=smoothstep(10.,1.,z);col+=c1*gl*fog*.9;float beam=smoothstep(.08,0.,abs(fract(p.x*.25+t*.05)-.5))*smoothstep(8.,1.,z);col+=c2*beam*.12;}
      float sun=smoothstep(.55,.0,length(uv-vec2((m.x-.5)*.6,.12)));col+=c2*sun*.35;col+=c1*smoothstep(.02,0.,abs(uv.y-hz))*.6;gl_FragColor=vec4(col,1.);}`, { colors: ["#3D7BFF", "#C6FF3D", "#05070B"], scale: 0.7 });
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const tick = () => { const d = Math.max(0, +end - +new Date()); setTimer([Math.floor(d / 36e5), Math.floor((d % 36e5) / 6e4), Math.floor((d % 6e4) / 1e3)].map((x) => String(x).padStart(2, "0")).join(":")); };
    tick(); const ti = setInterval(tick, 1000);
    const tw = gsap.to(el.querySelector(".v-prod"), { y: -60, rotate: lang === "ar" ? 6 : -6, ease: "none", scrollTrigger: { trigger: el.querySelector(".v-hero"), start: "top top", end: "bottom top", scrub: true } });
    gsap.from(el.querySelector(".v-prod"), { scale: 0.7, opacity: 0, rotate: -20, duration: 1.6, ease: "expo.out", delay: 0.2 });
    return () => { g.destroy(); clearInterval(ti); tw.scrollTrigger?.kill(); tw.kill(); };
  }, [lang]);
  const pickCat = (c: number | null) => {
    const grid = root.current!.querySelector("#vlist")!;
    gsap.to(grid.children, { opacity: 0, y: 20, duration: 0.22, stagger: 0.02, onComplete: () => { setCat(c); requestAnimationFrame(() => { grid.querySelectorAll("[data-reveal]").forEach((x) => x.classList.add("in")); gsap.fromTo(grid.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }); }); } });
  };
  const b = (p: Product, cls: string, w: number, fbk: string) => <Link href={`${base}/p/${p.id}`} className={`v-b ${cls}`} data-spot><Img id={p.img} w={w} fb={fbk} /><div><b>{L(p.name)}</b><span>{price(p.price)}</span></div></Link>;
  return (
    <div ref={root}>
      <section className="v-hero"><canvas id="vgl" className="v-gl" /><div className="v-fade" />
        <div className="v-hero-in"><div className="v-hero-txt"><Link className="v-pill" href={`${base}/p/p1`}><i />{C("badge")} <IconArrow /></Link><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p>
          <div className="v-cta" data-reveal style={{ ["--d" as string]: ".15s" }}><Link className="e-btn mag" href={`${base}/p/p1`}>{C("buy")} <IconArrow /></Link><a className="e-btn ghost" href="#vgrid" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("vgrid")); }}>{C("specs")}</a></div>
          <div className="v-stats">{C<[string, { ar: string; en: string }][]>("st").map((x) => <div key={x[0]}><b className="ya" {...(/^\d+$/.test(x[0]) ? { "data-count": x[0] } : {})}>{x[0]}</b><span>{L(x[1])}</span></div>)}</div></div>
          <div className="v-prod" data-tilt="14"><div className="v-ring" /><Img id={P[0].img} w={1200} fb="س" eager /><div className="v-floating ya">-52dB</div></div></div></section>
      <section className="v-sec"><div className="v-head"><h2 className="t-h" data-split>{C("bento")}</h2></div>
        <div className="v-bento">
          <Link href={`${base}/p/p1`} className="v-b b1 beam" data-spot><Img id={P[0].img} w={1000} fb="س" /><div><small>{L(def.cats[0])}</small><b>{L(P[0].name)}</b><span>{price(P[0].price)}</span></div></Link>
          {b(P[1], "b2", 700, "س")}
          <div className="v-b b3 v-deal" data-spot><small>{C("deal")}</small><div className="v-timer ya">{timer}</div><p>{C("dealSub")}</p><Link href={`${base}/p/p3`} className="v-dl"><Img id={P[2].img} w={400} fb="س" /><span><b>{L(P[2].name)}</b>{price(P[2].price)} <s>{price(P[2].old!)}</s></span></Link></div>
          {b(P[3], "b4", 900, "ح")}{b(P[6], "b5", 700, "ه")}
        </div></section>
      <section className="v-sec" id="vgrid"><div className="v-head"><h2 className="t-h" data-split>{C("shopBy")}</h2>
        <div className="v-tabs" ref={tabs}><span className="v-ind" ref={ind} /><button className={cat == null ? "on" : ""} onClick={() => pickCat(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => pickCat(i)}>{L(c)}</button>)}</div></div>
        <div className="v-grid" id="vlist">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div></section>
    </div>
  );
}
