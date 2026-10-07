"use client";
import { useEffect, useState } from "react";
import type { TemplateMeta } from "@/lib/catalog";
import { getLenis } from "@/lib/lenis";
import { IconX } from "../site/Icons";
import { useSite } from "../site/Providers";

/** Live template preview: the real demo store in an iframe, desktop or phone frame. */
export function PreviewModal({ tp, onClose, onPick }: { tp: TemplateMeta | null; onClose: () => void; onPick?: (t: TemplateMeta) => void }) {
  const { lang } = useSite(); const ar = lang === "ar";
  const [dev, setDev] = useState<"desk" | "mob">("desk"); const [loaded, setLoaded] = useState(false);
  useEffect(() => { const l = getLenis(); if (tp) { l?.stop(); setLoaded(false); } else l?.start(); return () => l?.start(); }, [tp]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  if (!tp) return null;
  const slug = tp.file.split("/").pop();
  return (
    <div className="pv" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pv-bar">
        <div className="pv-t"><b>{tp.name[lang]}</b><span>{tp.tag[lang]}</span></div>
        <div className="pv-dev"><button className={dev === "desk" ? "on" : ""} onClick={() => setDev("desk")}>{ar ? "حاسوب" : "Desktop"}</button><button className={dev === "mob" ? "on" : ""} onClick={() => setDev("mob")}>{ar ? "جوال" : "Mobile"}</button></div>
        <div className="pv-act">{onPick && <button className="nbtn" onClick={() => { onPick(tp); onClose(); }}>{ar ? "اختر هذا القالب" : "Choose this template"} · {tp.price ? `$${tp.price}` : ar ? "مجاني" : "Free"}</button>}<button className="icb nav-ic" onClick={onClose} aria-label="close"><IconX width={18} /></button></div>
      </div>
      <div className={`pv-stage ${dev}`}>
        <div className="pv-frame"><div className="pv-url ltr"><i /><i /><i /><span>{slug}.rvios.store</span></div>
          {!loaded && <div className="pv-load"><span className="pv-spin" /></div>}
          <iframe src={tp.file} title={tp.name[lang]} onLoad={() => setLoaded(true)} /></div>
      </div>
    </div>
  );
}
