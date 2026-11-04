"use client";
import { useSite } from "@/components/site/Providers";
import { Assistant } from "./Assistant";

const API = (process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "").replace(/\/+$/, "");

/** RVIOS AI على صفحات المنصة (الرئيسية، القوالب، الأدلة، إنشاء المتجر) — لا على متاجر التجّار */
export function PlatformAssistant() {
  const { lang } = useSite();
  if (!API) return null;
  return <Assistant site="platform" lang={lang} api={API} />;
}
