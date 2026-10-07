import type { Metadata } from "next";
import { MarketPage } from "@/components/market/MarketPage";
export const metadata: Metadata = { title: "قوالب RVIOS Store — قوالب متاجر احترافية" };
export default function Templates() {
  return <MarketPage />;
}
