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
      { id: "p1", cat: 0, name: { ar: "عباية كريب سوداء", en: "Black Crepe Abaya" }, price: 38000, img: "1509631179647-0177331693ae", badge: "best", variant: { label: { ar: "المقاس", en: "Size" }, options: ["52", "54", "56", "58"] }, desc: { ar: "كريب ياباني ثقيل بقصة مستقيمة.", en: "Heavy Japanese crepe, straight cut." } },
      { id: "p2", cat: 0, name: { ar: "عباية مطرّزة", en: "Embroidered Abaya" }, price: 52000, img: "1539109136881-3be0616acf4b", badge: "new", variant: { label: { ar: "المقاس", en: "Size" }, options: ["52", "54", "56"] }, desc: { ar: "تطريز يدوي على الأكمام.", en: "Hand embroidery on the sleeves." } },
      { id: "p3", cat: 1, name: { ar: "طرحة حرير", en: "Silk Scarf" }, price: 9000, img: "1485968579580-b6d095142e6e", desc: { ar: "حرير طبيعي بألوان هادئة.", en: "Pure silk in calm tones." } },
      { id: "p4", cat: 2, name: { ar: "عباية سهرة", en: "Evening Abaya" }, price: 78000, old: 90000, img: "1496747611176-843222e1e57c", badge: "sale", desc: { ar: "قماش لامع بتفاصيل كريستال.", en: "Satin finish with crystal details." } },
      { id: "p5", cat: 1, name: { ar: "طرحة شيفون", en: "Chiffon Scarf" }, price: 6000, img: "1529139574466-a303027c1d8b", desc: { ar: "خفيفة وعملية لكل يوم.", en: "Light and easy for every day." } },
      { id: "p6", cat: 0, name: { ar: "عباية كتان", en: "Linen Abaya" }, price: 34000, img: "1434389677669-e08b4cac3105", desc: { ar: "كتان يتنفس للصيف.", en: "Breathable linen for summer." } },
    ],
  },
  sections: [
    { k: "hero", v: "split", img: "1509631179647-0177331693ae" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "cats", v: "tiles", imgs: ["1539109136881-3be0616acf4b", "1485968579580-b6d095142e6e", "1496747611176-843222e1e57c"] },
    { k: "grid", title: { ar: "وصل حديثاً", en: "New arrivals" } },
    { k: "feature", img: "1490481651871-ab68de25d43d", title: { ar: "تفصيل بالمقاس", en: "Made to your measure" }, body: { ar: "أرسلي مقاساتك مع الطلب، ونفصّل عبايتك خلال ٥ أيام.", en: "Send your measurements with the order and we tailor your abaya in 5 days." } },
    { k: "news" },
    { k: "bento", title: { ar: "تسوّق المجموعات", en: "Shop the collections" }, imgs: [] }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
