"use client";
/* Customer accounts on a merchant store — phone + one-time code, session per store in localStorage.
   The backend decides whether accounts exist at all (def.accounts: a message provider is connected). */
import { useCallback, useEffect, useState } from "react";

const API = (process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "").replace(/\/+$/, "");
const EVT = "rv-customer";

export type Me = { id: string; name: string; phone: string; address: string; wallet: number; points: number };
export type AccountOrder = { ref: string; status: number; statusLabel: string; total: number; walletPaid: number; createdAt: string; _count: { items: number }; items: { name: string }[] };
export type WalletTx = { id: string; amount: number; kind: string; note: string; createdAt: string };
export type Notice = { id: string; kind: string; title: string; body: string; link: string; readAt: string | null; createdAt: string };

const key = (slug: string) => `rv-cust-${slug}`;
export const customerToken = (slug: string) => { try { return localStorage.getItem(key(slug)) ?? ""; } catch { return ""; } };

export class AccountError extends Error { constructor(m: string, readonly status: number) { super(m); } }

export async function accountCall<T>(slug: string, method: string, path: string, body?: unknown): Promise<T> {
  const token = customerToken(slug);
  let res: Response;
  try {
    res = await fetch(`${API}/shop/storefront/${encodeURIComponent(slug)}/account${path}`, {
      method,
      headers: { ...(body ? { "content-type": "application/json" } : {}), ...(token ? { "x-customer-token": token } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AccountError("تعذّر الاتصال — تحقّق من الإنترنت.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // جلسة منتهية: تُنسى فيظهر زر الدخول من جديد
    if (res.status === 401 && token) { try { localStorage.removeItem(key(slug)); } catch {} window.dispatchEvent(new Event(EVT)); }
    const m = (data as { message?: unknown }).message;
    throw new AccountError(typeof m === "string" ? m : Array.isArray(m) ? String(m[0]) : `تعذّر الطلب (${res.status})`, res.status);
  }
  return data as T;
}

/** حالة حساب العميل في متجر — يتزامن بين كل المكوّنات (زر الحساب، الإتمام، صفحة الحساب) */
export function useCustomer(slug: string, enabled = true) {
  const [me, setMe] = useState<Me | null>(null);
  const [unread, setUnread] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled || !customerToken(slug)) { setMe(null); setUnread(0); setReady(true); return; }
    try {
      const r = await accountCall<{ customer: Me; unread: number }>(slug, "GET", "");
      setMe(r.customer); setUnread(r.unread);
    } catch { setMe(null); }
    setReady(true);
  }, [slug, enabled]);

  useEffect(() => {
    void refresh();
    const on = () => void refresh();
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, [refresh]);

  return {
    me, unread, ready, refresh,
    requestCode: (phone: string) => accountCall<{ phone: string }>(slug, "POST", "/otp", { phone }),
    verify: async (phone: string, code: string) => {
      const r = await accountCall<{ token: string }>(slug, "POST", "/verify", { phone, code });
      try { localStorage.setItem(key(slug), r.token); } catch {}
      window.dispatchEvent(new Event(EVT));
    },
    logout: () => { try { localStorage.removeItem(key(slug)); } catch {} window.dispatchEvent(new Event(EVT)); },
    changed: () => window.dispatchEvent(new Event(EVT)),
  };
}
