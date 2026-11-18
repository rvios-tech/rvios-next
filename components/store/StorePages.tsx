"use client";
/* صفحات وأجزاء مشتركة يأخذها كل قالب فوق تصميمه: «الأقسام»، «من نحن»، «تواصل معنا»، الشريط السفلي
   للجوال، «العرض السريع» للمنتج، ومسار التنقّل وروابط الصفحات. تُلوَّن بمتغيّرات القالب نفسه
   (--acc، --ink، --bg)، فتبدو جزءًا منه في القوالب كلها. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLenis } from "@/lib/lenis";
import { useStore } from "@/lib/store/engine";
import { useCustomer } from "@/lib/store/customer";
import type { Product } from "@/lib/store/types";
import { Img } from "../site/Img";
import { IconArrow, IconBag, IconCheck, IconHeart, IconX } from "../site/Icons";
import { SOCIAL_ICONS } from "../site/SocialIcons";

const T = {
  ar: {
    home: "الرئيسية", shop: "تسوّق", cats: "الأقسام", catsSub: "تصفّح منتجات المتجر حسب القسم", items: "منتج", about: "من نحن", contact: "تواصل معنا",
    wish: "المفضلة", cart: "السلة", account: "حسابي", login: "دخول", products: "المنتجات", browse: "تصفّح المنتجات",
    aboutTag: "قصتنا", aboutFallback: (n: string) => `${n} — متجر يجمع لك منتجات مختارة بعناية، بأسعار واضحة وخدمة تتابعك حتى يصلك طلبك.`,
    stP: "منتج متاح", stC: "قسم", stS: "دعم مباشر", why: "لماذا تتسوّق معنا؟",
    feats: [["توصيل سريع", "نوصل طلبك إلى باب بيتك"], ["دفع مرن", "عند الاستلام أو بالمحفظة والتحويل"], ["استبدال سهل", "نقف معك بعد الشراء"], ["دعم حقيقي", "فريق يرد عليك على واتساب"]],
    cTitle: "تواصل معنا", cSub: "يسعدنا سؤالك — راسلنا وسنرد عليك في أقرب وقت.", wa: "واتساب", call: "اتصال", addr: "العنوان", hours: "أوقات العمل",
    fName: "اسمك", fPhone: "رقم جوالك", fMsg: "رسالتك", fSend: "أرسل عبر واتساب", fNeed: "اكتب رسالتك أولًا", fHi: "مرحبًا، أنا",
    qv: "عرض سريع", full: "التفاصيل الكاملة", added: "أُضيفت للسلة", off: "خصم", share: "مشاركة", copied: "نُسخ الرابط", buyNow: "أضف للسلة",
  },
  en: {
    home: "Home", shop: "Shop", cats: "Categories", catsSub: "Browse the store by category", items: "items", about: "About us", contact: "Contact us",
    wish: "Wishlist", cart: "Cart", account: "Account", login: "Sign in", products: "Products", browse: "Browse products",
    aboutTag: "Our story", aboutFallback: (n: string) => `${n} — a store of hand-picked products, clear prices and service that follows up until your order arrives.`,
    stP: "products", stC: "categories", stS: "live support", why: "Why shop with us?",
    feats: [["Fast delivery", "To your door"], ["Flexible payment", "On delivery, wallet or transfer"], ["Easy exchange", "We stand by every order"], ["Real support", "A team that replies on WhatsApp"]],
    cTitle: "Contact us", cSub: "We'd love to hear from you — message us and we'll reply shortly.", wa: "WhatsApp", call: "Call", addr: "Address", hours: "Opening hours",
    fName: "Your name", fPhone: "Your phone", fMsg: "Your message", fSend: "Send via WhatsApp", fNeed: "Write your message first", fHi: "Hi, I'm",
    qv: "Quick view", full: "Full details", added: "Added to cart", off: "off", share: "Share", copied: "Link copied", buyNow: "Add to cart",
  },
};
const useT = () => T[useStore().lang];

/** المنتجات المعروضة للزائر: بلا المخفي والمكرّر، وبلا عيّنات القالب في متجر تاجر له منتجات */
export function useLive() {
  const { def } = useStore();
  return useMemo(() => def.products.filter((p) => !p.hidden && !p.dup && (!def.merchant || p.srcId || !def.products.some((x) => x.srcId))), [def]);
}
const waNum = (s?: string) => (s ?? "").replace(/\D/g, "");

