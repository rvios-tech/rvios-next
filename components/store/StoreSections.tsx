"use client";
/* أقسام منتجات الرئيسية التي يضيفها التاجر من لوحته — تحت تصميم أي قالب، ببطاقة القالب نفسه.
   «شبكة» أو «شريط» يمرّ أفقيًا، و«عرض الكل» يفتح «كل المنتجات» بالفلتر المناسب. */
import Link from "next/link";
import { useStore } from "@/lib/store/engine";
import type { TemplateModule } from "@/lib/store/module";
import type { Product } from "@/lib/store/types";

export function StoreSections({ Card }: { Card: TemplateModule["Card"] }) {
  const { def, base, lang } = useStore();
  const sections = def.sections ?? [];
  if (!def.merchant || !sections.length) return null;
  const bySrc = new Map(def.products.filter((p) => p.srcId && !p.dup).map((p) => [p.srcId!, p]));

  return (
    <div className="e-secs">
      {sections.map((s) => {
        const items = s.productIds.map((id) => bySrc.get(id)).filter((p): p is Product => !!p);
        if (!items.length) return null;
        // «عرض الكل»: العروض والعلامة لهما فلتر في «كل المنتجات»
        const more = s.source === "sale" ? `${base}/shop?sale=1` : s.source === "brand" ? `${base}/shop?brand=${encodeURIComponent(s.ref)}` : s.source === "category" ? (() => { const k = items[0]?.cat; return k !== undefined ? `${base}/shop?cat=${k}` : `${base}/shop`; })() : `${base}/shop`;
        return (
          <section key={s.id} className={`e-sec e-sec-${s.layout === "row" ? "row" : "grid"}`}>
            <div className="e-sec-h">
              <div><h2 className="t-h">{s.title}</h2>{s.subtitle && <p>{s.subtitle}</p>}</div>
              <Link href={more}>{lang === "ar" ? "عرض الكل" : "View all"}</Link>
            </div>
            <div className={s.layout === "row" ? "e-sec-row" : "t-grid"} data-lenis-prevent={s.layout === "row" ? true : undefined}>
              {items.map((p, i) => <div key={p.id} className="e-sec-it"><Card p={p} i={i} /></div>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
