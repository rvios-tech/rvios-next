"use client";
import { useState } from "react";
import { isCut, parseImg, U } from "@/lib/u";

/** Image with a graceful fallback (the first letter of the product, tinted by the template). */
export function Img({ id, w = 1000, fb = "", className = "", extra = "", alt = "", eager = false, ...rest }: {
  id: string; w?: number; fb?: string; className?: string; extra?: string; alt?: string; eager?: boolean; [k: string]: unknown;
}) {
  const [fail, setFail] = useState(false);
  const src = U(id, w, extra);
  // a focal crop on a local image: same framing as the Unsplash crop, done in CSS
  const c = src.startsWith("/") ? parseImg(id).crop : null;
  const cropStyle = c ? { objectPosition: `${c.x * 100}% ${c.y * 100}%`, scale: String(c.z), transformOrigin: `${c.x * 100}% ${c.y * 100}%` } : undefined;
  return (
    <div className={`im ${className} ${isCut(id) ? "cut" : ""} ${fail ? "fail" : ""}`} data-fb={fb} {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} style={cropStyle} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFail(true)} />
    </div>
  );
}
