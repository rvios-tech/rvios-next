"use client";
/* حساب العميل — الدخول برمز الجوال، وطلباته ومحفظته ومكافآته وإشعاراته. مكوّنات مشتركة بين كل القوالب. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store/engine";
import { accountCall, useCustomer, type AccountOrder, type Notice, type WalletTx } from "@/lib/store/customer";

const T = {
  ar: {
    account: "حسابي", login: "تسجيل الدخول", phone: "رقم جوالك", sendCode: "أرسل رمز الدخول", code: "الرمز المرسل إلى جوالك",
    verify: "دخول", change: "تغيير الرقم", codeSent: "أرسلنا رمزًا من ستة أرقام إلى", resend: "إرسال رمز جديد",
    why: "سجّل الدخول لتتابع طلباتك، وتستخدم رصيد محفظتك ومكافآتك، وتصلك إشعارات طلبك.",
    hello: "أهلًا", logout: "تسجيل الخروج", orders: "طلباتي", wallet: "المحفظة والمكافآت", notices: "الإشعارات", profile: "بياناتي",
    noOrders: "لا طلبات بعد.", balance: "رصيد المحفظة", points: "رصيد المكافآت", walletHint: "يُدفع منه في طلبك القادم عند الإتمام.",
    noTx: "لا حركات بعد.", noNotices: "لا إشعارات بعد.", name: "الاسم", address: "العنوان", save: "حفظ", saved: "حُفظت بياناتك",
    items: "منتج", paidWallet: "من المحفظة",
    kinds: { credit: "إضافة من المتجر", debit: "خصم من المتجر", refund: "استرداد مرتجع", pay: "دفع طلب", cancel: "طلب ملغى", earn: "مكافأة طلب", redeem: "صُرف في طلب", revoke: "سُحب (مرتجع)", adjust: "تعديل من المتجر", unredeem: "أُعيد (طلب ملغى)" } as Record<string, string>,
  },
  en: {
    account: "My account", login: "Sign in", phone: "Your phone number", sendCode: "Send sign-in code", code: "Code sent to your phone",
    verify: "Sign in", change: "Change number", codeSent: "We sent a 6-digit code to", resend: "Send a new code",
    why: "Sign in to follow your orders, use your wallet and rewards, and get order updates.",
    hello: "Hi", logout: "Sign out", orders: "My orders", wallet: "Wallet & rewards", notices: "Notifications", profile: "My details",
    noOrders: "No orders yet.", balance: "Wallet balance", points: "Rewards balance", walletHint: "Use it on your next order at checkout.",
    noTx: "No activity yet.", noNotices: "No notifications yet.", name: "Name", address: "Address", save: "Save", saved: "Saved",
    items: "items", paidWallet: "from wallet",
    kinds: { credit: "Store credit", debit: "Store debit", refund: "Return refund", pay: "Order payment", cancel: "Cancelled order", earn: "Order reward", redeem: "Used on order", revoke: "Revoked (return)", adjust: "Store adjustment", unredeem: "Restored (cancelled)" } as Record<string, string>,
  },
};

/** نموذج الدخول: الجوال ثم الرمز */
export function LoginBox({ onDone, compact }: { onDone?: () => void; compact?: boolean }) {
  const { def, lang } = useStore(); const t = T[lang];
  const c = useCustomer(def.slug, !!def.accounts);
  const [phone, setPhone] = useState(""); const [sentTo, setSentTo] = useState(""); const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const run = async (f: () => Promise<unknown>) => { setBusy(true); setErr(""); try { await f(); } catch (e) { setErr((e as Error).message); } setBusy(false); };
  return (
    <form className={`e-login${compact ? " compact" : ""}`} onSubmit={(e) => { e.preventDefault(); void run(async () => {
      if (!sentTo) { const r = await c.requestCode(phone); setSentTo(r.phone); return; }
      await c.verify(sentTo, code); onDone?.();
    }); }}>
      {!compact && <p className="e-login-why">{t.why}</p>}
      {!sentTo ? (
        <label>{t.phone}<input required inputMode="tel" dir="ltr" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
      ) : (
        <>
          <p className="e-login-sent">{t.codeSent} <b dir="ltr">+{sentTo}</b> · <button type="button" className="e-link" onClick={() => { setSentTo(""); setCode(""); }}>{t.change}</button></p>
          <label>{t.code}<input required autoFocus inputMode="numeric" autoComplete="one-time-code" dir="ltr" maxLength={6} pattern="\d{6}" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></label>
        </>
      )}
      {err && <div className="e-err" role="alert">{err}</div>}
      <button className="e-btn" type="submit" disabled={busy || (!sentTo ? phone.replace(/\D/g, "").length < 7 : code.length !== 6)}>{busy ? "…" : sentTo ? t.verify : t.sendCode}</button>
      {sentTo && <button type="button" className="e-link" disabled={busy} onClick={() => void run(async () => { await c.requestCode(sentTo); })}>{t.resend}</button>}
    </form>
  );
}

/** زر الحساب العائم — بعدد الإشعارات غير المقروءة */
export function AccountFab() {
  const { def, base, lang } = useStore(); const t = T[lang];
  const c = useCustomer(def.slug, !!def.accounts);
  if (!def.merchant || !def.accounts || !c.ready) return null;
  return (
    <Link className="e-accfab" href={`${base}/account`} aria-label={t.account}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></svg>
      <b>{c.me ? (c.me.name || t.account) : t.login}</b>
      {c.unread > 0 && <span className="e-accfab-n">{c.unread}</span>}
    </Link>
  );
}

type Tab = "orders" | "wallet" | "notices" | "profile";

