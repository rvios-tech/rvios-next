import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { DEFS } from "@/templates/defs";

export const generateStaticParams = () => DEFS.map((d) => ({ store: d.slug }));
/** حساب العميل خاص به — لا يُفهرس */
export const metadata: Metadata = { title: "حسابي", robots: { index: false, follow: false } };
export default async function Account({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreRoot slug={store} view={{ v: "account" }} />;
}
