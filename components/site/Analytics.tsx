import Script from "next/script";
import { GA_IDS, analyticsOn, gtagInit } from "@/lib/analytics";

/** Google tag — rendered by the platform pages only (see lib/analytics.ts). */
export function Analytics() {
  if (!analyticsOn) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_IDS[0]}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{gtagInit()}</Script>
    </>
  );
}
