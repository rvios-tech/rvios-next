"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATALOG, SECTORS } from "@/lib/catalog";
import { GLSL_NOISE, gsap, marquee, ScrollTrigger, shader, clamp } from "@/lib/fx";
import { FAQS, PLANS, PX } from "@/lib/i18n-platform";
import { SITE_STR } from "@/lib/i18n-site";
import { num, type Lang } from "@/lib/u";
import { Img } from "../site/Img";
import { Brand, LogoMark } from "../site/Logo";
import { IconArrow, IconCheck } from "../site/Icons";
import { Poster } from "../site/Poster";
import { StoreEmblem } from "../site/StoreLogo";
import { useSite } from "../site/Providers";
import { ContactLinks } from "../site/Contact";

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

/* ---------------- manifesto (words light up while scrolling) ---------------- */
export function Manifesto() {
  const { lang } = useSite(); const ref = useRef<HTMLParagraphElement>(null);
  const words = PX[lang].mani.replace("RVIOS Store", "RVIOS\u00A0Store").split(" ");
  useEffect(() => {
    const ws = Array.from(ref.current!.querySelectorAll<HTMLElement>(".w"));
    const st = ScrollTrigger.create({ trigger: ref.current, start: "top 85%", end: "bottom 45%", scrub: true, onUpdate: (s) => ws.forEach((w, i) => (w.style.opacity = String(0.12 + 0.88 * clamp(s.progress * ws.length - i)))) });
    return () => st.kill();
  }, [lang]);
  return <section className="mani wrap"><span className="kick">MANIFESTO</span><p ref={ref}>{words.map((w, i) => <span key={i}><span className={`w ${/RVIOS/.test(w) ? "ya" : ""}`}>{w}</span> </span>)}</p></section>;
}

