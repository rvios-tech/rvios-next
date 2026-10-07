"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG, SECTORS, TIERS, type TemplateMeta } from "@/lib/catalog";
import { storeHost } from "@/lib/config";
import { repo } from "@/lib/data";
import type { Billing, PlanId } from "@/lib/data/types";
import { gsap } from "@/lib/fx";
import { PLANS } from "@/lib/i18n-platform";
import { scrollTop } from "@/lib/lenis";
import { Brand } from "../site/Logo";
import { IconArrow, IconCheck, IconPlus } from "../site/Icons";
import { Poster } from "../site/Poster";
import { useSite } from "../site/Providers";
import { ContactLinks } from "../site/Contact";
import { PreviewModal } from "./Preview";

const PLAN_NAME = { free: { ar: "مجاني", en: "Free" }, pro: { ar: "احترافي", en: "Pro" }, biz: { ar: "أعمال", en: "Business" } };
const PERKS: Record<PlanId, { ar: string[]; en: string[] }> = {
  free: { ar: ["القالب الأساسي المجاني", "رابط فرعي name.rvios.store", "١٠ منتجات", "عبارة Powered by RVIOS"], en: ["The free Essential template", "Subdomain name.rvios.store", "10 products", "Powered by RVIOS badge"] },
  pro: { ar: ["كل القوالب (Premium دفعة واحدة)", "ربط دومين خاص", "٥٠٠ منتج وكوبونات", "إزالة عبارة المنصة"], en: ["Every template (Premium one-time)", "Custom domain", "500 products & coupons", "No platform badge"] },
  biz: { ar: ["القوالب القياسية مجاناً، والتوقيع بخصم ٤٠٪", "دومين خاص مجاني أول سنة", "منتجات بلا حد", "فريق ومخزون"], en: ["Standard templates free, Signature 40% off", "Custom domain free first year", "Unlimited products", "Team & inventory"] },
};
const COLORS = ["#C1272D", "#1F3C88", "#2F4A3A", "#B08D57", "#6B2D5C", "#111111", "#E59A12", "#3F6B3A"];
export const tplPrice = (tp: TemplateMeta, plan: PlanId) => (tp.price === 0 ? 0 : plan === "biz" ? (tp.tier === "standard" ? 0 : Math.round(tp.price * 0.6)) : tp.price);

