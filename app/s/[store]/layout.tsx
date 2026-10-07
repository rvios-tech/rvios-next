import { notFound } from "next/navigation";
import { StoreLayoutClient } from "@/components/store/StoreRoot";
import { defBySlug } from "@/templates/defs";

export default async function StoreLayout({ children, params }: { children: React.ReactNode; params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  return <StoreLayoutClient slug={store}>{children}</StoreLayoutClient>;
}
