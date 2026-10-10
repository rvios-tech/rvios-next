"use client";
import Link from "next/link";
import { memo, useEffect, useRef } from "react";
import { FEATURED as CATALOG, type TemplateMeta } from "@/lib/catalog";
import { GLSL_NOISE, gsap, ScrollTrigger, shader } from "@/lib/fx";
import { PX } from "@/lib/i18n-platform";
import { clamp, lerp, reduceMotion, type Lang } from "@/lib/u";
import { LogoMark } from "../site/Logo";
import { IconArrow } from "../site/Icons";
import { Poster } from "../site/Poster";
import { useSite } from "../site/Providers";

const KEYS = (() => {
  const rows: number[][] = [[], [13], [0], [0, 12], [0, 11], [4]];
  const out: string[] = [];
  rows.forEach((wide, r) => { let cols = 0, k = 0; while (cols < 14) { const w6 = r === 5 && k === 4, w2 = !w6 && wide.includes(k); const span = w6 ? 6 : w2 ? 2 : 1; if (cols + span > 14) break; out.push(w6 ? "w6" : w2 ? "w2" : ""); cols += span; k++; } });
  return out;
})();

/** The phone screen shows the template's real phone capture. */
function PhoneMock({ tp, lang }: { tp: TemplateMeta; lang: Lang }) {
  return <Poster tp={tp} lang={lang} device="mob" />;
}

/** Pure-CSS 3D laptop, phone and shopping bag. Screens show the real templates. */
const Scene = memo(function Scene({ lang }: { lang: Lang }) {
  const phones = [...CATALOG].reverse();
  return (
    <div className="scene" aria-hidden="true">
      <div className="stage" id="stage"><div className="float">
        <div className="laptop" id="laptop"><div className="floor" />
          <div className="base" id="lbase"><div className="grill l" /><div className="kwell" id="kwell">{KEYS.map((c, i) => <i key={i} className={c} />)}</div><div className="grill r" /><div className="pad" /><div className="lip" /><div className="base-front" /></div>
          <div className="lid" id="lid"><div className="lid-back"><LogoMark /></div><div className="lid-top" />
            <div className="lid-front"><div className="bezel"><span className="notch" />
              <div className="screen" id="lscreen"><div className="slides" id="lslides">{CATALOG.map((tp, i) => <div key={tp.id} className={`slide ${i ? "" : "on"}`}><Poster tp={tp} lang={lang} /></div>)}</div><div className="boot"><LogoMark /></div><div className="glare" /><div className="sweep" id="lsweep" /></div>
              <span className="brandline">RVIOS</span></div></div><div className="hinge" /></div>
        </div>
        <div className="phone"><div className="phone-wrap" style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}><div className="phone-edge" />
          <div className="phone-body"><span className="pbtn-s a" /><span className="pbtn-s b" /><span className="pbtn-s c" /><div className="phone-in"><div className="phone-screen"><span className="island" />
            <div className="slides" data-sl>{phones.map((tp, i) => <div key={tp.id} className={`slide ${i ? "" : "on"}`}><PhoneMock tp={tp} lang={lang} /></div>)}</div><div className="glare" /></div></div></div></div></div>
        <div className="bag3d"><div className="bag-in" style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}><div className="hd b" /><div className="side" /><div className="front"><LogoMark /></div><div className="hd a" /></div></div>
      </div></div>
    </div>
  );
});

