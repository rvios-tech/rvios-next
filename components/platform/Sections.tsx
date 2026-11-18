"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATALOG, SECTORS } from "@/lib/catalog";
import { GLSL_NOISE, gsap, marquee, ScrollTrigger, shader } from "@/lib/fx";
import { FAQS, PLANS, PX } from "@/lib/i18n-platform";
import { SITE_STR } from "@/lib/i18n-site";
import { Img } from "../site/Img";
import { Brand, LogoMark } from "../site/Logo";
import { IconArrow, IconCheck } from "../site/Icons";
import { Poster, TemplateMark } from "../site/Poster";
import { StoreEmblem } from "../site/StoreLogo";
import { useSite } from "../site/Providers";
import { ContactLinks } from "../site/Contact";
import { ByRegion } from "../region/ByRegion";

type PlanId = "free" | "pro" | "biz";

/* ---------------- stores marquee ---------------- */
export function StoresMarquee() {
  const { lang } = useSite(); const x = PX[lang];
  const r1 = useRef<HTMLDivElement>(null), r2 = useRef<HTMLDivElement>(null);
  useEffect(() => { const a = marquee(r1.current!, 0.04, 1), b = marquee(r2.current!, 0.03, -1); return () => { a(); b(); }; }, []);
  const stores = CATALOG.map((c) => ({ slug: c.file.split("/").pop()!, name: c.store[lang], href: c.file, plan: (c.id === "essential" ? "free" : c.tier === "standard" ? "pro" : "biz") as PlanId, sector: SECTORS[c.sector][lang] }));
  const card = (s: (typeof stores)[number], k: string) => (
    <Link key={k} className="scard" href={s.href} data-cursor={x.visit}>
      <StoreEmblem slug={s.slug} size={52} />
      <span><b>{s.name}</b><small>{s.sector} <em className={`pl ${s.plan}`}>{x.plans[s.plan]}</em></small></span>
    </Link>
  );
  return (
    <section className="mq">
      <div className="wrap mq-h"><h2 className="disp">{x.mq}</h2><span className="ya mq-n">{stores.length}+</span></div>
      <div className="mq-t"><div className="mq-r" ref={r1}>{[...stores, ...stores].map((s, i) => card(s, "a" + i))}</div></div>
      <div className="mq-t"><div className="mq-r" ref={r2}>{[...stores, ...stores].map((s, i) => card(s, "b" + i))}</div></div>
    </section>
  );
}

/* ---------------- templates showcase (horizontal pin) ---------------- */
export function TemplatesShowcase() {
  const { lang } = useSite(); const x = PX[lang];
  const ref = useRef<HTMLElement>(null), tr = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (innerWidth <= 900) return;
    const dist = () => Math.max(0, tr.current!.scrollWidth - innerWidth + 40);
    const tw = gsap.to(tr.current, { x: () => (lang === "ar" ? dist() : -dist()), ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: () => "+=" + dist(), pin: ref.current!.querySelector(".tsh-pin"), scrub: 1, invalidateOnRefresh: true } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [lang]);
  return (
    <section className="tsh" ref={ref}><div className="tsh-pin"><div className="tsh-track" ref={tr}>
      <div className="tsh-head"><span className="kick">TEMPLATES</span><h2 className="disp">{x.th}</h2><p className="ss">{x.ts}</p><Link className="bbtn mag" href="/templates">{x.tAll} <IconArrow /></Link></div>
      {CATALOG.map((tp) => <Link key={tp.id} className="tsh-c" href={tp.file} data-cursor={x.live}><div className="tsh-art"><Poster tp={tp} lang={lang} /></div><div className="tsh-m"><TemplateMark tp={tp} className="t-mk" /><div><b className="disp">{tp.name[lang]}</b><span>{tp.tag[lang]}</span></div><em className={tp.price ? "ya" : ""}>{tp.price ? "$" + tp.price : x.free}</em></div></Link>)}
    </div></div></section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const { lang } = useSite();
  return <section className="fq wrap" id="faq"><h2 className="disp" data-split>{PX[lang].fq}</h2><div>{FAQS[lang].map((f, i) => <details key={i} open={i === 0}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</div></section>;
}

/* ---------------- curtain footer ---------------- */
export function CurtainFooter() {
  const { lang } = useSite(); const s = SITE_STR[lang];
  const ref = useRef<HTMLElement>(null); const [time, setTime] = useState("");
  useEffect(() => {
    const c = ref.current!.querySelector("canvas")!;
    const sh = shader(c, GLSL_NOISE + `void main(){vec2 uv=gl_FragCoord.xy/r;float n=fbm(uv*vec2(2.,1.2)+vec2(t*.05,0.)+fbm(uv*3.-t*.04));vec3 col=mix(c1,c3,smoothstep(-.2,.8,n));col=mix(col,c2,smoothstep(.55,1.,n)*.25);gl_FragColor=vec4(col,1.);}`, { colors: ["#C1272D", "#FFDAA7", "#8E1B20"], scale: 0.4 });
    const fmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", { timeZone: "Asia/Riyadh", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setTime(fmt.format(new Date())); tick(); const ci = setInterval(tick, 1000);
    const st = ScrollTrigger.create({ trigger: ref.current, start: "top 70%", onEnter: () => { const f = ref.current!.querySelector(".fbig")!; f.classList.remove("play"); void (f as HTMLElement).getBoundingClientRect(); f.classList.add("play"); } });
    return () => { sh.destroy(); clearInterval(ci); st.kill(); };
  }, [lang]);
  return (
    <footer className="foot" ref={ref}><div className="foot-in"><canvas /><div className="wrap fw"><LogoMark className="fbig" />
      <div><h2 className="disp">{PX[lang].cta3}</h2><div className="fcta"><Link className="pbtn mag" href="/create">{s.start} <IconArrow /></Link><Link className="lbtn" href="/templates">{s.templates}</Link></div></div>
      <div className="fg"><div><Brand /><p>{s.by}</p><ContactLinks compact /></div><div><Link href="/app">{s.app}</Link><Link href="/templates">{s.templates}</Link><Link href="/guide">{s.guides}</Link><Link href="/custom">{lang === "ar" ? "متجر بتصميم خاص" : "Custom store"}</Link><Link href="/pay">{lang === "ar" ? "طرق الدفع" : "Payments"}</Link><a href="#faq">{s.faq}</a></div><div><span className="ltr">rvios.store</span><span><ByRegion>{(c) => c.location[lang]}</ByRegion> {time}</span><span>{s.rights}</span></div></div>
    </div></div></footer>
  );
}
