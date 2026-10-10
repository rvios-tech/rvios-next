"use client";
import { useEffect, useRef, useState } from "react";
import { brandBySlug, fallbackBrand } from "@/lib/brands";
import { gsap, ScrollTrigger } from "@/lib/fx";
import { getLenis } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import { Img } from "../site/Img";
import { StoreEmblem } from "../site/StoreLogo";

import { SOCIAL_ICONS } from "../site/SocialIcons";
export { SOCIAL_ICONS };
const LABEL: Record<string, string> = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", snapchat: "Snapchat", x: "X", whatsapp: "WhatsApp" };
const href = (k: string, v: string) => ({ instagram: `https://instagram.com/${v}`, tiktok: `https://tiktok.com/@${v}`, facebook: `https://facebook.com/${v}`, snapchat: `https://snapchat.com/add/${v}`, x: `https://x.com/${v}`, whatsapp: `https://wa.me/${v}` })[k] ?? "#";

/** Store information + social accounts + "follow us" gallery. Styled by each template's tokens. */
export function StoreInfo() {
  const { def, lang, L, plan } = useStore(); const b = brandBySlug(def.slug) ?? fallbackBrand(def.slug, def.name.ar, def.accent ?? "#C1272D", def.whatsapp); const ar = lang === "ar";
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const tw = gsap.from(el.querySelectorAll(".si-g .im"), { y: 60, opacity: 0, rotate: (i) => (i % 2 ? 4 : -4), stagger: 0.06, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el.querySelector(".si-g"), start: "top 85%" } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [lang]);
  if (!b) return null;
  const imgs = def.products.filter((p) => !p.hidden).slice(0, 6).map((p) => p.img);
  const pays = ar ? ["الدفع عند الاستلام", "محفظة جيب", "تحويل الكريمي"] : ["Cash on delivery", "Jaib wallet", "Al-Kuraimi transfer"];
  const handle = b.socials.instagram ?? b.socials.tiktok ?? def.slug;
  return (
    <section className="si" ref={ref}>
      <div className="si-in">
        <div className="si-head">
          <StoreEmblem slug={def.slug} size={64} color={def.accent} />
          <div><h2 className="t-h">{ar ? "تابعنا" : "Follow us"}</h2><a className="si-handle" href={href("instagram", handle)} target="_blank" rel="noopener noreferrer">@{handle}</a></div>
          <div className="si-soc">{Object.entries(b.socials).map(([k, v]) => <a key={k} href={href(k, v!)} target="_blank" rel="noopener noreferrer" aria-label={LABEL[k]} data-cursor={LABEL[k]}>{SOCIAL_ICONS[k]}</a>)}</div>
        </div>
        <div className="si-g">{imgs.map((id, i) => <a key={i} href={href("instagram", handle)} target="_blank" rel="noopener noreferrer" className="si-tile" data-cursor="@"><Img id={id} w={500} /><span>{SOCIAL_ICONS.instagram}</span></a>)}</div>
        <div className="si-cards">
          <div className="si-card si-about"><b>{ar ? "عن المتجر" : "About"}</b><p>{L(b.about)}</p>{plan !== "free" && <span className="si-ver">✓ {ar ? "متجر موثّق" : "Verified store"}</span>}</div>
          <div className="si-card"><b>{ar ? "العنوان وأوقات العمل" : "Address & hours"}</b><p>{L(b.address)}</p><p>{L(b.hours)}</p></div>
          <div className="si-card"><b>{ar ? "التواصل" : "Contact"}</b><p className="ltr">{b.phone}</p><a className="si-wa" href={href("whatsapp", def.whatsapp || b.socials.whatsapp || "")} target="_blank" rel="noopener noreferrer">{SOCIAL_ICONS.whatsapp} {ar ? "راسلنا على واتساب" : "Chat on WhatsApp"}</a></div>
          <div className="si-card"><b>{ar ? "الدفع والتوصيل" : "Payment & delivery"}</b><div className="si-pay">{pays.map((p) => <span key={p}>{p}</span>)}</div><p>{L(b.delivery)}</p></div>
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
