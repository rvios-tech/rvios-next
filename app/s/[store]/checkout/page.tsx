import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { DEFS, defBySlug } from "@/templates/defs";

export const generateStaticParams = () => DEFS.map((d) => ({ store: d.slug }));
/** checkout and order pages are private steps — never in search results */
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Checkout({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreRoot slug={store} view={{ v: "checkout" }} />;
}
