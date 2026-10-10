import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "center", card: "tall", logo: "س", foot: { ar: "الرياض، حي حطين — توصيل لكافة المناطق", en: "Hittin, Riyadh — nationwide delivery" },
  ann: { ar: "تعديل المقاس مجاناً على كل العبايات", en: "Free tailoring on every abaya" },
  def: {
    id: "satr", slug: "lama-abayas", plan: "biz", price: 35, tplName: { ar: "قالب سَتر", en: "Satr template" },
    name: { ar: "عبايات لمى", en: "Lama Abayas" },
    cats: [{ ar: "عبايات", en: "Abayas" }, { ar: "طرح", en: "Scarves" }, { ar: "مناسبات", en: "Occasions" }],
    copy: {
      kick: { ar: "مجموعة الربيع", en: "Spring collection" }, h1: { ar: "أناقة محتشمة، بخطوط هادئة", en: "Modest elegance, quiet lines" },
      sub: { ar: "عبايات من الكريب والحرير، تُفصَّل بالمقاس وتُطرَّز يدوياً.", en: "Crepe and silk abayas, tailored to size and hand-embroidered." }, cta: { ar: "تسوّقي المجموعة", en: "Shop the collection" },
      catsT: { ar: "تسوّقي حسب الفئة", en: "Shop by category" }, mq: { ar: ["كريب ياباني", "حرير طبيعي", "تطريز يدوي", "تفصيل بالمقاس"], en: ["Japanese crepe", "Pure silk", "Hand embroidery", "Made to measure"] },
      newsT: { ar: "كوني أول من يرى المجموعة الجديدة", en: "Be first to see the new collection" }, email: { ar: "بريدك الإلكتروني", en: "Your email" }, join: { ar: "اشتركي", en: "Subscribe" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "عباية معطف سماوية", en: "Sky-blue Coat Abaya" }, price: 38000, img: "1539109136881-3be0616acf4b", badge: "best", variant: { label: { ar: "المقاس", en: "Size" }, options: ["52", "54", "56", "58"] }, desc: { ar: "كريب ياباني ثقيل بقصة معطف طويلة.", en: "Heavy Japanese crepe in a long coat cut." } },
      { id: "p2", cat: 0, name: { ar: "عباية كاروهات", en: "Plaid Abaya" }, price: 52000, img: "1485968579580-b6d095142e6e|0.45|0.72|1.7", badge: "new", variant: { label: { ar: "المقاس", en: "Size" }, options: ["52", "54", "56"] }, desc: { ar: "صوف ناعم بنقشة مربعات وجيوب جانبية.", en: "Soft wool in a check pattern with side pockets." } },
      { id: "p3", cat: 1, name: { ar: "طرحة حرير", en: "Silk Scarf" }, price: 9000, img: "1539109136881-3be0616acf4b|0.5|0.38|2", desc: { ar: "حرير طبيعي بألوان هادئة.", en: "Pure silk in calm tones." } },
      { id: "p4", cat: 2, name: { ar: "عباية سهرة بيضاء", en: "White Evening Abaya" }, price: 78000, old: 90000, img: "1490481651871-ab68de25d43d|0.3|0.62|1.8", badge: "sale", desc: { ar: "قماش ناعم بتفاصيل دانتيل على الصدر.", en: "Soft fabric with lace detailing." } },
      { id: "p5", cat: 1, name: { ar: "شال كروشيه", en: "Crochet Shawl" }, price: 6000, img: "1434389677669-e08b4cac3105", desc: { ar: "غزل قطني ناعم بأطراف شراشيب.", en: "Soft cotton knit with a fringed edge." } },
      { id: "p6", cat: 0, name: { ar: "عباية كتان", en: "Linen Abaya" }, price: 34000, img: "1490481651871-ab68de25d43d|0.74|0.62|1.9", desc: { ar: "كتان يتنفس للصيف.", en: "Breathable linen for summer." } },
    ],
  },
  sections: [
    { k: "hero", v: "split", img: "1539109136881-3be0616acf4b" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "cats", v: "tiles", imgs: ["1539109136881-3be0616acf4b", "1434389677669-e08b4cac3105", "1490481651871-ab68de25d43d|0.3|0.6|1.5"] },
    { k: "grid", title: { ar: "وصل حديثاً", en: "New arrivals" } },
    { k: "feature", img: "1490481651871-ab68de25d43d", title: { ar: "تفصيل بالمقاس", en: "Made to your measure" }, body: { ar: "أرسلي مقاساتك مع الطلب، ونفصّل عبايتك خلال ٥ أيام.", en: "Send your measurements with the order and we tailor your abaya in 5 days." } },
    { k: "news" },
    { k: "bento", title: { ar: "تسوّق المجموعات", en: "Shop the collections" }, imgs: ["1485968579580-b6d095142e6e|0.45|0.7|1.5", "1539109136881-3be0616acf4b|0.5|0.38|1.8", "1490481651871-ab68de25d43d|0.32|0.65|1.9"] }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
