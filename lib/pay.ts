/* RVIOS payment accounts (Al-Kuraimi, Jaib, Jawali…) — set by the platform team in AzmSmart
   (platform settings) and served by `GET /shop/public/payment-accounts`. The defaults below keep the
   page useful when the backend is unreachable; they mirror the backend's own defaults. */

export type PayAccount = {
  id: string; provider: string; providerName: string; providerNameEn: string;
  kind: "bank" | "wallet" | "intl" | string; color: string;
  title: string; holder: string; number: string; currency: string; qr: string; note: string;
};

export const DEFAULT_PAY_ACCOUNTS: PayAccount[] = [
  { id: "kuraimi-yer", provider: "kuraimi", providerName: "بنك الكريمي", providerNameEn: "Al-Kuraimi Bank", kind: "bank", color: "#6B3FA0",
    title: "حساب جاري — ريال يمني", holder: "", number: "3075249852", currency: "YER", qr: "", note: "إيداع أو حوالة إلى الحساب من أي فرع أو من تطبيق الكريمي." },
  { id: "kuraimi-usd", provider: "kuraimi", providerName: "بنك الكريمي", providerNameEn: "Al-Kuraimi Bank", kind: "bank", color: "#6B3FA0",
    title: "حساب جاري — دولار أمريكي", holder: "", number: "3204875528", currency: "USD", qr: "", note: "للدفع بالدولار من داخل اليمن أو خارجه." },
  { id: "jaib", provider: "jaib", providerName: "محفظة جيب", providerNameEn: "Jaib Wallet", kind: "wallet", color: "#E31E24",
    title: "محفظة جيب", holder: "", number: "601762", currency: "", qr: "/pay/jaib-qr.png", note: "امسح الرمز من تطبيق جيب، أو حوّل إلى رقم المحفظة." },
  { id: "jawali", provider: "jawali", providerName: "محفظة جوالي", providerNameEn: "Jawali Wallet", kind: "wallet", color: "#0E7C86",
    title: "محفظة جوالي", holder: "رياش فيصل البريهي", number: "778211887", currency: "", qr: "/pay/jawali-qr.png", note: "امسح الرمز من تطبيق جوالي، أو حوّل إلى رقم المحفظة." },
];

const API = (process.env.UNIFIED_API_URL || process.env.NEXT_PUBLIC_UNIFIED_API_URL || "").replace(/\/+$/, "");

/** Server-side: the live accounts (cached 5 min), or the defaults. */
export async function payAccounts(): Promise<PayAccount[]> {
  if (!API) return DEFAULT_PAY_ACCOUNTS;
  try {
    const res = await fetch(`${API}/shop/public/payment-accounts`, { next: { revalidate: 300, tags: ["pay-accounts"] } });
    if (!res.ok) return DEFAULT_PAY_ACCOUNTS;
    const j = (await res.json()) as { accounts?: PayAccount[] };
    return Array.isArray(j.accounts) && j.accounts.length ? j.accounts : DEFAULT_PAY_ACCOUNTS;
  } catch {
    return DEFAULT_PAY_ACCOUNTS;
  }
}

/** Browser-side: same source, for the create flow's last step. */
export async function payAccountsClient(): Promise<PayAccount[]> {
  const base = (process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "").replace(/\/+$/, "");
  if (!base) return DEFAULT_PAY_ACCOUNTS;
  try {
    const res = await fetch(`${base}/shop/public/payment-accounts`);
    if (!res.ok) return DEFAULT_PAY_ACCOUNTS;
    const j = (await res.json()) as { accounts?: PayAccount[] };
    return Array.isArray(j.accounts) && j.accounts.length ? j.accounts : DEFAULT_PAY_ACCOUNTS;
  } catch {
    return DEFAULT_PAY_ACCOUNTS;
  }
}

export const CURRENCY_NAME: Record<string, { ar: string; en: string }> = {
  YER: { ar: "ريال يمني", en: "Yemeni rial" },
  USD: { ar: "دولار أمريكي", en: "US dollar" },
  SAR: { ar: "ريال سعودي", en: "Saudi riyal" },
};
