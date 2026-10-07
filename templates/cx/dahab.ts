import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "split", card: "circle", logo: "ي", foot: { ar: "صنعاء، شارع الزبيري — ذهب عيار ٢١ و١٨", en: "Al-Zubairi St, Sana'a — 21k & 18k gold" },
  def: {
    id: "dahab", slug: "al-yaqoot", plan: "biz", price: 55, tplName: { ar: "قالب ذهب", en: "Dahab template" },
    name: { ar: "مجوهرات الياقوت", en: "Al-Yaqoot Jewels" },
    cats: [{ ar: "خواتم", en: "Rings" }, { ar: "قلائد", en: "Necklaces" }, { ar: "أساور", en: "Bracelets" }],
    copy: {
      kick: { ar: "منذ ١٩٨٥", en: "Since 1985" }, h1: { ar: "ذهبٌ يُورَث", en: "Gold worth passing on" },
      sub: { ar: "مجوهرات عيار ٢١ مصممة في صنعاء، بشهادة وزن وعيار مع كل قطعة.", en: "21k jewellery designed in Sana'a, with a weight and purity certificate for every piece." }, cta: { ar: "اكتشف المجموعة", en: "Discover the collection" },
      catsT: { ar: "المجموعات", en: "Collections" },
      usp: { ar: [["◆", "شهادة عيار", "مع كل قطعة"], ["⟲", "استبدال مدى الحياة", "بسعر الذهب اليومي"], ["✦", "تغليف فاخر", "جاهز للإهداء"]], en: [["◆", "Purity certificate", "With every piece"], ["⟲", "Lifetime exchange", "At the daily gold price"], ["✦", "Luxury packaging", "Ready to gift"]] },
      dealT: { ar: "قطعة الأسبوع", en: "Piece of the week" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "خاتم السوليتير", en: "Solitaire Ring" }, price: 240000, img: "1605100804763-247f67b3557e", badge: "best", variant: { label: { ar: "المقاس", en: "Size" }, options: ["6", "7", "8", "9"] }, desc: { ar: "ذهب أبيض عيار ١٨ بحجر مركزي.", en: "18k white gold with a centre stone." } },
      { id: "p2", cat: 1, name: { ar: "قلادة الهلال", en: "Crescent Necklace" }, price: 180000, img: "1599643478518-a784e5dc4c8f", badge: "new", desc: { ar: "ذهب أصفر عيار ٢١.", en: "21k yellow gold." } },
      { id: "p3", cat: 2, name: { ar: "سوار مجدول", en: "Braided Bangle" }, price: 310000, old: 340000, img: "1611591437281-460bfbe1220a", badge: "sale", desc: { ar: "صياغة يدوية بنقشة يمنية.", en: "Hand-made with a Yemeni motif." } },
      { id: "p4", cat: 1, name: { ar: "عقد اللؤلؤ", en: "Pearl Strand" }, price: 150000, img: "1515562141207-7a88fb7ce338", desc: { ar: "لؤلؤ طبيعي بقفل ذهب.", en: "Natural pearls with a gold clasp." } },
      { id: "p5", cat: 0, name: { ar: "خاتم النقش", en: "Engraved Ring" }, price: 95000, img: "1602173574767-37ac01994b2a", desc: { ar: "يُنقش عليه الاسم مجاناً.", en: "Engraved with a name for free." } },
      { id: "p6", cat: 2, name: { ar: "سوار رفيع", en: "Fine Bracelet" }, price: 120000, img: "1617038220319-276d3cfab638", desc: { ar: "خفيف وأنيق للاستخدام اليومي.", en: "Light and elegant for every day." } },
    ],
  },
  sections: [
    { k: "hero", v: "center", img: "1515562141207-7a88fb7ce338" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "usp" },
    { k: "cats", v: "circles" }, { k: "grid", title: { ar: "قطع مختارة", en: "Selected pieces" } }, { k: "deal", pid: "p3" },
    { k: "feature", img: "1599643478518-a784e5dc4c8f", title: { ar: "صنعة ثلاثة أجيال", en: "Three generations of craft" }, body: { ar: "كل قطعة تُصاغ في ورشتنا بصنعاء القديمة، بأيدي حرفيين تعلّموا المهنة من آبائهم.", en: "Every piece is made in our workshop in Old Sana'a by craftsmen who learned from their fathers." }, flip: true },
    { k: "bento", title: { ar: "تسوّق المجموعات", en: "Shop the collections" }, imgs: [] }, { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
