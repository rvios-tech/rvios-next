import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "center", card: "framed", logo: "ت", foot: { ar: "صنعاء القديمة، سوق الملح — صناعة يدوية يمنية", en: "Souq Al-Milh, Old Sana'a — Yemeni handicraft" },
  def: {
    id: "turath", slug: "heritage-house", plan: "pro", price: 24, tplName: { ar: "قالب تراث", en: "Turath template" },
    name: { ar: "بيت التراث", en: "Heritage House" },
    cats: [{ ar: "فخار", en: "Pottery" }, { ar: "منسوجات", en: "Textiles" }, { ar: "فضيات", en: "Silver" }],
    copy: {
      kick: { ar: "صُنع في اليمن", en: "Made in Yemen" }, h1: { ar: "حِرفٌ تحكي اليمن", en: "Crafts that tell Yemen's story" },
      sub: { ar: "فخار ومنسوجات وفضيات يدوية من حرفيين في صنعاء وحضرموت وتهامة.", en: "Hand-made pottery, textiles and silver from craftspeople in Sana'a, Hadramout and Tihama." }, cta: { ar: "تصفّح الحِرف", en: "Browse the crafts" },
      mq: { ar: ["صنعاء", "حضرموت", "تهامة", "إب", "شبوة"], en: ["Sana'a", "Hadramout", "Tihama", "Ibb", "Shabwa"] },
      catsT: { ar: "الحِرف", en: "Crafts" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "جرة فخار تهامية", en: "Tihama Clay Jar" }, price: 14000, img: "1565193566173-7a0ee3dbe261", badge: "best", desc: { ar: "فخار يحفظ الماء بارداً.", en: "Clay that keeps water cool." } },
      { id: "p2", cat: 1, name: { ar: "معوز حضرمي", en: "Hadrami Ma'awaz" }, price: 18000, img: "1578749556568-bc2c40e68b61", badge: "new", desc: { ar: "منسوج يدوياً بخيوط قطنية.", en: "Hand-woven cotton." } },
      { id: "p3", cat: 2, name: { ar: "خنجر فضي للزينة", en: "Decorative Silver Dagger" }, price: 95000, img: "1610701596007-11502861dcfa", desc: { ar: "نقش فضي يدوي.", en: "Hand-chased silver." } },
      { id: "p4", cat: 0, name: { ar: "مبخرة فخارية", en: "Clay Incense Burner" }, price: 6000, old: 7500, img: "1493106641515-6b5631de4bb9", badge: "sale", desc: { ar: "بزخارف هندسية.", en: "With geometric motifs." } },
      { id: "p5", cat: 1, name: { ar: "شال صنعاني", en: "Sana'ani Shawl" }, price: 22000, img: "1578749556568-bc2c40e68b61", desc: { ar: "ألوان تقليدية.", en: "Traditional colours." } },
      { id: "p6", cat: 2, name: { ar: "خاتم عقيق يمني", en: "Yemeni Agate Ring" }, price: 30000, img: "1610701596007-11502861dcfa", desc: { ar: "عقيق أحمر بإطار فضي.", en: "Red agate in silver." } },
    ],
  },
  sections: [
    { k: "hero", v: "split", img: "1565193566173-7a0ee3dbe261" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "cats", v: "tiles", imgs: ["1565193566173-7a0ee3dbe261", "1578749556568-bc2c40e68b61", "1610701596007-11502861dcfa"] },
    { k: "grid", title: { ar: "من الورشة", en: "From the workshop" } },
    { k: "feature", img: "1493106641515-6b5631de4bb9", title: { ar: "كل قطعة لها حرفي", en: "Every piece has a maker" }, body: { ar: "نكتب اسم الحرفي ومدينته على بطاقة مع كل قطعة، ونعيد له نصف الربح.", en: "Each piece ships with a card naming its maker and city, and half the profit goes back to them." } },
    { k: "stats" }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } },
  ],
};
