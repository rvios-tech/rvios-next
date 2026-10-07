"use client";
import { useEffect, type RefObject } from "react";
import { initInteractions, initReveals, ScrollTrigger } from "./fx";
import type { Lang } from "./u";

/** Attach reveals + interactions to a subtree; re-run when `deps` change (e.g. language). */
export function useFx(ref: RefObject<HTMLElement | null>, lang: Lang, deps: unknown[] = []) {
  useEffect(() => {
    if (!ref.current) return;
    const a = initReveals(ref.current, lang), b = initInteractions(ref.current);
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { a(); b(); cancelAnimationFrame(r); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, ...deps]);
}
