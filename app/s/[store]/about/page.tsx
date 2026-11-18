import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { storeMetadata } from "@/lib/seo";
import { DEFS } from "@/templates/defs";

export const generateStaticParams = () => DEFS.map((d) => ({ store: d.slug }));
export async function generateMetadata({ params }: { params: Promise<{ store: string }> }): Promise<Metadata> {
  const m = await storeMetadata((await params).store);
  const name = typeof m.title === "object" && m.title && "absolute" in m.title ? m.title.absolute : String(m.title ?? "");
  return { ...m, title: { absolute: `من نحن — ${name}` } };
}
export default async function StoreAbout({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreRoot slug={store} view={{ v: "about" }} />;
}
