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
  /** صاحب المتجر في AzmSmart — يلزم في الوضع الموحّد (الحساب يُنشأ مع المتجر أو يُدخل به) */
  owner?: { name: string; password: string };
};
export type PlaceOrderInput = { slug: string; items: { productId: string; option?: string; qty: number; name?: string; price?: number }[]; customer: { name: string; phone: string; city: string; address: string; notes?: string }; coupon?: string };

export interface Repo {
  mode: "demo" | "supabase" | "unified";
  /** هل يُطبَّق الكوبون في الخادم؟ — بدونه لا يُعرض خصمٌ لا يُحتسب */
  coupons: boolean;
  subscribe(cb: () => void): () => void;
  slugTaken(slug: string): Promise<boolean>;
  createStore(input: CreateStoreInput): Promise<MStore>;
  storeBySlug(slug: string): Promise<{ store: MStore; categories: MCategory[]; products: MProduct[] } | null>;
  /** `number` رقم الطلب — عدديّ في التجريبي، ومرجعيّ (RS-XXXXX) في الموحّد */
  placeOrder(input: PlaceOrderInput): Promise<{ number: number | string; total: number }>;

  // ── التقييمات — في الوضع الموحّد وحده (من مشترين فعليين بعد اكتمال الطلب) ──
  productReviews?(slug: string, productId: string): Promise<ProductReviews>;
  trackOrder?(slug: string, ref: string): Promise<TrackedOrder | null>;
  submitReview?(slug: string, ref: string, input: { itemId: string; rating: number; body: string; name?: string }): Promise<void>;
}

export type MReview = { id: string; rating: number; name: string; body: string; reply: string; createdAt: string };
export type ProductReviews = { average: number; count: number; reviews: MReview[] };
/** status: 0 قيد التأكيد · 1 مؤكد · 2 مكتمل · 3 ملغى */
export type TrackedOrder = { ref: string; status: number; items: { id: string; name: string; variant: string; reviewed: boolean }[] };
