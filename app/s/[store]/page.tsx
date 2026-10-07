import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { DEFS, defBySlug } from "@/templates/defs";

export const generateStaticParams = () => DEFS.map((d) => ({ store: d.slug }));
export async function generateMetadata({ params }: { params: Promise<{ store: string }> }): Promise<Metadata> {
  const d = defBySlug((await params).store); return { title: d ? `${d.name.ar} — ${d.name.en}` : "RVIOS Store" };
}
export default async function StoreHome({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreRoot slug={store} view={{ v: "home" }} />;
}
