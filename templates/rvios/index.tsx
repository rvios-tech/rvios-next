"use client";
/* «ريفيوس برو» — القالب الاحترافي المتكامل. كل نص يُقرأ بـ C(مفتاح) ويُعدَّل أو يُحذف من «شكل المتجر»،
   وكل صورة زخرفية <Img> تُستبدل أو تُحذف، والبيانات (المنتجات، التصنيفات، الأقسام، المفضلة،
   الحساب) من لوحة التاجر. يُكمله المحرّك بصفحات المنتج والسلة والإتمام والحساب المشتركة. */
import Link from "next/link";
import { useState } from "react";
import { StoreEmblem } from "@/components/site/StoreLogo";
import { Img } from "@/components/site/Img";
import { IconArrow, IconCart, IconHeart, IconSearch, IconX, IconChat, IconCheck } from "@/components/site/Icons";
import { SocialChips } from "@/components/store/StoreSocial";
import { scrollToEl } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";

const HERO_IMG = "1515886657613-9f3515b0c78f";
const PROMO_IMG = "1555041469-a586c61ea9bc";
const STORY_IMG = "1442512595331-e89e73853f31";

const I = {
  truck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>,
  cash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M7 9.5v5M17 9.5v5" /></svg>,
  swap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3" /></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19l1.4-3.6A8 8 0 1 1 8.6 18.6z" /></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z" /></svg>,
};

/** نص قابل للتعديل: يختفي عنصره إن حذفه التاجر (C يعيد نصًّا فارغًا) */
function T({ k, as: As = "span", className }: { k: string; as?: "span" | "p" | "h1" | "h2" | "h3" | "b" | "small"; className?: string }) {
  const { C } = useStore();
  const v = C(k);
  return v ? <As className={className} data-edit={`copy:${k}`}>{v}</As> : null;
}

