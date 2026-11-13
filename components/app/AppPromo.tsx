"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSite } from "../site/Providers";
import { IconArrow, IconCheck } from "../site/Icons";
import { CONTACTS, waHref } from "@/lib/contact";
import { useRegion } from "../region/useRegion";

/** رابط تنزيل التطبيق — ملف APK على المنصة نفسها حتى يُنشر في Google Play */
export const APK_URL = process.env.NEXT_PUBLIC_APP_APK_URL || "/download/rvios.apk";

/** لقطات التطبيق الحقيقية (public/app) */
export const SHOTS = [
  { src: "/app/home.webp", ar: "لوحة متجرك", en: "Your store" },
  { src: "/app/templates.webp", ar: "١٨ قالبًا", en: "18 templates" },
  { src: "/app/preview.webp", ar: "معاينة حية", en: "Live preview" },
  { src: "/app/design.webp", ar: "صمّم متجرك", en: "Design it" },
  { src: "/app/orders.webp", ar: "الطلبات", en: "Orders" },
  { src: "/app/products.webp", ar: "المنتجات", en: "Products" },
];

const T = {
  ar: {
    kick: "تطبيق RVIOS",
    h: ["متجرك كله", "في جيبك."],
    sub: "افتح متجرك من جوالك، واختر قالبه بمعاينة حية، وصمّمه بلمساتك، وأضف منتجاتك بصورها، وتابع كل طلب لحظة وصوله — بلا حاسوب.",
    points: ["معاينة حية للقوالب بشكل الجوال والمتصفح", "تصميم المتجر: الشعار والغلاف والنصوص والألوان", "منتجات بصورها من المعرض أو الكاميرا", "إشعار فوري مع كل طلب جديد", "الباقات والدفع بالكريمي وجيب وجوالي", "إرشادات مصوّرة في كل شاشة"],
    get: "حمّل التطبيق لأندرويد",
    more: "اكتشف التطبيق",
    soon: "قريبًا على Google Play و App Store",
    size: "مجاني · أندرويد ٨ فأحدث · ٤٨ م.ب",
  },
  en: {
    kick: "The RVIOS app",
    h: ["Your whole store", "in your pocket."],
    sub: "Open your store from your phone, pick its template with a live preview, design it your way, add products with photos, and follow every order as it arrives — no computer needed.",
    points: ["Live template preview, phone and desktop", "Store design: logo, cover, copy and colours", "Products with photos from gallery or camera", "Instant alert for every new order", "Plans and local payments built in", "Illustrated guides on every screen"],
    get: "Get the app for Android",
    more: "Discover the app",
    soon: "Coming soon to Google Play & the App Store",
    size: "Free · Android 8+ · 48 MB",
  },
};

/** ثلاثة هواتف متراكبة — الأوسط يتبدّل، والجانبيان خلفه بميل */
export function AppPhones({ shots = SHOTS }: { shots?: typeof SHOTS }) {
  const { lang } = useSite();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold) return;
    const t = setInterval(() => setI((x) => (x + 1) % shots.length), 3000);
    return () => clearInterval(t);
  }, [hold, shots.length]);
  const at = (k: number) => shots[(i + k + shots.length) % shots.length];
  const ph = (s: (typeof shots)[number], cls: string) => (
    <div className={`ap-ph ${cls}`} key={cls}>
      <div className="ap-sc">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={s.src} src={s.src} alt={s[lang]} decoding="async" />
      </div>
    </div>
  );
  return (
    <div className="ap-show" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="ap-stack" aria-label={lang === "ar" ? "لقطات من تطبيق RVIOS" : "RVIOS app screenshots"} role="img">
        {ph(at(-1), "l")}
        {ph(at(1), "r")}
        {ph(at(0), "f")}
      </div>
      <div className="ap-tabs">
        {shots.map((s, k) => (
          <button key={s.src} className={k === i ? "on" : ""} onClick={() => setI(k)}>{s[lang]}</button>
        ))}
      </div>
    </div>
  );
}

/** قسم التطبيق في صفحة المنصة الرئيسية */
export function AppSection() {
  const { lang } = useSite();
  const x = T[lang];
  return (
    <section className="ap-sec" id="app">
      <div className="wrap ap-grid">
        <div className="ap-txt">
          <span className="kick">APP</span>
          <h2 className="disp sh" data-split>{x.h[0]} <span className="ap-hl">{x.h[1]}</span></h2>
          <p className="ss" data-reveal>{x.sub}</p>
          <ul className="ap-pts" data-reveal>
            {x.points.slice(0, 4).map((p) => <li key={p}><IconCheck />{p}</li>)}
          </ul>
          <div className="ap-cta" data-reveal>
            <a className="bbtn mag" href={APK_URL} download><AndroidIcon /> {x.get}</a>
            <Link className="lbtn mag" href="/app">{x.more} <IconArrow /></Link>
          </div>
          <small className="ap-note">{x.size}</small>
        </div>
        <AppPhones />
      </div>
    </section>
  );
}

