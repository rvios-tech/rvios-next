"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { useRouter } from "next/navigation";
import { PreviewModal } from "../create/Preview";
import { CATALOG, SECTORS, TIERS, type Sector, type TemplateMeta, type Tier } from "@/lib/catalog";
import { GLSL_NOISE, gsap, marquee, ScrollTrigger, shader, initHoverReveal } from "@/lib/fx";
import { TX } from "@/lib/i18n-market";
import { SITE_STR } from "@/lib/i18n-site";
import { getLenis, scrollToEl } from "@/lib/lenis";
import { useFx } from "@/lib/useFx";
import type { Lang } from "@/lib/u";
import { Brand } from "../site/Logo";
import { IconArrow, IconCheck, IconPlus, IconX } from "../site/Icons";
import { Loader } from "../site/Loader";
import { Nav } from "../site/Nav";
import { Poster, TemplateMark } from "../site/Poster";
import { useSite } from "../site/Providers";
import { ContactLinks } from "../site/Contact";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);
type Plan = "free" | "pro" | "biz";
const perk = (tp: TemplateMeta, lang: Lang) => (tp.tier === "standard" ? TX[lang].inc : tp.tier === "signature" ? TX[lang].off : "");
/** Business plan: standard templates included, signature templates 40% off. */
export const templatePrice = (tp: TemplateMeta, plan: Plan) => (plan === "biz" ? (tp.tier === "standard" ? 0 : Math.round(tp.price * 0.6)) : tp.price);

function TemplateCard({ tp, lang, onPreview }: { tp: TemplateMeta; lang: Lang; onPreview: (t: TemplateMeta) => void }) {
  const x = TX[lang];
  return (
    <article className={`tc tier-${tp.tier}`} data-id={tp.id} id={tp.id}>
      <Link className="tc-view" href={tp.file} data-cursor={x.live} data-spot>
        <div className="tc-bar"><i /><i /><i /><span className="ltr">{tp.file.split("/").pop()}.rvios.store</span></div>
        <div className="tc-art"><Poster tp={tp} lang={lang} /></div>
      </Link>
      <div className="tc-info">
        <div className="tc-top"><div><span className="tc-tier">{TIERS[tp.tier][lang]}</span><h3 className="disp">{tp.name[lang]}</h3><p>{tp.tag[lang]}</p></div>
          <div className="tc-price">{tp.price ? <><b className="ya">${tp.price}</b><small>{x.oneTime}</small></> : <b>{x.free}</b>}</div></div>
        <div className="tc-pal">{tp.pal.map((c) => <i key={c} style={{ background: c }} />)}<span className="tc-st"><TemplateMark tp={tp} className="t-mk" />{tp.store[lang]} · {SECTORS[tp.sector][lang]}</span></div>
        <ul className="tc-feats">{tp.feats[lang].map((f) => <li key={f}>{f}</li>)}</ul>
        {perk(tp, lang) && <div className="tc-perk"><IconCheck /> {perk(tp, lang)}</div>}
        <div className="tc-act"><button className="lbtn" onClick={() => onPreview(tp)}>{lang === "ar" ? "معاينة حية" : "Live preview"} <IconArrow /></button><Link className="nbtn" href={`/create?template=${tp.id}`}>{tp.price > 0 ? x.buy : (lang === "ar" ? "ابدأ بهذا القالب" : "Start with this")}</Link></div>
      </div>
    </article>
  );
}

