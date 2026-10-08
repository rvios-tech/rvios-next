"use client";
/* Unified-backend repository — active when NEXT_PUBLIC_UNIFIED_API_URL is set.
   The same backend AzmSmart runs on: stores, catalogue, orders and billing live there, and
   merchants manage their store (products, orders, plan) from AzmSmart with the account they
   create here. RVIOS Store only creates stores and serves storefronts. */
import { DEFS } from "@/templates/defs";
import { U } from "@/lib/u";
import type { CreateStoreInput, MCategory, MProduct, MStore, PlaceOrderInput, PlanId, ProductReviews, Repo, TrackedOrder } from "./types";

const API = (process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "").replace(/\/+$/, "");

/** Backend plan codes ↔ the platform's: Pro = plus, Business = pro. */
const PLAN_CODE: Record<Exclude<PlanId, "free">, "plus" | "pro"> = { pro: "plus", biz: "pro" };

type Json = Record<string, unknown>;

/** Arabic error text exactly as the backend wrote it (`{ message }`). */
export class UnifiedError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) { super(message); }
}

async function call<T = Json>(method: string, path: string, opts: { token?: string; body?: unknown; form?: FormData } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: { ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}), ...(opts.body ? { "content-type": "application/json" } : {}) },
      body: opts.form ?? (opts.body ? JSON.stringify(opts.body) : undefined),
    });
  } catch {
    throw new UnifiedError("تعذّر الاتصال بالخادم — تحقّق من الإنترنت ثم أعد المحاولة.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) {
    const m = data.message;
    const message = typeof m === "string" ? m : Array.isArray(m) && m.length ? String(m[0]) : `تعذّر إتمام الطلب (${res.status})`;
    throw new UnifiedError(message, res.status, typeof data.code === "string" ? data.code : undefined);
  }
  return data as T;
}

/** WhatsApp numbers arrive international (digits only); the backend validates per country. */
const DIAL: [string, string][] = [["967", "YE"], ["966", "SA"], ["971", "AE"], ["968", "OM"], ["974", "QA"], ["965", "KW"], ["973", "BH"], ["962", "JO"], ["964", "IQ"], ["963", "SY"], ["961", "LB"], ["970", "PS"], ["249", "SD"], ["218", "LY"], ["216", "TN"], ["213", "DZ"], ["212", "MA"], ["222", "MR"], ["20", "EG"]];
const countryOf = (digits: string) => DIAL.find(([d]) => digits.startsWith(d))?.[1] ?? "YE";

const toStore = (s: Json): MStore => ({
  slug: s.slug as string, nameAr: s.name as string, nameEn: "", color: (s.color as string) ?? "#C1272D",
  whatsapp: (s.whatsapp as string) ?? "", email: "", templateId: (s.template as string) ?? "essential",
  planId: ((s.planTier as PlanId) ?? "free"), customDomain: (s.customDomain as string) ?? null, status: "active", createdAt: (s.createdAt as string) ?? "",
});

const toProduct = (p: Json): MProduct => {
  const axes = (p.axes as { name: string; values: { value: string }[] }[]) ?? [];
  const old = p.oldPrice as number | null;
  return {
    id: p.id as string, categoryId: (p.categoryId as string) ?? null, nameAr: p.name as string, nameEn: "",
    descAr: ((p.description as string) || (p.summary as string)) ?? "", descEn: "",
    price: Number(p.price), oldPrice: old ?? null, img: (p.image as string) ?? "",
    // the templates show one option row — the first axis (size, colour…) carries the choice
    variantLabel: axes[0]?.name, variantOptions: axes[0]?.values.map((v) => v.value),
    stock: (p.qty as number) ?? null, badge: old && old > Number(p.price) ? "sale" : null, visible: true,
  };
};

