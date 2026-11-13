import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { Analytics } from "@/components/site/Analytics";
import { platformMetadata } from "@/lib/platform-seo";

export const metadata: Metadata = platformMetadata(
  "تطبيق RVIOS — أدِر متجرك الإلكتروني من جوالك | RVIOS Store",
  "حمّل تطبيق RVIOS لأندرويد: افتح متجرك في أربع خطوات، واختر قالبه بمعاينة حية، وصمّمه، وأضف منتجاتك بصورها، وتابع كل طلب مع إشعار فوري. مجاني.",
  "/app",
);

export default function AppDownload() {
  return <><Analytics /><AppShell /></>;
}
