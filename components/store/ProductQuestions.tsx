"use client";
/* أسئلة المنتج — يسأل الزائر بلا حساب، ولا يظهر إلا ما أجاب عنه المتجر. */
import { useEffect, useState } from "react";
import { repo } from "@/lib/data";
import type { ProductQuestion } from "@/lib/data/types";
import { useStore } from "@/lib/store/engine";

const T = {
  ar: { title: "أسئلة عن المنتج", ask: "اسأل عن المنتج", q: "سؤالك", name: "اسمك (اختياري)", send: "أرسل السؤال", sent: "وصل سؤالك — تظهر الإجابة هنا حين يجيب المتجر.", store: "إجابة المتجر", short: "اكتب سؤالك بوضوح", visitor: "زائر" },
  en: { title: "Questions about this product", ask: "Ask a question", q: "Your question", name: "Your name (optional)", send: "Send", sent: "Received — the answer shows here once the store replies.", store: "Store answer", short: "Please write your question", visitor: "Visitor" },
};

export function ProductQuestions({ productId }: { productId?: string }) {
  const { def, lang } = useStore(); const t = T[lang];
  const [list, setList] = useState<ProductQuestion[]>([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(""); const [name, setName] = useState("");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!productId || !repo.productQuestions) return;
    let live = true;
    repo.productQuestions(def.slug, productId).then((r) => live && setList(r)).catch(() => {});
    return () => { live = false; };
  }, [def.slug, productId]);

  // متاجر القوالب التجريبية لا أسئلة فيها — المنتجات نماذج
  if (!productId || !repo.askQuestion || !def.merchant) return null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 5) return setMsg({ ok: false, text: t.short });
    setBusy(true); setMsg(null);
    try { await repo.askQuestion!(def.slug, productId!, { question: q.trim(), name: name.trim() || undefined }); setMsg({ ok: true, text: t.sent }); setQ(""); setOpen(false); }
    catch (err) { setMsg({ ok: false, text: (err as Error).message }); }
    finally { setBusy(false); }
  }

  return (
    <section className="e-qa">
      <div className="e-qa-h">
        <h3 className="t-h">{t.title}</h3>
        {!open && <button type="button" className="e-qa-ask" onClick={() => { setOpen(true); setMsg(null); }}>{t.ask}</button>}
      </div>
      {list.length > 0 && (
        <ul>
          {list.map((x) => (
            <li key={x.id}>
              <p className="e-qa-q"><b>س:</b> {x.question} <small>— {x.name || t.visitor}</small></p>
              <p className="e-qa-a"><b>{t.store}:</b> {x.answer}</p>
            </li>
          ))}
        </ul>
      )}
      {open && (
        <form onSubmit={send} className="e-qa-form">
          <textarea value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} rows={3} placeholder={t.q} aria-label={t.q} />
          <div><input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t.name} aria-label={t.name} />
            <button type="submit" className="e-btn" disabled={busy}>{busy ? "…" : t.send}</button></div>
        </form>
      )}
      {msg && <p className={msg.ok ? "e-qa-ok" : "e-qa-bad"}>{msg.text}</p>}
    </section>
  );
}
