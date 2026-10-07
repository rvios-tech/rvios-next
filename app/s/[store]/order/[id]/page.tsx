import { notFound } from "next/navigation";
import { StoreRoot } from "@/components/store/StoreRoot";
import { defBySlug } from "@/templates/defs";

export default async function Order({ params }: { params: Promise<{ store: string; id: string }> }) {
  const { store, id } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreRoot slug={store} view={{ v: "order", id }} />;
}
