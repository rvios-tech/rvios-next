"use client";
/* «ريفيوس برو» — القالب الاحترافي المتكامل. كل نص يُقرأ بـ C(مفتاح) ويُعدَّل أو يُحذف من «شكل المتجر»،
   وكل صورة زخرفية <Img> تُستبدل أو تُحذف، والبيانات (المنتجات، التصنيفات، العلامات، الأقسام، المفضلة،
   الحساب) من لوحة التاجر. يُكمله المحرّك بصفحات المنتج والأقسام ومن نحن والتواصل والسلة والحساب. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { StoreEmblem } from "@/components/site/StoreLogo";
import { Img } from "@/components/site/Img";
import { IconArrow, IconCart, IconHeart, IconSearch, IconX, IconChat, IconCheck } from "@/components/site/Icons";
import { useSite } from "@/components/site/Providers";
import { SocialChips } from "@/components/store/StoreSocial";
import { useLive } from "@/components/store/StorePages";
import { useCustomer } from "@/lib/store/customer";
import { useStore } from "@/lib/store/engine";
import type { Product } from "@/lib/store/types";

const HERO_IMG = "1515886657613-9f3515b0c78f";
const S2_IMG = "1490481651871-ab68de25d43d";
const S3_IMG = "1600166898405-da9535204843";
const B1_IMG = "1539109136881-3be0616acf4b";
const B2_IMG = "noir/4a01a733655ef6aece379e16f12ec4db";
const PROMO_IMG = "1555041469-a586c61ea9bc";
const STORY_IMG = "1442512595331-e89e73853f31";

const I = {
  truck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>,
  cash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M7 9.5v5M17 9.5v5" /></svg>,
  swap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3" /></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19l1.4-3.6A8 8 0 1 1 8.6 18.6z" /></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z" /></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>,
  chev: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z" /></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>,
};

/** نص قابل للتعديل: يختفي عنصره إن حذفه التاجر (C يعيد نصًّا فارغًا) */
function T({ k, as: As = "span", className }: { k: string; as?: "span" | "p" | "h1" | "h2" | "h3" | "b" | "small"; className?: string }) {
  const { C } = useStore();
  const v = C(k);
  return v ? <As className={className} data-edit={`copy:${k}`}>{v}</As> : null;
}
const waLink = (n?: string) => (n ? `https://wa.me/${n.replace(/\D/g, "")}` : "");