export function CreateFlow() {
  const { lang, toast } = useSite(); const ar = lang === "ar"; const router = useRouter(); const q = useSearchParams();
  const [step, setStep] = useState(q.get("template") ? 1 : 0);
  const [tpl, setTpl] = useState<TemplateMeta>(CATALOG.find((c) => c.id === q.get("template")) ?? CATALOG.find((c) => c.id === "essential")!);
  const [plan, setPlan] = useState<PlanId>((q.get("plan") as PlanId) || (CATALOG.find((c) => c.id === q.get("template"))?.price ? "pro" : "free"));
  const [billing, setBilling] = useState<Billing>((q.get("billing") as Billing) || "year");
  const [tier, setTier] = useState<"all" | "free" | "standard" | "signature">("all");
  const [preview, setPreview] = useState<TemplateMeta | null>(null);
  const [f, setF] = useState({ nameAr: "", nameEn: "", slug: "", color: "#C1272D", whatsapp: "", email: "", domain: "" });
  const [slugState, setSlugState] = useState<"idle" | "checking" | "ok" | "taken" | "bad">("idle");
  const [method, setMethod] = useState<"jaib" | "kuraimi">("jaib"); const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  const premium = tpl.price > 0;
  const paid = plan !== "free";
  const P = PLANS.find((p) => p.id === plan)!;
  const sub = paid ? (billing === "year" ? P.y : P.m) : 0;
  const tplCost = paid ? tplPrice(tpl, plan) : 0;
  const total = sub + tplCost;
  const steps = paid ? [ar ? "القالب" : "Template", ar ? "الباقة" : "Plan", ar ? "بيانات المتجر" : "Store details", ar ? "الدفع" : "Payment"] : [ar ? "القالب" : "Template", ar ? "الباقة" : "Plan", ar ? "بيانات المتجر" : "Store details"];

  // a premium template needs a paid plan
  useEffect(() => { if (premium && plan === "free") setPlan("pro"); }, [premium, plan]);
  // animate panel on step change
  useEffect(() => { scrollTop(); if (panel.current) gsap.fromTo(panel.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }); }, [step]);
  // live sub-domain availability
  useEffect(() => {
    const s = f.slug; if (!s) { setSlugState("idle"); return; }
    if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(s)) { setSlugState("bad"); return; }
    setSlugState("checking"); let live = true;
    const t = setTimeout(() => repo.slugTaken(s).then((x) => live && setSlugState(x ? "taken" : "ok")), 350);
    return () => { live = false; clearTimeout(t); };
  }, [f.slug]);
  const autoSlug = (name: string) => name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);

  const list = useMemo(() => CATALOG.filter((c) => tier === "all" || c.tier === tier), [tier]);
  const detailsOk = f.nameAr.trim().length >= 2 && slugState === "ok" && /\S+@\S+\.\S+/.test(f.email) && f.whatsapp.replace(/\D/g, "").length >= 9;
  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));

  const create = async () => {
    if (!detailsOk) { setErr(ar ? "أكمل بيانات المتجر" : "Complete the store details"); return; }
    if (paid && !file) { setErr(ar ? "ارفع صورة إيصال التحويل" : "Upload the transfer receipt"); return; }
    setBusy(true); setErr("");
    try {
      await repo.createStore({ slug: f.slug, nameAr: f.nameAr.trim(), nameEn: f.nameEn.trim(), color: f.color, whatsapp: f.whatsapp.replace(/\D/g, ""), email: f.email.trim(), templateId: tpl.id, planId: plan, billing, customDomain: paid ? f.domain.trim() : undefined, payment: paid ? { method, amount: total, file: file ?? undefined } : undefined });
      router.push(`/create/success?slug=${f.slug}`);
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  };

  return (
    <div className="cf" key={lang}>
      <header className="cf-top"><Link href="/"><Brand /></Link>
        <ol className="cf-steps">{steps.map((s, i) => <li key={s} className={i === step ? "on" : i < step ? "done" : ""}><button disabled={i > step} onClick={() => setStep(i)}><span>{i < step ? <IconCheck width={14} /> : i + 1}</span>{s}</button></li>)}</ol>
        <Link href="/templates" className="cf-x">{ar ? "خروج" : "Exit"}</Link>
        <i className="cf-prog" style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
      </header>

      <div className="cf-body">
        <main className="cf-main" ref={panel}>
          {step === 0 && (<>
            <h1 className="disp">{ar ? "اختر قالب متجرك" : "Choose your store template"}</h1>
            <p className="mut">{ar ? "القالب الأساسي مجاني مع كل الباقات. قوالب Premium تُدفع مرة واحدة وتحتاج باقة مدفوعة." : "Essential is free on every plan. Premium templates are a one-time payment and need a paid plan."}</p>
            <div className="cf-filter">{(["all", "free", "standard", "signature"] as const).map((k) => <button key={k} className={tier === k ? "on" : ""} onClick={() => setTier(k)}>{k === "all" ? (ar ? "الكل" : "All") : TIERS[k][lang]}</button>)}</div>
            <div className="cf-grid">{list.map((tp) => (
              <article key={tp.id} className={`cf-tpl ${tpl.id === tp.id ? "on" : ""}`} onClick={() => setTpl(tp)} data-spot>
                <div className="art"><Poster tp={tp} lang={lang} /><button className="cf-prev" onClick={(e) => { e.stopPropagation(); setPreview(tp); }}>{ar ? "معاينة حية" : "Live preview"}</button><span className="cf-check"><IconCheck width={18} /></span></div>
                <div className="m"><div><b>{tp.name[lang]}</b><small className="mut">{SECTORS[tp.sector][lang]}</small></div><em className={tp.price ? "ya" : "free"}>{tp.price ? `$${tp.price}` : ar ? "مجاني" : "Free"}</em></div>
              </article>))}</div>
          </>)}

          {step === 1 && (<>
            <h1 className="disp">{ar ? "اختر الباقة" : "Choose your plan"}</h1>
            <div className="cf-bill"><button className={billing === "month" ? "on" : ""} onClick={() => setBilling("month")}>{ar ? "شهري" : "Monthly"}</button><button className={billing === "year" ? "on" : ""} onClick={() => setBilling("year")}>{ar ? "سنوي · شهران مجاناً" : "Yearly · 2 months free"}</button></div>
            <div className="cf-plans">{(["free", "pro", "biz"] as PlanId[]).map((id) => { const p = PLANS.find((x) => x.id === id)!; const locked = id === "free" && premium; return (
              <button key={id} className={`cf-plan ${plan === id ? "on" : ""} ${locked ? "locked" : ""}`} onClick={() => !locked && setPlan(id)} data-spot>
                <div className="t"><b className="disp">{PLAN_NAME[id][lang]}</b>{id === "pro" && <span className="pop">{ar ? "الأكثر اختياراً" : "Popular"}</span>}</div>
                <div className="pr"><span className="ya">${billing === "year" ? p.y : p.m}</span><small>{id === "free" ? (ar ? "للأبد" : "forever") : billing === "year" ? (ar ? "/ سنوياً" : "/ year") : (ar ? "/ شهرياً" : "/ month")}</small></div>
                {id !== "free" && <small className="alt">{billing === "year" ? (ar ? `يعادل $${(p.y / 12).toFixed(2)} شهرياً` : `= $${(p.y / 12).toFixed(2)} / month`) : (ar ? `أو $${p.y} سنوياً` : `or $${p.y} / year`)}</small>}
                <ul>{PERKS[id][lang].map((x) => <li key={x}><IconCheck width={15} />{x}</li>)}</ul>
                {locked && <div className="lk">{ar ? "الباقة المجانية تشمل القالب الأساسي فقط" : "Free includes the Essential template only"}<span onClick={(e) => { e.stopPropagation(); setTpl(CATALOG.find((c) => c.id === "essential")!); setPlan("free"); }}>{ar ? "استخدم الأساسي" : "Use Essential"}</span></div>}
              </button>); })}</div>
          </>)}

          {step === 2 && (<>
            <h1 className="disp">{ar ? "بيانات متجرك" : "Your store details"}</h1>
            <div className="cf-form">
              <label>{ar ? "اسم المتجر" : "Store name"} *<input value={f.nameAr} onChange={(e) => setF((o) => ({ ...o, nameAr: e.target.value }))} placeholder={ar ? "مثال: عطور السبعة" : "e.g. Al-Sabaa Oud"} /></label>
              <label>{ar ? "الاسم بالإنجليزية" : "English name"}<input dir="ltr" value={f.nameEn} onChange={(e) => setF((o) => ({ ...o, nameEn: e.target.value, slug: o.slug || autoSlug(e.target.value) }))} placeholder="Al-Sabaa Oud" /></label>
              <label className="full">{ar ? "رابط متجرك" : "Your store link"} *
                <div className={`cf-slug s-${slugState}`}><input dir="ltr" value={f.slug} onChange={(e) => setF((o) => ({ ...o, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} placeholder="mystore" /><span className="ltr">.rvios.store</span><i>{slugState === "ok" ? "✓" : slugState === "checking" ? "…" : slugState === "taken" ? "✕" : ""}</i></div>
                <small className={`cf-hint s-${slugState}`}>{({ idle: ar ? "أحرف إنجليزية صغيرة وأرقام وشرطة" : "Lowercase letters, numbers and dashes", checking: ar ? "جارِ التحقق…" : "Checking…", ok: ar ? "متاح!" : "Available!", taken: ar ? "هذا الرابط مستخدم، جرّب غيره" : "Taken, try another", bad: ar ? "من ٣ إلى ٤٠ حرفاً، بدون شرطة في البداية أو النهاية" : "3–40 chars, no leading/trailing dash" })[slugState]}</small></label>
              <label>{ar ? "رقم واتساب لاستقبال الطلبات" : "WhatsApp for orders"} *<input dir="ltr" inputMode="tel" value={f.whatsapp} onChange={(e) => setF((o) => ({ ...o, whatsapp: e.target.value }))} placeholder="+967 7XX XXX XXX" /></label>
              <label>{ar ? "البريد الإلكتروني" : "Email"} *<input dir="ltr" type="email" value={f.email} onChange={(e) => setF((o) => ({ ...o, email: e.target.value }))} placeholder="you@email.com" /><small className="mut">{ar ? "سيُستخدم لربط متجرك بحسابك في AzmSmart" : "Used to link your store to your AzmSmart account"}</small></label>
              <label className="full">{ar ? "لون المتجر" : "Store color"}<div className="cf-sw">{COLORS.map((c) => <button key={c} style={{ background: c }} className={f.color === c ? "on" : ""} onClick={() => setF((o) => ({ ...o, color: c }))} aria-label={c} />)}<input type="color" value={f.color} onChange={(e) => setF((o) => ({ ...o, color: e.target.value }))} /></div></label>
              {paid && <label className="full">{ar ? "دومين خاص (اختياري)" : "Custom domain (optional)"}<input dir="ltr" value={f.domain} onChange={(e) => setF((o) => ({ ...o, domain: e.target.value.toLowerCase().trim() }))} placeholder="mystore.com" /><small className="mut">{ar ? "نرسل لك إعدادات DNS بعد التفعيل" : "We'll send DNS settings after activation"}</small></label>}
            </div>
          </>)}

          {step === 3 && paid && (<>
            <h1 className="disp">{ar ? "الدفع والتفعيل" : "Payment & activation"}</h1>
            <p className="mut">{ar ? "يُنشأ متجرك فوراً، ويتفعّل القالب والباقة بعد التحقق من التحويل (عادة خلال ساعات)." : "Your store is created now; the template and plan activate once the transfer is verified (usually within hours)."}</p>
            <div className="cf-pay">
              <div className="cf-tabs"><button className={method === "jaib" ? "on" : ""} onClick={() => setMethod("jaib")}>{ar ? "محفظة جيب" : "Jaib wallet"}</button><button className={method === "kuraimi" ? "on" : ""} onClick={() => setMethod("kuraimi")}>{ar ? "بنك الكريمي" : "Al-Kuraimi Bank"}</button></div>
              <div className="cf-acc"><small className="mut">{ar ? "حوّل المبلغ إلى:" : "Transfer to:"}</small><b className="ya ltr">{method === "jaib" ? "Jaib · 7XX XXX XXX" : "Al-Kuraimi · 3XXXXXXXX"}</b><small className="mut">{ar ? "باسم: RVIOS Technologies" : "Name: RVIOS Technologies"}</small></div>
              <label className={`cf-up ${file ? "has" : ""}`}><input type="file" accept="image/*,.pdf" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />{file ? <><IconCheck width={18} /> {file.name}</> : <><IconPlus width={18} /> {ar ? "ارفع صورة الإيصال" : "Upload the receipt"}</>}</label>
            </div>
          </>)}

          {err && <p className="cf-err">{err}</p>}
          <div className="cf-nav">
            {step > 0 && <button className="lbtn" onClick={() => setStep((s) => s - 1)}>{ar ? "رجوع" : "Back"}</button>}
            {step < steps.length - 1
              ? <button className="bbtn mag" disabled={step === 2 && !detailsOk} onClick={() => (step === 2 && !detailsOk ? toast(ar ? "أكمل البيانات" : "Complete the details") : next())}>{ar ? "متابعة" : "Continue"} <IconArrow /></button>
              : <button className="bbtn mag" disabled={busy || (step === 2 && !detailsOk)} onClick={create}>{busy ? (ar ? "جارِ إنشاء متجرك…" : "Creating your store…") : paid ? (ar ? "أرسل الدفع وأنشئ المتجر" : "Submit payment & create") : (ar ? "أنشئ متجري مجاناً" : "Create my free store")}</button>}
          </div>
        </main>

        <aside className="cf-sum">
          <div className="cf-sum-art"><Poster tp={tpl} lang={lang} /><button onClick={() => setPreview(tpl)}>{ar ? "معاينة" : "Preview"}</button></div>
          <div className="cf-url"><span className="dot" style={{ background: f.color }} /><span className="ltr">{storeHost(f.slug || "yourstore", paid && f.domain ? f.domain : null)}</span></div>
          <dl>
            <dt>{ar ? "القالب" : "Template"}</dt><dd>{tpl.name[lang]} {tpl.price ? <em className="ya">{tplCost === 0 && paid ? (ar ? "مشمول" : "included") : `$${tplCost || tpl.price}`}</em> : <em>{ar ? "مجاني" : "Free"}</em>}{premium && <small>{ar ? "دفعة واحدة" : "one-time"}</small>}</dd>
            <dt>{ar ? "الباقة" : "Plan"}</dt><dd>{PLAN_NAME[plan][lang]} {paid && <em className="ya">${sub}</em>}{paid && <small>{billing === "year" ? (ar ? "سنوياً" : "yearly") : (ar ? "شهرياً" : "monthly")}</small>}</dd>
          </dl>
          <div className="cf-total"><span>{ar ? "الإجمالي اليوم" : "Due today"}</span><b className="ya">${total}</b></div>
          {!paid && <p className="cf-free">{ar ? "متجر مجاني للأبد، يُنشأ فوراً مع عبارة Powered by RVIOS." : "Free forever, created instantly with a Powered by RVIOS badge."}</p>}
          <div className="cf-help"><small className="mut">{ar ? "تحتاج مساعدة؟" : "Need help?"}</small><ContactLinks compact /></div>
        </aside>
      </div>
      <PreviewModal tp={preview} onClose={() => setPreview(null)} onPick={(t) => setTpl(t)} />
    </div>
  );
}
