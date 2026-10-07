import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateFlow } from "@/components/create/CreateFlow";
export const metadata: Metadata = { title: "أنشئ متجرك — RVIOS Store" };
export default function Create() {
  return <Suspense><CreateFlow /></Suspense>;
}
