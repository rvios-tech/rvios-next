"use client";
/* طلب الاسترجاع من صفحة تتبّع طلب مكتمل — الإثبات رقم الطلب، كالتقييم. */
import { useState } from "react";
import { repo } from "@/lib/data";
import type { TrackedOrder } from "@/lib/data/types";
import { useStore } from "@/lib/store/engine";

const T = {
  ar: {
    ask: "طلب استرجاع", reason: "سبب الاسترجاع (المقاس، عيب، غير مطابق…)", send: "أرسل الطلب", short: "اكتب السبب بوضوح",
    status: ["طلب الاسترجاع قيد المراجعة", "قُبل طلب الاسترجاع — المتجر يتواصل معك لاستلام المنتج", "رُفض طلب الاسترجاع", "اكتمل الاسترجاع"],
    refund: "المبلغ المُعاد", note: "ملاحظة المتجر",
  },
  en: {
    ask: "Request a return", reason: "Reason (size, defect, not as described…)", send: "Send request", short: "Please describe the reason",
    status: ["Return request under review", "Return approved — the store will contact you", "Return request declined", "Return completed"],
    refund: "Refund", note: "Store note",
  },
};

export function ReturnRequest({ orderRef, order, onDone }: { orderRef: string; order: TrackedOrder; onDone: () => void }) {
  const { def, lang, price } = useStore(); const t = T[lang];
  const [open, setOpen] = useState(false); const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const r = order.return;

  if (!repo.requestReturn) return null;
  if (r && r.status !== 2) {
    return (
      <div className="e-ret">
        <b>{t.status[r.status] ?? ""}</b>
        {r.status === 3 && r.refund > 0 && <p>{t.refund}: {price(r.refund)}</p>}
        {r.note && <p>{t.note}: {r.note}</p>}
      </div>
    );
  }
  // يُطلب بعد الاستلام وحده؛ ومرفوض سابقًا يبقى معروضًا مع ملاحظته ولا يُعاد طلبه من هنا
  if (order.status !== 2) return null;
  if (r?.status === 2) return <div className="e-ret"><b>{t.status[2]}</b>{r.note && <p>{t.note}: {r.note}</p>}</div>;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 5) return setErr(t.short);
    setBusy(true); setErr("");
    try { await repo.requestReturn!(def.slug, orderRef, reason.trim()); setOpen(false); onDone(); }
    catch (x) { setErr((x as Error).message); }
    finally { setBusy(false); }
  }

  return open ? (
    <form className="e-ret e-ret-form" onSubmit={send}>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={500} placeholder={t.reason} aria-label={t.reason} />
      {err && <p className="e-qa-bad">{err}</p>}
      <button className="e-btn" type="submit" disabled={busy}>{busy ? "…" : t.send}</button>
    </form>
  ) : (
    <button type="button" className="e-ret-open" onClick={() => setOpen(true)}>{t.ask}</button>
  );
}
