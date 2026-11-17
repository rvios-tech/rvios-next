"use client";
/* «كل المنتجات»: صفحة تصفّح مشتركة لكل القوالب — بحث، تصنيفات، علامات تجارية، نطاق سعر، المتوفر،
   التخفيضات، والترتيب. الكتالوج محمّل أصلًا، فالفلترة فورية في المتصفح بلا طلبات. البطاقة بطاقة القالب. */
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/engine";
import type { TemplateModule } from "@/lib/store/module";
import type { Product } from "@/lib/store/types";

const T = {
  ar: { title: "كل المنتجات", search: "ابحث في المتجر…", cats: "التصنيفات", all: "الكل", brands: "العلامات التجارية", price: "السعر", from: "من", to: "إلى", stock: "المتوفر فقط", sale: "العروض فقط", sort: "الترتيب", sorts: { new: "الأحدث", low: "الأقل سعرًا", high: "الأعلى سعرًا", name: "الاسم" }, filters: "الفلاتر", clear: "مسح الفلاتر", empty: "لا منتجات تطابق اختيارك", count: "منتج" },
  en: { title: "All products", search: "Search the store…", cats: "Categories", all: "All", brands: "Brands", price: "Price", from: "From", to: "To", stock: "In stock only", sale: "On sale only", sort: "Sort", sorts: { new: "Newest", low: "Price: low to high", high: "Price: high to low", name: "Name" }, filters: "Filters", clear: "Clear filters", empty: "No products match", count: "products" },
};
type Sort = "new" | "low" | "high" | "name";

export function ShopAll({ Card }: { Card: TemplateModule["Card"] }) {
  const { def, lang, L, num } = useStore(); const t = T[lang];
  const sp = useSearchParams();
  const all = useMemo(() => def.products.filter((p) => !p.hidden && !p.dup && (!def.merchant || p.srcId)), [def]);
  const brands = useMemo(() => [...new Set(all.map((p) => p.brand?.trim()).filter((b): b is string => !!b))].sort((a, b) => a.localeCompare(b, "ar")), [all]);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState<number | null>(sp.get("cat") !== null && sp.get("cat") !== "" ? Number(sp.get("cat")) : null);
  const [brand, setBrand] = useState<string[]>(sp.get("brand") ? [sp.get("brand")!] : []);
  const [min, setMin] = useState(""); const [max, setMax] = useState("");
  const [stock, setStock] = useState(false); const [sale, setSale] = useState(sp.get("sale") === "1");
  const [sort, setSort] = useState<Sort>((sp.get("sort") as Sort) || "new");
  const [open, setOpen] = useState(false);

  const counts = useMemo(() => { const m = new Map<number, number>(); all.forEach((p) => m.set(p.cat, (m.get(p.cat) ?? 0) + 1)); return m; }, [all]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase(); const lo = Number(min) || 0; const hi = Number(max) || 0;
    const r = all.filter((p) =>
      (!s || L(p.name).toLowerCase().includes(s) || L(p.desc).toLowerCase().includes(s) || (p.brand ?? "").toLowerCase().includes(s))
      && (cat === null || p.cat === cat)
      && (!brand.length || brand.includes(p.brand ?? ""))
      && (!lo || p.price >= lo) && (!hi || p.price <= hi)
      && (!stock || (p.stock ?? 1) > 0)
      && (!sale || (p.old ?? 0) > p.price));
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      new: () => 0, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, name: (a, b) => L(a.name).localeCompare(L(b.name), lang),
    };
    return sort === "new" ? r : [...r].sort(by[sort]);
  }, [all, q, cat, brand, min, max, stock, sale, sort, L, lang]);
  const active = cat !== null || brand.length > 0 || !!min || !!max || stock || sale || !!q.trim();
  const clear = () => { setQ(""); setCat(null); setBrand([]); setMin(""); setMax(""); setStock(false); setSale(false); };

  return (
    <div className="e-page e-shop">
      <div className="e-shop-top">
        <h1 className="t-h">{t.title} <small>({num(list.length)})</small></h1>
        <input className="e-shop-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t.sort}>
          {(Object.keys(t.sorts) as Sort[]).map((k) => <option key={k} value={k}>{t.sorts[k]}</option>)}
        </select>
        <button type="button" className="e-shop-ft" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{t.filters}{active ? " •" : ""}</button>
      </div>
      <div className="e-shop-body">
        <aside className={`e-shop-side ${open ? "open" : ""}`}>
          <fieldset><legend>{t.cats}</legend>
            <button type="button" className={cat === null ? "on" : ""} onClick={() => setCat(null)}>{t.all} <span>{num(all.length)}</span></button>
            {def.cats.map((c, i) => counts.get(i) ? <button type="button" key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)} <span>{num(counts.get(i)!)}</span></button> : null)}
          </fieldset>
          {brands.length > 0 && (
            <fieldset><legend>{t.brands}</legend>
              {brands.map((b) => (
                <label key={b} className="chk"><input type="checkbox" checked={brand.includes(b)} onChange={(e) => setBrand((x) => e.target.checked ? [...x, b] : x.filter((y) => y !== b))} /> {b}</label>
              ))}
            </fieldset>
          )}
          <fieldset><legend>{t.price}</legend>
            <div className="rng"><input type="number" min={0} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} placeholder={t.from} aria-label={t.from} /><input type="number" min={0} inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} placeholder={t.to} aria-label={t.to} /></div>
          </fieldset>
          <fieldset>
            <label className="chk"><input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} /> {t.stock}</label>
            <label className="chk"><input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} /> {t.sale}</label>
          </fieldset>
          {active && <button type="button" className="clr" onClick={clear}>{t.clear}</button>}
        </aside>
        <div className="e-shop-grid">
          {list.length ? <div className="t-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div> : <p className="e-shop-empty">{t.empty}</p>}
        </div>
      </div>
    </div>
  );
}
