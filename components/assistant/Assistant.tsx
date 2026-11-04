"use client";

import { useEffect, useRef, useState } from "react";
import { Md } from "./md";
import "./assistant.css";

/* ─────────────────────────────────────────────────────────────────────────
   RVIOS AI للزوّار — فقاعة محادثة تجيب عن RVIOS ومنتجاتها من قاعدة معرفتها.
   بلا حساب ولا بيانات شخصية: المحادثة تبقى في هذا التبويب (sessionStorage)، وترسل آخر
   الرسائل مع كل سؤال، والخادم يقصّها ويتحقق منها. الألوان من متغيرات CSS بالموقع المضيف.
   ───────────────────────────────────────────────────────────────────────── */

type Site = "web" | "platform";
type Lang = "ar" | "en";
type Turn = { role: "user" | "model"; text: string; status?: "streaming" | "error" | "stopped" };

const T = {
  ar: {
    open: "اسأل RVIOS AI", title: "RVIOS AI", sub: "المساعد الذكي · يرد فورًا", close: "إغلاق", reset: "محادثة جديدة",
    placeholder: "اكتب سؤالك…", send: "إرسال", stop: "إيقاف", note: "قد يخطئ المساعد — للتأكيد كلّم الفريق على",
    wa: "واتساب", sa: "السعودية", ye: "اليمن", error: "تعذّر الاتصال — حاول مرة أخرى أو راسلنا على واتساب.",
    welcome: {
      web: "أهلًا بك في RVIOS 👋 أنا مساعدها الذكي. اسألني عن خدماتنا في تصميم المواقع والأنظمة والمتاجر، أو عن منصة المتاجر ونظام AzmSmart.",
      platform: "أهلًا بك 👋 أنا RVIOS AI. أساعدك تختار القالب والباقة المناسبين وتنشئ متجرك في دقائق — اسألني أي شيء عن المنصة.",
    },
    chips: {
      web: ["ما الخدمات التي تقدمونها؟", "كم تكلفة تصميم موقع؟", "ما الفرق بين المنصة والمتجر الخاص؟", "ما هو نظام AzmSmart؟"],
      platform: ["كيف أنشئ متجري؟", "ما الفرق بين الباقات؟", "أي قالب يناسب متجر عطور؟", "كيف يدفع عملائي؟"],
    },
  },
  en: {
    open: "Ask RVIOS AI", title: "RVIOS AI", sub: "Smart assistant · instant replies", close: "Close", reset: "New chat",
    placeholder: "Type your question…", send: "Send", stop: "Stop", note: "The assistant can make mistakes — confirm with the team on",
    wa: "WhatsApp", sa: "Saudi", ye: "Yemen", error: "Connection failed — try again or message us on WhatsApp.",
    welcome: {
      web: "Welcome to RVIOS 👋 I'm its smart assistant. Ask me about our website, system and store services, or our store platform and AzmSmart.",
      platform: "Welcome 👋 I'm RVIOS AI. I'll help you pick the right template and plan and launch your store in minutes — ask me anything.",
    },
    chips: {
      web: ["What services do you offer?", "How much does a website cost?", "Platform store vs custom store?", "What is AzmSmart?"],
      platform: ["How do I create my store?", "What are the plans?", "Which template suits a perfume store?", "How do my customers pay?"],
    },
  },
};

const WA = { sa: "966551341301", ye: "967739008083" };

