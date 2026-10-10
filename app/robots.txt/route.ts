/* robots.txt per host — checkout and order pages are private steps on every store. */
import { hostSite } from "@/lib/host";

export async function GET() {
  const site = await hostSite();
  const body = [
    "User-agent: *",
    "Allow: /",
    ...(site.kind === "store" ? ["Disallow: /checkout", "Disallow: /order/"] : ["Disallow: /create/success", "Disallow: /s/*/checkout", "Disallow: /s/*/order/"]),
    "",
    `Sitemap: ${site.origin}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, s-maxage=3600" } });
}
