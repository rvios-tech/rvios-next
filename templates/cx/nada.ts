import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "pill", card: "soft", logo: "ن", foot: { ar: "عدن، المعلا — منتجات أصلية من الوكيل", en: "Mualla, Aden — genuine products" },
  def: {
    id: "nada", slug: "nada-care", plan: "biz", price: 32, tplName: { ar: "قالب ندى", en: "Nada template" },
    name: { ar: "ندى للعناية", en: "Nada Care" },
    cats: [{ ar: "العناية بالبشرة", en: "Skincare" }, { ar: "مكياج", en: "Makeup" }, { ar: "الشعر", en: "Hair" }],
    copy: {
      kick: { ar: "روتين بسيط، نتيجة واضحة", en: "Simple routine, real results" }, h1: { ar: "بشرتك تستحق اللطف", en: "Your skin deserves kindness" },
      sub: { ar: "منتجات عناية أصلية ومختارة لبشرة المناخ اليمني، مع استشارة مجانية لروتينك.", en: "Genuine skincare picked for Yemen's climate, with a free routine consultation." }, cta: { ar: "ابدئي روتينك", en: "Start your routine" },
      catsT: { ar: "حسب الاحتياج", en: "Shop by need" }, mq: { ar: ["خالٍ من البارابين", "مختبر جلدياً", "أصلي ١٠٠٪", "استشارة مجانية"], en: ["Paraben free", "Dermatologist tested", "100% genuine", "Free consultation"] },
      dealT: { ar: "عرض اليوم", en: "Today's offer" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "سيروم فيتامين C", en: "Vitamin C Serum" }, price: 16000, img: "1598440947619-2c35fc9aa908", badge: "best", desc: { ar: "يوحّد لون البشرة ويمنحها إشراقة.", en: "Evens tone and adds glow." } },
      { id: "p2", cat: 0, name: { ar: "كريم مرطب", en: "Daily Moisturiser" }, price: 12000, old: 15000, img: "1620916566398-39f1143ab7be", badge: "sale", desc: { ar: "ترطيب خفيف طوال اليوم.", en: "Light, all-day hydration." } },
      { id: "p3", cat: 1, name: { ar: "أحمر شفاه مطفي", en: "Matte Lipstick" }, price: 7000, img: "1612817288484-6f916006741a", variant: { label: { ar: "اللون", en: "Shade" }, options: ["Rose", "Nude", "Berry"] }, desc: { ar: "ثبات يدوم ٨ ساعات.", en: "Lasts 8 hours." } },
      { id: "p4", cat: 0, name: { ar: "غسول لطيف", en: "Gentle Cleanser" }, price: 9000, img: "1556228578-8c89e6adf883", badge: "new", desc: { ar: "ينظف دون أن يجفف.", en: "Cleans without drying." } },
      { id: "p5", cat: 2, name: { ar: "زيت الشعر", en: "Hair Oil" }, price: 11000, img: "1608248543803-ba4f8c70ae0b", desc: { ar: "أرغان وجوجوبا.", en: "Argan and jojoba." } },
      { id: "p6", cat: 0, name: { ar: "واقي شمس SPF50", en: "Sunscreen SPF50" }, price: 13000, img: "1571781926291-c477ebfd024b", desc: { ar: "خفيف ولا يترك أثراً أبيض.", en: "Light, no white cast." } },
    ],
  },
  sections: [
    { k: "hero", v: "collage", img: "1556228578-8c89e6adf883", imgs: ["1598440947619-2c35fc9aa908", "1620916566398-39f1143ab7be", "1612817288484-6f916006741a"] }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "cats", v: "pills" }, { k: "grid", title: { ar: "الأكثر حباً", en: "Most loved" } }, { k: "deal", pid: "p2" },
    { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
