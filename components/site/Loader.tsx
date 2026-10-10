"use client";
import { useEffect, useState } from "react";
import { getLenis } from "@/lib/lenis";
import { reduceMotion } from "@/lib/u";
import { LogoMark } from "./Logo";

let shown = false;
/** Brand intro: the logo assembles (speed lines → cart → bag) while a counter runs, then a curtain lifts. */
export function Loader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(shown);
  useEffect(() => {
    if (shown || reduceMotion()) { setGone(true); onDone(); return; }
    shown = true; getLenis()?.stop();
    const t0 = performance.now(), dur = 650; let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 2); setN(Math.round(e * 100));
      if (k < 1) { raf = requestAnimationFrame(tick); return; }
      setOut(true); getLenis()?.start(); setTimeout(onDone, 80); setTimeout(() => setGone(true), 800);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (gone) return null;
  return <div className={`loader ${out ? "out" : ""}`}><div><LogoMark className="play" /><div className="lcount ya">{String(n).padStart(3, "0")}</div></div></div>;
}
