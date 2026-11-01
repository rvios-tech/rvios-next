import type { Metadata } from "next";
import { Suspense } from "react";
import { Success } from "@/components/create/Success";
import { Analytics } from "@/components/site/Analytics";
export const metadata: Metadata = { title: "متجرك — RVIOS Store", robots: { index: false } };
export default function Page() {
  return <><Analytics /><Suspense><Success /></Suspense></>;
}