/* ---------------- features bento with live mini-UIs ---------------- */
export function Features() {
  const { lang } = useSite(); const x = PX[lang]; const F = x.f;
  const [slugLen, setSlugLen] = useState(0); const slug = "bunn-haraz";
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState("#C1272D");
  const [orders, setOrders] = useState<number[]>([2049, 2048]);
  const chart = useRef<SVGPathElement>(null);
  useEffect(() => { const t = setInterval(() => setSlugLen((n) => (n + 1) % (slug.length + 14)), 140); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setOrders((o) => [o[0] + 1, ...o].slice(0, 3)), 2600); return () => clearInterval(t); }, []);
  useEffect(() => {
    const ln = chart.current!; const L = ln.getTotalLength(); ln.style.strokeDasharray = String(L); ln.style.strokeDashoffset = String(L);
    const st = ScrollTrigger.create({ trigger: ln, start: "top 85%", once: true, onEnter: () => gsap.to(ln, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }) });
    return () => st.kill();
  }, []);
  const yer = lang === "ar" ? "ر.ي" : "YER";
  return (
    <section className="feat wrap" id="features">
      <span className="kick">FEATURES</span><h2 className="disp sh" data-split>{x.fh}</h2><p className="ss" data-reveal>{x.fs}</p>
      <div className="bento">
        <div className="bx b-link" data-spot data-reveal>
          <div className="bx-ui"><div className="lk ltr"><span className="lk-dot" /><span id="lkt">{slug.slice(0, Math.min(slugLen, slug.length))}.rvios.store</span><span className="lk-c">|</span>
            <button onClick={() => { navigator.clipboard?.writeText(`https://${slug}.rvios.store`).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>{copied ? x.copied : x.copy}</button></div></div>
          <b>{F.link[0]}</b><p>{F.link[1]}</p>
        </div>
        <div className="bx b-orders" data-spot data-reveal style={{ ["--d" as string]: ".06s" }}>
          <div className="bx-ui ord">{orders.map((o) => <div className="oi" key={o}><i /><span><b>{x.newOrder} #{num(o, lang)}</b><small>{num(9000 + (o % 7) * 4500, lang)} {yer}</small></span><em>{lang === "ar" ? "قيد الانتظار" : "Pending"}</em></div>)}</div>
          <b>{F.orders[0]}</b><p>{F.orders[1]}</p>
        </div>
        <div className="bx b-id" data-spot data-reveal style={{ ["--d" as string]: ".12s" }}>
          <div className="bx-ui idui"><div className="idc" style={{ ["--c" as string]: color }}><i /><b>{CATALOG[5].store[lang]}</b><span /><span /></div></div>
          <b>{F.id[0]}</b><p>{F.id[1]}</p>
          <div className="sws">{["#C1272D", "#1F3C88", "#2F4A3A", "#B08D57", "#6B2D5C", "#111111"].map((c) => <button key={c} style={{ ["--c" as string]: c }} className={c === color ? "on" : ""} onClick={() => setColor(c)} aria-label={c} />)}</div>
        </div>
        <div className="bx b-stats" data-spot data-reveal>
          <div className="bx-ui"><svg viewBox="0 0 300 120" className="chart"><defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--brand)" stopOpacity=".35" /><stop offset="1" stopColor="var(--brand)" stopOpacity="0" /></linearGradient></defs>
            <path d="M0,100 C40,90 60,60 100,70 S160,30 200,40 S260,10 300,15 L300,120 L0,120Z" fill="url(#cg)" /><path ref={chart} d="M0,100 C40,90 60,60 100,70 S160,30 200,40 S260,10 300,15" fill="none" stroke="var(--brand)" strokeWidth="2.5" /></svg>
            <div className="kpis"><div><b className="ya" data-count="1284">0</b><span>{lang === "ar" ? "زيارة" : "visits"}</span></div><div><b className="ya" data-count="96">0</b><span>{lang === "ar" ? "طلب" : "orders"}</span></div></div></div>
          <b>{F.stats[0]}</b><p>{F.stats[1]}</p>
        </div>
        <div className="bx b-fee" data-spot data-reveal style={{ ["--d" as string]: ".06s" }}><div className="fee ya">0%</div><b>{F.fee[0]}</b><p>{F.fee[1]}</p></div>
        <div className="bx b-ver" data-spot data-reveal style={{ ["--d" as string]: ".12s" }}><div className="bx-ui"><div className="vb shimmer"><IconCheck /><span>{lang === "ar" ? "متجر موثّق" : "Verified store"}</span></div></div><b>{F.ver[0]}</b><p>{F.ver[1]}</p></div>
      </div>
    </section>
  );
}

/* ---------------- how it works: pinned phone ---------------- */
export function HowItWorks() {
  const { lang } = useSite(); const x = PX[lang];
  const [step, setStep] = useState(0); const [prog, setProg] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (innerWidth <= 900) return;
    const st = ScrollTrigger.create({ trigger: ref.current, start: "top top", end: "+=200%", pin: ref.current!.querySelector(".how-in"), scrub: true, onUpdate: (s) => { setProg(s.progress); setStep(Math.min(2, Math.floor(s.progress * 3))); } });
    return () => st.kill();
  }, [lang]);
  return (
    <section className="how" id="how" ref={ref}>
      <div className="wrap how-in">
        <div className="how-txt"><span className="kick">HOW IT WORKS</span><h2 className="disp sh" data-split>{x.hh}</h2><p className="ss">{x.hs}</p>
          <ol className="how-steps">{x.steps.map((s, i) => <li key={i} className={i === step ? "on" : ""}><span className="ya">0{i + 1}</span><div><b>{s[0]}</b><p>{s[1]}</p></div><i className="bar"><i style={{ transform: `scaleX(${clamp(prog * 3 - i)})` }} /></i></li>)}</ol></div>
        <div className="how-ph"><div className="hp"><div className="hp-s">
          <div className={`hp-v ${step === 0 ? "on" : ""}`}><div className="hp-t">{lang === "ar" ? "متجر جديد" : "New store"}</div><div className="hp-f"><label>{lang === "ar" ? "اسم المتجر" : "Store name"}</label><div className="hp-in">{CATALOG[5].store[lang]}</div></div><div className="hp-f"><label>{lang === "ar" ? "اللون" : "Color"}</label><div className="hp-cs"><i style={{ background: "#C1272D" }} className="on" /><i style={{ background: "#1F3C88" }} /><i style={{ background: "#2F4A3A" }} /><i style={{ background: "#B08D57" }} /></div></div><div className="hp-f"><label>{lang === "ar" ? "الشعار" : "Logo"}</label><div className="hp-logo">ب</div></div><div className="hp-b">{lang === "ar" ? "إنشاء المتجر" : "Create store"}</div></div>
          <div className={`hp-v ${step === 1 ? "on" : ""}`}><div className="hp-t">{lang === "ar" ? "منتج جديد" : "New product"}</div><div className="hp-up"><Img id="1559056199-641a0ac8b55e" w={500} fb="ب" /></div><div className="hp-f"><div className="hp-in">{lang === "ar" ? "بن حرازي محمّص" : "Roasted Harazi"}</div></div><div className="hp-f"><div className="hp-in ya">9,000</div></div><div className="hp-b">{lang === "ar" ? "حفظ المنتج" : "Save product"}</div></div>
          <div className={`hp-v ${step === 2 ? "on" : ""}`}><div className="hp-t">{lang === "ar" ? "شارك متجرك" : "Share your store"}</div><div className="hp-qr" /><div className="hp-in ltr" style={{ textAlign: "center" }}>haraz.rvios.store</div><div className="hp-share"><i /><i /><i /><i /></div><div className="hp-b">{lang === "ar" ? "نسخ الرابط" : "Copy link"}</div></div>
        </div></div></div>
      </div>
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
      {CATALOG.map((tp) => <Link key={tp.id} className="tsh-c" href={tp.file} data-cursor={x.live}><div className="tsh-art"><Poster tp={tp} lang={lang} /></div><div className="tsh-m"><div><b className="disp">{tp.name[lang]}</b><span>{tp.tag[lang]}</span></div><em className={tp.price ? "ya" : ""}>{tp.price ? "$" + tp.price : x.free}</em></div></Link>)}
    </div></div></section>
  );
}

