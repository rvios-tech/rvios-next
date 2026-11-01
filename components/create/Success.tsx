"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CATALOG } from "@/lib/catalog";
import { AZMSMART, storeHost, storeUrl } from "@/lib/config";
import { useRepo } from "@/lib/data";
import { gsap } from "@/lib/fx";
import { Brand } from "../site/Logo";
import { IconArrow, IconCheck } from "../site/Icons";
import { Poster } from "../site/Poster";
import { useSite } from "../site/Providers";
import { ContactLinks } from "../site/Contact";
import { ByRegion } from "../region/ByRegion";
import { waHref } from "@/lib/contact";
import { PLAN_NAME, orderMessage } from "@/lib/create-order";
import type { Billing, PlanId } from "@/lib/data/types";
import { SOCIAL_ICONS } from "../site/SocialIcons";

/** Confetti burst in brand colours. */
function confetti(el: HTMLElement) {
  const cols = ["#C1272D", "#FFDAA7", "#8E1B20", "#FFFFFF", "#E59A12"];
  for (let i = 0; i < 90; i++) {
    const d = document.createElement("i"); d.className = "cfx"; d.style.background = cols[i % cols.length]; el.appendChild(d);
    gsap.fromTo(d, { x: 0, y: 0, rotate: 0, opacity: 1 }, { x: (Math.random() - 0.5) * innerWidth * 0.9, y: Math.random() * innerHeight * 0.7 - innerHeight * 0.35, rotate: Math.random() * 720, opacity: 0, duration: 1.8 + Math.random() * 1.2, ease: "power3.out", onComplete: () => d.remove() });
  }
}

