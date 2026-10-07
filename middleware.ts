import { NextResponse, type NextRequest } from "next/server";
import { STORE_DOMAIN } from "@/lib/config";

/** <slug>.rvios.store → /s/<slug>. Custom domains can be resolved here later (lookup → slug). */
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (host.endsWith("." + STORE_DOMAIN)) {
    const slug = host.slice(0, -(STORE_DOMAIN.length + 1));
    if (slug && slug !== "www") {
      const url = req.nextUrl.clone();
      if (!url.pathname.startsWith("/s/")) { url.pathname = `/s/${slug}${url.pathname === "/" ? "" : url.pathname}`; return NextResponse.rewrite(url); }
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|favicon|logo.svg|.*\\..*).*)"] };