export function Header() {
  const { def, L, t, setDrawer, count, num, base, wish, lang } = useStore();
  const ar = lang === "ar";
  const [open, setOpen] = useState(false);
  const logo = def.look?.logo;
  const wishes = wish.filter((id) => def.products.some((p) => p.id === id)).length;
  const links = [
    { href: base, label: ar ? "الرئيسية" : "Home" },
    { href: `${base}/shop`, label: ar ? "كل المنتجات" : "All products" },
    ...def.cats.slice(0, 4).map((c, i) => ({ href: `${base}/shop?cat=${i}`, label: L(c) })),
  ];
  return (
    <header className="r-hdr">
      <div className="r-hdr-in">
        <button className="r-ic r-menu" onClick={() => setOpen(true)} aria-label="menu">{I.menu}</button>
        <Link href={base} className="r-logo">
          {!def.look?.hidden.includes("logo") && <span data-edit="logo" className="r-logo-mk">{/* eslint-disable-next-line @next/next/no-img-element */}{logo ? <img src={logo} alt="" /> : <StoreEmblem slug={def.slug} size={40} color={def.accent} />}</span>}
          <b data-edit="name">{L(def.name)}</b>
        </Link>
        <nav className="r-nav">{links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}</nav>
        <div className="r-acts">
          <Link className="r-ic" href={`${base}/shop`} aria-label="search"><IconSearch /></Link>
          <Link className="r-ic" href={`${base}/wishlist`} aria-label={t.wishTitle}><IconHeart />{wishes > 0 && <span className="r-n">{num(wishes)}</span>}</Link>
          {def.merchant && def.accounts && <Link className="r-ic r-hide-sm" href={`${base}/account`} aria-label="account">{I.user}</Link>}
          <button className="r-ic r-cart" onClick={() => setDrawer(true)} aria-label={t.cart}><IconCart />{count > 0 && <span className="r-n">{num(count)}</span>}</button>
        </div>
      </div>
      <div className={`r-mnav ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <div className="r-mnav-p" onClick={(e) => e.stopPropagation()}>
          <button className="r-ic" onClick={() => setOpen(false)} aria-label="close"><IconX /></button>
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
          {def.merchant && def.accounts && <Link href={`${base}/account`} onClick={() => setOpen(false)}>{ar ? "حسابي" : "My account"}</Link>}
        </div>
      </div>
    </header>
  );
}

export function Card({ p, i = 0 }: { p: Product; i?: number }) {
  const { L, t, price, add, base, fb, badge, wish, toggleWish, def, lang } = useStore();
  const ar = lang === "ar";
  const off = p.old && p.old > p.price && !def.wholesale ? Math.round((1 - p.price / p.old) * 100) : 0;
  const out = p.stock === 0;
  const on = wish.includes(p.id);
  return (
    <article className="r-card" data-reveal data-edit={`product:${p.srcId ?? "sample"}`} style={{ ["--d" as string]: (i % 4) * 0.05 + "s" }}>
      <div className="r-cimg">
        <Link href={`${base}/p/${p.id}`} className="r-cimg-l"><Img id={p.img} w={700} fb={fb(p)} alt={L(p.name)} /></Link>
        <div className="r-tags">{off > 0 ? <span className="r-tag sale">−{off}%</span> : p.badge && <span className={`r-tag ${p.badge}`}>{badge(p.badge)}</span>}{out && <span className="r-tag out">{ar ? "نفد" : "Sold out"}</span>}</div>
        <button className={`r-wish ${on ? "on" : ""}`} onClick={() => toggleWish(p.id)} aria-label={t.wishAdd}><IconHeart filled={on} /></button>
      </div>
      <div className="r-cb">
        <h3><Link href={`${base}/p/${p.id}`}>{L(p.name)}</Link></h3>
        <div className="r-price"><b>{price(p.price)}</b>{p.old && !def.wholesale && p.old > p.price && <s>{price(p.old)}</s>}</div>
        <button className="r-add" disabled={out} onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}><IconCart />{out ? (ar ? "غير متوفر" : "Unavailable") : def.wholesale ? (ar ? "أضف للطلب" : "Add to request") : t.add}</button>
      </div>
    </article>
  );
}

export function Home() {
  const { def, L, C, t, cat, setCat, base, fb, lang } = useStore();
  const [tab, setTab] = useState<"all" | "new" | "sale">("all");
  const shown = (k: string) => !!C(k);
  const imgOn = (id: string) => !def.look?.hidden.includes(`img:${id}`);
  const live = def.products.filter((p) => !p.hidden && !p.dup);
  const best = (tab === "new" ? live.filter((p) => p.badge === "new") : tab === "sale" ? live.filter((p) => p.old && p.old > p.price) : live.filter((p) => p.badge === "best").concat(live.filter((p) => p.badge !== "best"))).slice(0, 8);
  const list = (cat == null ? live : live.filter((p) => p.cat === cat)).slice(0, 12);
  const feats = [["f1", I.truck], ["f2", I.cash], ["f3", I.swap], ["f4", I.chat]] as const;
  const faqs = [1, 2, 3, 4].filter((n) => shown(`q${n}`));
  const reviews = [1, 2, 3].filter((n) => shown(`rev${n}`));
  const ar = lang === "ar";
  const wa = def.whatsapp ? `https://wa.me/${def.whatsapp.replace(/\D/g, "")}` : "";
  return (
    <div className="r-home">
      {/* الواجهة */}
      <section className="r-hero">
        <div className="r-hero-c">
          <T k="heroTag" className="r-eyebrow" />
          <T k="h1" as="h1" className="t-h" />
          <T k="sub" as="p" className="r-lead" />
          <div className="r-btns">
            {shown("shop") && <Link className="r-btn" href={`${base}/shop`} data-edit="copy:shop">{C("shop")} <IconArrow /></Link>}
            {shown("cta2") && <a className="r-btn ghost" href="#r-cats" data-edit="copy:cta2" onClick={(e) => { e.preventDefault(); scrollToEl(document.getElementById("r-cats")); }}>{C("cta2")}</a>}
          </div>
          {(shown("stat1") || shown("stat2")) && <div className="r-stats">{shown("stat1") && <span><i>{I.star}</i><T k="stat1" /></span>}{shown("stat2") && <span><i>{I.truck}</i><T k="stat2" /></span>}</div>}
        </div>
        {imgOn(HERO_IMG) && <div className="r-hero-img"><Img id={HERO_IMG} w={1400} eager /></div>}
      </section>

      {/* الثقة */}
      {feats.some(([k]) => shown(`${k}t`)) && (
        <section className="r-feats">{feats.filter(([k]) => shown(`${k}t`)).map(([k, icon]) => (
          <div key={k} className="r-feat"><i>{icon}</i><div><T k={`${k}t`} as="b" /><T k={`${k}d`} as="small" /></div></div>
        ))}</section>
      )}

      {/* الأقسام */}
      {def.cats.length > 0 && shown("catsT") && (
        <section className="r-sec" id="r-cats">
          <div className="r-sh"><T k="catsT" as="h2" className="t-h" /></div>
          <div className="r-cats">{def.cats.map((c, i) => {
            const p = live.find((x) => x.cat === i);
            return (
              <button key={i} className="r-cat" onClick={() => { setCat(i); scrollToEl(document.getElementById("r-all")); }}>
                <span className="r-cat-img">{p ? <Img id={p.img} w={500} fb={fb(p)} /> : null}</span>
                <b>{L(c)}</b><small>{live.filter((x) => x.cat === i).length} {ar ? "منتج" : "items"}</small>
              </button>
            );
          })}</div>
        </section>
      )}

      {/* الأكثر طلبًا */}
      {shown("bestT") && best.length > 0 && (
        <section className="r-sec">
          <div className="r-sh">
            <div><T k="bestT" as="h2" className="t-h" /><T k="bestS" as="p" className="r-muted" /></div>
            <div className="r-tabs">{(["all", "new", "sale"] as const).map((k) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{k === "all" ? t.all : k === "new" ? t.newIn : t.sale}</button>)}</div>
          </div>
          <div className="r-grid">{best.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
        </section>
      )}

      {/* عرض */}
      {shown("promoT") && (
        <section className="r-sec">
          <div className="r-promo">
            {imgOn(PROMO_IMG) && <div className="r-promo-img"><Img id={PROMO_IMG} w={1600} /></div>}
            <div className="r-promo-c"><T k="promoTag" className="r-eyebrow light" /><T k="promoT" as="h2" className="t-h" /><T k="promoS" as="p" />{shown("promoCta") && <Link className="r-btn light" href={`${base}/shop`} data-edit="copy:promoCta">{C("promoCta")} <IconArrow /></Link>}</div>
          </div>
        </section>
      )}

      {/* وصل حديثًا — بالتصنيفات */}
      {shown("newT") && (
        <section className="r-sec" id="r-all">
          <div className="r-sh">
            <T k="newT" as="h2" className="t-h" />
            <div className="r-tabs scroll"><button className={cat == null ? "on" : ""} onClick={() => setCat(null)}>{t.all}</button>{def.cats.map((c, i) => <button key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)}</button>)}</div>
          </div>
          <div className="r-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
          <div className="r-more"><Link className="r-btn ghost" href={`${base}/shop`}>{ar ? "عرض كل المنتجات" : "View all products"} <IconArrow /></Link></div>
        </section>
      )}

      {/* القصة */}
      {(shown("story") || shown("storyTxt")) && (
        <section className="r-sec">
          <div className="r-story">
            {imgOn(STORY_IMG) && <div className="r-story-img"><Img id={STORY_IMG} w={1200} /></div>}
            <div className="r-story-c"><T k="story" as="h2" className="t-h" /><T k="storyTxt" as="p" className="r-lead" />
              <ul>{feats.filter(([k]) => shown(`${k}t`)).slice(0, 3).map(([k]) => <li key={k}><IconCheck width={16} />{C(`${k}t`)}</li>)}</ul>
            </div>
          </div>
        </section>
      )}

      {/* آراء */}
      {reviews.length > 0 && (
        <section className="r-sec">
          <div className="r-sh center"><T k="revT" as="h2" className="t-h" /></div>
          <div className="r-revs">{reviews.map((n) => <figure key={n} className="r-rev"><span className="r-stars">{I.star}{I.star}{I.star}{I.star}{I.star}</span><T k={`rev${n}`} as="p" /></figure>)}</div>
        </section>
      )}

      {/* أسئلة */}
      {faqs.length > 0 && (
        <section className="r-sec r-faq-s">
          <div className="r-sh center"><T k="faqT" as="h2" className="t-h" /></div>
          <div className="r-faq">{faqs.map((n) => <details key={n}><summary><T k={`q${n}`} /></summary><T k={`a${n}`} as="p" /></details>)}</div>
        </section>
      )}

      {/* واتساب */}
      {shown("waT") && (
        <section className="r-sec">
          <div className="r-wa"><div><T k="waT" as="h2" className="t-h" /><T k="waS" as="p" /></div>{wa && shown("waCta") && <a className="r-btn light" href={wa} target="_blank" rel="noopener noreferrer" data-edit="copy:waCta"><IconChat /> {C("waCta")}</a>}</div>
        </section>
      )}
    </div>
  );
}

export function Footer() {
  const { def, L, base, t, lang } = useStore();
  const ar = lang === "ar";
  const PAY: Record<string, string> = { cod: ar ? "الدفع عند الاستلام" : "Cash on delivery", wallet: ar ? "محفظة إلكترونية" : "E-wallet", bank: ar ? "تحويل بنكي" : "Bank transfer" };
  const pays = def.info?.payMethods ?? ["cod", "wallet", "bank"];
  const social = def.look?.social ?? {};
  return (
    <footer className="r-foot">
      <div className="r-foot-in">
        <div className="r-foot-b">
          <b data-edit="name">{L(def.name)}</b>
          <T k="footAbout" as="p" />
          {def.merchant && <SocialChips accounts={social} edit />}
        </div>
        <div><h4>{ar ? "تسوّق" : "Shop"}</h4><Link href={`${base}/shop`}>{ar ? "كل المنتجات" : "All products"}</Link>{def.cats.slice(0, 4).map((c, i) => <Link key={i} href={`${base}/shop?cat=${i}`}>{L(c)}</Link>)}</div>
        <div><h4>{ar ? "حسابك" : "Your account"}</h4><Link href={`${base}/wishlist`}>{t.wishTitle}</Link>{def.merchant && def.accounts && <Link href={`${base}/account`}>{ar ? "حسابي وطلباتي" : "My account & orders"}</Link>}<Link href={`${base}/checkout`}>{t.cart}</Link></div>
        <div><h4>{ar ? "تواصل" : "Contact"}</h4>{def.whatsapp && <a href={`https://wa.me/${def.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="ltr">+{def.whatsapp.replace(/\D/g, "")}</a>}<T k="city" as="span" /><div className="r-pays">{pays.map((m) => <span key={m}>{PAY[m] ?? m}</span>)}</div></div>
      </div>
      <div className="r-foot-bar"><span>© {new Date().getFullYear()} {L(def.name)}</span>{def.badge !== false && <a href="https://store.rvios.com" target="_blank" rel="noopener noreferrer">{t.builtWith} RVIOS</a>}</div>
    </footer>
  );
}