/* ---------------- order flow demo ---------------- */
export function OrderFlow() {
  const { lang } = useSite(); const x = PX[lang]; const [stg, setStg] = useState(0);
  const yer = lang === "ar" ? "ر.ي" : "YER";
  return (
    <section className="ofl"><div className="wrap"><span className="kick">ORDERS</span><h2 className="disp sh" data-split>{x.oh}</h2><p className="ss">{x.os}</p>
      <div className="of"><ol>{x.stages.map((s, i) => <li key={i} className={`${i <= stg ? "on" : ""} ${i === stg ? "cur" : ""}`}><span className="n ya">0{i + 1}</span><div><b>{s[0]}</b><p>{s[1]}</p></div></li>)}</ol>
        <div className="rc" data-tilt="6">
          <div className="row"><b>{x.receipt} #{num(2048, lang)}</b><span className="mut">{CATALOG[0].store[lang]}</span></div>
          <div className="row"><span>{lang === "ar" ? "دهن عود كمبودي" : "Cambodian Oud Oil"} × {num(1, lang)}</span><span>{num(45000, lang)} {yer}</span></div>
          <div className="row"><span>{lang === "ar" ? "بخور مروكي" : "Maroki Incense"} × {num(2, lang)}</span><span>{num(18000, lang)} {yer}</span></div>
          <div className="row tot"><span>{x.total}</span><span>{num(63000, lang)} {yer}</span></div>
          <div className="rst" aria-live="polite"><i className={stg === 1 ? "pulse" : stg === 2 ? "done" : ""} /><span>{x.ost[stg]}</span></div>
          <button className="bbtn" style={{ width: "100%", justifyContent: "center" }} onClick={() => setStg((s) => (s + 1) % 3)}>{x.oact[stg]}</button>
        </div></div></div></section>
  );
}

