"use client";
/* The payment-account cards: provider identity, the number with a one-tap copy, and the wallet's QR
   (tap to enlarge for scanning from another phone). Shared by /pay and the create flow's last step. */
import { useState } from "react";
import { CURRENCY_NAME, type PayAccount } from "@/lib/pay";

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M12 3l9 5H3z" /></svg>
);
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" /><path d="M21 9h-6a3 3 0 0 0 0 6h6z" /><circle cx="15.5" cy="12" r=".8" fill="currentColor" /></svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
);

function Card({ a, ar }: { a: PayAccount; ar: boolean }) {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(a.number); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked: the number stays selectable */ }
  };
  const cur = a.currency ? CURRENCY_NAME[a.currency]?.[ar ? "ar" : "en"] ?? a.currency : "";
  return (
    <article className="pay-card" style={{ ["--pc" as string]: a.color }}>
      <header>
        <span className="pay-ic">{a.kind === "wallet" ? <WalletIcon /> : <BankIcon />}</span>
        <div><b>{ar ? a.providerName : a.providerNameEn}</b>{a.title !== a.providerName && <small>{a.title}</small>}</div>
        {cur && <em className="pay-cur">{a.currency}</em>}
      </header>
      {a.number && (
        <div className="pay-num">
          <small>{a.kind === "wallet" ? (ar ? "رقم المحفظة" : "Wallet number") : (ar ? "رقم الحساب" : "Account number")}{cur && ` · ${cur}`}</small>
          <div><span dir="ltr" className="pay-n">{a.number}</span>
            <button type="button" onClick={() => void copy()} aria-label={ar ? "نسخ الرقم" : "Copy number"} className={copied ? "on" : ""}>{copied ? <CheckIcon /> : <CopyIcon />}<span>{copied ? (ar ? "نُسخ" : "Copied") : (ar ? "نسخ" : "Copy")}</span></button>
          </div>
        </div>
      )}
      {a.holder && <p className="pay-holder"><small>{ar ? "باسم" : "Name"}</small> {a.holder}</p>}
      {a.qr && (
        <button type="button" className="pay-qr" onClick={() => setZoom(true)} aria-label={ar ? "تكبير رمز QR" : "Enlarge QR code"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.qr} alt={ar ? `رمز الدفع — ${a.providerName}` : `Payment QR — ${a.providerNameEn}`} width={180} height={180} loading="lazy" />
          <small>{ar ? "اضغط للتكبير" : "Tap to enlarge"}</small>
        </button>
      )}
      {a.note && <p className="pay-note">{a.note}</p>}
      {zoom && (
        <div className="pay-zoom" role="dialog" aria-modal="true" aria-label={a.providerName} onClick={() => setZoom(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <b>{ar ? a.providerName : a.providerNameEn}</b>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.qr} alt="" width={360} height={360} />
            <small>{ar ? "امسح الرمز من تطبيق المحفظة" : "Scan with the wallet app"}</small>
            <button type="button" className="lbtn" onClick={() => setZoom(false)}>{ar ? "إغلاق" : "Close"}</button>
          </div>
        </div>
      )}
    </article>
  );
}

export function PayAccounts({ accounts, ar = true }: { accounts: PayAccount[]; ar?: boolean }) {
  if (!accounts.length) return null;
  return <div className="pay-grid">{accounts.map((a) => <Card key={a.id} a={a} ar={ar} />)}</div>;
}
