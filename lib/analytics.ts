/* Google Analytics for the platform's own pages (home, templates, create) — not for merchants'
   storefronts: their visitors aren't RVIOS's to track. Production only, so dev visits don't count.
   NEXT_PUBLIC_GA_IDS (comma-separated) overrides the default; an empty value turns it off. */
const raw = process.env.NEXT_PUBLIC_GA_IDS ?? "G-M457B7LQ9S";
export const GA_IDS = raw.split(",").map((s) => s.trim()).filter((s) => /^(G|GT|AW|DC)-[A-Z0-9]+$/.test(s));
export const analyticsOn = process.env.NODE_ENV === "production" && GA_IDS.length > 0;
export const gtagInit = () =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());` +
  GA_IDS.map((id) => `gtag('config',${JSON.stringify(id)});`).join("");