async function catalogue(slug: string, hops = 0): Promise<{ store: MStore; categories: MCategory[]; products: MProduct[] } | null> {
  let c: Json;
  try { c = await call("GET", `/shop/storefront/${encodeURIComponent(slug)}/catalogue`); }
  catch (e) { if (e instanceof UnifiedError && (e.status === 404 || e.status === 410)) return null; throw e; }
  // an old link redirects to the store's current one
  if (typeof c.moved === "string") return hops < 2 ? catalogue(c.moved, hops + 1) : null;
  return {
    store: toStore(c.store as Json),
    categories: ((c.categories as Json[]) ?? []).map((x) => ({ id: x.id as string, nameAr: x.name as string, nameEn: "" })),
    products: ((c.products as Json[]) ?? []).map(toProduct),
  };
}

/** Opens (or creates) the merchant's AzmSmart account; the store belongs to its company. */
async function account(i: CreateStoreInput): Promise<string> {
  const owner = i.owner;
  if (!owner?.password) throw new UnifiedError("اكتب كلمة مرور لحسابك في AzmSmart", 400);
  try {
    const r = await call<{ accessToken: string }>("POST", "/auth/register", {
      body: { email: i.email, password: owner.password, displayName: owner.name || i.nameAr, companyName: i.nameAr },
    });
    return r.accessToken;
  } catch (e) {
    // already a merchant: the same email signs in, and the new store joins their company
    if (e instanceof UnifiedError && e.status === 409) {
      const r = await call<{ accessToken: string }>("POST", "/auth/login", { body: { email: i.email, password: owner.password } });
      return r.accessToken;
    }
    throw e;
  }
}

/**
 * A new store starts with its template's sample catalogue (as in the demo), so it looks complete on
 * day one and the merchant edits rather than fills an empty grid. Stops quietly at the plan's limit.
 */
async function seedSample(token: string, storeId: string, templateId: string) {
  const tpl = DEFS.find((d) => d.id === templateId) ?? DEFS.find((d) => d.id === "essential")!;
  const catIds: string[] = [];
  for (const [k, c] of tpl.cats.entries()) {
    const r = await call<{ id: string }>("POST", `/shop/stores/${storeId}/categories`, { token, body: { name: c.ar, sort: k } }).catch(() => null);
    catIds[k] = r?.id ?? "";
  }
  for (const [k, p] of tpl.products.filter((x) => !x.hidden).entries()) {
    const opts = p.variant?.options.map((o) => (typeof o === "string" ? o : o.ar)) ?? [];
    const body = {
      name: p.name.ar, description: p.desc.ar, price: Math.round(p.price), ...(p.old ? { oldPrice: Math.round(p.old) } : {}),
      qty: p.stock ?? 20, image: U(p.img, 1200), sort: k, live: true, ...(catIds[p.cat] ? { categoryId: catIds[p.cat] } : {}),
      ...(opts.length ? { opt1Name: p.variant!.label.ar, variants: opts.map((v) => ({ v1: v, qty: p.stock ?? 20 })) } : {}),
    };
    try { await call("POST", `/shop/stores/${storeId}/products`, { token, body }); }
    catch (e) { if (e instanceof UnifiedError && e.status === 409) break; throw e; }
  }
}

