"use client";
/* Merchant extras on every template (AzmSmart → «شكل المتجر» → إضافات المتجر): the announcement bar,
   the policy pages in the footer, and the floating WhatsApp button. Template-agnostic on purpose —
   they sit in StoreShell around the template, so all 18 templates get them with their own accent. */
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store/engine";
import { SOCIAL_ICONS } from "../site/SocialIcons";

export type StoreExtras = {
  announce?: { on: boolean; text: string; link: string; color: string };
  policies?: Record<string, string>;
  waFloat?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export const POLICY_TITLES: Record<string, { ar: string; en: string }> = {
  shipping: { ar: "سياسة الشحن والتوصيل", en: "Shipping policy" },
  returns: { ar: "الاستبدال والاسترجاع", en: "Returns & exchanges" },
  privacy: { ar: "سياسة الخصوصية", en: "Privacy policy" },
  terms: { ar: "الشروط والأحكام", en: "Terms & conditions" },
};

/** dark text on light accents, light on dark — the bar stays readable on any colour */
const ink = (hex: string) => {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return "#fff";
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 170 ? "#111" : "#fff";
};

export function AnnounceBar() {
  const { def } = useStore();
  const a = def.look?.extras?.announce;
  if (!a?.on || !a.text) return null;
  const bg = a.color || def.accent || "#C1272D";
  const body = <span>{a.text}</span>;
  return (
    <div className="sx-announce" style={{ background: bg, color: ink(bg) }} role="note">
      {a.link ? <a href={a.link} target={a.link.startsWith("http") ? "_blank" : undefined} rel="noopener">{body} <span aria-hidden>←</span></a> : body}
    </div>
  );
}

export function WaFloat() {
  const { def, lang } = useStore();
  if (!def.look?.extras?.waFloat || !def.whatsapp) return null;
  const text = lang === "ar" ? `مرحبًا ${def.name.ar}، عندي استفسار` : `Hi ${def.name.en}, I have a question`;
  return (
    <a className="sx-wa" href={`https://wa.me/${def.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener" aria-label={lang === "ar" ? "راسلنا على واتساب" : "Chat on WhatsApp"}>
      {SOCIAL_ICONS.whatsapp}
    </a>
  );
}

export function PolicyLinks() {
  const { def, lang } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const policies = def.look?.extras?.policies ?? {};
  const keys = Object.keys(POLICY_TITLES).filter((k) => policies[k]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!keys.length) return null;
  const ar = lang === "ar";
  return (
    <>
      <nav className="sx-policies" aria-label={ar ? "سياسات المتجر" : "Store policies"}>
        {keys.map((k) => <button key={k} type="button" onClick={() => setOpen(k)}>{POLICY_TITLES[k][ar ? "ar" : "en"]}</button>)}
      </nav>
      {open && (
        <div className="sx-modal" role="dialog" aria-modal="true" aria-label={POLICY_TITLES[open][ar ? "ar" : "en"]} onClick={() => setOpen(null)}>
          <article onClick={(e) => e.stopPropagation()}>
            <header><h2>{POLICY_TITLES[open][ar ? "ar" : "en"]}</h2><button type="button" onClick={() => setOpen(null)} aria-label={ar ? "إغلاق" : "Close"}>×</button></header>
            <div className="sx-policy">{policies[open].split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
          </article>
        </div>
      )}
    </>
  );
}
