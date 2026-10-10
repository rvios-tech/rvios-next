import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { ldJson, storeContext, storeJsonLd, storeMetadata } from "@/lib/seo";
import { DEFS } from "@/templates/defs";

export const generateStaticParams = () => DEFS.map((d) => ({ store: d.slug }));
export async function generateMetadata({ params }: { params: Promise<{ store: string }> }): Promise<Metadata> {
  return storeMetadata((await params).store);
}
export default async function StoreHome({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  const ctx = await storeContext(store);
  return (
    <>
      {ctx && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(storeJsonLd(ctx)) }} />}
      <StoreRoot slug={store} view={{ v: "home" }} />
    </>
  );
}