export function Header() {
  const { def, L, C, t, setDrawer, count, num, base, wish, lang, fb } = useStore();
  const { toggleLang } = useSite();
  const router = useRouter();
  const ar = lang === "ar";
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [q, setQ] = useState("");
  const live = useLive();
  const acc = useCustomer(def.slug, !!(def.merchant && def.accounts));
  const logo = def.look?.logo;
  const wishes = wish.filter((id) => def.products.some((p) => p.id === id)).length;
  const cats = def.cats.map((c, i) => ({ c, i, items: live.filter((p) => p.cat === i) })).filter((x) => x.items.length);
  const links = [
    { href: base, label: ar ? "الرئيسية" : "Home" },
    { href: `${base}/shop`, label: ar ? "تسوّق" : "Shop" },
    { href: `${base}/shop?sale=1`, label: ar ? "العروض" : "Deals" },
    { href: `${base}/about`, label: ar ? "من نحن" : "About" },
    { href: `${base}/contact`, label: ar ? "تواصل معنا" : "Contact" },
  ];
  const search = (e: React.FormEvent) => { e.preventDefault(); setOpen(false); router.push(`${base}/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`); };
  const wa = def.whatsapp?.replace(/\D/g, "");
  const accounts = def.merchant ? def.accounts : true;
  const searchBox = (cls: string) => (
    <form className={cls} onSubmit={search} role="search">
      <IconSearch /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ar ? "ابحث عن منتج، قسم، أو علامة…" : "Search products, categories, brands…"} aria-label={ar ? "بحث" : "Search"} />
      <button type="submit">{ar ? "بحث" : "Search"}</button>
    </form>
  );
  return (
    <header className="r-hdr">
      {C("topNote") && (
        <div className="r-top"><div className="r-top-in">
          <T k="topNote" className="r-top-note" />
          <div className="r-top-l">
            {wa && <a href={waLink(wa)} target="_blank" rel="noopener noreferrer" className="ltr">{I.phone} +{wa}</a>}
            <Link href={`${base}/about`}>{ar ? "من نحن" : "About"}</Link>
            <Link href={`${base}/contact`}>{ar ? "تواصل" : "Contact"}</Link>
            <button type="button" onClick={toggleLang}>{ar ? "English" : "العربية"}</button>
          </div>
        </div></div>
      )}
      <div className="r-hdr-in">
        <button className="r-ic r-menu" onClick={() => setOpen(true)} aria-label="menu">{I.menu}</button>
        <Link href={base} className="r-logo">
          {!def.look?.hidden.includes("logo") && <span data-edit="logo" className="r-logo-mk">{/* eslint-disable-next-line @next/next/no-img-element */}{logo ? <img src={logo} alt="" /> : <StoreEmblem slug={def.slug} size={42} color={def.accent} />}</span>}
          <b data-edit="name">{L(def.name)}</b>
        </Link>
        {searchBox("r-search")}
        <div className="r-acts">
          {accounts && (
            def.merchant && acc.me
              ? <Link className="r-acc on" href={`${base}/account`}>{I.user}<span>{acc.me.name || (ar ? "حسابي" : "Account")}</span>{acc.unread > 0 && <em>{num(acc.unread)}</em>}</Link>
              : <Link className="r-acc" href={def.merchant ? `${base}/account` : `${base}/contact`}>{I.user}<span>{ar ? "تسجيل الدخول" : "Sign in"}</span></Link>
          )}
          <Link className="r-ic r-hide-sm" href={`${base}/wishlist`} aria-label={t.wishTitle}><IconHeart />{wishes > 0 && <span className="r-n">{num(wishes)}</span>}</Link>
          <button className="r-ic r-cart" onClick={() => setDrawer(true)} aria-label={t.cart}><IconCart />{count > 0 && <span className="r-n">{num(count)}</span>}</button>
        </div>
      </div>
      {searchBox("r-search sm")}
      <nav className="r-nav" onMouseLeave={() => setMega(false)}>
        <div className="r-nav-in">
          {cats.length > 0 && <button type="button" className={`r-allcats ${mega ? "on" : ""}`} onMouseEnter={() => setMega(true)} onClick={() => setMega((m) => !m)} aria-expanded={mega}>{I.grid} {ar ? "كل الأقسام" : "All categories"}</button>}
          {links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          {cats.slice(0, 3).map(({ c, i }) => <Link key={`c${i}`} href={`${base}/shop?cat=${i}`} className="r-nav-cat">{L(c)}</Link>)}
        </div>
        {mega && cats.length > 0 && (
          <div className="r-mega" onClick={() => setMega(false)}>
            <div className="r-mega-in">
              <div className="r-mega-g">
                {cats.map(({ c, i, items }) => (
                  <Link key={i} href={`${base}/shop?cat=${i}`} className="r-mega-c">
                    <span className="r-mega-im"><Img id={items[0].img} w={200} fb={fb(items[0])} alt="" /></span>
                    <span><b>{L(c)}</b><small>{num(items.length)} {ar ? "منتج" : "items"}</small></span>
                  </Link>
                ))}
              </div>
              <Link href={`${base}/categories`} className="r-mega-all">{ar ? "عرض كل الأقسام" : "View all categories"} <IconArrow /></Link>
            </div>
          </div>
        )}
      </nav>
      <div className={`r-mnav ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <div className="r-mnav-p" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
          <div className="r-mnav-h"><b>{L(def.name)}</b><button className="r-ic" onClick={() => setOpen(false)} aria-label="close"><IconX /></button></div>
          {searchBox("r-search in")}
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
          {cats.length > 0 && <small className="r-mnav-t">{ar ? "الأقسام" : "Categories"}</small>}
          {cats.map(({ c, i, items }) => <Link key={`m${i}`} href={`${base}/shop?cat=${i}`} onClick={() => setOpen(false)} className="r-mnav-c"><span className="r-mega-im"><Img id={items[0].img} w={120} fb={fb(items[0])} alt="" /></span>{L(c)}</Link>)}
          {def.merchant && def.accounts && <Link href={`${base}/account`} onClick={() => setOpen(false)}>{ar ? "حسابي وطلباتي" : "My account"}</Link>}
          <button type="button" className="r-mnav-lang" onClick={toggleLang}>{ar ? "English" : "العربية"}</button>
        </div>
      </div>
    </header>
  );
}

export function Card({ p, i = 0 }: { p: Product; i?: number }) {
  const { L, t, price, add, base, fb, badge, wish, toggleWish, def, lang, setQuick } = useStore();
  const ar = lang === "ar";
  const off = p.old && p.old > p.price && !def.wholesale ? Math.round((1 - p.price / p.old) * 100) : 0;
  const out = p.stock === 0;
  const on = wish.includes(p.id);
  return (
    <article className="r-card" data-reveal data-edit={`product:${p.srcId ?? "sample"}`} style={{ ["--d" as string]: (i % 4) * 0.06 + "s" }}>
      <div className="r-cimg">
        <Link href={`${base}/p/${p.id}`} className="r-cimg-l"><Img id={p.img} w={700} fb={fb(p)} alt={L(p.name)} /></Link>
        <div className="r-tags">{off > 0 ? <span className="r-tag sale">−{off}%</span> : p.badge && <span className={`r-tag ${p.badge}`}>{badge(p.badge)}</span>}{out && <span className="r-tag out">{ar ? "نفد" : "Sold out"}</span>}</div>
        <div className="r-cacts">
          <button className={`r-wish ${on ? "on" : ""}`} onClick={() => toggleWish(p.id)} aria-label={t.wishAdd}><IconHeart filled={on} /></button>
          <button className="r-wish" onClick={() => setQuick(p.id)} aria-label={ar ? "عرض سريع" : "Quick view"} title={ar ? "عرض سريع" : "Quick view"}>{I.eye}</button>
        </div>
        <button className="r-quick" onClick={() => setQuick(p.id)}>{I.eye} {ar ? "عرض سريع" : "Quick view"}</button>
      </div>
      <div className="r-cb">
        {p.brand ? <small className="r-cbrand">{p.brand}</small> : def.cats[p.cat] && <small className="r-cbrand">{L(def.cats[p.cat])}</small>}
        <h3><Link href={`${base}/p/${p.id}`}>{L(p.name)}</Link></h3>
        <div className="r-price"><b>{price(p.price)}</b>{p.old && !def.wholesale && p.old > p.price && <s>{price(p.old)}</s>}</div>
        <button className="r-add" disabled={out} onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}><IconCart />{out ? (ar ? "غير متوفر" : "Unavailable") : def.wholesale ? (ar ? "أضف للطلب" : "Add to request") : t.add}</button>
      </div>
    </article>
  );
}

/** الواجهة المتحركة: شرائح بصورة ونص وزر، تتبدّل وحدها، وتتوقف عند المرور أو بالزر، وتُسحب باللمس */
function Hero() {
  const { C, base, lang } = useStore();
  const ar = lang === "ar";
  const slides = [
    { tag: "heroTag", t: "h1", s: "sub", cta: "shop", img: HERO_IMG, href: `${base}/shop` },
    { tag: "s2Tag", t: "s2T", s: "s2S", cta: "s2Cta", img: S2_IMG, href: `${base}/shop?sort=new` },
    { tag: "s3Tag", t: "s3T", s: "s3S", cta: "s3Cta", img: S3_IMG, href: `${base}/categories` },
  ].filter((x) => !!C(x.t));
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const x0 = useRef<number | null>(null);
  const n = slides.length;
  const i = n ? cur % n : 0;
  useEffect(() => {
    if (paused || hover || n < 2) return;
    const id = setTimeout(() => setCur((c) => (c + 1) % n), 6500);
    return () => clearTimeout(id);
  }, [cur, paused, hover, n]);
  if (!n) return null;
  const go = (d: number) => setCur((c) => (c + d + n) % n);
  return (
    <section className={`r-hero ${paused || hover ? "paused" : ""}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { if (x0.current == null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 50) go((dx < 0 ? 1 : -1) * (ar ? -1 : 1)); }}
      aria-roledescription="carousel">
      {slides.map((s, k) => (
        <div key={s.t} className={`r-slide ${k === i ? "on" : ""}`} aria-hidden={k !== i}>
          <div className="r-slide-bg"><Img id={s.img} w={1800} eager={k === 0} /></div>
          <div className="r-slide-c">
            <T k={s.tag} className="r-eyebrow light" />
            {k === 0 ? <T k={s.t} as="h1" className="t-h" /> : <T k={s.t} as="h2" className="t-h" />}
            <T k={s.s} as="p" className="r-lead" />
            {C(s.cta) && <Link className="r-btn" href={s.href} data-edit={`copy:${s.cta}`} tabIndex={k === i ? 0 : -1}>{C(s.cta)} <IconArrow /></Link>}
            {k === 0 && (C("stat1") || C("stat2")) && <div className="r-stats">{C("stat1") && <span><i>{I.star}</i><T k="stat1" /></span>}{C("stat2") && <span><i>{I.truck}</i><T k="stat2" /></span>}</div>}
          </div>
        </div>
      ))}
      {n > 1 && (
        <div className="r-hero-ctl">
          <button type="button" className="r-arw prev" onClick={() => go(-1)} aria-label={ar ? "السابق" : "Previous"}>{I.chev}</button>
          <div className="r-dots">{slides.map((s, k) => <button key={s.t} type="button" className={k === i ? "on" : ""} onClick={() => setCur(k)} aria-label={String(k + 1)}><i key={k === i ? cur : -1} /></button>)}</div>
          <button type="button" className="r-arw next" onClick={() => go(1)} aria-label={ar ? "التالي" : "Next"}>{I.chev}</button>
          <button type="button" className="r-arw" onClick={() => setPaused((p) => !p)} aria-label={paused ? "play" : "pause"}>{paused ? I.play : I.pause}</button>
        </div>
      )}
    </section>
  );
}

