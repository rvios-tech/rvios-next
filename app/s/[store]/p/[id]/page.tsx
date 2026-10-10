import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { ldJson, productJsonLd, productMetadata, storeContext } from "@/lib/seo";
import { DEFS, defBySlug } from "@/templates/defs";

export const generateStaticParams = () => DEFS.flatMap((d) => d.products.filter((p) => !p.hidden).map((p) => ({ store: d.slug, id: p.id })));
export async function generateMetadata({ params }: { params: Promise<{ store: string; id: string }> }): Promise<Metadata> {
  const { store, id } = await params;
  return productMetadata(store, id);
}
export default async function Product({ params }: { params: Promise<{ store: string; id: string }> }) {
  const { store, id } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store) || !/^[\w-]{1,64}$/.test(id)) notFound();
  const ctx = await storeContext(store);
  const p = ctx?.def.products.find((x) => x.id === id);
  // a merchant store answers only for its own product slots — anything else is a real 404
  if (ctx && !p) notFound();
  if (!ctx && defBySlug(store) && !defBySlug(store)!.products.some((x) => x.id === id)) notFound();
  const ld = ctx && p ? await productJsonLd(ctx, p, store) : null;
  return (
    <>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />}
      <StoreRoot slug={store} view={{ v: "p", id }} />
    </>
  );
}
