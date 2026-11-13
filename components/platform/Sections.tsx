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
      <div className="pr-more" data-reveal>
        <Link href="/custom" className="pr-custom" data-spot><span className="kick">{lang === "ar" ? "تصميم خاص" : "CUSTOM"}</span><b>{lang === "ar" ? "تريد متجرًا لا يشبه غيره؟" : "Want a store like no other?"}</b><p>{lang === "ar" ? "يصمم فريق RVIOS متجرك من الصفر بهويتك ومزاياك — أرسل فكرتك ونرد بعرض مفصّل." : "The RVIOS team designs your store from scratch — send your idea and get a detailed quote."}</p><span className="lbtn">{lang === "ar" ? "اطلب تصميمًا خاصًا" : "Request a custom design"} <IconArrow /></span></Link>
        <Link href="/pay" className="pr-pay"><b>{lang === "ar" ? "طرق الدفع" : "Payment methods"}</b><p>{lang === "ar" ? "بنك الكريمي بالريال والدولار، ومحفظتا جيب وجوالي." : "Al-Kuraimi Bank (YER/USD), Jaib and Jawali wallets."}</p></Link>
      </div>
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
      <div className="fg"><div><Brand /><p>{s.by}</p><ContactLinks compact /></div><div><Link href="/app">{s.app}</Link><Link href="/templates">{s.templates}</Link><Link href="/guide">{s.guides}</Link><Link href="/custom">{lang === "ar" ? "متجر بتصميم خاص" : "Custom store"}</Link><Link href="/pay">{lang === "ar" ? "طرق الدفع" : "Payments"}</Link><a href="#pricing">{s.pricing}</a><a href="#faq">{s.faq}</a></div><div><span className="ltr">rvios.store</span><span><ByRegion>{(c) => c.location[lang]}</ByRegion> {time}</span><span>{s.rights}</span></div></div>
    </div></div></footer>
  );
}