/** Purchase flow: plan-aware price, Jaib / Al-Kuraimi transfer, receipt upload → manual verification. */
function BuyModal({ tp, lang, onClose }: { tp: TemplateMeta | null; lang: Lang; onClose: () => void }) {
  const { toast } = useSite(); const c = TX[lang].co;
  const [plan, setPlan] = useState<Plan>("pro"); const [m, setM] = useState<"jaib" | "kur">("jaib"); const [file, setFile] = useState("");
  useEffect(() => { const l = getLenis(); if (tp) { l?.stop(); setPlan("pro"); setFile(""); } else l?.start(); }, [tp]);
  if (!tp) return <div className="modal" />;
  return (
    <div className="modal open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mbox co-box" role="dialog" aria-modal="true" data-lenis-prevent>
        <button className="icb mx" onClick={onClose} aria-label="close"><IconX width={18} /></button>
        <div className="co-head"><div className="co-art"><Poster tp={tp} lang={lang} /></div><div><small className="mut">{c.title}</small><h3>{tp.name[lang]}</h3><span className="tc-tier">{TIERS[tp.tier][lang]}</span></div></div>
        <label className="co-l">{c.plan}<select value={plan} onChange={(e) => setPlan(e.target.value as Plan)}><option value="free">{lang === "ar" ? "مجاني" : "Free"}</option><option value="pro">{lang === "ar" ? "احترافي" : "Pro"}</option><option value="biz">{lang === "ar" ? "أعمال" : "Business"}</option></select></label>
        <div className="co-l">{c.method}<div className="co-m"><button className={m === "jaib" ? "on" : ""} onClick={() => setM("jaib")}>{c.jaib}</button><button className={m === "kur" ? "on" : ""} onClick={() => setM("kur")}>{c.kur}</button></div></div>
        <div className="co-acc"><p>{c.acc}</p><div className="co-num ltr">{m === "jaib" ? "Jaib · 7XX XXX XXX" : "Al-Kuraimi · 3XXXXXXXX"}</div></div>
        <label className="co-up"><input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} /><span>{file ? "✓ " + file : <><IconPlus width={18} /> {c.upload}</>}</span></label>
        <div className="co-tot"><span>{c.total}</span><b className="ya">${templatePrice(tp, plan)}</b></div>
        <small className="mut">{plan === "biz" ? `${c.disc}: ${perk(tp, lang)}` : ""}</small>
        <button className="nbtn wide" onClick={() => { onClose(); toast(c.done); }}>{c.confirm}</button>
      </div>
    </div>
  );
}

