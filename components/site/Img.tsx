"use client";
import { useState } from "react";
import { U } from "@/lib/u";

/** Image with a graceful fallback (the first letter of the product, tinted by the template). */
export function Img({ id, w = 1000, fb = "", className = "", extra = "", alt = "", eager = false, ...rest }: {
  id: string; w?: number; fb?: string; className?: string; extra?: string; alt?: string; eager?: boolean; [k: string]: unknown;
}) {
  const [fail, setFail] = useState(false);
  return (
    <div className={`im ${className} ${fail ? "fail" : ""}`} data-fb={fb} {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={U(id, w, extra)} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFail(true)} />
    </div>
  );
}
