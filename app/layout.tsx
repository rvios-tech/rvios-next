import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/site/Providers";
import "./globals.css";
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
  metadataBase: new URL("https://rvios.store"),
  icons: { icon: "/logo.svg" },
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
