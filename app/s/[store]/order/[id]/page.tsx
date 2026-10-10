import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { defBySlug } from "@/templates/defs";

/** checkout and order pages are private steps — never in search results */
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Order({ params }: { params: Promise<{ store: string; id: string }> }) {
  const { store, id } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreRoot slug={store} view={{ v: "order", id }} />;
}
