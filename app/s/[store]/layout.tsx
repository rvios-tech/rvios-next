import { notFound, permanentRedirect } from "next/navigation";
import { getCatalogue, unifiedServerOn } from "@/lib/data/unified-server";
import { defBySlug } from "@/templates/defs";
import localFont from "next/font/local";
import { StoreLayoutClient } from "@/components/store/StoreRoot";

/* Arabic display faces for the stores' large headings — each template picks one in store-common.css.
   Not preloaded: a page only downloads the face its template actually uses. */
const foda = localFont({ src: "../../fonts/display/foda.ttf", variable: "--fd-foda", preload: false, display: "swap" });
const hacen = localFont({ src: "../../fonts/display/hacen-samra.ttf", variable: "--fd-hacen", preload: false, display: "swap" });
const palestine = localFont({ src: "../../fonts/display/palestine.ttf", variable: "--fd-palestine", preload: false, display: "swap" });
const medad = localFont({ src: "../../fonts/display/medad.ttf", variable: "--fd-medad", preload: false, display: "swap" });
const milan = localFont({ src: "../../fonts/display/milan-display-black.otf", variable: "--fd-milan", preload: false, display: "swap" });
const maghfira = localFont({ src: "../../fonts/display/maghfira.ttf", variable: "--fd-maghfira", preload: false, display: "swap" });
const typocar = localFont({ src: "../../fonts/display/typocar.ttf", variable: "--fd-typocar", preload: false, display: "swap" });
const cortoba = localFont({ src: "../../fonts/display/cortoba.ttf", variable: "--fd-cortoba", preload: false, display: "swap" });
const FONTS = [foda, hacen, palestine, medad, milan, maghfira, typocar, cortoba].map((f) => f.variable).join(" ");

export default async function StoreLayout({ children, params }: { children: React.ReactNode; params: Promise<{ store: string }> }) {
  const { store } = await params; if (!/^[a-z0-9-]{3,40}$/.test(store)) notFound();
  // merchant stores render on the server with their real data; demo template stores stay static
  const r = unifiedServerOn && !defBySlug(store) ? await getCatalogue(store) : null;
  if (r?.status === "moved") permanentRedirect(`/s/${r.slug}`); // an old link — one 308 to the current one
  if (r?.status === "missing") notFound(); // a real 404 status, not an empty page search engines index
  const initial = r?.status === "ok" ? r.data : undefined;
  return <div className={FONTS} style={{ display: "contents" }}><StoreLayoutClient slug={store} initial={initial}>{children}</StoreLayoutClient></div>;
}
