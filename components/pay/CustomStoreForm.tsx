"use client";
/* "A store designed only for you" — the brief a visitor sends the RVIOS team. Chips instead of long
   questions: what to sell, which pages and features, the look, budget and timing, examples they like. */
import { useState } from "react";
import { SOCIAL_ICONS } from "../site/SocialIcons";
import { CONTACTS, waHref } from "@/lib/contact";
import { useRegion } from "../region/useRegion";

const FEATURES = [
  "هوية وشعار جديدان", "صفحة رئيسية بتصميم خاص", "صفحات منتجات مخصّصة", "متجر بلغتين (عربي/إنجليزي)",
  "حجز مواعيد أو خدمات", "طلبات مسبقة ومقاسات خاصة", "برنامج ولاء ونقاط", "كوبونات وعروض موسمية",
  "مدونة ومحتوى", "ربط نطاق خاص", "تصوير وتجهيز المنتجات", "إدخال المنتجات عنّا",
  "تطبيق جوال للمتجر", "ربط مع نظام محاسبة أو مخزون", "تعدّد الفروع والمدن",
];
const STYLES: [string, string][] = [["minimal", "بسيط وهادئ"], ["luxury", "فخم وراقٍ"], ["bold", "جريء وملوّن"], ["playful", "مرح وحيوي"], ["classic", "تراثي وعريق"], ["tech", "تقني وعصري"]];
const BUDGETS: [string, string, string][] = [["starter", "أساسي", "تصميم خاص لقالب جاهز"], ["growth", "متوسط", "تصميم كامل وصفحات مخصّصة"], ["premium", "متكامل", "هوية ومتجر ومزايا خاصة"], ["unsure", "لست متأكدًا", "اقترحوا عليّ"]];
const TIMELINES: [string, string][] = [["asap", "بأسرع وقت"], ["month", "خلال شهر"], ["quarter", "خلال ٣ أشهر"], ["unsure", "لم أحدد"]];
const EXISTING = ["لا شيء بعد", "حساب إنستغرام أو فيسبوك", "واتساب فقط", "متجر على منصة أخرى", "محل فعلي"];

const API = (process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "").replace(/\/+$/, "");