/** عدّاد حتى نهاية اليوم — يُرسم في المتصفح وحده (لا يختلف عن نسخة الخادم) */
function Countdown() {
  const { num } = useStore();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => { const d = new Date(); const end = new Date(d); end.setHours(24, 0, 0, 0); setLeft(Math.max(0, Math.floor((end.getTime() - d.getTime()) / 1000))); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  if (left == null) return null;
  const parts = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60];
  return <span className="r-cd">{parts.map((v, k) => <b key={k}>{num(v).padStart(2, num(0))}</b>)}</span>;
}

/** شريط منتجات يمرّ أفقيًا بأسهم */
function Row({ items }: { items: Product[] }) {
  const { lang } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const by = (d: number) => { const el = ref.current; if (!el) return; el.scrollBy({ left: d * el.clientWidth * 0.8 * (lang === "ar" ? -1 : 1), behavior: "smooth" }); };
  return (
    <div className="r-rowwrap">
      <button type="button" className="r-arw prev" onClick={() => by(-1)} aria-label="prev">{I.chev}</button>
      <div className="r-row" ref={ref} data-lenis-prevent>{items.map((p, k) => <div key={p.id} className="r-row-it"><Card p={p} i={k} /></div>)}</div>
      <button type="button" className="r-arw next" onClick={() => by(1)} aria-label="next">{I.chev}</button>
    </div>
  );
}

