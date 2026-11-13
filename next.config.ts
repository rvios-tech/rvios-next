import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * NEXT_PUBLIC_* values are baked into the bundle at build time. A production build without a
 * backend would ship demo mode — every store kept only in its visitor's browser. Stop it here.
 * ALLOW_DEMO=1 builds the demo on purpose (e.g. a showcase deployment).
 */
function assertBuildEnv() {
  if (process.env.ALLOW_DEMO === "1") return;
  const unified = process.env.NEXT_PUBLIC_UNIFIED_API_URL ?? "";
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!unified && !supabase) throw new Error("NEXT_PUBLIC_UNIFIED_API_URL is not set — the build would run in browser-only demo mode. Set it, or ALLOW_DEMO=1.");
  if (unified && /localhost|127\.0\.0\.1/.test(unified)) throw new Error(`NEXT_PUBLIC_UNIFIED_API_URL points at a local backend ("${unified}"). For a local build: ALLOW_DEMO=1.`);
  if (!process.env.NEXT_PUBLIC_AZMSMART_URL) console.warn("⚠ NEXT_PUBLIC_AZMSMART_URL is not set — AzmSmart links fall back to https://azm.rvios.com");
}

/**
 * Security headers for every page. CSP: scripts/styles from this origin (Next's inline bootstrap
 * needs 'unsafe-inline'); network calls only to this origin and the backend — so even injected
 * script can't post a session token to a foreign server via fetch; no plugins, and framing only by this site and AzmSmart (the store editor's live preview).
 * Images allow any https (merchant/product URLs). Dev adds eval + HMR websockets.
 */
const originOf = (u?: string) => { try { return u ? new URL(u).origin : ""; } catch { return ""; } };
function securityHeaders(connect: string[]) {
  const prod = process.env.NODE_ENV === "production";
  const self = "'self'";
  const azm = originOf(process.env.NEXT_PUBLIC_AZMSMART_URL) || "https://azm.rvios.com";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://www.googletagmanager.com${prod ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' blob: https:",
    "worker-src 'self' blob:",
    `connect-src 'self' https://cloudflareinsights.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com ${connect.filter(Boolean).join(" ")}${prod ? "" : " ws: wss: http://localhost:*"}`,
    `frame-src ${self}`,
    `frame-ancestors ${self} ${azm}${prod ? "" : " http://localhost:3001"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(prod ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ...(prod ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }] : []),
  ];
}

const supabase = originOf(process.env.NEXT_PUBLIC_SUPABASE_URL);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // the template preview frames this site's own demo stores, and AzmSmart's editor frames the merchant's store — frame-ancestors above allows exactly those
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders([originOf(process.env.NEXT_PUBLIC_UNIFIED_API_URL), supabase, supabase.replace(/^https/, "wss")]) },
      // تطبيق أندرويد: نوعه الصحيح + «حفظ كملف» فورًا — حتى حين يُضغط الزر من موقع آخر (rvios.com) حيث تتجاهل المتصفحات سمة download
      {
        source: "/download/:file*.apk",
        headers: [
          { key: "Content-Type", value: "application/vnd.android.package-archive" },
          { key: "Content-Disposition", value: 'attachment; filename="RVIOS.apk"' },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  // صور التجّار من R2 أو نطاق الوسائط تُصغَّر بحجم ظهورها (lib/u.ts → /_next/image) وتُخزَّن شهرًا
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.rvios.com" },
      ...(originOf(process.env.NEXT_PUBLIC_MEDIA_URL) ? [{ protocol: "https" as const, hostname: new URL(process.env.NEXT_PUBLIC_MEDIA_URL!).hostname }] : []),
    ],
  },
  // NEXT_DIST_DIR lets a production build run beside a dev server without sharing .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) assertBuildEnv();
  return nextConfig;
}
