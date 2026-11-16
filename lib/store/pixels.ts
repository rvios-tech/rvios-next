/* أكواد التتبع الإعلانية لمتجر التاجر — المعرّفات من «إضافات المتجر» (يتحقق منها الخادم بنمط كل منصة،
   وتُفحص هنا مرة ثانية قبل حقنها). الكود نفسه نبنيه نحن: التاجر لا يلصق سكربتًا.
   الأحداث: مشاهدة صفحة، إضافة للسلة، شراء — بأسماء كل منصة. */

export type Tracking = Partial<Record<"ga4" | "gtm" | "meta" | "tiktok" | "snap" | "x" | "gsc", string>>;

const RE: Record<keyof Tracking, RegExp> = {
  ga4: /^G-[A-Z0-9]{4,16}$/,
  gtm: /^GTM-[A-Z0-9]{4,12}$/,
  meta: /^\d{8,20}$/,
  tiktok: /^[A-Z0-9]{10,30}$/,
  snap: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  x: /^[a-z0-9]{4,10}$/,
  gsc: /^[A-Za-z0-9_-]{20,80}$/,
};

/** المعرّفات الصالحة فقط */
export function validTracking(t: Tracking | undefined): Tracking {
  const out: Tracking = {};
  for (const k of Object.keys(RE) as (keyof Tracking)[]) {
    const v = t?.[k];
    if (typeof v === "string" && RE[k].test(v)) out[k] = v;
  }
  return out;
}

/** كود التحميل لكل منصة — يُحقن سكربتًا داخليًا (CSP يسمح بنطاقات هذه المنصات في صفحات المتاجر وحدها) */
export function pixelBootstrap(t: Tracking): string {
  const s: string[] = [];
  if (t.ga4) s.push(`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',${JSON.stringify(t.ga4)});`);
  if (t.gtm) s.push(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(t.gtm)});`);
  if (t.meta) s.push(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(t.meta)});fbq('track','PageView');`);
  if (t.tiktok) s.push(`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(${JSON.stringify(t.tiktok)});ttq.page();}(window,document,'ttq');`);
  if (t.snap) s.push(`(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init',${JSON.stringify(t.snap)});snaptr('track','PAGE_VIEW');`);
  if (t.x) s.push(`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config',${JSON.stringify(t.x)});`);
  return s.join("\n");
}

type W = Window & {
  gtag?: (...a: unknown[]) => void; dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void;
  ttq?: { track: (...a: unknown[]) => void; page: () => void }; snaptr?: (...a: unknown[]) => void; twq?: (...a: unknown[]) => void;
};

/** حدث تجاري لكل المنصات المحمّلة — صامت حين لا تتبّع (متاجر بلا أكواد، ومعاينة المحرر) */
export function track(
  ev: "page" | "add" | "checkout" | "purchase",
  d: { value?: number; currency?: string; id?: string; name?: string; qty?: number; ref?: string; items?: { id: string; name: string; price: number; qty: number }[] } = {},
) {
  if (typeof window === "undefined") return;
  const w = window as W;
  const cur = d.currency || "YER";
  try {
    if (ev === "page") {
      w.fbq?.("track", "PageView"); w.ttq?.page(); w.snaptr?.("track", "PAGE_VIEW");
      w.gtag?.("event", "page_view", { page_location: location.href, page_title: document.title });
      return;
    }
    if (ev === "add") {
      w.fbq?.("track", "AddToCart", { value: d.value, currency: cur, content_ids: d.id ? [d.id] : [], content_name: d.name, content_type: "product" });
      w.ttq?.track("AddToCart", { value: d.value, currency: cur, content_id: d.id, content_name: d.name, quantity: d.qty, content_type: "product" });
      w.snaptr?.("track", "ADD_CART", { price: d.value, currency: cur, item_ids: d.id ? [d.id] : [] });
      w.gtag?.("event", "add_to_cart", { currency: cur, value: d.value, items: [{ item_id: d.id, item_name: d.name, quantity: d.qty }] });
      w.dataLayer?.push({ event: "rv_add_to_cart", value: d.value, currency: cur, item_id: d.id });
      return;
    }
    if (ev === "checkout") {
      w.fbq?.("track", "InitiateCheckout", { value: d.value, currency: cur });
      w.ttq?.track("InitiateCheckout", { value: d.value, currency: cur });
      w.snaptr?.("track", "START_CHECKOUT", { price: d.value, currency: cur });
      w.gtag?.("event", "begin_checkout", { currency: cur, value: d.value });
      return;
    }
    const ids = (d.items ?? []).map((i) => i.id);
    w.fbq?.("track", "Purchase", { value: d.value, currency: cur, content_ids: ids, content_type: "product", num_items: (d.items ?? []).reduce((a, i) => a + i.qty, 0) });
    w.ttq?.track("CompletePayment", { value: d.value, currency: cur, contents: (d.items ?? []).map((i) => ({ content_id: i.id, content_name: i.name, quantity: i.qty, price: i.price })) });
    w.snaptr?.("track", "PURCHASE", { price: d.value, currency: cur, transaction_id: d.ref, item_ids: ids });
    w.twq?.("event", "tw-purchase", { value: d.value, currency: cur, conversion_id: d.ref });
    w.gtag?.("event", "purchase", { transaction_id: d.ref, currency: cur, value: d.value, items: (d.items ?? []).map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })) });
    w.dataLayer?.push({ event: "rv_purchase", value: d.value, currency: cur, transaction_id: d.ref });
  } catch { /* منصة إعلانية لا تكسر المتجر أبدًا */ }
}
