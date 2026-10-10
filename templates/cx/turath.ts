import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "center", card: "framed", logo: "ت", foot: { ar: "جدة التاريخية، البلد — صناعة يدوية أصيلة", en: "Historic Jeddah — authentic handicraft" },
  def: {
    id: "turath", slug: "heritage-house", plan: "pro", price: 24, tplName: { ar: "قالب تراث", en: "Turath template" },
    name: { ar: "بيت التراث", en: "Heritage House" },
    cats: [{ ar: "فخار وخزف", en: "Pottery & ceramics" }, { ar: "منسوجات", en: "Textiles" }, { ar: "أواني المائدة", en: "Tableware" }],
    copy: {
      kick: { ar: "صُنع بإتقان", en: "Crafted with care" }, h1: { ar: "حِرفٌ تحكي الأصالة", en: "Crafts that tell heritage stories" },
      sub: { ar: "فخار وخزف ومنسوجات يدوية من أمهر الحرفيين.", en: "Hand-made pottery, ceramics and textiles from skilled craftspeople." }, cta: { ar: "تصفّح الحِرف", en: "Browse the crafts" },
      mq: { ar: ["حِرف يدوية", "فخار أصيل", "خزف مزجج", "منسوجات", "تراث"], en: ["Handcrafts", "Pottery", "Glazed ceramics", "Textiles", "Heritage"] },
      catsT: { ar: "الحِرف", en: "Crafts" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "مزهريات خزفية يدوية", en: "Handmade Ceramic Vases" }, price: 14000, img: "1565193566173-7a0ee3dbe261", badge: "best", desc: { ar: "ثلاث مزهريات بطلاء مطفأ وملمس حجري.", en: "Three matte vases with a stone-like finish." } },
      { id: "p2", cat: 1, name: { ar: "سجادة منسوجة يدوياً", en: "Hand-woven Rug" }, price: 18000, img: "1600166898405-da9535204843", badge: "new", desc: { ar: "زخارف تقليدية بخيوط الصوف والحرير.", en: "Traditional motifs in wool and silk." } },
      { id: "p3", cat: 2, name: { ar: "طقم أطباق مزججة", en: "Glazed Plate Set" }, price: 95000, img: "1578749556568-bc2c40e68b61", desc: { ar: "أطباق بطلاء أزرق تُشكّل يدوياً، كل قطعة فريدة.", en: "Hand-shaped blue-glazed plates, each one unique." } },
      { id: "p4", cat: 0, name: { ar: "جرة فخار مشغولة يدوياً", en: "Wheel-thrown Clay Jar" }, price: 6000, old: 7500, img: "1493106641515-6b5631de4bb9", badge: "sale", desc: { ar: "تُشكّل على دولاب الفخار وتُحرق في فرن تقليدي.", en: "Shaped on the wheel, fired in a traditional kiln." } },
      { id: "p5", cat: 2, name: { ar: "طقم أكواب فخارية", en: "Clay Cup Set" }, price: 22000, img: "1610701596007-11502861dcfa", desc: { ar: "أكواب بطلاء نصفي وملمس طبيعي.", en: "Half-glazed cups with a natural finish." } },
      { id: "p6", cat: 2, name: { ar: "طقم أوعية خزفية", en: "Ceramic Bowl Set" }, price: 30000, img: "1578749556568-bc2c40e68b61|0.9|0.15|2", desc: { ar: "أوعية مزججة للتقديم والسلطات.", en: "Glazed bowls for serving and salads." } },
    ],
  },
  sections: [
    { k: "hero", v: "split", img: "1565193566173-7a0ee3dbe261" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "cats", v: "tiles", imgs: ["1565193566173-7a0ee3dbe261", "1600166898405-da9535204843", "1578749556568-bc2c40e68b61"] },
    { k: "grid", title: { ar: "من الورشة", en: "From the workshop" } },
    { k: "feature", img: "1493106641515-6b5631de4bb9", title: { ar: "كل قطعة لها حرفي", en: "Every piece has a maker" }, body: { ar: "نكتب اسم الحرفي ومدينته على بطاقة مع كل قطعة، ونعيد له نصف الربح.", en: "Each piece ships with a card naming its maker and city, and half the profit goes back to them." } },
    { k: "stats" }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } },
  ],
};