/** مسار التنقّل أعلى الصفحات الداخلية */
export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { base } = useStore(); const t = useT();
  const all = [{ label: t.home, href: base }, ...items];
  return (
    <nav className="e-crumbs" aria-label="breadcrumb">
      {all.map((c, i) => <span key={i}>{c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}{i < all.length - 1 && <i aria-hidden>/</i>}</span>)}
    </nav>
  );
}

/** «الأقسام»: كل تصنيفات المتجر بصورة أول منتج فيها وعدد منتجاتها */
export function CategoriesPage() {
  const { def, L, base, fb, num } = useStore(); const t = useT();
  const live = useLive();
  const cats = def.cats.map((c, i) => ({ c, i, items: live.filter((p) => p.cat === i) })).filter((x) => x.items.length);
  return (
    <div className="e-page e-cats-page">
      <Crumbs items={[{ label: t.cats }]} />
      <header className="e-ph"><h1 className="t-h">{t.cats}</h1><p>{t.catsSub}</p></header>
      <div className="e-catgrid">
        {cats.map(({ c, i, items }, k) => (
          <Link key={i} href={`${base}/shop?cat=${i}`} className="e-catcard" data-reveal style={{ ["--d" as string]: (k % 4) * 0.06 + "s" }}>
            <span className="e-catcard-im">{items.slice(0, 3).map((p, j) => <Img key={p.id} id={p.img} w={600} fb={fb(p)} className={`e-ci${j}`} alt="" />)}</span>
            <span className="e-catcard-b"><b>{L(c)}</b><small>{num(items.length)} {t.items}</small><i aria-hidden><IconArrow /></i></span>
          </Link>
        ))}
      </div>
      <div className="e-allp"><Link className="e-btn" href={`${base}/shop`}>{t.browse} <IconArrow /></Link></div>
    </div>
  );
}

/** «من نحن»: نبذة المتجر، أرقامه، ولماذا يختاره العملاء */
export function AboutPage() {
  const { def, L, C, base, num, fb } = useStore(); const t = useT();
  const live = useLive();
  const about = (def.merchant && def.info?.about) || C("storyTxt") || C("about") || t.aboutFallback(L(def.name));
  const pics = live.slice(0, 3);
  const cats = def.cats.filter((_, i) => live.some((p) => p.cat === i)).length;
  return (
    <div className="e-page e-about">
      <Crumbs items={[{ label: t.about }]} />
      <section className="e-about-hero">
        <div className="e-about-c" data-reveal>
          <span className="e-tag">{t.aboutTag}</span>
          <h1 className="t-h">{L(def.name)}</h1>
          <p>{String(about)}</p>
          <div className="e-about-st">
            <span><b>{num(live.length)}</b><small>{t.stP}</small></span>
            <span><b>{num(cats)}</b><small>{t.stC}</small></span>
            <span><b>24/7</b><small>{t.stS}</small></span>
          </div>
          <div className="e-about-btns"><Link className="e-btn" href={`${base}/shop`}>{t.browse} <IconArrow /></Link><Link className="e-btn ghost" href={`${base}/contact`}>{t.contact}</Link></div>
        </div>
        <div className="e-about-pics" data-reveal>{pics.map((p, i) => <Img key={p.id} id={p.img} w={800} fb={fb(p)} className={`e-ap${i}`} alt="" />)}</div>
      </section>
      <section className="e-why">
        <h2 className="t-h">{t.why}</h2>
        <div className="e-why-g">{t.feats.map(([h, d], i) => <div key={h} className="e-why-i" data-reveal style={{ ["--d" as string]: i * 0.07 + "s" }}><i><IconCheck /></i><b>{h}</b><small>{d}</small></div>)}</div>
      </section>
    </div>
  );
}

