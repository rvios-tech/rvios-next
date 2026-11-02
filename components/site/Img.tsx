"use client";
import { useState } from "react";
import { isCut, parseImg, U } from "@/lib/u";
import { useStoreMaybe } from "@/lib/store/ctx";

/** Image with a graceful fallback (the first letter of the product, tinted by the template). */
export function Img({ id, w = 1000, fb = "", className = "", extra = "", alt = "", eager = false, ...rest }: {
  id: string; w?: number; fb?: string; className?: string; extra?: string; alt?: string; eager?: boolean; [k: string]: unknown;
}) {
  const [fail, setFail] = useState(false);
  // a template's own picture can be replaced or deleted in "شكل المتجر" (merchant photos are product data, not this)
  const look = useStoreMaybe()?.def;
  const key = parseImg(id).base;
  const asset = !/^(https?:|data:|blob:)/.test(key);
  const editable = asset && look?.merchant && look.id !== "essential";
  if (editable && look.look?.hidden.includes(`img:${key}`)) return null;
  const own = editable ? look.look?.images[key] : undefined;
  const src = own ?? U(id, w, extra);
  // a focal crop on a local image: same framing as the Unsplash crop, done in CSS
  const c = !own && src.startsWith("/") ? parseImg(id).crop : null;
  const cropStyle = c ? { objectPosition: `${c.x * 100}% ${c.y * 100}%`, scale: String(c.z), transformOrigin: `${c.x * 100}% ${c.y * 100}%` } : undefined;
  return (
    <div className={`im ${className} ${isCut(id) ? "cut" : ""} ${fail ? "fail" : ""}`} data-fb={fb} {...(editable ? { "data-edit": `img:${key}` } : {})} {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} style={cropStyle} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFail(true)} />
    </div>
  );
}