export const unifiedRepo: Repo = {
  mode: "unified",
  coupons: false,
  subscribe: () => () => {},

  async slugTaken(slug) {
    const r = await call<{ ok: boolean }>("GET", `/shop/storefront/slug/check?q=${encodeURIComponent(slug)}`);
    return !r.ok;
  },

  async createStore(i) {
    const token = await account(i);
    const digits = i.whatsapp.replace(/\D/g, "");
    const { store } = await call<{ store: { id: string } }>("POST", "/shop/stores", {
      token, body: { name: i.nameAr, slug: i.slug, whatsapp: digits, country: countryOf(digits), color: i.color },
    });
    const free = i.planId === "free";
    // the free template is set now; a paid one becomes the store's template once its invoice receipt lands
    await call("PATCH", `/shop/stores/${store.id}`, { token, body: { colorDeep: i.color, ...(free || i.templateId === "essential" ? { template: "essential" } : {}) } });

    if (!free) {
      // one transfer, one receipt — attached to every invoice it pays (plan, then template)
      let proofKey = "";
      if (i.payment?.file) {
        const form = new FormData(); form.append("file", i.payment.file);
        proofKey = (await call<{ url: string }>("POST", `/uploads?storeId=${store.id}`, { token, form })).url;
      }
      const sub = await call<{ id: string }>("POST", "/shop/invoices", {
        token, body: { storeRef: store.id, kind: 0, plan: PLAN_CODE[i.planId as Exclude<PlanId, "free">], months: i.billing === "year" ? 12 : 1 },
      });
      if (proofKey) await call("POST", `/shop/invoices/${sub.id}/proof`, { token, body: { method: i.payment?.method, proofKey } });
      if (i.templateId !== "essential") {
        try {
          const tpl = await call<{ id: string }>("POST", "/shop/invoices", { token, body: { storeRef: store.id, kind: 4, template: i.templateId } });
          if (proofKey) await call("POST", `/shop/invoices/${tpl.id}/proof`, { token, body: { method: i.payment?.method, proofKey } });
        } catch (e) {
          // free for this plan (Business + standard): no purchase, just pick it
          if (e instanceof UnifiedError && e.code === "TEMPLATE_FREE") await call("PATCH", `/shop/stores/${store.id}`, { token, body: { template: i.templateId } });
          else throw e;
        }
      }
    }
    // the custom domain is a paid-plan feature — set once the plan is active (after the receipt)
    let domain: string | null = null;
    if (!free && i.customDomain?.trim()) {
      try {
        const r = await call<{ store: { customDomain: string | null } }>("PATCH", `/shop/stores/${store.id}`, { token, body: { customDomain: i.customDomain.trim() } });
        domain = r.store.customDomain;
      } catch { /* a bad or taken domain must not fail a store that was paid for — it's set later from AzmSmart */ }
    }
    // after the plan: a paid plan's higher product limit applies to the samples too
    await seedSample(token, store.id, free ? "essential" : i.templateId).catch(() => undefined);
    return {
      slug: i.slug, nameAr: i.nameAr, nameEn: i.nameEn ?? "", color: i.color, whatsapp: digits, email: i.email,
      templateId: free ? "essential" : i.templateId, planId: i.planId, billing: i.billing, customDomain: domain,
      status: free ? "active" : "pending_payment", createdAt: new Date().toISOString(),
    };
  },

  storeBySlug: (slug) => catalogue(slug),

  async placeOrder(inp: PlaceOrderInput) {
    // the cart keeps the chosen option's text; the backend wants the variant behind it
    const lines = await Promise.all(inp.items.map(async (it) => {
      if (!it.option) return { id: it.productId, qty: it.qty };
      const d = await call<{ product: { variants: { id: string; v1: string; v2: string; label: string }[] } }>(
        "GET", `/shop/storefront/${encodeURIComponent(inp.slug)}/products/${it.productId}`);
      const v = d.product.variants.find((x) => x.v1 === it.option || x.label === it.option || `${x.v1} / ${x.v2}` === it.option);
      return { id: it.productId, ...(v ? { variantId: v.id } : {}), qty: it.qty };
    }));
    const c = inp.customer;
    const r = await call<{ ref: string; total: number }>("POST", `/shop/storefront/${encodeURIComponent(inp.slug)}/orders`, {
      body: { lines, name: c.name, phone: c.phone, address: [c.city, c.address].filter(Boolean).join(" — "), note: c.notes ?? "" },
    });
    return { number: r.ref, total: Number(r.total) };
  },

  productReviews: (slug, productId) =>
    call<ProductReviews>("GET", `/shop/storefront/${encodeURIComponent(slug)}/products/${productId}/reviews`),

  async trackOrder(slug, ref) {
    try { return await call<TrackedOrder>("GET", `/shop/storefront/${encodeURIComponent(slug)}/orders/${encodeURIComponent(ref)}`); }
    catch (e) { if (e instanceof UnifiedError && e.status === 404) return null; throw e; }
  },

  async submitReview(slug, ref, input) {
    await call("POST", `/shop/storefront/${encodeURIComponent(slug)}/orders/${encodeURIComponent(ref)}/reviews`, { body: input });
  },
};
