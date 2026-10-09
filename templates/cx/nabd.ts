import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "bar", card: "overlay", logo: "N", foot: { ar: "الخبر، طريق الكورنيش — معدات رياضية للمحترفين", en: "Corniche Rd, Khobar — pro sports gear" },
  def: {
    id: "nabd", slug: "nabd-sports", plan: "biz", price: 27, tplName: { ar: "قالب نبض", en: "Nabd template" },
    name: { ar: "نبض للرياضة", en: "Nabd Sports" },
    cats: [{ ar: "أحذية", en: "Shoes" }, { ar: "ملابس", en: "Apparel" }, { ar: "معدات", en: "Equipment" }],
    copy: {
      kick: { ar: "تدرّب بلا أعذار", en: "Train, no excuses" }, h1: { ar: "أقوى من الأمس", en: "Stronger than yesterday" },
      sub: { ar: "أحذية وملابس ومعدات رياضية أصلية، لكل من يتدرب بجدية.", en: "Genuine shoes, apparel and equipment for people who train seriously." }, cta: { ar: "تسوّق الآن", en: "Shop now" },
      mq: { ar: ["قوة", "سرعة", "تحمّل", "انضباط"], en: ["POWER", "SPEED", "ENDURANCE", "DISCIPLINE"] },
      dealT: { ar: "عرض نهاية الأسبوع", en: "Weekend drop" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "حذاء جري Pro", en: "Pro Running Shoe" }, price: 42000, img: "1542291026-7eec264c27ff", badge: "best", variant: { label: { ar: "المقاس", en: "Size" }, options: ["40", "41", "42", "43", "44"] }, desc: { ar: "نعل مرن ووزن خفيف.", en: "Responsive sole, light weight." } },
      { id: "p2", cat: 2, name: { ar: "دمبل قابل للتعديل", en: "Adjustable Dumbbell" }, price: 65000, img: "1584735935682-2f2b69dff9d2", badge: "new", desc: { ar: "من ٢ إلى ٢٤ كغ.", en: "From 2 to 24 kg." } },
      { id: "p3", cat: 1, name: { ar: "تيشيرت تدريب", en: "Training Tee" }, price: 8000, img: "1571019613454-1cb2f99b2d8b", variant: { label: { ar: "المقاس", en: "Size" }, options: ["S", "M", "L", "XL"] }, desc: { ar: "قماش يطرد العرق.", en: "Sweat-wicking fabric." } },
      { id: "p4", cat: 0, name: { ar: "حذاء صالة", en: "Gym Trainer" }, price: 36000, old: 42000, img: "1600185365926-3a2ce3cdb9eb", badge: "sale", desc: { ar: "ثبات عالٍ لرفع الأوزان.", en: "Stable for lifting." } },
      { id: "p5", cat: 2, name: { ar: "حبل قفز", en: "Speed Rope" }, price: 4000, img: "1517836357463-d25dfeac3438", desc: { ar: "مقابض بمحامل.", en: "Ball-bearing handles." } },
      { id: "p6", cat: 2, name: { ar: "سجادة يوغا", en: "Yoga Mat" }, price: 9000, img: "1534438327276-14e5300c3a48", desc: { ar: "سماكة ٦ ملم.", en: "6 mm thick." } },
    ],
  },
  sections: [
    { k: "hero", v: "diag", img: "1517963879433-6ad2b056d712" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "grid", title: { ar: "تجهّز للتمرين", en: "Gear up" } }, { k: "deal", pid: "p4" },
    { k: "feature", img: "1534438327276-14e5300c3a48", title: { ar: "مدرّب في جيبك", en: "A coach in your pocket" }, body: { ar: "كل طلب يأتي مع برنامج تمرين مجاني لأربعة أسابيع.", en: "Every order comes with a free four-week training plan." } },
    { k: "bento", title: { ar: "تسوّق المجموعات", en: "Shop the collections" }, imgs: [] }, { k: "stats" },
  ],
};
