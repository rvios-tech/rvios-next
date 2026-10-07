export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Unsplash image URL helper — swap for your CDN / Supabase storage later. */
export const U = (id: string, w = 1000, extra = "") =>
  id.startsWith("http") || id.startsWith("/") ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${extra}`;
export type Lang = "ar" | "en";
export type Bi = { ar: string; en: string };
export const pick = <T,>(o: { ar: T; en: T }, lang: Lang): T => o[lang] ?? o.ar;
export const num = (n: number, lang: Lang) => Number(n).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
export const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
