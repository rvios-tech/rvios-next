import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/site/Providers";
import "./globals.css";
import { PLATFORM_ORIGIN } from "@/lib/config";
import { regionCss, regionScript } from "@/lib/contact";

const zain = localFont({ src: "./fonts/ZainMobileSwashes-VF.woff2", variable: "--f-zain", weight: "100 900", display: "swap" });
const thmanyah = localFont({
  src: [
    { path: "./fonts/ThmanyahSerifText-Medium.woff2", weight: "500" },
    { path: "./fonts/ThmanyahSerifText-Bold.woff2", weight: "700" },
  ],
  variable: "--f-th", display: "swap",
});
const yapari = localFont({ src: "./fonts/Yapari-Bold.woff2", variable: "--f-ya", weight: "700", display: "swap" });

export const metadata: Metadata = {
  title: "RVIOS Store — متجرك كاملاً في رابط واحد",
  description: "منصة متاجر إلكترونية: أنشئ متجرك بهويتك، اختر قالباً، وشارك رابطاً واحداً.",
  // the platform is served from store.rvios.com — canonical URLs point there
  metadataBase: new URL(PLATFORM_ORIGIN),
  applicationName: "RVIOS Store",
  icons: { icon: "/logo.svg" },
  // large previews of pages and images in search results
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Search Console / Bing Webmaster ownership — set the tokens in the deployment's environment
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  category: "ecommerce",
  creator: "RVIOS Technologies",
  publisher: "RVIOS Technologies",
};
export const viewport: Viewport = { themeColor: "#C1272D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning className={`${zain.variable} ${thmanyah.variable} ${yapari.variable}`}>
      <head>
        {/* the visitor's region (contact number) before first paint — lib/contact.ts */}
        <script dangerouslySetInnerHTML={{ __html: regionScript }} />
        <style dangerouslySetInnerHTML={{ __html: regionCss }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
