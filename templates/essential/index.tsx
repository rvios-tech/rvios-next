"use client";
import { StoreEmblem } from "@/components/site/StoreLogo";
import Link from "next/link";
import { Img } from "@/components/site/Img";
import { IconArrow, IconCart } from "@/components/site/Icons";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";

/** The free template: neutral and warm, takes the merchant's own colors. */
export function Header() {
  const { def, L, t, setDrawer, count, num, base, setCat } = useStore();
  return (
    <header className="x-hdr"><Link href={base} className="x-logo"><StoreEmblem slug={def.slug} size={38} color={def.accent} /><b>{L(def.name)}</b></Link>
      <nav className="x-nav">{def.cats.map((c, i) => <Link key={i} href={base} onClick={() => setCat(i)}>{L(c)}</Link>)}</nav>
      <button className="icb x-cart" onClick={() => setDrawer(true)} aria-label={t.cart}><IconCart />{count > 0 && <span className="n">{num(count)}</span>}</button></header>
  );
}
export function Footer() {
  const { def, L, C } = useStore();
  return <footer className="x-foot"><b>{L(def.name)}</b><span>{C("city")}</span></footer>;
}
export function Card({ p, i = 0 }: { p: Product; i?: number }) {
  const { L, t, price, add, base, fb, badge } = useStore();
  return (
    <article className="x-card" data-reveal style={{ ["--d" as string]: (i % 3) * 0.06 + "s" }}>
      <Link href={`${base}/p/${p.id}`} className="x-ci"><Img id={p.img} w={700} fb={fb(p)} />{p.badge && <span className={`x-tag ${p.badge}`}>{badge(p.badge)}</span>}</Link>
      <h3><Link href={`${base}/p/${p.id}`}>{L(p.name)}</Link></h3>
      <div className="x-row"><b>{price(p.price)}{p.old && <> <s>{price(p.old)}</s></>}</b><button onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}>{t.add}</button></div>
    </article>
  );
}
export function Home() {
  const { def, L, C, t, cat, setCat } = useStore();
  const list = cat == null ? def.products : def.products.filter((p) => p.cat === cat);
  return (
    <>
      <section className="x-hero"><div className="x-hero-img"><Img id="1442512595331-e89e73853f31" w={1800} eager data-speed="1" /></div>
        <div className="x-hero-c"><h1 className="t-h" data-split>{C("h1")}</h1><p data-reveal>{C("sub")}</p><a href="#xg" className="e-btn mag" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("xg")); }}>{C("shop")} <IconArrow /></a></div></section>
      <section className="x-sec" id="xg"><div className="x-h"><h2 className="t-h" data-split>{C("prods")}</h2>
        <div className="x-chips"><button className={cat == null ? "on" : ""} onClick={() => setCat(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)}</button>)}</div></div>
        <div className="x-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div></section>
      <section className="x-sec"><div className="x-story"><div data-clip><Img id="1511537190424-bbbab87ac5eb" w={1200} /></div><div><h2 className="t-h" data-split>{C("story")}</h2><p data-reveal>{C("storyTxt")}</p></div></div></section>
    </>
  );
}
