"use client";
import { useEffect } from "react";
import type { StoreDef } from "@/lib/store/types";
import { listEntries } from "@/lib/store/copy-lists";

type Bi = { ar: string; en: string };
const isBi = (v: unknown): v is Bi => !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as Bi).ar === "string";
const textOf = (v: unknown) => (typeof v === "string" ? v : isBi(v) ? v.ar : "");
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * يصف القالب الحالي للمحرر (نصوصه وصوره)، ويترجم النقر إلى عنصر: منتج بالرابط، أو عنصر معلَّم
 * بـ`data-edit`، أو نص يطابق أحد نصوص القالب. قالب جديد يصير قابلًا للتعديل دون تعليمه عنصرًا عنصرًا.
 */
export function EditorBridge({ def, parent }: { def: StoreDef; parent: string }) {
  // الوصف بعد كل رسم: الصور تُقرأ من الصفحة نفسها، فلا يُذكر إلا ما يظهر فعلًا
  useEffect(() => {
    const t = setTimeout(() => {
      const copy = [...Object.entries(def.copy).filter(([, v]) => typeof v === "string" || isBi(v)).map(([key, v]) => ({ key, text: textOf(v) })), ...listEntries(def.copy)].filter((c) => norm(c.text));
      const seen = new Map<string, string>();
      document.querySelectorAll<HTMLElement>('[data-edit^="img:"]').forEach((el) => {
        const key = el.getAttribute("data-edit")!.slice(4);
        if (!seen.has(key)) seen.set(key, el.querySelector("img")?.currentSrc || el.querySelector("img")?.src || "");
      });
      const images = [...seen].map(([key, src]) => ({ key, src }));
      window.parent.postMessage({ type: "rv-editor:schema", template: def.id, copy, images }, parent);
    }, 400);
    return () => clearTimeout(t);
  }, [def, parent]);

  useEffect(() => {
    const texts = [...Object.entries(def.copy).map(([k, v]) => [k, norm(textOf(v))] as const), ...listEntries(def.copy).map((e) => [e.key, norm(e.text)] as const)].filter(([, v]) => v);
    const name = norm(def.name.ar);
    const pick = (target: string) => window.parent.postMessage({ type: "rv-editor:pick", target }, parent);
    /** ما تحت المؤشر كله لا الأعلى وحده: طبقات الزينة والتدرّج تغطي النصوص في قوالب كثيرة */
    const resolve = (stack: Element[]): string | null => {
      for (const el of stack) {
        const tagged = el.closest("[data-edit]")?.getAttribute("data-edit");
        // عنصر معلَّم بالاسم (القالب الأساسي، الشعار) أولًا — الصور وحدها تنتظر بعد النصوص
        if (tagged && !tagged.startsWith("img:")) return tagged;
        const link = el.closest('a[href*="/p/"]')?.getAttribute("href");
        if (link) {
          const slot = link.split("/p/")[1]?.split(/[?#/]/)[0];
          return `product:${def.products.find((x) => x.id === slot)?.srcId ?? "sample"}`;
        }
      }
      // نص بلا علامة: أقرب عنصر نصّه يطابق نصًّا من نصوص القالب — قبل الصورة التي تحته
      for (const el of stack) {
        for (let n: Element | null = el, i = 0; n && i < 4; n = n.parentElement, i++) {
          const text = norm((n as HTMLElement).innerText ?? "");
          if (!text || text.length > 700) continue;
          if (text === name) return "name";
          const hit = texts.find(([, v]) => v === text);
          if (hit) return `copy:${hit[0]}`;
        }
      }
      for (const el of stack) {
        const tagged = el.closest("[data-edit]")?.getAttribute("data-edit");
        if (tagged) return tagged;
      }
      return null;
    };
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // السلة المغلقة طبقة تغطي الصفحة — لا تُحسب
      const target = resolve(document.elementsFromPoint(e.clientX, e.clientY).filter((x) => !x.closest(".drawer:not(.open)")));
      if (target) pick(target);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [def, parent]);

  return null;
}
