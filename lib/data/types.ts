/* Data contracts shared by the demo (localStorage) and Supabase repositories.
   Store management (products, orders, account) lives in AzmSmart; RVIOS Store only creates stores and serves storefronts. */
export type PlanId = "free" | "pro" | "biz";
export type Billing = "month" | "year";
export type MStore = {
  slug: string; nameAr: string; nameEn: string; color: string; whatsapp: string; email: string;
  templateId: string; planId: PlanId; billing?: Billing; customDomain?: string | null;
  status: "active" | "pending_payment"; createdAt: string;
  logo?: string; banner?: string; showcase?: string; tagline?: string; about?: string; city?: string;
  /** تعديلات «شكل المتجر» من AzmSmart على القالب الأساسي */
  appearance?: { copy?: Record<string, string>; hidden?: string[]; images?: Record<string, string>; fonts?: { display?: string; body?: string }; social?: Record<string, string>; extras?: import("@/components/store/StoreExtras").StoreExtras };
  address?: string; hours?: string; payMethods?: string; payNote?: string; deliveryNote?: string;
  /** للمتجر قسيمة خصم مفعّلة — حقل الرمز في السلة يظهر فقط حينها */
  coupons?: boolean;
  /** رمز ISO للعملة (YER) — لأحداث التتبع الإعلانية والبيانات المنظّمة */
  currencyCode?: string;
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
  payment?: { method?: "jaib" | "kuraimi"; amount: number; file?: File };
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
  placeOrder(input: PlaceOrderInput): Promise<{ number: number | string; total: number; discount?: number }>;
  /** معاينة رمز الخصم من الخادم — الطلب يعيد التحقق والحساب */
  checkCoupon?(slug: string, code: string, subtotal: number): Promise<CouponPreview>;

  // ── التقييمات — في الوضع الموحّد وحده (من مشترين فعليين بعد اكتمال الطلب) ──
  productReviews?(slug: string, productId: string): Promise<ProductReviews>;
  /** أسئلة المنتج المُجابة، وسؤال زائر جديد */
  productQuestions?(slug: string, productId: string): Promise<ProductQuestion[]>;
  askQuestion?(slug: string, productId: string, input: { question: string; name?: string }): Promise<void>;
  /** طلب استرجاع لطلب مكتمل */
  requestReturn?(slug: string, ref: string, reason: string): Promise<void>;
  trackOrder?(slug: string, ref: string): Promise<TrackedOrder | null>;
  submitReview?(slug: string, ref: string, input: { itemId: string; rating: number; body: string; name?: string }): Promise<void>;
}

/** kind: percent · amount · ship (توصيل مجاني) */
export type CouponPreview = { code: string; kind: "percent" | "amount" | "ship"; value: number; maxDiscount: number; minSubtotal: number; label: string; discount: number };

export type ProductQuestion = { id: string; name: string; question: string; answer: string; createdAt: string; answeredAt: string | null };

export type MReview = { id: string; rating: number; name: string; body: string; reply: string; createdAt: string };
export type ProductReviews = { average: number; count: number; reviews: MReview[] };
/** status: 0 قيد التأكيد · 1 مؤكد · 4 قيد التجهيز · 5 تم الشحن · 2 مكتمل · 3 ملغى */
/** return.status: 0 قيد المراجعة · 1 مقبول · 2 مرفوض · 3 مكتمل */
export type TrackedOrder = { ref: string; status: number; cancelReason?: string; return?: { status: number; note: string; refund: number; createdAt: string } | null; items: { id: string; name: string; variant: string; reviewed: boolean }[] };
