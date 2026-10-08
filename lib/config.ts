/* Platform-wide settings: store domains, RVIOS contacts and AzmSmart integration points. */
export const STORE_DOMAIN = "rvios.store";
/** Public address of a store: free plan → <slug>.rvios.store ; paid plans may add a custom domain. */
export const storeHost = (slug: string, custom?: string | null) => custom || `${slug}.${STORE_DOMAIN}`;
export const storeUrl = (slug: string, custom?: string | null) => `https://${storeHost(slug, custom)}`;

export const RVIOS = {
  whatsapp: "+967739008083",
  whatsappLink: "https://wa.me/967739008083",
  instagram: "@rvios_tech",
  instagramLink: "https://instagram.com/rvios_tech",
  facebookLink: "https://www.facebook.com/profile.php?id=61593186581618",
  website: "www.rvios.com",
  websiteLink: "https://www.rvios.com",
};

/**
 * AzmSmart owns accounts and store management (products, orders, plan). Live once
 * NEXT_PUBLIC_AZMSMART_URL points at it — the same system the unified backend serves.
 */
const AZM_URL = (process.env.NEXT_PUBLIC_AZMSMART_URL ?? "").replace(/\/+$/, "");
export const AZMSMART = {
  live: !!AZM_URL,
  name: "AzmSmart",
  login: `${AZM_URL || "https://azmsmart.rvios.com"}/login`,
  account: `${AZM_URL || "https://azmsmart.rvios.com"}/profile`,
  /** the merchant's store dashboard — AzmSmart opens their current store after sign-in */
  manageStore: (_slug: string) => `${AZM_URL || "https://azmsmart.rvios.com"}/dashboard`,
};
