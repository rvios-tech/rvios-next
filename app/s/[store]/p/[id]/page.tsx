import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { DEFS, defBySlug } from "@/templates/defs";

export const generateStaticParams = () => DEFS.flatMap((d) => d.products.filter((p) => !p.hidden).map((p) => ({ store: d.slug, id: p.id })));
export default async function Product({ params }: { params: Promise<{ store: string; id: string }> }) {
  const { store, id } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store) || !defBySlug(store) && !id) notFound();
  return <StoreRoot slug={store} view={{ v: "p", id }} />;
}