/** صفحة الحساب */
export function AccountPage() {
  const { def, lang, price, base, num } = useStore(); const t = T[lang];
  const c = useCustomer(def.slug, !!def.accounts);
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<AccountOrder[] | null>(null);
  const [wallet, setWallet] = useState<{ wallet: number; points: number; history: WalletTx[]; pointsHistory: WalletTx[] } | null>(null);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [name, setName] = useState(""); const [address, setAddress] = useState(""); const [msg, setMsg] = useState("");
  const date = (s: string) => new Date(s).toLocaleDateString(lang === "ar" ? "ar" : "en", { day: "numeric", month: "short", year: "numeric" });

  useEffect(() => {
    if (!c.me) return;
    setName(c.me.name); setAddress(c.me.address);
    if (tab === "orders") void accountCall<{ orders: AccountOrder[] }>(def.slug, "GET", "/orders").then((r) => setOrders(r.orders), () => setOrders([]));
    if (tab === "wallet") void accountCall<typeof wallet & object>(def.slug, "GET", "/wallet").then(setWallet, () => setWallet(null));
    if (tab === "notices") void accountCall<{ notices: Notice[] }>(def.slug, "GET", "/notices").then((r) => {
      setNotices(r.notices);
      if (r.notices.some((n) => !n.readAt)) void accountCall(def.slug, "POST", "/notices/read").then(c.changed, () => {});
    }, () => setNotices([]));
  }, [tab, c.me?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!def.accounts) return <div className="e-page"><div className="e-done"><h1 className="t-h">{t.account}</h1><Link className="e-btn" href={base}>←</Link></div></div>;
  if (!c.ready) return <div className="e-page" />;
  if (!c.me) return <div className="e-page"><div className="e-acc-login"><h1 className="t-h">{t.login}</h1><LoginBox /></div></div>;

  const kind = (k: string) => t.kinds[k] ?? k;
  const TABS: [Tab, string][] = [["orders", t.orders], ["wallet", t.wallet], ["notices", t.notices], ["profile", t.profile]];
  return (
    <div className="e-page"><div className="e-acc">
      <div className="e-acc-head">
        <div><h1 className="t-h">{t.hello} {c.me.name || ""}</h1><span dir="ltr" className="e-acc-phone">+{c.me.phone}</span></div>
        <div className="e-acc-bal"><span>{t.balance}<b>{price(c.me.wallet)}</b></span>{c.me.points > 0 && <span>{t.points}<b>{price(c.me.points)}</b></span>}</div>
      </div>
      <nav className="e-acc-tabs">{TABS.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}{k === "notices" && c.unread > 0 && <i>{c.unread}</i>}</button>)}</nav>

      {tab === "orders" && (
        <div className="e-acc-list">
          {orders?.length === 0 && <p className="e-acc-empty">{t.noOrders}</p>}
          {orders?.map((o) => (
            <Link key={o.ref} className="e-acc-row" href={`${base}/order/${o.ref}`}>
              <div><b dir="ltr">{o.ref}</b><small>{date(o.createdAt)} · {num(o._count.items)} {t.items} · {o.items.map((i) => i.name).join("، ")}</small></div>
              <div className="end"><b>{price(o.total)}</b><small>{o.statusLabel}{o.walletPaid > 0 ? ` · ${price(o.walletPaid)} ${t.paidWallet}` : ""}</small></div>
            </Link>
          ))}
        </div>
      )}

      {tab === "wallet" && wallet && (
        <div className="e-acc-list">
          <p className="e-acc-hint">{t.walletHint}</p>
          {[...wallet.history, ...wallet.pointsHistory.map((p) => ({ ...p, kind: p.kind, note: `${t.points} · ${p.note}` }))]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((x) => (
              <div key={x.id} className="e-acc-row">
                <div><b>{kind(x.kind)}</b><small>{date(x.createdAt)}{x.note ? ` · ${x.note}` : ""}</small></div>
                <b className={x.amount >= 0 ? "plus" : "minus"} dir="ltr">{x.amount >= 0 ? "+" : "−"}{price(Math.abs(x.amount))}</b>
              </div>
            ))}
          {wallet.history.length + wallet.pointsHistory.length === 0 && <p className="e-acc-empty">{t.noTx}</p>}
        </div>
      )}

      {tab === "notices" && (
        <div className="e-acc-list">
          {notices?.length === 0 && <p className="e-acc-empty">{t.noNotices}</p>}
          {notices?.map((n) => {
            const inner = <><div><b>{n.title}</b>{n.body && <small>{n.body}</small>}</div><small className="end">{date(n.createdAt)}</small></>;
            return n.link ? <Link key={n.id} className={`e-acc-row${n.readAt ? "" : " new"}`} href={`${base}${n.link === "/account" ? "/account" : n.link}`}>{inner}</Link>
              : <div key={n.id} className={`e-acc-row${n.readAt ? "" : " new"}`}>{inner}</div>;
          })}
        </div>
      )}

      {tab === "profile" && (
        <form className="e-login" onSubmit={(e) => { e.preventDefault(); void accountCall(def.slug, "PATCH", "", { name, address }).then(() => { setMsg(t.saved); c.changed(); }, (x) => setMsg((x as Error).message)); }}>
          <label>{t.name}<input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label>{t.address}<input value={address} maxLength={200} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" /></label>
          {msg && <p className="e-acc-hint">{msg}</p>}
          <button className="e-btn" type="submit">{t.save}</button>
          <button type="button" className="e-link" onClick={c.logout}>{t.logout}</button>
        </form>
      )}
    </div></div>
  );
}
