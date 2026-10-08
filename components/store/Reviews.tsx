"use client";
/* Product reviews — from real buyers only (a completed order line), served by the unified backend.
   A product nobody rated stays silent: no "0 of 5", no grey stars implying someone did. */
import { useCallback, useEffect, useState } from "react";
import { repo } from "@/lib/data";
import type { ProductReviews as Data, TrackedOrder } from "@/lib/data/types";
import { useStore } from "@/lib/store/engine";
import { useSite } from "../site/Providers";

const T = {
  ar: { reviews: "آراء المشترين", of: "من", based: "تقييم", reply: "ردّ المتجر", rate: "قيّم مشترياتك", rateTxt: "وصل طلبك — شاركنا رأيك فيما اشتريت.", yourName: "اسمك (اختياري)", body: "رأيك في المنتج", send: "أرسل التقييم", thanks: "شكراً — نُشر تقييمك", done: "قيّمت هذا المنتج" },
  en: { reviews: "Buyer reviews", of: "of", based: "reviews", reply: "Store reply", rate: "Rate your purchase", rateTxt: "Your order arrived — tell others what you think.", yourName: "Your name (optional)", body: "Your review", send: "Submit review", thanks: "Thanks — your review is live", done: "You reviewed this" },
};

function Stars({ value, size = 16, onPick }: { value: number; size?: number; onPick?: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, direction: "ltr" }} aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" disabled={!onPick} onClick={() => onPick?.(i)} aria-label={String(i)}
          style={{ background: "none", border: 0, padding: 0, cursor: onPick ? "pointer" : "default", color: i <= Math.round(value) ? "#E0A82E" : "color-mix(in srgb, currentColor 22%, transparent)", fontSize: size, lineHeight: 1 }}>★</button>
      ))}
    </span>
  );
}

/** Published reviews under a product — only once someone has actually reviewed it. */
export function ProductReviews({ productId }: { productId?: string }) {
  const { def, lang, num } = useStore(); const t = T[lang];
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    if (!productId || !repo.productReviews) return;
    let live = true;
    repo.productReviews(def.slug, productId).then((d) => live && setData(d)).catch(() => {});
    return () => { live = false; };
  }, [def.slug, productId]);
  if (!data?.count) return null;
  return (
    <section className="e-rev" style={{ marginTop: 28 }}>
      <h3 className="t-h" style={{ fontSize: 22, display: "flex", alignItems: "center", gap: 10 }}>
        {t.reviews} <Stars value={data.average} /> <small style={{ opacity: 0.6, fontSize: 14 }}>{num(data.average)} {t.of} ٥ · {num(data.count)} {t.based}</small>
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 14 }}>
        {data.reviews.map((r) => (
          <li key={r.id} style={{ borderTop: "1px solid var(--line, rgba(0,0,0,.1))", paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><b>{r.name}</b><Stars value={r.rating} size={13} /></div>
            <p style={{ margin: "6px 0 0", opacity: 0.85 }}>{r.body}</p>
            {r.reply && <p style={{ margin: "8px 0 0", padding: "8px 12px", borderRadius: 10, background: "color-mix(in srgb, currentColor 6%, transparent)", fontSize: 14 }}><b>{t.reply}:</b> {r.reply}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** After the store marks the order completed: rate each line once. */
export function OrderReview({ orderRef }: { orderRef: string }) {
  const { def, lang } = useStore(); const { toast } = useSite(); const t = T[lang];
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [form, setForm] = useState<Record<string, { rating: number; body: string }>>({});
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const load = useCallback(() => { repo.trackOrder?.(def.slug, orderRef).then(setOrder).catch(() => {}); }, [def.slug, orderRef]);
  useEffect(() => { load(); }, [load]);
  if (!repo.submitReview || !order || order.status !== 2 || !order.items.length) return null;

  const send = async (itemId: string) => {
    const f = form[itemId]; if (!f?.rating || (f.body ?? "").trim().length < 2) return;
    setBusy(itemId);
    try { await repo.submitReview!(def.slug, orderRef, { itemId, rating: f.rating, body: f.body.trim(), name: name.trim() || undefined }); toast(t.thanks); load(); }
    catch (e) { toast((e as Error).message); }
    finally { setBusy(null); }
  };

  return (
    <section style={{ marginTop: 28, textAlign: "start" }}>
      <h2 className="t-h" style={{ fontSize: 24 }}>{t.rate}</h2>
      <p style={{ opacity: 0.7, margin: "6px 0 14px" }}>{t.rateTxt}</p>
      <input placeholder={t.yourName} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} style={{ width: "100%", marginBottom: 12 }} />
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
        {order.items.map((it) => (
          <li key={it.id} style={{ borderTop: "1px solid var(--line, rgba(0,0,0,.1))", paddingTop: 12 }}>
            <b>{it.name}{it.variant ? ` · ${it.variant}` : ""}</b>
            {it.reviewed ? <p style={{ opacity: 0.6, margin: "6px 0 0" }}>✓ {t.done}</p> : (<>
              <div style={{ margin: "8px 0" }}><Stars value={form[it.id]?.rating ?? 0} size={24} onPick={(n) => setForm((f) => ({ ...f, [it.id]: { rating: n, body: f[it.id]?.body ?? "" } }))} /></div>
              <textarea rows={2} maxLength={1000} placeholder={t.body} value={form[it.id]?.body ?? ""} onChange={(e) => setForm((f) => ({ ...f, [it.id]: { rating: f[it.id]?.rating ?? 0, body: e.target.value } }))} style={{ width: "100%" }} />
              <button className="e-btn" style={{ marginTop: 8 }} disabled={busy === it.id || !form[it.id]?.rating || (form[it.id]?.body ?? "").trim().length < 2} onClick={() => void send(it.id)}>{t.send}</button>
            </>)}
          </li>
        ))}
      </ul>
    </section>
  );
}