export function Home() {
  const { def, L, C, t, cat, setCat, base, fb, lang, num } = useStore();
  const [tab, setTab] = useState<"all" | "new" | "sale">("all");
  const shown = (k: string) => !!C(k);
  const imgOn = (id: string) => !def.look?.hidden.includes(`img:${id}`);
  const live = useLive();
  const ar = lang === "ar";
  const best = (tab === "new" ? live.filter((p) => p.badge === "new") : tab === "sale" ? live.filter((p) => p.old && p.old > p.price) : live.filter((p) => p.badge === "best").concat(live.filter((p) => p.badge !== "best"))).slice(0, 8);
  const deals = def.wholesale ? [] : live.filter((p) => p.old && p.old > p.price);
  const list = (cat == null ? live : live.filter((p) => p.cat === cat)).slice(0, 12);
  const cats = def.cats.map((c, i) => ({ c, i, items: live.filter((p) => p.cat === i) })).filter((x) => x.items.length);
  const brands = useMemo(() => [...new Set(live.map((p) => p.brand?.trim()).filter((b): b is string => !!b))], [live]);
  const feats = [["f1", I.truck], ["f2", I.cash], ["f3", I.swap], ["f4", I.chat]] as const;
  const faqs = [1, 2, 3, 4].filter((n) => shown(`q${n}`));
  const reviews = [1, 2, 3].filter((n) => shown(`rev${n}`));
  const wa = waLink(def.whatsapp);
  const accounts = def.merchant ? def.accounts : true;
  return (
    <div className="r-home">
      <Hero />

      {/* الثقة */}
      {feats.some(([k]) => shown(`${k}t`)) && (
        <section className="r-feats">{feats.filter(([k]) => shown(`${k}t`)).map(([k, icon], n) => (
          <div key={k} className="r-feat" data-reveal style={{ ["--d" as string]: n * 0.06 + "s" }}><i>{icon}</i><div><T k={`${k}t`} as="b" /><T k={`${k}d`} as="small" /></div></div>
        ))}</section>
      )}

      {/* الأقسام بدوائر */}
      {cats.length > 0 && shown("catsT") && (
        <section className="r-sec" id="r-cats">
          <div className="r-sh"><T k="catsT" as="h2" className="t-h" /><Link className="r-link" href={`${base}/categories`}>{ar ? "كل الأقسام" : "All categories"} <IconArrow /></Link></div>
          <div className="r-circles" data-lenis-prevent>{cats.map(({ c, i, items }, n) => (
            <Link key={i} href={`${base}/shop?cat=${i}`} className="r-circle" data-reveal style={{ ["--d" as string]: n * 0.05 + "s" }}>
              <span className="r-circle-im"><Img id={items[0].img} w={360} fb={fb(items[0])} alt="" /></span>
              <b>{L(c)}</b><small>{num(items.length)} {ar ? "منتج" : "items"}</small>
            </Link>
          ))}</div>
        </section>
      )}

      {/* عروض اليوم بعدّاد */}
      {shown("dealT") && deals.length > 0 && (
        <section className="r-sec">
          <div className="r-deal-h">
            <div className="r-deal-t"><i>{I.bolt}</i><T k="dealT" as="h2" className="t-h" /></div>
            {shown("dealEnd") && <div className="r-deal-cd"><T k="dealEnd" /><Countdown /></div>}
            <Link className="r-link" href={`${base}/shop?sale=1`}>{ar ? "كل العروض" : "All deals"} <IconArrow /></Link>
          </div>
          <Row items={deals} />
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

      {/* بانران متجاوران */}
      {(shown("b1T") || shown("b2T")) && (
        <section className="r-sec r-duo">
          {[["b1", B1_IMG, `${base}/shop?cat=0`], ["b2", B2_IMG, `${base}/shop?cat=${Math.min(3, Math.max(0, def.cats.length - 1))}`]].filter(([k]) => shown(`${k}T`)).map(([k, img, href]) => (
            <Link key={k} href={href} className="r-duo-b" data-reveal>
              {imgOn(img) && <div className="r-duo-im"><Img id={img} w={1200} /></div>}
              <div className="r-duo-c"><T k={`${k}Tag`} className="r-eyebrow light" /><T k={`${k}T`} as="h3" className="t-h" />{shown(`${k}Cta`) && <span className="r-duo-cta" data-edit={`copy:${k}Cta`}>{C(`${k}Cta`)} <IconArrow /></span>}</div>
            </Link>
          ))}
        </section>
      )}

      {/* عرض كبير */}
      {shown("promoT") && (
        <section className="r-sec">
          <div className="r-promo">
            {imgOn(PROMO_IMG) && <div className="r-promo-img" data-speed="0.92"><Img id={PROMO_IMG} w={1800} /></div>}
            <div className="r-promo-c" data-reveal><T k="promoTag" className="r-eyebrow light" /><T k="promoT" as="h2" className="t-h" /><T k="promoS" as="p" />{shown("promoCta") && <Link className="r-btn light" href={`${base}/shop?sale=1`} data-edit="copy:promoCta">{C("promoCta")} <IconArrow /></Link>}</div>
          </div>
        </section>
      )}

      {/* وصل حديثًا — بالتصنيفات */}
      {shown("newT") && (
        <section className="r-sec" id="r-all">
          <div className="r-sh">
            <T k="newT" as="h2" className="t-h" />
            <div className="r-tabs scroll"><button className={cat == null ? "on" : ""} onClick={() => setCat(null)}>{t.all}</button>{cats.map(({ c, i }) => <button key={i} className={cat === i ? "on" : ""} onClick={() => setCat(i)}>{L(c)}</button>)}</div>
          </div>
          <div className="r-grid">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
          <div className="r-more"><Link className="r-btn ghost" href={`${base}/shop`}>{ar ? "عرض كل المنتجات" : "View all products"} <IconArrow /></Link></div>
        </section>
      )}

      {/* العلامات التجارية — شريط متحرك */}
      {shown("brandsT") && brands.length > 1 && (
        <section className="r-sec r-brands">
          <div className="r-sh center"><T k="brandsT" as="h2" className="t-h" /></div>
          <div className="r-marq"><div className="r-marq-t">{[0, 1].map((r) => <div key={r} className="r-marq-h" aria-hidden={r === 1}>{[...brands, ...brands, ...brands].slice(0, Math.max(8, brands.length)).map((b, k) => <Link key={k} href={`${base}/shop?brand=${encodeURIComponent(b)}`} className="r-brand" tabIndex={r ? -1 : 0}>{b}</Link>)}</div>)}</div></div>
        </section>
      )}

      {/* القصة */}
      {(shown("story") || shown("storyTxt")) && (
        <section className="r-sec">
          <div className="r-story">
            {imgOn(STORY_IMG) && <div className="r-story-img" data-reveal><Img id={STORY_IMG} w={1200} /></div>}
            <div className="r-story-c" data-reveal><T k="story" as="h2" className="t-h" /><T k="storyTxt" as="p" className="r-lead" />
              <ul>{feats.filter(([k]) => shown(`${k}t`)).slice(0, 3).map(([k]) => <li key={k}><IconCheck width={16} />{C(`${k}t`)}</li>)}</ul>
              <Link className="r-btn ghost" href={`${base}/about`}>{ar ? "اعرف المزيد عنّا" : "More about us"} <IconArrow /></Link>
            </div>
          </div>
        </section>
      )}

      {/* آراء — شريط متحرك */}
      {reviews.length > 0 && (
        <section className="r-sec">
          <div className="r-sh center"><T k="revT" as="h2" className="t-h" /></div>
          <div className="r-marq slow"><div className="r-marq-t">{[0, 1].map((r) => <div key={r} className="r-marq-h" aria-hidden={r === 1}>{[...reviews, ...reviews].map((n, k) => <figure key={k} className="r-rev"><span className="r-stars">{I.star}{I.star}{I.star}{I.star}{I.star}</span>{r === 0 && k < reviews.length ? <T k={`rev${n}`} as="p" /> : <p>{C(`rev${n}`)}</p>}</figure>)}</div>)}</div></div>
        </section>
      )}

      {/* أسئلة */}
      {faqs.length > 0 && (
        <section className="r-sec r-faq-s">
          <div className="r-sh center"><T k="faqT" as="h2" className="t-h" /></div>
          <div className="r-faq">{faqs.map((n) => <details key={n}><summary><T k={`q${n}`} /></summary><T k={`a${n}`} as="p" /></details>)}</div>
        </section>
      )}

      {/* ابقَ على اتصال: الحساب وواتساب */}
      {(shown("joinT") || shown("waT")) && (
        <section className="r-sec">
          <div className="r-join" data-reveal>
            <span className="r-join-o" aria-hidden /><span className="r-join-o b" aria-hidden />
            <div>{accounts && shown("joinT") ? <><T k="joinT" as="h2" className="t-h" /><T k="joinS" as="p" /></> : <><T k="waT" as="h2" className="t-h" /><T k="waS" as="p" /></>}</div>
            <div className="r-join-b">
              {accounts && shown("joinCta") && <Link className="r-btn light" href={def.merchant ? `${base}/account` : `${base}/contact`} data-edit="copy:joinCta">{I.user} {C("joinCta")}</Link>}
              {wa && shown("waCta") && <a className="r-btn glass" href={wa} target="_blank" rel="noopener noreferrer" data-edit="copy:waCta"><IconChat /> {C("waCta")}</a>}
            </div>
          </div>
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
  const live = useLive();
  const cats = def.cats.map((c, i) => ({ c, i })).filter(({ i }) => live.some((p) => p.cat === i)).slice(0, 5);
  const wa = def.whatsapp?.replace(/\D/g, "");
  return (
    <footer className="r-foot">
      <div className="r-foot-in">
        <div className="r-foot-b">
          <b data-edit="name">{L(def.name)}</b>
          <T k="footAbout" as="p" />
          {def.merchant && <SocialChips accounts={social} edit />}
        </div>
        <div><h4>{ar ? "تسوّق" : "Shop"}</h4><Link href={`${base}/shop`}>{ar ? "كل المنتجات" : "All products"}</Link><Link href={`${base}/shop?sale=1`}>{ar ? "العروض" : "Deals"}</Link>{cats.map(({ c, i }) => <Link key={i} href={`${base}/shop?cat=${i}`}>{L(c)}</Link>)}</div>
        <div><h4>{ar ? "المتجر" : "Store"}</h4><Link href={`${base}/about`}>{ar ? "من نحن" : "About us"}</Link><Link href={`${base}/categories`}>{ar ? "الأقسام" : "Categories"}</Link><Link href={`${base}/contact`}>{ar ? "تواصل معنا" : "Contact us"}</Link><Link href={`${base}/wishlist`}>{t.wishTitle}</Link>{def.merchant && def.accounts && <Link href={`${base}/account`}>{ar ? "حسابي وطلباتي" : "My account & orders"}</Link>}</div>
        <div><h4>{ar ? "تواصل" : "Contact"}</h4>{wa && <a href={waLink(wa)} target="_blank" rel="noopener noreferrer" className="ltr">+{wa}</a>}<T k="city" as="span" /><div className="r-pays">{pays.map((m) => <span key={m}>{PAY[m] ?? m}</span>)}</div></div>
      </div>
      <div className="r-foot-bar"><span>© {new Date().getFullYear()} {L(def.name)}</span>{def.badge !== false && <a href="https://store.rvios.com" target="_blank" rel="noopener noreferrer">{t.builtWith} RVIOS</a>}</div>
    </footer>
  );
}
