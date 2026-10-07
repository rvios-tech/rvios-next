"use client";
import { RVIOS } from "@/lib/config";
import { SOCIAL_ICONS } from "../store/StoreInfo";
import { useSite } from "./Providers";

/** RVIOS official contact channels. */
export function ContactLinks({ compact = false }: { compact?: boolean }) {
  const { lang } = useSite(); const ar = lang === "ar";
  const items = [
    { k: "whatsapp", label: ar ? "واتساب" : "WhatsApp", val: RVIOS.whatsapp, href: RVIOS.whatsappLink },
    { k: "instagram", label: "Instagram", val: RVIOS.instagram, href: RVIOS.instagramLink },
    { k: "facebook", label: "Facebook", val: "RVIOS", href: RVIOS.facebookLink },
    { k: "web", label: ar ? "الموقع" : "Website", val: RVIOS.website, href: RVIOS.websiteLink },
  ];
  return (
    <div className={`rv-contact ${compact ? "compact" : ""}`}>
      {items.map((i) => (
        <a key={i.k} href={i.href} target="_blank" rel="noopener noreferrer" data-cursor={i.label}>
          <span className="rc-ic">{i.k === "web" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg> : SOCIAL_ICONS[i.k]}</span>
          <span><small>{i.label}</small><b className="ltr">{i.val}</b></span>
        </a>
      ))}
    </div>
  );
}
