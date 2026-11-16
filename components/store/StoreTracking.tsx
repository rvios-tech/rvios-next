"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store/engine";
import { pixelBootstrap, track, validTracking } from "@/lib/store/pixels";

/**
 * أكواد التتبع لمتجر التاجر (Meta وTikTok وSnap وX وGoogle). لا تعمل في معاينة المحرر داخل اللوحة
 * (iframe) ولا في متاجر القوالب التجريبية — زيارات التاجر نفسه تُفسد بيانات حملاته.
 * التحميل الأول يسجّل مشاهدة الصفحة من كود كل منصة، وكل تنقّل بعده يسجّلها من هنا.
 */
export function StoreTracking() {
  const { def } = useStore();
  const t = validTracking(def.look?.extras?.tracking);
  const code = def.merchant ? pixelBootstrap(t) : "";
  const [live, setLive] = useState(false);
  useEffect(() => { try { setLive(window.self === window.top); } catch { setLive(false); } }, []);

  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (!live || !code) return;
    if (first.current) { first.current = false; return; }
    track("page");
  }, [path, live, code]);

  if (!live || !code) return null;
  return (
    <>
      {t.ga4 && <Script src={`https://www.googletagmanager.com/gtag/js?id=${t.ga4}`} strategy="afterInteractive" />}
      <Script id="rv-store-pixels" strategy="afterInteractive">{code}</Script>
    </>
  );
}
