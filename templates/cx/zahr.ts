import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "split", card: "classic", logo: "ز", foot: { ar: "الرياض، حي الملقا — توصيل نباتات وورد طازج", en: "Al-Malqa, Riyadh — fresh plants & flowers" },
  def: {
    id: "zahr", slug: "sanaa-garden", plan: "pro", price: 22, tplName: { ar: "قالب زهر", en: "Zahr template" },
    name: { ar: "بستان الزهور", en: "Flower Garden" },
    cats: [{ ar: "نباتات داخلية", en: "Indoor plants" }, { ar: "ورد", en: "Flowers" }, { ar: "أصص", en: "Pots" }],
    copy: {
      kick: { ar: "بيت أكثر خضرة", en: "A greener home" }, h1: { ar: "أدخل الحياة إلى بيتك", en: "Bring life into your home" },
      sub: { ar: "نباتات داخلية سهلة العناية وباقات ورد طازجة، تصل مع دليل رعاية.", en: "Easy-care indoor plants and fresh bouquets, delivered with a care guide." }, cta: { ar: "اختر نبتتك", en: "Pick your plant" },
      catsT: { ar: "ماذا تبحث؟", en: "What are you looking for?" },
      usp: { ar: [["🌿", "ضمان ٣٠ يوماً", "على كل نبتة"], ["💧", "دليل رعاية", "مع كل طلب"], ["💐", "ورد طازج", "يُقطف صباحاً"]], en: [["🌿", "30-day guarantee", "On every plant"], ["💧", "Care guide", "With every order"], ["💐", "Fresh flowers", "Cut each morning"]] },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "مونستيرا", en: "Monstera" }, price: 15000, img: "1459411552884-841db9b3cc2a", badge: "best", variant: { label: { ar: "الحجم", en: "Size" }, options: [{ ar: "صغير", en: "Small" }, { ar: "كبير", en: "Large" }] }, desc: { ar: "أوراق كبيرة وعناية سهلة.", en: "Big leaves, easy care." } },
      { id: "p2", cat: 1, name: { ar: "باقة الربيع", en: "Spring Bouquet" }, price: 12000, img: "1487070183336-b863922373d4", badge: "new", desc: { ar: "ورد موسمي مشكل.", en: "Mixed seasonal flowers." } },
      { id: "p3", cat: 0, name: { ar: "نبتة الثعبان", en: "Snake Plant" }, price: 9000, img: "1485955900006-10f4d324d411", desc: { ar: "تتحمل الإضاءة الضعيفة.", en: "Tolerates low light." } },
      { id: "p4", cat: 2, name: { ar: "أصيص فخار", en: "Terracotta Pot" }, price: 4000, old: 5000, img: "1463936575829-25148e1db1b8", badge: "sale", desc: { ar: "فخار طبيعي مع صحن.", en: "Natural clay with saucer." } },
      { id: "p5", cat: 1, name: { ar: "ورد أحمر", en: "Red Roses" }, price: 15000, img: "1490750967868-88aa4486c946", desc: { ar: "١٢ وردة طازجة.", en: "12 fresh roses." } },
      { id: "p6", cat: 0, name: { ar: "صبار مشكل", en: "Cactus Trio" }, price: 6000, img: "1416879595882-3373a0480b5b", desc: { ar: "ثلاث نباتات صغيرة.", en: "Three small plants." } },
    ],
  },
  sections: [
    { k: "hero", v: "split", img: "1485955900006-10f4d324d411" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "usp" },
    { k: "cats", v: "tiles", imgs: ["1459411552884-841db9b3cc2a", "1487070183336-b863922373d4", "1463936575829-25148e1db1b8"] },
    { k: "grid", title: { ar: "من البستان", en: "From the garden" } },
    { k: "feature", img: "1416879595882-3373a0480b5b", title: { ar: "اشتراك الورد الأسبوعي", en: "Weekly flower subscription" }, body: { ar: "باقة طازجة تصلك كل خميس، تختار ألوانها وحجمها.", en: "A fresh bouquet every Thursday, in the colours and size you choose." }, flip: true },
    { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
