/* SEO for the platform's own pages (home, templates, create) — never for merchant storefronts,
   which carry their own titles and descriptions (lib/seo.ts). */
import type { Metadata } from "next";

export const PLATFORM_KEYWORDS = [
  // Arabic
  "إنشاء متجر إلكتروني", "متجر إلكتروني مجاني", "منصة متاجر إلكترونية", "منصة متاجر", "تصميم متجر إلكتروني", "قوالب متاجر إلكترونية",
  "متجر إلكتروني في اليمن", "متجر إلكتروني في السعودية", "متجر إلكتروني بدون عمولة", "بيع أونلاين", "بيع عبر واتساب", "طلبات واتساب",
  "سلة مشتريات", "متجر برابط واحد", "نطاق خاص للمتجر", "الدفع عند الاستلام", "الكريمي", "جيب", "تجارة إلكترونية",
  "RVIOS Store", "RVIOS StoreOS", "ريفيوس ستور", "ريفيوس",
  // English
  "create online store", "free online store", "e-commerce platform", "online store builder", "store templates",
  "online store Yemen", "online store Saudi Arabia", "sell on WhatsApp", "no commission store", "custom domain store",
];

export const platformMetadata = (title: string, description: string, path = "/"): Metadata => ({
  title: { absolute: title },
  description,
  keywords: PLATFORM_KEYWORDS,
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, siteName: "RVIOS Store", title, description, locale: "ar_SA" },
  twitter: { card: "summary_large_image", title, description },
});
