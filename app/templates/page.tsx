import type { Metadata } from "next";
import { MarketPage } from "@/components/market/MarketPage";
import { Analytics } from "@/components/site/Analytics";
import { platformMetadata } from "@/lib/platform-seo";
export const metadata: Metadata = platformMetadata(
  "قوالب متاجر إلكترونية احترافية — 18 قالبًا | RVIOS Store",
  "18 قالب متجر إلكتروني عربي احترافي بمعاينة حية: عطور، أزياء، إلكترونيات، مطاعم، حلويات، مجوهرات وغيرها. لكل قالب هيكل وحركة مختلفة، وقوالب مجانية وأخرى مميّزة تُشترى مرة واحدة.",
  "/templates",
);
export default function Templates() {
  return <><Analytics /><MarketPage /></>;
}
