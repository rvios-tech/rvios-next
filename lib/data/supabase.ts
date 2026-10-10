"use client";
/* Supabase repository — active when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
   Mirrors supabase/migrations/0001_init.sql (create_store + place_order RPCs). */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MProduct, MStore, Repo } from "./types";

type Row = Record<string, unknown>;
let sb: SupabaseClient | null = null;
/** supabase-js is loaded on first use only, so stores served by another backend never download it */
const client = async () => (sb ??= (await import("@supabase/supabase-js")).createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const must = <T = any,>(r: { data: unknown; error: { message: string } | null }) => { if (r.error) throw new Error(r.error.message); return r.data as T; };
const toStore = (r: Row): MStore => ({ slug: r.slug as string, nameAr: r.name_ar as string, nameEn: (r.name_en as string) ?? "", color: r.color as string, whatsapp: (r.whatsapp as string) ?? "", email: (r.owner_email as string) ?? "",
  templateId: r.template_id as string, planId: r.plan_id as MStore["planId"], billing: (r.billing as MStore["billing"]) ?? undefined, customDomain: (r.custom_domain as string) ?? null, status: r.status as MStore["status"], createdAt: r.created_at as string });
const toProduct = (r: Row): MProduct => ({ id: r.id as string, categoryId: (r.category_id as string) ?? null, nameAr: r.name_ar as string, nameEn: (r.name_en as string) ?? "", descAr: (r.description_ar as string) ?? "", descEn: (r.description_en as string) ?? "",
  price: Number(r.price), oldPrice: r.old_price == null ? null : Number(r.old_price), img: ((r.images as string[]) ?? [])[0] ?? "", variantLabel: (r.variant_label as string) ?? undefined, variantOptions: (r.variant_options as string[]) ?? undefined, stock: (r.stock as number) ?? null, badge: (r.badge as MProduct["badge"]) ?? null, visible: !!r.visible });

export const supabaseRepo: Repo = {
  mode: "supabase",
  coupons: true,
  subscribe: () => () => {},
  async slugTaken(slug) { const r = must<Row | null>(await (await client()).from("stores").select("slug").eq("slug", slug).maybeSingle()); return !!r; },
  async createStore(i) {
    let receipt: string | null = null;
    if (i.payment?.file) { receipt = `pending/${i.slug}/${Date.now()}-${i.payment.file.name}`; must(await (await client()).storage.from("receipts").upload(receipt, i.payment.file)); }
    const row = must<Row[]>(await (await client()).rpc("create_store", { p_slug: i.slug, p_name_ar: i.nameAr, p_name_en: i.nameEn ?? null, p_color: i.color, p_whatsapp: i.whatsapp, p_email: i.email, p_template: i.templateId, p_plan: i.planId, p_billing: i.billing, p_domain: i.customDomain ?? null, p_method: i.payment?.method ?? null, p_amount: i.payment?.amount ?? 0, p_receipt: receipt }));
    return toStore(row[0]);
  },
  async storeBySlug(slug) {
    const row = must<Row | null>(await (await client()).from("stores").select("*").eq("slug", slug).maybeSingle()); if (!row) return null;
    const cats = must<Row[]>(await (await client()).from("categories").select("*").eq("store_id", row.id).order("position"));
    const prods = must<Row[]>(await (await client()).from("products").select("*").eq("store_id", row.id).eq("visible", true).order("position"));
    return { store: toStore(row), categories: cats.map((c) => ({ id: c.id as string, nameAr: c.name_ar as string, nameEn: (c.name_en as string) ?? "" })), products: prods.map(toProduct) };
  },
  async placeOrder(inp) {
    const r = must<Row[]>(await (await client()).rpc("place_order", { p_slug: inp.slug, p_items: inp.items.map((i) => ({ product_id: i.productId, option: i.option, qty: i.qty })), p_customer: inp.customer, p_coupon: inp.coupon ?? null }));
    return { number: r[0].order_number as number, total: Number(r[0].order_total) };
  },
};
