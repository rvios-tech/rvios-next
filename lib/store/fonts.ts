/**
 * Fonts a merchant can pick in "شكل المتجر": a display face for headings and a text face for the rest.
 * Values are the CSS variables the store layout loads. AzmSmart lists the same ids
 * (`src/lib/shop/store-fonts.ts`); an unknown id falls back to the template's own font.
 */
export const DISPLAY_FONTS: Record<string, string> = {
  foda: "var(--fd-foda)", hacen: "var(--fd-hacen)", palestine: "var(--fd-palestine)", medad: "var(--fd-medad)",
  milan: "var(--fd-milan)", maghfira: "var(--fd-maghfira)", typocar: "var(--fd-typocar)", cortoba: "var(--fd-cortoba)",
  zain: "var(--f-zain)", thmanyah: "var(--f-th)", cairo: "var(--fg-cairo)", tajawal: "var(--fg-tajawal)", kufi: "var(--fg-kufi)",
};

export const BODY_FONTS: Record<string, string> = {
  zain: "var(--f-zain)", thmanyah: "var(--f-th)", cairo: "var(--fg-cairo)", tajawal: "var(--fg-tajawal)",
  plex: "var(--fg-plex)", almarai: "var(--fg-almarai)", kufi: "var(--fg-kufi)",
};
