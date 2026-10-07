"use client";
import { useEffect } from "react";
import { AZMSMART, RVIOS } from "@/lib/config";
import { getLenis } from "@/lib/lenis";
import { LogoMark } from "./Logo";
import { IconArrow, IconX } from "./Icons";
import { ContactLinks } from "./Contact";
import { useSite } from "./Providers";

/** Accounts & store management move to AzmSmart. Until it launches, this explains it and offers contact. */
export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useSite(); const ar = lang === "ar";
  useEffect(() => { const l = getLenis(); if (open) l?.stop(); else l?.start(); }, [open]);
  return (
    <div className={`modal ${open ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mbox azm" role="dialog" aria-modal="true">
        <button className="icb mx" onClick={onClose} aria-label="close"><IconX width={18} /></button>
        <LogoMark />
        <span className="azm-badge">{AZMSMART.name}</span>
        <h3>{ar ? "إدارة متجرك عبر AzmSmart" : "Manage your store with AzmSmart"}</h3>
        <p className="mnote" style={{ marginTop: 0 }}>{ar ? "تسجيل الدخول وإدارة المنتجات والطلبات والحساب ستكون عبر نظام AzmSmart من RVIOS. سيتم إطلاقه قريباً، وسيرتبط بمتجرك تلقائياً عبر بريدك." : "Sign-in, products, orders and your account will be handled by AzmSmart by RVIOS. It's launching soon and will link to your store through your email."}</p>
        <a className={`nbtn wide ${AZMSMART.live ? "" : "is-soon"}`} href={AZMSMART.live ? AZMSMART.login : undefined} aria-disabled={!AZMSMART.live}>{ar ? "الدخول إلى AzmSmart" : "Sign in to AzmSmart"} {AZMSMART.live ? <IconArrow width={18} /> : <em>{ar ? "قريباً" : "Soon"}</em>}</a>
        <div className="or">{ar ? "تحتاج مساعدة الآن؟" : "Need help now?"}</div>
        <ContactLinks compact />
        <p className="mnote">{RVIOS.website}</p>
      </div>
    </div>
  );
}