export function Success() {
  const { lang, toast } = useSite(); const ar = lang === "ar"; const q = useSearchParams(); const slug = q.get("slug") ?? "";
  const { data, loaded } = useRepo((r) => r.storeBySlug(slug), [slug]);
  const burst = useRef<HTMLDivElement>(null); const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!data) return;
    if (burst.current) confetti(burst.current);
    if (card.current) gsap.from(card.current.children, { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" });
  }, [data]);
  if (!loaded) return <div className="ok-wait"><span className="pv-spin" /></div>;
  if (!data) return <div className="ok-wait"><p>{ar ? "لم نجد هذا المتجر." : "Store not found."}</p><Link className="bbtn" href="/create">{ar ? "أنشئ متجراً" : "Create a store"}</Link></div>;
  const s = data.store; const host = storeHost(s.slug);
  // طلب مدفوع لم يُؤكَّد بعد: الخادم يعرض المتجر مجانيًا إلى أن يفعّله الفريق، فالتفاصيل من الطلب نفسه
  const pay = q.get("pay") === "1"; const pending = pay || s.status === "pending_payment";
  const tp = CATALOG.find((c) => c.id === (pay && q.get("tpl"))) ?? CATALOG.find((c) => c.id === s.templateId)!;
  const askedPlan = q.get("plan") as PlanId | null; const planId: PlanId = pay && askedPlan && askedPlan in PLAN_NAME ? askedPlan : s.planId;
  const billing: Billing = pay ? (q.get("billing") === "year" ? "year" : "month") : s.billing ?? "month";
  const domain = (pay && q.get("domain")) || s.customDomain;
  const order = orderMessage(lang, { store: s.nameAr, host, template: tp.name[lang], plan: planId, billing, total: Number(q.get("total")) || 0, domain: domain || undefined });
  const share = `https://wa.me/?text=${encodeURIComponent(`${ar ? "تسوّق من متجري" : "Shop at my store"} ${s.nameAr}: ${storeUrl(s.slug)}`)}`;
  return (
    <div className="ok" key={lang}>
      <div className="ok-burst" ref={burst} />
      <header className="cf-top"><Link href="/"><Brand /></Link></header>
      <div className="ok-in" ref={card}>
        <div className="ok-check"><IconCheck width={40} /></div>
        <h1 className="disp">{pending ? (ar ? "بقي التواصل مع الفريق" : "One step left: contact the team") : (ar ? "متجرك جاهز!" : "Your store is live!")}</h1>
        <p className="mut">{pending ? (ar ? "حفظنا حسابك وبيانات متجرك. أرسل الرسالة الجاهزة للفريق على واتساب لإكمال الدفع، وبعدها تتفعّل الباقة والقالب. رابط متجرك:" : "We saved your account and store details. Send the ready message to the team on WhatsApp to complete payment, then the plan and template activate. Your store link:") : (ar ? "شارك الرابط مع زبائنك وابدأ استقبال الطلبات على واتساب." : "Share the link with your customers and start receiving orders on WhatsApp.")}</p>
        <div className="ok-link"><span className="dot" style={{ background: s.color }} /><b className="ltr">{host}</b><button onClick={() => { navigator.clipboard?.writeText(storeUrl(s.slug)).catch(() => {}); toast(ar ? "تم نسخ الرابط" : "Link copied"); }}>{ar ? "نسخ" : "Copy"}</button></div>
        <div className="ok-acts">
          {pending && <ByRegion>{(c) => <a className="bbtn mag" href={waHref(c, order)} target="_blank" rel="noopener noreferrer">{SOCIAL_ICONS.whatsapp} {ar ? "تواصل مع الفريق لإكمال الدفع" : "Contact the team to pay"}</a>}</ByRegion>}
          <Link className={pending ? "lbtn" : "bbtn mag"} href={`/s/${s.slug}`} target="_blank">{ar ? "زيارة المتجر" : "Visit store"} <IconArrow /></Link>
          <a className={`lbtn ${AZMSMART.live ? "" : "is-soon"}`} href={AZMSMART.live ? AZMSMART.manageStore(s.slug) : undefined} aria-disabled={!AZMSMART.live}>{ar ? "إدارة المتجر عبر AzmSmart" : "Manage with AzmSmart"} {!AZMSMART.live && <em>{ar ? "قريباً" : "Soon"}</em>}</a>
          {!pending && <a className="lbtn" href={share} target="_blank" rel="noopener noreferrer">{SOCIAL_ICONS.whatsapp} {ar ? "شارك على واتساب" : "Share on WhatsApp"}</a>}
        </div>
        <div className="ok-grid">
          <div className="ok-card ok-art"><Poster tp={tp} lang={lang} /></div>
          <div className="ok-card"><b>{ar ? "ملخص المتجر" : "Store summary"}</b>
            <dl><dt>{ar ? "الاسم" : "Name"}</dt><dd>{s.nameAr}</dd><dt>{ar ? "القالب" : "Template"}</dt><dd>{tp.name[lang]}</dd><dt>{ar ? "الباقة" : "Plan"}</dt><dd>{PLAN_NAME[planId][lang]}{billing && planId !== "free" ? ` · ${billing === "year" ? (ar ? "سنوي" : "yearly") : (ar ? "شهري" : "monthly")}` : ""}</dd>
              <dt>{ar ? "الحالة" : "Status"}</dt><dd><span className={`ok-st ${pending ? "p" : "a"}`}>{pending ? (ar ? "بانتظار إكمال الدفع" : "Awaiting payment") : (ar ? "يعمل" : "Live")}</span></dd>{domain && <><dt>{ar ? "الدومين" : "Domain"}</dt><dd className="ltr">{domain}</dd></>}</dl></div>
          <div className="ok-card"><b>{ar ? "الخطوات التالية" : "Next steps"}</b>
            <ol className="ok-next">{pending && <li>{ar ? "تواصل مع الفريق على واتساب لإكمال الدفع وتفعيل الباقة والقالب." : "Contact the team on WhatsApp to complete payment and activate your plan and template."}</li>}<li>{ar ? "شارك رابط متجرك في الحالة والمجموعات." : "Share your link in status and groups."}</li>{AZMSMART.live
              ? <li>{ar ? "ادخل إلى AzmSmart ببريدك وكلمة المرور التي اخترتها: متجرك فيه بمنتجات القالب التجريبية، عدّلها أو استبدلها بمنتجاتك." : "Sign in to AzmSmart with your email and the password you chose: your store is there with the template's sample products — edit or replace them."}</li>
              : <li>{ar ? "ستصلك رسالة على بريدك لربط المتجر بـ AzmSmart عند إطلاقه." : "You'll get an email to link the store to AzmSmart at launch."}</li>}<li>{ar ? "من AzmSmart تضيف منتجاتك وتدير طلباتك." : "From AzmSmart you add products and manage orders."}</li></ol></div>
          <div className="ok-card"><b>{ar ? "تواصل مع RVIOS" : "Contact RVIOS"}</b><ContactLinks compact /></div>
        </div>
      </div>
    </div>
  );
}