export function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 00-.66-.38l-1.86 3.22A11.4 11.4 0 0012 8.1c-1.78 0-3.46.38-4.92 1.04L5.22 5.92a.38.38 0 00-.66.38L6.4 9.48A10.7 10.7 0 001 18h22a10.7 10.7 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}

const PAGE = {
  ar: {
    eyebrow: "جديد · لأندرويد",
    h1: ["أدِر متجرك", "من جوالك."],
    sub: "تطبيق RVIOS يحمل منصة المتاجر كلها إلى هاتفك: افتح متجرك في أربع خطوات، وصمّمه بمعاينة حية، وتابع طلباتك مع إشعار فوري — في أي وقت ومن أي مكان.",
    featsH: "كل المنصة في تطبيق واحد",
    feats: [
      ["افتح متجرك في دقائق", "القالب، ثم الباقة، ثم اسم متجرك ورابطه — والمجاني يعمل فورًا.", "🏪"],
      ["معاينة حية للقوالب", "جرّب متجر العرض لكل قالب داخل إطار جوال أو متصفح قبل أن تختار.", "📱"],
      ["صمّم بلمساتك", "الشعار والغلاف والألوان والنصوص وشريط الإعلان وزر واتساب — وترى النتيجة فورًا.", "🎨"],
      ["منتجات بصورها", "من المعرض أو الكاميرا؛ تُصغَّر وتتحوّل WebP فيفتح متجرك أسرع.", "📸"],
      ["لا تفوّت طلبًا", "إشعار مع كل طلب جديد، ورسالة واتساب جاهزة لتأكيده مع العميل.", "🔔"],
      ["الباقات والدفع", "رقِّ باقتك أو اشترِ قالبًا، وادفع بالكريمي أو جيب أو جوالي، وارفع الإيصال.", "💳"],
      ["عملاؤك ومورّدوك", "عملاء المتجر ودفتر العملاء والموردون وروتين يومك في «أعمالي».", "🤝"],
      ["إرشاد في كل شاشة", "نوافذ مصوّرة تقودك أول مرة، وزر «؟» يعيدها متى شئت.", "💡"],
    ],
    galleryH: "جولة في التطبيق",
    stepsH: "ثلاث خطوات وتبيع",
    steps: [
      ["حمّل التطبيق", "ملف أندرويد مباشر — ثبّته وافتحه."],
      ["افتح متجرك", "اختر قالبك وباقتك واسم متجرك."],
      ["شارك الرابط", "أضف منتجاتك وانشر رابطك — والطلبات تصلك."],
    ],
    faqH: "أسئلة عن التطبيق",
    faq: [
      ["هل التطبيق مجاني؟", "نعم. التطبيق مجاني، والمتجر المجاني مجاني للأبد. تدفع فقط إن اخترت باقة مدفوعة أو قالبًا مميزًا."],
      ["هل أحتاج حسابًا جديدًا؟", "إن كان لديك حساب على المنصة فادخل به — هو نفسه في التطبيق ولوحة التحكم. وإن لم يكن، تنشئه من التطبيق في دقيقة."],
      ["كيف أثبّت ملف APK؟", "افتح الملف بعد تنزيله، واسمح بالتثبيت من هذا المصدر مرة واحدة، ثم «تثبيت». يتحدّث التطبيق فوق نفسه دون فقد بياناتك."],
      ["هل يعمل على الآيفون؟", "النسخة الحالية لأندرويد. نسخة iOS قيد التجهيز — وإلى ذلك الحين، لوحة التحكم تعمل من متصفح الآيفون."],
    ],
    ctaH: "متجرك ينتظرك في جيبك.",
    help: "تحتاج مساعدة في التثبيت؟",
  },
  en: {
    eyebrow: "New · Android",
    h1: ["Run your store", "from your phone."],
    sub: "The RVIOS app brings the whole store platform to your phone: open your store in four steps, design it with a live preview, and follow orders with instant alerts — anytime, anywhere.",
    featsH: "The whole platform in one app",
    feats: [
      ["Open your store in minutes", "Template, plan, then your store name and link — free stores go live instantly.", "🏪"],
      ["Live template preview", "Try every template's demo store in a phone or browser frame before choosing.", "📱"],
      ["Design it your way", "Logo, cover, colours, copy, announcement bar and WhatsApp button — see it instantly.", "🎨"],
      ["Products with photos", "From gallery or camera; shrunk to WebP so your store opens faster.", "📸"],
      ["Never miss an order", "An alert for every new order, and a ready WhatsApp message to confirm it.", "🔔"],
      ["Plans & payments", "Upgrade or buy a template, pay locally, and upload the receipt.", "💳"],
      ["Customers & suppliers", "Store customers, customer book, suppliers and your daily routine.", "🤝"],
      ["Guides on every screen", "Illustrated tips the first time, and a “?” button to see them again.", "💡"],
    ],
    galleryH: "A tour of the app",
    stepsH: "Three steps to selling",
    steps: [
      ["Get the app", "A direct Android file — install and open it."],
      ["Open your store", "Pick your template, plan and store name."],
      ["Share the link", "Add products and share your link — orders come to you."],
    ],
    faqH: "About the app",
    faq: [
      ["Is the app free?", "Yes. The app is free and the free store is free forever. You pay only for a paid plan or a premium template."],
      ["Do I need a new account?", "If you have a platform account, sign in with it — it's the same in the app and the dashboard. If not, create one in the app in a minute."],
      ["How do I install the APK?", "Open the file after downloading, allow installs from this source once, then tap Install. Updates install over it without losing data."],
      ["Does it work on iPhone?", "The current version is Android. iOS is on the way — meanwhile the dashboard works in the iPhone browser."],
    ],
    ctaH: "Your store is waiting in your pocket.",
    help: "Need help installing?",
  },
};

