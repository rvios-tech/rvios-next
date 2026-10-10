/* RVIOS contact details by visitor country — the single source for the number, its WhatsApp
   link and the location line on the platform's own pages (store pages show the merchant's).

   How the country reaches the page without a cached page leaking one country's number to another:
     1. middleware.ts reads the visitor's country from a header the host adds after its own GeoIP
        lookup (Vercel / Cloudflare / CloudFront) and stores the region in REGION_COOKIE.
     2. The HTML is the same for everyone (static, safe to cache): each contact block is rendered
        for every region by <ByRegion>, each copy tagged data-only="<region>".
     3. A tiny <head> script puts the region on <html> before first paint and a CSS rule hides the
        other copies — no flash, and the number never shows without its own tel/WhatsApp link,
        since both live in the same copy.

   IP geolocation is approximate (VPNs, mobile carriers): ?region=sa | ?region=ye pins it for a year. */
import type { Lang } from "./u";

export type Region = "sa" | "ye";

export interface RegionContact {
  /** international digits only — for wa.me and tel: */
  whatsapp: string;
  display: string;
  location: Record<Lang, string>;
  timeZone: string;
  /** example number in phone inputs */
  phoneHint: string;
}

export const CONTACTS: Record<Region, RegionContact> = {
  sa: { whatsapp: "966551341301", display: "+966 551341301", location: { ar: "الرياض", en: "Riyadh" }, timeZone: "Asia/Riyadh", phoneHint: "+966 5XX XXX XXX" },
  ye: { whatsapp: "967739008083", display: "+967 739008083", location: { ar: "اليمن", en: "Yemen" }, timeZone: "Asia/Aden", phoneHint: "+967 7XX XXX XXX" },
};

export const REGIONS = Object.keys(CONTACTS) as Region[];

/** outside Saudi Arabia — and whenever the country is unknown — the Yemeni number */
export const DEFAULT_REGION: Region = "ye";

/** ISO-3166 alpha-2 country → region */
export const regionOfCountry = (cc: string | null | undefined): Region => (cc?.toUpperCase() === "SA" ? "sa" : "ye");
export const isRegion = (v: string | null | undefined): v is Region => !!v && v in CONTACTS;

export const REGION_COOKIE = "rv-region";
export const REGION_PIN_COOKIE = "rv-region-pin";

export const waHref = (c: RegionContact, text?: string) => `https://wa.me/${c.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** sets the region on <html> before first paint (cookie, else the default) */
export const regionScript = `try{var m=document.cookie.match(/(?:^|; )${REGION_COOKIE}=([a-z]+)/),r=m&&m[1];document.documentElement.dataset.region=${JSON.stringify(REGIONS)}.indexOf(r)>-1?r:${JSON.stringify(DEFAULT_REGION)}}catch(e){}`;

/** hides every copy that isn't the page's region; with no attribute (script blocked) the default shows */
export const regionCss = [
  "[data-only]{display:contents}",
  ...REGIONS.map((r) =>
    r === DEFAULT_REGION
      ? `html[data-region]:not([data-region="${r}"]) [data-only="${r}"]{display:none!important}`
      : `html:not([data-region="${r}"]) [data-only="${r}"]{display:none!important}`,
  ),
].join("");