export function Assistant({ site, lang, api }: { site: Site; lang: Lang; api: string }) {
  const t = T[lang];
  const key = `rv-ai-${site}`;
  const [open, setOpen] = useState(false);
  // المحادثة تبقى ما بقي التبويب مفتوحًا. اللوحة مغلقة عند التحميل فلا يختلف ما يرسمه الخادم
  const [turns, setTurns] = useState<Turn[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) ?? "[]") as Turn[];
      return Array.isArray(saved) ? saved.filter((x) => x.status !== "streaming" && typeof x.text === "string").slice(-20) : [];
    } catch {
      return []; // تخزين محظور أو تالف — نبدأ فارغين
    }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (busy) return;
    try { sessionStorage.setItem(key, JSON.stringify(turns.slice(-20))); } catch { /* لا شيء */ }
  }, [turns, busy, key]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, open]);
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  async function ask(raw: string) {
    const text = raw.trim().slice(0, 1000);
    if (!text || busy) return;
    const history = [...turns.filter((x) => x.status !== "error" && x.text), { role: "user" as const, text }];
    setTurns([...history, { role: "model", text: "", status: "streaming" }]);
    setInput("");
    setBusy(true);
    const ac = new AbortController();
    abortRef.current = ac;
    const patch = (fn: (m: Turn) => Turn) => setTurns((p) => p.map((m, i) => (i === p.length - 1 ? fn(m) : m)));
    try {
      const res = await fetch(`${api}/ai/public/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ site, lang, page: location.pathname, turns: history.slice(-10).map(({ role, text: x }) => ({ role, text: x.slice(0, 3000) })) }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body || !res.headers.get("content-type")?.includes("text/event-stream")) {
        const j = (await res.json().catch(() => null)) as { message?: string } | null;
        patch((m) => ({ ...m, text: j?.message || t.error, status: "error" }));
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let cut: number;
        while ((cut = buf.indexOf("\n\n")) >= 0) {
          const block = buf.slice(0, cut);
          buf = buf.slice(cut + 2);
          const data = block.split("\n").find((l) => l.startsWith("data:"));
          if (!data) continue;
          try {
            const ev = JSON.parse(data.slice(5)) as { type: string; text?: string; message?: string };
            if (ev.type === "delta") patch((m) => ({ ...m, text: m.text + (ev.text ?? "") }));
            else if (ev.type === "done") patch((m) => ({ ...m, status: undefined }));
            else if (ev.type === "error") patch((m) => ({ ...m, text: m.text || ev.message || t.error, status: "error" }));
          } catch { /* حدث تالف */ }
        }
      }
      patch((m) => (m.status === "streaming" ? { ...m, status: m.text ? undefined : "error", text: m.text || t.error } : m));
    } catch (e) {
      if ((e as Error)?.name === "AbortError") patch((m) => ({ ...m, status: "stopped" }));
      else patch((m) => ({ ...m, text: m.text || t.error, status: "error" }));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setTurns([]);
    try { sessionStorage.removeItem(key); } catch { /* لا شيء */ }
    inputRef.current?.focus();
  }

  return (
    <div className="rvai" dir={lang === "ar" ? "rtl" : "ltr"} data-open={open || undefined}>
      {open && (
        <section className="rvai-panel" role="dialog" aria-label={t.title}>
          <header className="rvai-head">
            <span className="rvai-av" aria-hidden><Spark /></span>
            <div className="rvai-ttl"><b>{t.title}</b><small>{t.sub}</small></div>
            {turns.length > 0 && <button type="button" className="rvai-ic" onClick={reset} aria-label={t.reset} title={t.reset}><Refresh /></button>}
            <button type="button" className="rvai-ic" onClick={() => setOpen(false)} aria-label={t.close}><Close /></button>
          </header>

          <div className="rvai-body" aria-live="polite">
            <div className="rvai-msg rvai-bot"><Md text={t.welcome[site]} /></div>
            {!turns.length && (
              <div className="rvai-chips">
                {t.chips[site].map((c) => <button key={c} type="button" onClick={() => void ask(c)}>{c}</button>)}
              </div>
            )}
            {turns.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="rvai-msg rvai-me" dir="auto">{m.text}</div>
              ) : (
                <div key={i} className={`rvai-msg rvai-bot${m.status === "error" ? " rvai-err" : ""}`}>
                  {m.status === "streaming" && !m.text ? <span className="rvai-dots" aria-label="…"><i /><i /><i /></span> : <Md text={m.text} />}
                  {m.status === "error" && <WaLinks t={t} />}
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>

          <form className="rvai-form" onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void ask(input); }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1000}
              dir={input ? "auto" : undefined}
              placeholder={t.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void ask(input); }
              }}
            />
            {busy ? (
              <button type="button" className="rvai-send" onClick={() => abortRef.current?.abort()} aria-label={t.stop}><Stop /></button>
            ) : (
              <button type="submit" className="rvai-send" disabled={!input.trim()} aria-label={t.send}><Send /></button>
            )}
          </form>
          <p className="rvai-note">{t.note} <WaLinks t={t} inline /></p>
        </section>
      )}

      <button type="button" className="rvai-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t.close : t.open}>
        {open ? <Close /> : <Spark />}
        {!open && <span>{t.open}</span>}
      </button>
    </div>
  );
}

function WaLinks({ t, inline }: { t: (typeof T)["ar"]; inline?: boolean }) {
  return (
    <span className={inline ? "rvai-wa-inline" : "rvai-wa"}>
      <a href={`https://wa.me/${WA.sa}`} target="_blank" rel="noopener noreferrer">{inline ? t.wa : `${t.wa} · ${t.sa}`}</a>
      {inline ? " " : null}
      <a href={`https://wa.me/${WA.ye}`} target="_blank" rel="noopener noreferrer">{inline ? `(${t.sa}/${t.ye})` : `${t.wa} · ${t.ye}`}</a>
    </span>
  );
}

const Spark = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l1.9 4.7L18.6 9.6 13.9 11.5 12 16.2 10.1 11.5 5.4 9.6 10.1 7.7z" /><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /><path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z" />
  </svg>
);
const Close = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>;
const Send = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7" /></svg>;
const Stop = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden><rect x="6" y="6" width="12" height="12" rx="2" /></svg>;
const Refresh = () => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>;