/** صفحة التطبيق كاملة — /app */
export function AppPage() {
  const { lang } = useSite();
  const x = PAGE[lang];
  const t = T[lang];
  const region = useRegion();
  return (
    <main className="ap-page">
      <section className="ap-hero">
        <div className="wrap ap-grid">
          <div className="ap-txt">
            <div className="eyebrow"><span>{lang === "ar" ? "جديد" : "New"}</span>{x.eyebrow}</div>
            <h1 className="disp ap-h1">{x.h1[0]}<br /><span className="ap-hl">{x.h1[1]}</span></h1>
            <p className="ss">{x.sub}</p>
            <div className="ap-cta">
              <a className="bbtn mag" href={APK_URL} download><AndroidIcon /> {t.get}</a>
              <Link className="lbtn mag" href="/create">{lang === "ar" ? "أو أنشئ متجرك من الويب" : "Or create on the web"}</Link>
            </div>
            <small className="ap-note">{t.size} · {t.soon}</small>
          </div>
          <AppPhones />
        </div>
      </section>

      <section className="wrap ap-feats">
        <span className="kick">FEATURES</span>
        <h2 className="disp sh">{x.featsH}</h2>
        <div className="ap-fg">
          {x.feats.map(([h, p, e]) => (
            <div className="ap-f" key={h} data-spot>
              <span className="ap-fe" aria-hidden="true">{e}</span>
              <b>{h}</b>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ap-gal">
        <div className="wrap"><span className="kick">TOUR</span><h2 className="disp sh">{x.galleryH}</h2></div>
        <div className="ap-strip" data-lenis-prevent-horizontal>
          {SHOTS.map((s) => (
            <figure key={s.src} className="ap-gi">
              <div className="ap-ph"><div className="ap-sc">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s[lang]} loading="lazy" decoding="async" />
              </div></div>
              <figcaption>{s[lang]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="wrap ap-steps">
        <span className="kick">START</span>
        <h2 className="disp sh">{x.stepsH}</h2>
        <ol>{x.steps.map(([h, p], i) => <li key={h}><span className="ya">0{i + 1}</span><b>{h}</b><p>{p}</p></li>)}</ol>
      </section>

      <section className="wrap ap-faq">
        <h2 className="disp sh">{x.faqH}</h2>
        {x.faq.map(([q, a], i) => (
          <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </section>

      <section className="wrap ap-final">
        <h2 className="disp">{x.ctaH}</h2>
        <div className="ap-cta">
          <a className="bbtn mag" href={APK_URL} download><AndroidIcon /> {t.get}</a>
          <a className="lbtn" href={waHref(CONTACTS[region], lang === "ar" ? "مرحبًا فريق RVIOS، أحتاج مساعدة في تثبيت تطبيق RVIOS" : "Hi RVIOS team, I need help installing the RVIOS app")} target="_blank" rel="noopener">{x.help}</a>
        </div>
      </section>
    </main>
  );
}
