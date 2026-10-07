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

/** AzmSmart will own accounts and store management. Links are ready; flip `live` when it launches. */
export const AZMSMART = {
  live: false,
  name: "AzmSmart",
  login: "https://azmsmart.rvios.com/login",
  account: "https://azmsmart.rvios.com/account",
  manageStore: (slug: string) => `https://azmsmart.rvios.com/stores/${slug}`,
};