export function MarketPage() {
  const { lang, theme } = useSite(); const x = TX[lang]; const s = SITE_STR[lang];
  const [tier, setTier] = useState<"all" | Tier>("all");
  const [sector, setSector] = useState<"all" | Sector>("all");
  const [sort, setSort] = useState<"default" | "low" | "high">("default");
  const [buy, setBuy] = useState<TemplateMeta | null>(null);
  const [pv, setPv] = useState<TemplateMeta | null>(null); const router = useRouter();
  const root = useRef<HTMLElement>(null), grid = useRef<HTMLElement>(null), strip = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const shRef = useRef<ReturnType<typeof shader> | null>(null);
  useFx(root, lang);

  const list = useMemo(() => {
    const l = CATALOG.filter((c) => (tier === "all" || c.tier === tier) && (sector === "all" || c.sector === sector));
    if (sort === "low") l.sort((a, b) => a.price - b.price); if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [tier, sector, sort]);
  const setFilter = (fn: () => void) => { if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll(".tc")); fn(); };
  useEffect(() => {
    if (!flipState.current || !grid.current) return;
    Flip.from(flipState.current, { targets: grid.current.querySelectorAll(".tc"), duration: 0.7, ease: "power3.inOut", absolute: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6 }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.4 }), onComplete: () => ScrollTrigger.refresh() });
    flipState.current = null;
  }, [list]);

  const colors = (t: string) => (t === "dark" ? ["#5a1216", "#C1272D", "#0D0707"] : ["#FFC9B0", "#C1272D", "#FFF6EC"]);
  useEffect(() => {
    const sh = shader(root.current!.querySelector<HTMLCanvasElement>("#thgl")!, GLSL_NOISE + `void main(){vec2 uv=gl_FragCoord.xy/r;float n=fbm(uv*1.4+vec2(t*.04,t*.03)+fbm(uv*2.-t*.05));float k=smoothstep(-.3,.8,n+uv.y*.4-(1.-m.y)*.25);vec3 col=mix(c3,c1,k*.55);col=mix(col,c2,smoothstep(.55,1.,k)*.45);gl_FragColor=vec4(col,1.);}`, { colors: colors(theme), scale: 0.45 });
    shRef.current = sh; const mq = marquee(strip.current!, 0.03); const hr = initHoverReveal();
    if (location.hash) setTimeout(() => scrollToEl(document.getElementById(location.hash.slice(1)), -120), 600);
    return () => { sh.destroy(); mq(); hr(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (shRef.current) shRef.current.st.colors = colors(theme); }, [theme]);

  return (
    <div key={lang}>
      <Loader onDone={() => {}} />
      <Nav links={[["features", "/#features"], ["templates", "/templates", true], ["pricing", "/#pricing"], ["faq", "/#faq"]]} />
      <main ref={root}>
        <section className="th"><canvas id="thgl" />
          <div className="th-in wrap"><span className="kick">{x.kick}</span>
            <h1 className="disp"><span data-split>{x.h1a}</span> <em data-split>{x.h1b}</em></h1><p data-reveal>{x.sub}</p>
            <div className="th-st" data-reveal style={{ ["--d" as string]: ".15s" }}>{x.st.map((v) => <div key={v[1]}><b className="disp">{v[0]}</b><span>{v[1]}</span></div>)}</div></div>
          <div className="th-strip" aria-hidden="true"><div ref={strip}>{[...CATALOG, ...CATALOG, ...CATALOG].map((tp, i) => <div key={i} className="th-mini"><Poster tp={tp} lang={lang} /></div>)}</div></div>
        </section>
        <div className="tf-zone">
        <div className="tf"><div className="wrap tf-in">
          <div className="tf-g">{(["all", "free", "standard", "signature"] as const).map((k) => <button key={k} className={tier === k ? "on" : ""} onClick={() => setFilter(() => setTier(k))}>{k === "all" ? x.all : TIERS[k][lang]}</button>)}</div>
          <div className="tf-g">{(["all", ...Object.keys(SECTORS)] as ("all" | Sector)[]).map((k) => <button key={k} className={sector === k ? "on" : ""} onClick={() => setFilter(() => setSector(k))}>{k === "all" ? x.all : SECTORS[k][lang]}</button>)}</div>
          <select id="tsort" value={sort} onChange={(e) => setFilter(() => setSort(e.target.value as typeof sort))} aria-label={x.sort}><option value="default">{x.sort}</option><option value="low">{x.low}</option><option value="high">{x.high}</option></select>
        </div></div>
        <section className="wrap tg" ref={grid}>{list.map((tp) => <TemplateCard key={tp.id} tp={tp} lang={lang} onPreview={setPv} />)}</section>
        </div>
        <section className="wrap tl"><h2 className="disp" data-split>{x.lic}</h2><div className="tl-g">{x.licL.map((l, i) => <div key={i} className="tl-c" data-spot data-reveal style={{ ["--d" as string]: i * 0.08 + "s" }}><span className="ya">0{i + 1}</span><b>{l[0]}</b><p>{l[1]}</p></div>)}</div></section>
        <section className="wrap tcmp"><h2 className="disp" data-split>{x.cmp}</h2><div className="tcmp-t"><table><thead><tr><th>{x.feature}</th>{CATALOG.map((c) => <th key={c.id}><span className="disp">{c.name[lang]}</span><small className="ya">{c.price ? "$" + c.price : "FREE"}</small></th>)}</tr></thead>
          <tbody>{x.rows.map((r) => <tr key={r[0] as string}><th scope="row">{r[0] as string}</th>{CATALOG.map((c) => <td key={c.id}>{(r[1] as string[]).includes(c.id) ? <span className="tcmp-ok"><IconCheck /></span> : <span className="tcmp-no">—</span>}</td>)}</tr>)}</tbody></table></div></section>
        <section className="wrap tq">{x.faq.map((f, i) => <details key={i} open={i === 0}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</section>
        <section className="wrap tcta"><div className="tcta-in beam" data-spot><div><h2 className="disp" data-split>{x.cta}</h2><p>{x.ctaSub}</p></div><Link className="bbtn mag" href="/#pricing">{x.ctaBtn} <IconArrow /></Link></div></section>
      </main>
      <footer className="tfoot wrap"><Link href="/"><Brand /></Link><ContactLinks compact /><span className="mut">{s.by}</span><span className="mut">{s.rights}</span></footer>
      <BuyModal tp={buy} lang={lang} onClose={() => setBuy(null)} />
      <PreviewModal tp={pv} onClose={() => setPv(null)} onPick={(t) => router.push(`/create?template=${t.id}`)} />
    </div>
  );
}
