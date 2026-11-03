/* SEO for the platform's own pages (home, templates, create, guides) — never for merchant storefronts,
   which carry their own titles and descriptions (lib/seo.ts). */
import type { Metadata } from "next";
import { PLATFORM_ORIGIN, RVIOS } from "./config";
import { FAQS, PLANS } from "./i18n-platform";

export { PLATFORM_ORIGIN };

export const PLATFORM_KEYWORDS = [
  // Arabic
  "إنشاء متجر إلكتروني", "انشاء متجر الكتروني", "متجر إلكتروني مجاني", "منصة متاجر إلكترونية", "منصة متاجر", "تصميم متجر إلكتروني", "قوالب متاجر إلكترونية",
  "عمل متجر إلكتروني", "فتح متجر إلكتروني", "متجر أونلاين", "متجر إلكتروني في اليمن", "متجر إلكتروني في السعودية", "متجر إلكتروني بدون عمولة",
  "بيع أونلاين", "بيع عبر واتساب", "متجر واتساب", "طلبات واتساب", "سلة مشتريات", "متجر برابط واحد", "نطاق خاص للمتجر", "الدفع عند الاستلام",
  "الكريمي", "جيب", "تجارة إلكترونية",
  "RVIOS Store", "RVIOS StoreOS", "ريفيوس ستور", "ريفيوس",
  // English
  "create online store", "free online store", "e-commerce platform", "online store builder", "store templates",
  "online store Yemen", "online store Saudi Arabia", "sell on WhatsApp", "no commission store", "custom domain store",
];

const OG = { url: "/og.png", width: 1200, height: 630, alt: "RVIOS Store — منصة متاجر إلكترونية" };

export const platformMetadata = (title: string, description: string, path = "/", keywords: string[] = PLATFORM_KEYWORDS): Metadata => ({
  title: { absolute: title },
  description,
  keywords,
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, siteName: "RVIOS Store", title, description, locale: "ar_SA", images: [OG] },
  twitter: { card: "summary_large_image", title, description, images: [OG.url] },
});

const ORG_ID = `${PLATFORM_ORIGIN}/#org`;

/** who runs the platform — every platform page's graph points at this one node */
export const platformOrganization = {
  "@type": "Organization", "@id": ORG_ID, name: "RVIOS Store", alternateName: ["RVIOS StoreOS", "ريفيوس ستور"],
  url: `${PLATFORM_ORIGIN}/`, logo: `${PLATFORM_ORIGIN}/logo.svg`,
  parentOrganization: { "@type": "Organization", name: "RVIOS Technologies", url: RVIOS.websiteLink },
  sameAs: [RVIOS.websiteLink, RVIOS.instagramLink, RVIOS.facebookLink],
};

export function faqPage(faq: readonly (readonly string[])[]) {
  return { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
}

export function breadcrumbs(items: [string, string][]) {
  return { "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: PLATFORM_ORIGIN + path })) };
}

const PLAN_NAME: Record<string, string> = { free: "الباقة المجانية", pro: "الباقة الاحترافية", biz: "باقة الأعمال" };

/** home: who we are, the site, the product with its real prices, and the FAQ shown on the page */
export function platformJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      platformOrganization,
      { "@type": "WebSite", "@id": `${PLATFORM_ORIGIN}/#site`, url: `${PLATFORM_ORIGIN}/`, name: "RVIOS Store", alternateName: "ريفيوس ستور", inLanguage: "ar", publisher: { "@id": ORG_ID } },
      {
        "@type": "SoftwareApplication", name: "RVIOS Store", applicationCategory: "BusinessApplication", operatingSystem: "Web",
        url: `${PLATFORM_ORIGIN}/`, inLanguage: ["ar", "en"], publisher: { "@id": ORG_ID }, image: `${PLATFORM_ORIGIN}${OG.url}`,
        description: "منصة عربية لإنشاء متجر إلكتروني مجانًا بقوالب احترافية، وطلبات منظّمة عبر واتساب، ودفع عند الاستلام وتحويل محلي، بلا عمولة على المبيعات.",
        offers: PLANS.map((p) => ({ "@type": "Offer", name: PLAN_NAME[p.id] ?? p.id, price: p.m, priceCurrency: "USD", description: p.b.ar.join("، ") })),
      },
      faqPage(FAQS.ar),
    ],
  };
}