export function Hero({ ready }: { ready: boolean }) {
  const { lang, theme } = useSite();
  const x = PX[lang];
  const root = useRef<HTMLElement>(null);
  const shaderRef = useRef<ReturnType<typeof shader> | null>(null);
  const P = useRef(0);
  const booted = useRef(false);
  const swashDone = useRef(false);
  const colors = (t: string) => (t === "dark" ? ["#C1272D", "#4a1012", "#0D0707"] : ["#C1272D", "#FFC8A8", "#FFF6EC"]);

  // background shader
  useEffect(() => {
    const c = root.current?.querySelector<HTMLCanvasElement>("#hgl"); if (!c) return;
    const s = shader(c, GLSL_NOISE + `void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.);float n=fbm(p*1.1+vec2(t*.035,-t*.025)+fbm(p*1.8+t*.03)*.9);float d=distance(uv,vec2(m.x,m.y));float k=smoothstep(-.35,.9,n)+smoothstep(.6,0.,d)*.25;vec3 col=mix(c3,c2,smoothstep(.2,.9,k)*.55);col=mix(col,c1,smoothstep(.6,1.2,k)*.55);col=mix(col,c3,smoothstep(.25,.75,uv.y)*.35);gl_FragColor=vec4(col,1.);}`, { colors: colors(theme), scale: 0.45 });
    shaderRef.current = s; return () => s.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (shaderRef.current) shaderRef.current.st.colors = colors(theme); }, [theme]);

  // scroll choreography + idle life
  useEffect(() => {
    const el = root.current!; const $ = (s: string) => el.querySelector<HTMLElement>(s)!;
    const stage = $("#stage"), copy = $("#hcopy"), title = $("#htitle"), hend = $("#hend"), hsc = $("#hscroll");
    const cos = Array.from(el.querySelectorAll<HTMLElement>(".callout"));
    const rtl = lang === "ar"; const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const mm = (e: PointerEvent) => { mouse.x = (e.clientX / innerWidth - 0.5) * 2; mouse.y = (e.clientY / innerHeight - 0.5) * 2; const sc = $("#lscreen"); sc.style.setProperty("--gx", (e.clientX / innerWidth) * 100 + "%"); sc.style.setProperty("--gy", (e.clientY / innerHeight) * 100 + "%"); };
    window.addEventListener("pointermove", mm);
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (s) => { P.current = s.progress; } });
    const lsl = Array.from($("#lslides").children); let cur = 0, tIdx = 0;
    const show = (i: number) => { if (i === cur) return; lsl[cur].classList.remove("on"); lsl[i].classList.add("on"); cur = i; const sw = $("#lsweep"); sw.classList.remove("go"); void sw.offsetWidth; sw.classList.add("go"); $("#lbase").style.setProperty("--spill", CATALOG[i].pal[1] + "33"); };
    // sizes are measured on resize only (reading them every frame forces a layout), and the
    // per-frame work stops while the hero is off screen
    let W = 0, copyH = 0, inView = true; const ease = gsap.parseEase("power3.out");
    const measure = () => { W = stage.parentElement!.offsetWidth; copyH = copy.offsetHeight; };
    measure(); window.addEventListener("resize", measure); document.fonts?.ready.then(measure);
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting)); io.observe(el);
    const apply = () => {
      if (!inView) return;
      const p = P.current, vh = innerHeight, e1 = ease(clamp(p / 0.55));
      const endSc = clamp((vh - 200) / (0.98 * W), 0.6, 0.92), startY = Math.max(vh * 0.6, copyH + 24), endY = Math.max(84, (vh - 110 - 0.98 * W * endSc) / 2 + 40);
      mouse.sx = lerp(mouse.sx, mouse.x, 0.06); mouse.sy = lerp(mouse.sy, mouse.y, 0.06);
      stage.style.setProperty("--ty", lerp(startY, endY, e1) + "px"); stage.style.setProperty("--sc", String(lerp(Math.min(0.92, endSc + 0.04), endSc, e1)));
      stage.style.setProperty("--rx", lerp(-16, -8, e1) + mouse.sy * 4 + "deg"); stage.style.setProperty("--ry", lerp(rtl ? 16 : -16, 0, e1) + mouse.sx * 6 + "deg");
      const co = clamp(1 - p * 3.2); copy.style.opacity = String(co); copy.style.transform = `translateY(${-p * 160}px)`; copy.style.visibility = co <= 0 ? "hidden" : "";
      if (rtl && swashDone.current && p > 0.001) title.style.setProperty("--long", String(p * 900));
      cos.forEach((c, i) => { const s = 0.4 + i * 0.08; const o = clamp((p - s) / 0.08) * clamp((0.97 - p) / 0.06); c.style.opacity = String(o); c.style.transform = `translateY(${(1 - o) * 20}px) scale(${0.92 + o * 0.08})`; });
      const eo = clamp((p - 0.78) / 0.12); hend.style.opacity = String(eo); hend.style.transform = `translateY(${(1 - eo) * 30}px)`; hsc.style.opacity = String(clamp(1 - p * 8));
      if (p >= 0.04 && booted.current) show(Math.min(lsl.length - 1, Math.floor(((p - 0.04) / 0.8) * lsl.length)));
    };
    gsap.ticker.add(apply);
    const lt = setInterval(() => { if (P.current < 0.04 && booted.current) { tIdx = (tIdx + 1) % lsl.length; show(tIdx); } }, 3400);
    const sl = setInterval(() => el.querySelectorAll("[data-sl]").forEach((g) => { const ch = Array.from(g.children); const i = ch.findIndex((c) => c.classList.contains("on")); ch[i].classList.remove("on"); ch[(i + 1) % ch.length].classList.add("on"); }), 3200);
    const keys = Array.from(el.querySelectorAll("#kwell i"));
    const ty = setInterval(() => { if (!inView) return; const k = keys[(Math.random() * keys.length) | 0]; k.classList.add("lit"); setTimeout(() => k.classList.remove("lit"), 260); }, 180);
    return () => { st.kill(); io.disconnect(); window.removeEventListener("resize", measure); gsap.ticker.remove(apply); clearInterval(lt); clearInterval(sl); clearInterval(ty); window.removeEventListener("pointermove", mm); };
  }, [lang]);

  // intro timeline (runs once the loader has finished)
  useEffect(() => {
    if (!ready) return;
    const el = root.current!; el.classList.add("in");
    const lid = el.querySelector<HTMLElement>("#lid")!, lap = el.querySelector<HTMLElement>("#laptop")!, title = el.querySelector<HTMLElement>("#htitle")!;
    const rtl = lang === "ar";
    if (reduceMotion()) { lid.style.setProperty("--lid", "4deg"); lap.classList.add("boot", "on"); booted.current = true; swashDone.current = true; return; }
    const tl = gsap.timeline();
    tl.fromTo(el.querySelector(".scene"), { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, 0.1)
      .fromTo(lid, { "--lid": "-90deg" }, { "--lid": "4deg", duration: 1.7, ease: "power3.inOut" }, 0.45)
      .add(() => lap.classList.add("boot"), 1.6).add(() => { lap.classList.add("on"); booted.current = true; }, 2.5)
      .fromTo(el.querySelector(".phone-wrap"), { y: 90, opacity: 0, rotate: rtl ? -12 : 12 }, { y: 0, opacity: 1, rotate: 0, duration: 1.3, ease: "back.out(1.4)" }, 1.1)
      .fromTo(el.querySelector(".bag-in"), { y: -140, opacity: 0, rotate: rtl ? 14 : -14 }, { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "bounce.out" }, 1.3);
    let sw: gsap.core.Tween | undefined;
    if (rtl) { const o = { v: 700 }; sw = gsap.to(o, { v: 0, duration: 1.8, ease: "power3.out", onUpdate: () => title.style.setProperty("--long", String(o.v)), onComplete: () => { swashDone.current = true; } }); }
    else swashDone.current = true;
    return () => { tl.kill(); sw?.kill(); };
  }, [ready, lang]);

  const callPos = ["right:4%;top:15%", "left:4%;top:15%", "right:4%;top:31%"];
  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-pin">
        <canvas id="hgl" className="hero-gl" /><div className="hero-dots" /><div className="hero-glow" />
        <div className="hero-copy wrap" id="hcopy">
          <div className="eyebrow fade"><span>{x.new}</span>{x.eyebrow}</div>
          <h1 className="disp" id="htitle"><span className="ln"><span>{x.l1}</span></span><span className="ln"><span>{x.l2}</span></span></h1>
          <p className="hsub fade">{x.sub}</p>
          <div className="hcta fade"><Link className="bbtn mag" href="/create">{x.cta} <IconArrow /></Link><Link className="lbtn mag" href="/templates">{x.cta2}</Link></div>
          <div className="hnote fade">{x.note}</div>
        </div>
        <Scene lang={lang} />
        {x.chips.map((c, i) => {
          const [side, top] = callPos[i].split(";");
          const [sk, sv] = side.split(":"); const [, tv] = top.split(":");
          return <div key={i} className="callout" style={{ [sk]: sv, top: tv }}><b><i />{c[0]}</b><span>{c[1]}</span></div>;
        })}
        <div className="hend disp" id="hend">{x.end}</div>
        <div className="hero-scroll" id="hscroll"><i />{lang === "ar" ? "مرّر" : "SCROLL"}</div>
      </div>
    </section>
  );
}