/* ---------------- pricing ---------------- */
export function Pricing() {
  const { lang } = useSite(); const x = PX[lang];
  const [bill, setBill] = useState<"m" | "y">("m");
  const refs = useRef<(HTMLElement | null)[]>([]);
  const change = (b: "m" | "y") => {
    setBill(b);
    PLANS.forEach((p, i) => { const el = refs.current[i]; if (!el) return; const o = { v: parseInt(el.textContent!.replace(/\D/g, "")) || 0 }; gsap.to(o, { v: p[b], duration: 0.8, ease: "power3.out", onUpdate: () => { el.textContent = "$" + Math.round(o.v); } }); });
  };
  return (
    <section className="pr wrap" id="pricing"><span className="kick">PRICING</span><h2 className="disp sh" data-split>{x.ph}</h2><p className="ss">{x.ps}</p>
      <div className="bill"><div className="seg"><button className={bill === "m" ? "on" : ""} onClick={() => change("m")}>{x.m}</button><button className={bill === "y" ? "on" : ""} onClick={() => change("y")}>{x.y}</button></div><span>{x.save}</span></div>
      <div className="ytable">{PLANS.filter((p) => p.id !== "free").map((p) => <div key={p.id}><b>{x.plans[p.id as PlanId]}</b><span>{lang === "ar" ? "شهري" : "Monthly"} <em className="ya">${p.m}</em></span><span>{lang === "ar" ? "سنوي" : "Yearly"} <em className="ya">${p.y}</em></span><span className="sv">{lang === "ar" ? "توفير" : "Save"} <em className="ya">${p.m * 12 - p.y}</em></span></div>)}</div>
      <div className="plans">{PLANS.map((p, i) => (
        <article key={p.id} className={`plan ${p.feat ? "feat beam" : ""}`} data-spot>
          <div className="pt"><h3 className="disp">{x.plans[p.id as PlanId]}</h3>{p.feat && <span className="pop">{x.pop}</span>}</div><p className="mut">{p.pitch[lang]}</p>
          <div className="pp"><b className="ya" ref={(el) => { refs.current[i] = el; }}>${p.m}</b><span className="mut">{p.id === "free" ? x.per.f : x.per[bill]}</span></div>
          {p.id !== "free" && (
            <div className="pp-alt">{bill === "m"
              ? (lang === "ar" ? <>أو <b className="ya">${p.y}</b> سنوياً · توفّر <b className="ya">${p.m * 12 - p.y}</b></> : <>or <b className="ya">${p.y}</b> / year · save <b className="ya">${p.m * 12 - p.y}</b></>)
              : (lang === "ar" ? <>يعادل <b className="ya">${(p.y / 12).toFixed(p.y % 12 ? 2 : 0)}</b> شهرياً · شهران مجاناً</> : <>equals <b className="ya">${(p.y / 12).toFixed(p.y % 12 ? 2 : 0)}</b> / month · 2 months free</>)}</div>
          )}
          <ul>{p.b[lang].map((b) => <li key={b}><IconCheck />{b}</li>)}</ul>
          <Link className={p.feat ? "bbtn" : "lbtn"} href={`/create?plan=${p.id}&billing=${bill === "y" ? "year" : "month"}`}>{p.cta[lang]}</Link>
        </article>))}</div>
      <div className="offers">{x.offers.map((o, i) => <div key={i} className={`offer ${i ? "alt" : ""}`} data-reveal><span className="ya">{o[0]}</span><div><b>{o[1]}</b><p>{o[2]}</p></div></div>)}</div>
      <p className="local">{x.local}</p>
      <h3 className="disp sub">{x.addh}</h3>
      <div className="adds">{x.adds.map((a, i) => <div key={i} className="add" data-spot data-reveal style={{ ["--d" as string]: i * 0.06 + "s" }}><b>{a[0]}</b><em>{a[1]}</em><p>{a[2]}</p></div>)}</div>
    </section>
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
      <div className="fg"><div><Brand /><p>{s.by}</p><ContactLinks compact /></div><div><a href="#features">{s.features}</a><Link href="/templates">{s.templates}</Link><a href="#pricing">{s.pricing}</a><a href="#faq">{s.faq}</a></div><div><span className="ltr">rvios.store</span><span>{s.city} {time}</span><span>{s.rights}</span></div></div>
    </div></div></footer>
  );
}
