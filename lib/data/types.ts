/* Data contracts shared by the demo (localStorage) and Supabase repositories.
   Store management (products, orders, account) lives in AzmSmart; RVIOS Store only creates stores and serves storefronts. */
export type PlanId = "free" | "pro" | "biz";
export type Billing = "month" | "year";
export type MStore = {
  slug: string; nameAr: string; nameEn: string; color: string; whatsapp: string; email: string;
  templateId: string; planId: PlanId; billing?: Billing; customDomain?: string | null;
  status: "active" | "pending_payment"; createdAt: string;
};
export type MCategory = { id: string; nameAr: string; nameEn: string };
export type MProduct = {
  id: string; categoryId: string | null; nameAr: string; nameEn: string; descAr: string; descEn: string;
  price: number; oldPrice?: number | null; img: string; variantLabel?: string; variantOptions?: string[];
  stock?: number | null; badge?: "best" | "new" | "sale" | null; visible: boolean;
};
export type CreateStoreInput = {
  slug: string; nameAr: string; nameEn?: string; color: string; whatsapp: string; email: string;
  templateId: string; planId: PlanId; billing: Billing; customDomain?: string;
  payment?: { method: "jaib" | "kuraimi"; amount: number; file?: File };
};
export type PlaceOrderInput = { slug: string; items: { productId: string; option?: string; qty: number; name?: string; price?: number }[]; customer: { name: string; phone: string; city: string; address: string; notes?: string }; coupon?: string };

export interface Repo {
  mode: "demo" | "supabase";
  subscribe(cb: () => void): () => void;
  slugTaken(slug: string): Promise<boolean>;
  createStore(input: CreateStoreInput): Promise<MStore>;
  storeBySlug(slug: string): Promise<{ store: MStore; categories: MCategory[]; products: MProduct[] } | null>;
  placeOrder(input: PlaceOrderInput): Promise<{ number: number; total: number }>;
}
