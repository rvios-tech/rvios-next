export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
import { ALIAS } from "./image-alias";
import { LOCAL } from "./local-images";
/** An image id may carry a focal crop: "<id>|<x>|<y>|<zoom>" (x, y in 0..1). */
export const crop = (id: string, x = 0.5, y = 0.5, z = 1.4) => `${id.split("|")[0]}|${x}|${y}|${z}`;
export const parseImg = (id: string): { base: string; crop: { x: number; y: number; z: number } | null } => {
  const [base, x, y, z] = id.split("|");
  const own = x ? { x: +x, y: +y, z: +z } : null;
  // a missing photo resolves to its local stand-in (keeping the caller's crop when it has one)
  if (!LOCAL[base] && ALIAS[base]) { const a = parseImg(ALIAS[base]); return { base: a.base, crop: own ?? a.crop }; }
  return { base, crop: own };
};
/** Image URL helper: the optimised local copy of template-images/ (smallest WebP at least ~w wide)
    when we have one, Unsplash otherwise. */
export const U = (img: string, w = 1000, extra = "") => {
  const { base: id, crop: c } = parseImg(img);
  if (id.startsWith("http") || id.startsWith("/")) return id;
  const loc = LOCAL[id];
  if (!loc) return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${extra}${c ? `&crop=focalpoint&fp-x=${c.x}&fp-y=${c.y}&fp-z=${c.z}` : ""}`;
  const [base, ws] = loc;
  if (!ws.length) return base;
  return `${base}-${ws.find((x) => x >= w * 0.8) ?? ws[ws.length - 1]}.webp`;
};
/** A transparent hero cutout (template-images/<tpl>/hero*.png). */
export const isCut = (id: string) => !!LOCAL[parseImg(id).base]?.[2];
export type Lang = "ar" | "en";
export type Bi = { ar: string; en: string };
export const pick = <T,>(o: { ar: T; en: T }, lang: Lang): T => o[lang] ?? o.ar;
export const num = (n: number, lang: Lang) => Number(n).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
export const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