export function CustomStoreForm() {
  const region = useRegion();
  const [f, setF] = useState({ name: "", phone: "", email: "", country: region === "sa" ? "السعودية" : "اليمن", business: "", storeName: "", budget: "", timeline: "", existing: "", message: "", ref: "", website: "" });
  const [features, setFeatures] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const phoneOk = f.phone.replace(/\D/g, "").length >= 9;
  const ok = f.name.trim().length >= 2 && phoneOk;

  function brief() {
    return [
      "مرحبًا فريق RVIOS، أريد متجرًا بتصميم خاص.",
      f.storeName && `اسم المتجر: ${f.storeName}`,
      f.business && `النشاط: ${f.business}`,
      features.length ? `المزايا: ${features.join("، ")}` : "",
      f.message,
    ].filter(Boolean).join("\n");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!ok || busy) return;
    setBusy(true);
    setErr("");
    try {
      if (!API) throw new Error("offline");
      const res = await fetch(`${API}/shop/public/custom-store`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(), phone: f.phone, email: f.email.trim(), country: f.country, business: f.business.trim(), storeName: f.storeName.trim(),
          budget: f.budget || undefined, timeline: f.timeline || undefined, existing: f.existing, message: f.message.trim(),
          features, styles: styles.map((s) => STYLES.find(([k]) => k === s)?.[1] ?? s), references: f.ref.split(/\s+/).filter(Boolean).slice(0, 5), website: f.website,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
        throw new Error(Array.isArray(j?.message) ? j!.message[0] : j?.message || "تعذّر الإرسال");
      }
      setDone(true);
    } catch (e2) {
      // الخادم غير متاح: لا يضيع الطلب — يفتح واتساب بالموجز نفسه
      if ((e2 as Error).message === "offline") window.open(waHref(CONTACTS[region], brief()), "_blank");
      else setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="cs-done">
        <span className="cs-ok">✓</span>
        <h2 className="disp">وصل طلبك لفريق التصميم</h2>
        <p className="mut">نراجع ما كتبته ونتواصل معك على واتساب خلال يوم عمل بعرض مفصّل: التصميم المقترح، والمدة، والتكلفة. لا التزام قبل موافقتك.</p>
        <a className="bbtn mag" href={waHref(CONTACTS[region], brief())} target="_blank" rel="noopener">{SOCIAL_ICONS.whatsapp} أكمل الحديث على واتساب الآن</a>
      </div>
    );
  }

  return (
    <form className="cs-form" onSubmit={(e) => void send(e)}>
      <fieldset>
        <legend>عنك وعن متجرك</legend>
        <div className="cs-grid">
          <label>اسمك *<input required value={f.name} maxLength={80} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></label>
          <label>رقم واتساب *<input required dir="ltr" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+967 7xx xxx xxx" autoComplete="tel" /></label>
          <label>البريد (اختياري)<input dir="ltr" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label>
          <label>الدولة<input value={f.country} maxLength={40} onChange={(e) => setF({ ...f, country: e.target.value })} /></label>
          <label>اسم المتجر<input value={f.storeName} maxLength={80} onChange={(e) => setF({ ...f, storeName: e.target.value })} placeholder="مثل: عطر الصباح" /></label>
          <label>ماذا تبيع؟<input value={f.business} maxLength={80} onChange={(e) => setF({ ...f, business: e.target.value })} placeholder="عطور، أزياء، حلويات…" /></label>
        </div>
        <div className="cs-chips" role="group" aria-label="أين تبيع الآن">
          <small>أين تبيع الآن؟</small>
          {EXISTING.map((x) => <button type="button" key={x} className={f.existing === x ? "on" : ""} onClick={() => setF({ ...f, existing: f.existing === x ? "" : x })}>{x}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend>الصفحات والمزايا التي تريدها</legend>
        <div className="cs-chips">{FEATURES.map((x) => <button type="button" key={x} className={features.includes(x) ? "on" : ""} aria-pressed={features.includes(x)} onClick={() => toggle(features, setFeatures, x)}>{x}</button>)}</div>
      </fieldset>

      <fieldset>
        <legend>الأسلوب الذي يشبهك</legend>
        <div className="cs-chips">{STYLES.map(([k, l]) => <button type="button" key={k} className={styles.includes(k) ? "on" : ""} aria-pressed={styles.includes(k)} onClick={() => toggle(styles, setStyles, k)}>{l}</button>)}</div>
        <label className="cs-full">متاجر أو حسابات أعجبك تصميمها (روابط)<input dir="ltr" value={f.ref} onChange={(e) => setF({ ...f, ref: e.target.value })} placeholder="https://… https://…" /></label>
      </fieldset>

      <fieldset>
        <legend>الميزانية والموعد</legend>
        <div className="cs-cards">{BUDGETS.map(([k, l, d]) => <button type="button" key={k} className={f.budget === k ? "on" : ""} onClick={() => setF({ ...f, budget: k })}><b>{l}</b><small>{d}</small></button>)}</div>
        <div className="cs-chips"><small>متى تريد الإطلاق؟</small>{TIMELINES.map(([k, l]) => <button type="button" key={k} className={f.timeline === k ? "on" : ""} onClick={() => setF({ ...f, timeline: k })}>{l}</button>)}</div>
      </fieldset>

      <fieldset>
        <legend>فكرتك بكلماتك</legend>
        <label className="cs-full"><textarea rows={4} maxLength={3000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="الألوان التي تحبها، جمهورك، ما يميّز منتجاتك، أي تفصيل يهمك…" /></label>
        {/* honeypot: hidden from people, filled only by bots */}
        <input className="cs-hp" tabIndex={-1} autoComplete="off" aria-hidden value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} name="website" />
      </fieldset>

      {err && <p className="cf-err">{err}</p>}
      <div className="cs-send">
        <button className="bbtn mag" disabled={!ok || busy}>{busy ? "جارِ الإرسال…" : "أرسل طلب التصميم"}</button>
        <small className="mut">مجاني وبلا التزام — نرد عليك بعرض مفصّل على واتساب.</small>
      </div>
    </form>
  );
}
