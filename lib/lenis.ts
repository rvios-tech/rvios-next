"use client";
import type Lenis from "lenis";
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;
export const scrollToEl = (el: Element | null, offset = -20) => { if (!el) return; instance ? instance.scrollTo(el as HTMLElement, { offset }) : el.scrollIntoView({ behavior: "smooth" }); };
export const scrollTop = () => (instance ? instance.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));