/** «تواصل معنا»: قنوات المتجر ونموذج يصل رسالته إلى واتساب المتجر */
export function ContactPage() {
  const { def, L, lang } = useStore(); const t = useT();
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const wa = waNum(def.whatsapp);
  const info = def.merchant ? def.info : undefined;
  const tel = info?.phone || (wa ? `+${wa}` : "");
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) { setErr(t.fNeed); return; }
    const text = `${t.fHi} ${name.trim() || "—"}${phone.trim() ? ` (${phone.trim()})` : ""}\n\n${msg.trim()}`;
    window.open(wa ? `https://wa.me/${wa}?text=${encodeURIComponent(text)}` : `tel:${tel}`, "_blank", "noopener");
  };
  return (
    <div className="e-page e-contact">
      <Crumbs items={[{ label: t.contact }]} />
      <header className="e-ph"><h1 className="t-h">{t.cTitle}</h1><p>{t.cSub}</p></header>
      <div className="e-contact-g">
        <div className="e-contact-cards">
          {wa && <a className="e-cc wa" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" data-reveal><i>{SOCIAL_ICONS.whatsapp}</i><span><b>{t.wa}</b><small className="ltr">+{wa}</small></span></a>}
          {tel && <a className="e-cc" href={`tel:${tel.replace(/\s/g, "")}`} data-reveal><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg></i><span><b>{t.call}</b><small className="ltr">{tel}</small></span></a>}
          {info?.address && <div className="e-cc" data-reveal><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></i><span><b>{t.addr}</b><small>{info.address}</small></span></div>}
          {info?.hours && <div className="e-cc" data-reveal><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></i><span><b>{t.hours}</b><small>{info.hours}</small></span></div>}
        </div>
        <form className="e-cform" onSubmit={send} data-reveal>
          <b className="t-h">{L(def.name)}</b>
          <div className="e-cform-r"><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.fName} maxLength={60} aria-label={t.fName} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.fPhone} inputMode="tel" maxLength={20} dir="ltr" aria-label={t.fPhone} /></div>
          <textarea value={msg} onChange={(e) => { setMsg(e.target.value); setErr(""); }} placeholder={t.fMsg} rows={5} maxLength={800} aria-label={t.fMsg} />
          {err && <small className="e-cform-err">{err}</small>}
          <button className="e-btn" type="submit">{wa && SOCIAL_ICONS.whatsapp} {t.fSend}</button>
          <small className="e-cform-n" lang={lang}>{wa ? `wa.me/+${wa}` : tel}</small>
        </form>
      </div>
    </div>
  );
}

/** الشريط السفلي للجوال: الأقسام · السلة · الرئيسية (في الوسط) · المفضلة · حسابي */
export function MobileDock() {
  const { def, base, count, num, wish, setDrawer, lang } = useStore(); const t = T[lang];
  const path = usePathname();
  const c = useCustomer(def.slug, !!(def.merchant && def.accounts));
  const wishes = wish.filter((id) => def.products.some((p) => p.id === id)).length;
  const on = (h: string) => (h === base ? path === base || path === base + "/" : path.startsWith(h));
  const acc = def.merchant && def.accounts;
  const ic = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></svg>,
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></svg>,
    user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></svg>,
    chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 19l1.4-3.6A8 8 0 1 1 8.6 18.6z" /></svg>,
  };
  return (
    <nav className="e-dock" aria-label="store">
      <Link href={`${base}/categories`} className={on(`${base}/categories`) ? "on" : ""}>{ic.grid}<span>{t.cats}</span></Link>
      <button type="button" onClick={() => setDrawer(true)}><span className="e-dock-i"><IconBag />{count > 0 && <em>{num(count)}</em>}</span><span>{t.cart}</span></button>
      <Link href={base} className={`e-dock-home ${on(base) ? "on" : ""}`}><span className="e-dock-c">{ic.home}</span><span>{t.home}</span></Link>
      <Link href={`${base}/wishlist`} className={on(`${base}/wishlist`) ? "on" : ""}><span className="e-dock-i"><IconHeart />{wishes > 0 && <em>{num(wishes)}</em>}</span><span>{t.wish}</span></Link>
      {acc
        ? <Link href={`${base}/account`} className={on(`${base}/account`) ? "on" : ""}><span className="e-dock-i">{ic.user}{c.unread > 0 && <em>{num(c.unread)}</em>}</span><span>{c.me ? t.account : t.login}</span></Link>
        : <Link href={`${base}/contact`} className={on(`${base}/contact`) ? "on" : ""}>{ic.chat}<span>{t.contact}</span></Link>}
    </nav>
  );
}

