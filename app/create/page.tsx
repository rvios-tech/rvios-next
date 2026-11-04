import { PlatformAssistant } from "@/components/assistant/PlatformAssistant";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateFlow } from "@/components/create/CreateFlow";
import { Analytics } from "@/components/site/Analytics";
import { platformMetadata } from "@/lib/platform-seo";
export const metadata: Metadata = platformMetadata(
  "أنشئ متجرك الإلكتروني الآن — مجانًا | RVIOS Store",
  "أنشئ متجرك الإلكتروني في دقائق: اختر القالب، ثم الباقة، ثم بيانات متجرك. ابدأ مجانًا برابط خاص وترقَّ إلى نطاقك الخاص متى شئت.",
  "/create",
);
export default function Create() {
  return <><Analytics /><Suspense><CreateFlow /></Suspense><PlatformAssistant /></>;
}
