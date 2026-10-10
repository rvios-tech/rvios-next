import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateFlow } from "@/components/create/CreateFlow";
import { Analytics } from "@/components/site/Analytics";
export const metadata: Metadata = { title: "أنشئ متجرك — RVIOS Store" };
export default function Create() {
  return <><Analytics /><Suspense><CreateFlow /></Suspense></>;
}
