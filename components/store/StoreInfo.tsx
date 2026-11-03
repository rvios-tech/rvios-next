"use client";
import { useEffect, useRef, useState } from "react";
import { brandBySlug, fallbackBrand } from "@/lib/brands";
import { ScrollTrigger } from "@/lib/fx";
import { getLenis } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import { StoreEmblem } from "../site/StoreLogo";

import { socialHandle, socialHref } from "@/lib/store/social";
import { SOCIAL_ICONS } from "../site/SocialIcons";
import { presentNetworks, SocialChips } from "./StoreSocial";
export { SOCIAL_ICONS };

/** Store information + social accounts + "follow us" gallery. Styled by each template's tokens. */
export function StoreInfo() {
  const { def, lang, L, plan } = useStore(); const b = brandBySlug(def.slug) ?? fallbackBrand(def.slug, def.name.ar, def.accent ?? "#C1272D", def.whatsapp); const ar = lang === "ar";
  if (!b) return null;
  // a merchant's store shows its own details and accounts — template demos keep their sample brand
  const own = def.merchant ? def.info : undefined;
  const accounts: Partial<Record<string, string>> = def.merchant ? { ...def.look?.social } : b.socials;
  delete accounts.placement;
  const placement = def.look?.social.placement ?? "info";
  const showFollow = (!def.merchant || placement !== "footer") && presentNetworks(accounts).length > 0;
  const insta = accounts.instagram;
  const PAY: Record<string, [string, string]> = { cod: ["الدفع عند الاستلام", "Cash on delivery"], wallet: ["محفظة إلكترونية", "E-wallet"], bank: ["تحويل بنكي", "Bank transfer"] };
  const pays = own ? own.payMethods.map((m) => PAY[m]?.[ar ? 0 : 1] ?? m) : ar ? ["الدفع عند الاستلام", "محفظة جيب", "تحويل الكريمي"] : ["Cash on delivery", "Jaib wallet", "Al-Kuraimi transfer"];
  const about = own ? own.about || (ar ? `${L(def.name)} — متجر على منصة RVIOS Store.` : `${L(def.name)} — a store on RVIOS Store.`) : L(b.about);
  const address = own ? own.address : L(b.address);
  const hours = own ? own.hours : L(b.hours);
  const phone = own ? own.phone : b.phone;
  const delivery = own ? own.deliveryNote || (ar ? "يُنسّق التوصيل بعد تأكيد الطلب" : "Delivery is arranged after the order is confirmed") : L(b.delivery);
  return (
    <section className="si">
      <div className="si-in">
        {showFollow && (
          <div className="si-head">
            <StoreEmblem slug={def.slug} size={64} color={def.accent} />
            <div><h2 className="t-h">{ar ? "تابعنا" : "Follow us"}</h2>{insta && <a className="si-handle" href={socialHref("instagram", insta)} target="_blank" rel="noopener noreferrer">{socialHandle(insta)}</a>}</div>
            <SocialChips accounts={accounts} edit={def.merchant} />
          </div>
        )}
        <div className="si-cards">
          <div className="si-card si-about"><b>{ar ? "عن المتجر" : "About"}</b><p>{about}</p>{plan !== "free" && <span className="si-ver">✓ {ar ? "متجر موثّق" : "Verified store"}</span>}</div>
          {(address || hours) && <div className="si-card"><b>{ar ? "العنوان وأوقات العمل" : "Address & hours"}</b>{address && <p>{address}</p>}{hours && <p>{hours}</p>}</div>}
          <div className="si-card"><b>{ar ? "التواصل" : "Contact"}</b>{phone && <p className="ltr">{phone}</p>}<a className="si-wa" href={socialHref("whatsapp", def.whatsapp || b.socials.whatsapp || "")} target="_blank" rel="noopener noreferrer">{SOCIAL_ICONS.whatsapp} {ar ? "راسلنا على واتساب" : "Chat on WhatsApp"}</a></div>
          <div className="si-card"><b>{ar ? "الدفع والتوصيل" : "Payment & delivery"}</b><div className="si-pay">{pays.map((p) => <span key={p}>{p}</span>)}</div>{own?.payNote && <p>{own.payNote}</p>}<p>{delivery}</p></div>
        </div>
      </div>
    </section>
  );
}

/** Global storefront chrome: reading progress, route-change curtain and back-to-top. */
export function StoreChrome({ route }: { route: string }) {
  const bar = useRef<HTMLDivElement>(null); const [top, setTop] = useState(false); const [cur, setCur] = useState(false);
  useEffect(() => { const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`; setTop(s.scroll() > 900); } }); return () => st.kill(); }, [route]);
  useEffect(() => { setCur(true); const t = setTimeout(() => setCur(false), 650); return () => clearTimeout(t); }, [route]);
  return (
    <>
      <div className="sc-bar" ref={bar} />
      <div className={`sc-curtain ${cur ? "on" : ""}`} />
      <button className={`sc-top ${top ? "on" : ""}`} onClick={() => getLenis()?.scrollTo(0) ?? window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="top">↑</button>
    </>
  );
}