/** «عرض سريع»: نافذة المنتج من أي بطاقة — الصورة، السعر، الخيار، الكمية، والإضافة للسلة */
export function QuickView() {
  const { quick, setQuick, prod } = useStore();
  const p: Product | undefined = quick ? prod(quick) : undefined;
  useEffect(() => {
    if (!p) return;
    const l = getLenis(); l?.stop();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setQuick(null);
    window.addEventListener("keydown", k);
    return () => { l?.start(); window.removeEventListener("keydown", k); };
  }, [p, setQuick]);
  return p ? <QuickPanel key={p.id} p={p} /> : null;
}

function QuickPanel({ p }: { p: Product }) {
  const { setQuick, L, price, num, add, base, fb, def, wish, toggleWish, setDrawer } = useStore(); const t = useT();
  const [opt, setOpt] = useState(p.variant ? L(p.variant.options[0]) : ""); const [qty, setQty] = useState(1);
  const off = p.old && p.old > p.price && !def.wholesale ? Math.round((1 - p.price / p.old) * 100) : 0;
  const wished = wish.includes(p.id);
  return (
    <div className="e-qv" role="dialog" aria-modal="true" aria-label={t.qv} onClick={() => setQuick(null)} style={def.accent ? ({ ["--acc" as string]: def.accent } as React.CSSProperties) : undefined}>
      <div className="e-qv-p" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button className="e-qv-x" onClick={() => setQuick(null)} aria-label="close"><IconX /></button>
        <div className="e-qv-im"><Img id={p.img} w={900} fb={fb(p)} alt={L(p.name)} eager />{off > 0 && <span className="e-qv-off">−{off}%</span>}</div>
        <div className="e-qv-b">
          <small>{L(def.cats[p.cat] ?? "")}</small>
          <h2 className="t-h">{L(p.name)}</h2>
          <div className="e-qv-pr"><b>{price(p.price)}</b>{off > 0 && <s>{price(p.old!)}</s>}</div>
          <p>{L(p.desc)}</p>
          {p.variant && <div className="e-opt"><label>{L(p.variant.label)}</label><div className="ch">{p.variant.options.map((o) => <button key={L(o)} className={opt === L(o) ? "on" : ""} onClick={() => setOpt(L(o))}>{L(o)}</button>)}</div></div>}
          <div className="e-buy">
            <div className="qty"><button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button><span>{num(qty)}</span><button onClick={() => setQty((q) => q + 1)}>+</button></div>
            <button className="e-btn" disabled={p.stock === 0} onClick={() => { add(p.id, opt, qty); setQuick(null); setTimeout(() => setDrawer(true), 200); }}><IconBag /> {t.buyNow}</button>
            <button className={`e-wish ${wished ? "on" : ""}`} onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={t.wish}><IconHeart filled={wished} /></button>
          </div>
          <Link className="e-qv-full" href={`${base}/p/${p.id}`} onClick={() => setQuick(null)}>{t.full} <IconArrow /></Link>
        </div>
      </div>
    </div>
  );
}

/** روابط صفحات المتجر — أسفل القوالب التي لا تذكرها في تذييلها */
export function StoreLinks() {
  const { def, base } = useStore(); const t = useT();
  if (def.id === "rvios") return null;
  return (
    <nav className="e-links" aria-label="store pages">
      <Link href={`${base}/shop`}>{t.products}</Link><Link href={`${base}/categories`}>{t.cats}</Link><Link href={`${base}/about`}>{t.about}</Link>
      <Link href={`${base}/contact`}>{t.contact}</Link><Link href={`${base}/wishlist`}>{t.wish}</Link>{def.merchant && def.accounts && <Link href={`${base}/account`}>{t.account}</Link>}
    </nav>
  );
}

/** زر مشاركة المنتج: مشاركة الجهاز، وإلا نسخ الرابط */
export function ShareBtn({ title }: { title: string }) {
  const t = useT(); const [done, setDone] = useState(false);
  const share = async () => {
    const url = location.href;
    try { if (navigator.share) { await navigator.share({ title, url }); return; } await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* أُلغيت المشاركة */ }
  };
  return (
    <button type="button" className="e-share" onClick={share} aria-label={t.share} title={done ? t.copied : t.share}>
      {done ? <IconCheck /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></svg>}
    </button>
  );
}
