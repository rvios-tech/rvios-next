"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TemplateMeta } from "@/lib/catalog";
import { getLenis } from "@/lib/lenis";
import { IconX } from "../site/Icons";
import { useSite } from "../site/Providers";

/* The store always renders at a real device size and the frame is scaled to fit the screen, so the
   phone view is exactly what a 390×844 phone shows and the desktop view keeps its desktop layout
   even when the preview is opened on a small screen. */
const PHONE = { w: 390, h: 844, bezel: 10 };
const DESK_W = 1280;

/** Live template preview: the real demo store in an iframe, desktop or phone frame. */
export function PreviewModal({ tp, onClose, onPick }: { tp: TemplateMeta | null; onClose: () => void; onPick?: (t: TemplateMeta) => void }) {
  const { lang } = useSite(); const ar = lang === "ar";
  const [dev, setDev] = useState<"desk" | "mob">("desk"); const [loaded, setLoaded] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ s: number; w?: number; h?: number }>({ s: 1 });
  useEffect(() => { const l = getLenis(); if (tp) { l?.stop(); setLoaded(false); } else l?.start(); return () => l?.start(); }, [tp]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  useLayoutEffect(() => {
    const el = stage.current; if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el), W = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), H = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (dev === "mob") {
        const fw = PHONE.w + PHONE.bezel * 2, fh = PHONE.h + PHONE.bezel * 2;
        setFit({ s: Math.min(1, W / fw, H / fh), w: fw, h: fh });
      } else if (W < DESK_W - 120) {
        const s = W / DESK_W; setFit({ s, w: DESK_W, h: H / s });
      } else setFit({ s: 1 });
    };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, [dev, tp]);
  if (!tp) return null;
  const slug = tp.file.split("/").pop();
  const frameStyle = fit.w ? { width: fit.w, height: fit.h, transform: `translate(-50%, -50%) scale(${fit.s})` } : undefined;
  return (
    <div className="pv" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pv-bar">
        <div className="pv-t"><b>{tp.name[lang]}</b><span>{tp.tag[lang]}</span></div>
        <div className="pv-dev"><button className={dev === "desk" ? "on" : ""} onClick={() => setDev("desk")}>{ar ? "حاسوب" : "Desktop"}</button><button className={dev === "mob" ? "on" : ""} onClick={() => setDev("mob")}>{ar ? "جوال" : "Mobile"}</button></div>
        <div className="pv-act">{onPick && <button className="nbtn" onClick={() => { onPick(tp); onClose(); }}>{ar ? "اختر هذا القالب" : "Choose this template"} · {tp.price ? `$${tp.price}` : ar ? "مجاني" : "Free"}</button>}<button className="icb nav-ic" onClick={onClose} aria-label="close"><IconX width={18} /></button></div>
      </div>
      <div className={`pv-stage ${dev}`} ref={stage}>
        <div className={`pv-frame ${fit.w ? "fixed" : ""}`} style={frameStyle}><div className="pv-url ltr"><i /><i /><i /><span>{slug}.rvios.store</span></div>
          {!loaded && <div className="pv-load"><span className="pv-spin" /></div>}
          <iframe src={tp.file} title={tp.name[lang]} onLoad={() => setLoaded(true)} /></div>
      </div>
    </div>
  );
}
