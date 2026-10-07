"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/fx";
import { setLenis } from "@/lib/lenis";
import { lerp, reduceMotion, finePointer, type Lang } from "@/lib/u";

type Theme = "light" | "dark";
type Ctx = { lang: Lang; theme: Theme; setLang: (l: Lang) => void; toggleLang: () => void; toggleTheme: () => void; toast: (m: string) => void };
const SiteCtx = createContext<Ctx | null>(null);
export const useSite = () => { const c = useContext(SiteCtx); if (!c) throw new Error("useSite outside provider"); return c; };

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("ar");
  const [theme, setTheme] = useState<Theme>("light");
  const [msg, setMsg] = useState<string | null>(null);
  const tRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // restore preferences
  useEffect(() => {
    const l = localStorage.getItem("rv-lang") as Lang | null;
    const t = localStorage.getItem("rv-theme") as Theme | null;
    if (l) setLangS(l);
    setTheme(t ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }, []);
  useEffect(() => {
    const h = document.documentElement;
    h.lang = lang; h.dir = lang === "ar" ? "rtl" : "ltr"; h.dataset.theme = theme;
    localStorage.setItem("rv-lang", lang); localStorage.setItem("rv-theme", theme);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [lang, theme]);

  // smooth scroll synced with GSAP
  useEffect(() => {
    if (reduceMotion()) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
  }, []);

  const toast = useCallback((m: string) => { setMsg(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setMsg(null), 2200); }, []);
  const value: Ctx = { lang, theme, setLang: setLangS, toggleLang: () => setLangS((l) => (l === "ar" ? "en" : "ar")), toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")), toast };

  return (
    <SiteCtx.Provider value={value}>
      {children}
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <div className={`toast ${msg ? "show" : ""}`} role="status">{msg}</div>
    </SiteCtx.Provider>
  );
}

/** Custom cursor: grows over links, shows a label over [data-cursor]. */
function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [link, setLink] = useState(false);
  useEffect(() => {
    if (!finePointer() || reduceMotion()) return;
    let x = -99, y = -99, cx = -99, cy = -99, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; const t = e.target as HTMLElement;
      const lab = t.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(lab ? lab.dataset.cursor ?? null : null); setLink(!lab && !!t.closest?.("a,button,select,input,label"));
    };
    const f = () => { cx = lerp(cx, x, 0.2); cy = lerp(cy, y, 0.2); if (ref.current) ref.current.style.transform = `translate(${cx}px,${cy}px)`; raf = requestAnimationFrame(f); };
    window.addEventListener("pointermove", move); raf = requestAnimationFrame(f);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className={`rvcur ${label ? "label" : link ? "link" : ""}`} aria-hidden="true"><i>{label}</i></div>;
}
