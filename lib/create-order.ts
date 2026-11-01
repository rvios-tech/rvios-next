import type { Billing, PlanId } from "./data/types";

export const PLAN_NAME: Record<PlanId, { ar: string; en: string }> = { free: { ar: "مجاني", en: "Free" }, pro: { ar: "احترافي", en: "Pro" }, biz: { ar: "أعمال", en: "Business" } };

/** A paid store order the team completes by hand: what the customer tells them on WhatsApp. */
export type StoreOrder = { store: string; host: string; template: string; plan: PlanId; billing: Billing; total: number; domain?: string };

export function orderMessage(lang: "ar" | "en", o: StoreOrder): string {
  const ar = lang === "ar";
  const cycle = o.billing === "year" ? (ar ? "سنوي" : "yearly") : (ar ? "شهري" : "monthly");
  return [
    ar ? "مرحبًا فريق RVIOS، أريد إكمال الدفع وإنشاء متجري:" : "Hello RVIOS team, I'd like to complete payment and create my store:",
    `${ar ? "المتجر" : "Store"}: ${o.store} (${o.host})`,
    `${ar ? "القالب" : "Template"}: ${o.template}`,
    `${ar ? "الباقة" : "Plan"}: ${PLAN_NAME[o.plan][lang]} · ${cycle}`,
    ...(o.domain ? [`${ar ? "الدومين المطلوب" : "Requested domain"}: ${o.domain}`] : []),
    `${ar ? "الإجمالي" : "Total"}: $${o.total}`,
  ].join("\n");
}
