/* sitemap.xml per host: a store's own pages on the store's host (subdomain or custom domain), and
   the platform pages plus every store without a custom domain on the platform's host. Only the
   canonical URLs of each page — see lib/seo.ts. */
import { storeUrl } from "@/lib/config";
import { hostSite, liveStores } from "@/lib/host";
import { storeContext } from "@/lib/seo";
import { canonicalSlot } from "@/lib/store/merge";

const xml = (urls: { loc: string; lastmod?: string }[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u.loc.replace(/&/g, "&amp;")}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n") +
  `\n</urlset>\n`;

export async function GET() {
  const site = await hostSite();
  let urls: { loc: string; lastmod?: string }[] = [];
  if (site.kind === "store") {
    const ctx = await storeContext(site.slug);
    // a store reached at a non-canonical host lists nothing here — its canonical host has the sitemap
    if (ctx && new URL(ctx.base).host === new URL(site.origin).host) {
      const products = ctx.def.products.filter((p) => p.srcId && canonicalSlot(ctx.def, p.id) === p.id);
      urls = [{ loc: `${ctx.base}/` }, ...products.map((p) => ({ loc: `${ctx.base}/p/${p.id}` }))];
    }
  } else {
    const stores = await liveStores();
    urls = [
      ...["/", "/templates", "/create"].map((p) => ({ loc: site.origin + p })),
      ...stores.filter((s) => !s.customDomain).map((s) => ({ loc: `${storeUrl(s.slug)}/`, lastmod: s.updatedAt.slice(0, 10) })),
    ];
  }
  return new Response(xml(urls), { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
