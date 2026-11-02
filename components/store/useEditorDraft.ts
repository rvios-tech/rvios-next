"use client";
import { useEffect, useState } from "react";
import { toCatalogue, type Catalogue, type Json } from "@/lib/data/unified-map";

/** «شكل المتجر» في AzmSmart وحده يرسل المسودّة — ورسالة من غيره تُهمل، فلا يُغيَّر عرض متجر من الخارج */
const allowedParents = () => {
  const azm = process.env.NEXT_PUBLIC_AZMSMART_URL;
  const origins = [azm ? new URL(azm).origin : "https://azm.rvios.com"];
  if (process.env.NODE_ENV !== "production") origins.push("http://localhost:3001");
  return origins;
};

const CSS = `
html.rv-editing [data-edit]{cursor:pointer;outline:2px dashed transparent;outline-offset:3px;transition:outline-color .15s}
html.rv-editing [data-edit]:hover{outline-color:#C1272D}
html.rv-editing [data-reveal],html.rv-editing [data-split],html.rv-editing [data-clip]{opacity:1!important;transform:none!important;clip-path:none!important;visibility:visible!important}
html.rv-editing [data-split] .wi,html.rv-editing [data-clip]>*{transform:none!important}
html.rv-editing [data-split] .wm{overflow:visible!important}
html.rv-editing :is(h1,h2,h3,h4,h5,h6,p,span,b,strong,em,small,li,a,button,label,img):not(.drawer *,.drawer){pointer-events:auto!important}
`;

/**
 * معاينة المحرر داخل إطار: `?editor=1` وصفحة مؤطَّرة معًا. يلتقط النقر كله — فلا تنقّل ولا سلّة —
 * ويخبر المحرر بالعنصر المنقور، ويعرض المسودّة دون حفظ شيء. الزائر العادي لا يصل إلى أيٍّ من هذا.
 */
export function useEditorDraft(live: Catalogue | null | undefined): { draft: Catalogue | null; rev: number; parent: string | null } {
  const [draft, setDraft] = useState<{ json: Json; rev: number } | null>(null);
  const [parentOrigin, setParentOrigin] = useState<string | null>(null);

  useEffect(() => {
    if (window.parent === window || !new URLSearchParams(location.search).has("editor")) return;
    const allowed = allowedParents();
    const onMessage = (e: MessageEvent) => {
      if (!allowed.includes(e.origin) || e.data?.type !== "rv-editor:draft") return;
      setParentOrigin(e.origin);
      setDraft((d) => ({ json: e.data.draft as Json, rev: (d?.rev ?? 0) + 1 }));
    };
    window.addEventListener("message", onMessage);
    document.documentElement.classList.add("rv-editing");
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    // لا نعرف المؤطِّر بعد: «جاهز» لا يحمل شيئًا، ويُرسل لكل أصل مسموح
    for (const o of allowed) window.parent.postMessage({ type: "rv-editor:ready" }, o);
    return () => {
      window.removeEventListener("message", onMessage);
      document.documentElement.classList.remove("rv-editing");
      style.remove();
    };
  }, []);

  // النقر يترجمه <EditorBridge> — يحتاج القالب المعروض ليعرف أي نص نُقر
  if (!draft) return { draft: null, rev: 0, parent: parentOrigin };
  // التصنيفات تُدار من صفحتها في AzmSmart: تبقى كما هي في المعاينة
  return { draft: { ...toCatalogue(draft.json), categories: live?.categories ?? [] }, rev: draft.rev, parent: parentOrigin };
}
