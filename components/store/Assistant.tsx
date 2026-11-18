"use client";
/* المساعد الذكي للمتسوّقين — مشترك بين القوالب، يظهر حين يفعّله التاجر وباقته تسمح. الرد بثّ SSE،
   ووسم [[p:المعرّف]] في الرد يصير بطاقة منتج بزر «أضف للسلة». */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store/engine";
import { Img } from "../site/Img";
import { IconX } from "../site/Icons";

const API = (process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "").replace(/\/+$/, "");
type Turn = { role: "user" | "model"; text: string };

const T = {
  ar: { open: "اسأل المساعد", title: "مساعد التسوّق", hello: "أهلًا! أنا مساعد المتجر الذكي — صف لي ما تبحث عنه وأقترح عليك الأنسب.", ph: "ابحث عن هدية، مقاس، ميزانية…", send: "إرسال", err: "تعذّر الرد الآن — جرّب بعد قليل أو راسل المتجر على واتساب.", ideas: ["ماذا تنصحني كهدية؟", "ما الأكثر مبيعًا؟", "كم يستغرق التوصيل؟"] },
  en: { open: "Ask the assistant", title: "Shopping assistant", hello: "Hi! I'm the store's assistant — tell me what you're looking for and I'll suggest the best fit.", ph: "A gift, a size, a budget…", send: "Send", err: "Couldn't reply right now — try again shortly or message the store on WhatsApp.", ideas: ["What would make a good gift?", "What's best-selling?", "How long is delivery?"] },
};

export function Assistant() {
  const { def, lang, L, price, add, base, fb } = useStore();
  const t = T[lang];
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [turns, open]);
  if (!def.merchant || !def.storeAI) return null;

  const productId = (() => {
    const slot = path.split("/p/")[1]?.split(/[/?#]/)[0];
    return slot ? def.products.find((p) => p.id === slot)?.srcId : undefined;
  })();

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    const history: Turn[] = [...turns, { role: "user", text: question }];
    setTurns([...history, { role: "model", text: "" }]);
    setText("");
    setBusy(true);
    try {
      const res = await fetch(`${API}/shop/storefront/${encodeURIComponent(def.slug)}/assistant`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ turns: history.slice(-10), ...(productId ? { productId } : {}) }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(typeof j.message === "string" ? j.message : t.err);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const blocks = buf.split("\n\n");
        buf = blocks.pop() ?? "";
        for (const b of blocks) {
          const data = b.split("\n").find((l) => l.startsWith("data:"));
          if (!data) continue;
          const ev = JSON.parse(data.slice(5)) as { type: string; text?: string; message?: string };
          if (ev.type === "delta" && ev.text) { reply += ev.text; setTurns([...history, { role: "model", text: reply }]); }
          if (ev.type === "error") throw new Error(ev.message || t.err);
        }
      }
    } catch (e) {
      setTurns([...history, { role: "model", text: (e as Error).message || t.err }]);
    } finally {
      setBusy(false);
    }
  }

  /** نص المساعد: الأسطر العادية، ووسوم المنتجات بطاقات */
  const render = (s: string) => s.split(/(\[\[p:[0-9a-f-]{36}\]\])/g).map((part, i) => {
    const m = /^\[\[p:([0-9a-f-]{36})\]\]$/.exec(part);
    if (!m) return part.trim() ? <span key={i} className="as-txt">{part.replace(/\n{3,}/g, "\n\n")}</span> : null;
    const p = def.products.find((x) => x.srcId === m[1]);
    if (!p) return null;
    return (
      <span key={i} className="as-card">
        <Link href={`${base}/p/${p.id}`} className="as-ci"><Img id={p.img} w={200} fb={fb(p)} /></Link>
        <span className="as-cb"><Link href={`${base}/p/${p.id}`}><b>{L(p.name)}</b></Link><small>{price(p.price)}</small></span>
        <button onClick={() => add(p.id, p.variant ? L(p.variant.options[0]) : "")}>+</button>
      </span>
    );
  });

  return (
    <>
      {!open && <button className="as-fab" onClick={() => setOpen(true)}><span className="as-spark">✦</span>{t.open}</button>}
      {open && (
        <div className="as-panel" role="dialog" aria-label={t.title}>
          <div className="as-head"><b><span className="as-spark">✦</span> {t.title}</b><button onClick={() => setOpen(false)} aria-label="close"><IconX /></button></div>
          <div className="as-body" ref={box}>
            <div className="as-msg model"><span className="as-txt">{t.hello}</span></div>
            {turns.length === 0 && <div className="as-ideas">{t.ideas.map((x) => <button key={x} onClick={() => void ask(x)}>{x}</button>)}</div>}
            {turns.map((m, i) => <div key={i} className={`as-msg ${m.role}`}>{m.role === "model" ? (m.text ? render(m.text) : <span className="as-dots"><i /><i /><i /></span>) : <span className="as-txt">{m.text}</span>}</div>)}
          </div>
          <form className="as-form" onSubmit={(e) => { e.preventDefault(); void ask(text); }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.ph} maxLength={500} disabled={busy} />
            <button type="submit" disabled={busy || !text.trim()}>{t.send}</button>
          </form>
        </div>
      )}
    </>
  );
}
