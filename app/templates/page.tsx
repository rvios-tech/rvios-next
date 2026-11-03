import type { Metadata } from "next";
import { MarketPage } from "@/components/market/MarketPage";
import { Analytics } from "@/components/site/Analytics";
import { GUIDE_TEMPLATES } from "@/lib/guides";
import { breadcrumbs, PLATFORM_ORIGIN, platformMetadata, platformOrganization } from "@/lib/platform-seo";
import { ldJson } from "@/lib/seo";
export const metadata: Metadata = platformMetadata(
  "قوالب متاجر إلكترونية احترافية — 18 قالبًا | RVIOS Store",
  "18 قالب متجر إلكتروني عربي احترافي بمعاينة حية: عطور، أزياء، إلكترونيات، مطاعم، حلويات، مجوهرات وغيرها. لكل قالب هيكل وحركة مختلفة، وقوالب مجانية وأخرى مميّزة تُشترى مرة واحدة.",
  "/templates",
);
/** the catalogue as a list search engines read: each template with its live demo */
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    platformOrganization,
    {
      "@type": "ItemList", name: "قوالب متاجر إلكترونية — RVIOS Store", url: `${PLATFORM_ORIGIN}/templates`,
      itemListElement: Object.entries(GUIDE_TEMPLATES).map(([id, [name, demo, fits]], i) => ({
        "@type": "ListItem", position: i + 1, name: `قالب ${name} — ${fits}`, url: `${PLATFORM_ORIGIN}/s/${demo}`, image: `${PLATFORM_ORIGIN}/previews/${id}-desk.webp`,
      })),
    },
    breadcrumbs([["RVIOS Store", "/"], ["القوالب", "/templates"]]),
  ],
};
export default function Templates() {
  return <><Analytics /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} /><MarketPage /></>;
}
