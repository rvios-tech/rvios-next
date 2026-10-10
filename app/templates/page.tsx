import type { Metadata } from "next";
import { MarketPage } from "@/components/market/MarketPage";
import { Analytics } from "@/components/site/Analytics";
export const metadata: Metadata = { title: "قوالب RVIOS Store — قوالب متاجر احترافية" };
export default function Templates() {
  return <><Analytics /><MarketPage /></>;
}
