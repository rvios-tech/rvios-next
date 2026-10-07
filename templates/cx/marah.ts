import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "pill", card: "bubble", logo: "م", foot: { ar: "إب، الشارع العام — ألعاب آمنة ومعتمدة", en: "Main St, Ibb — safe, certified toys" },
  ann: { ar: "🎁 تغليف هدايا مجاني لأعياد الميلاد", en: "🎁 Free birthday gift wrapping" },
  def: {
    id: "marah", slug: "fun-world", plan: "pro", price: 17, tplName: { ar: "قالب مرح", en: "Marah template" },
    name: { ar: "عالم المرح", en: "Fun World" },
    cats: [{ ar: "تركيب", en: "Building" }, { ar: "تعليمية", en: "Learning" }, { ar: "أطفال صغار", en: "Toddlers" }],
    copy: {
      kick: { ar: "ألعاب تكبر معهم", en: "Toys that grow with them" }, h1: { ar: "لعب يصنع خيالاً", en: "Play that builds imagination" },
      sub: { ar: "ألعاب تعليمية وآمنة لكل الأعمار، مختارة لتنمية التفكير والإبداع.", en: "Safe, educational toys for every age, chosen to grow thinking and creativity." }, cta: { ar: "اختر لعبة", en: "Pick a toy" },
      catsT: { ar: "حسب العمر", en: "By age" },
      usp: { ar: [["🧸", "مواد آمنة", "خالية من المواد الضارة"], ["🎁", "تغليف هدايا", "مجاناً"], ["🚚", "توصيل سريع", "خلال يومين"]], en: [["🧸", "Safe materials", "Non-toxic"], ["🎁", "Gift wrapping", "Free"], ["🚚", "Fast delivery", "Within 2 days"]] },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "مكعبات بناء ٥٠٠ قطعة", en: "500-Piece Build Set" }, price: 18000, img: "1587654780291-39c9404d746b", badge: "best", desc: { ar: "لعمر ٦ سنوات فأكثر.", en: "Ages 6+." } },
      { id: "p2", cat: 1, name: { ar: "لوح الحروف", en: "Alphabet Board" }, price: 7000, img: "1596461404969-9ae70f2830c1", badge: "new", desc: { ar: "خشبي لتعلم الحروف العربية.", en: "Wooden board for learning letters." } },
      { id: "p3", cat: 2, name: { ar: "دمية قماشية", en: "Soft Plush" }, price: 5000, img: "1558060370-d644479cb6f7", desc: { ar: "ناعمة وقابلة للغسل.", en: "Soft and washable." } },
      { id: "p4", cat: 0, name: { ar: "سيارة تحكم", en: "RC Car" }, price: 22000, old: 26000, img: "1566576912321-d58ddd7a6088", badge: "sale", desc: { ar: "شحن USB وتحكم عن بعد.", en: "USB charging, remote control." } },
      { id: "p5", cat: 1, name: { ar: "مجهر الأطفال", en: "Kids Microscope" }, price: 15000, img: "1515488042361-ee00e0ddd4e4", desc: { ar: "تكبير حتى ٤٠٠ مرة.", en: "Up to 400x." } },
      { id: "p6", cat: 2, name: { ar: "حلقات التكديس", en: "Stacking Rings" }, price: 4000, img: "1596461404969-9ae70f2830c1", desc: { ar: "لعمر سنة فأكثر.", en: "Ages 1+." } },
    ],
  },
  sections: [
    { k: "hero", v: "banner", img: "1587654780291-39c9404d746b" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "cats", v: "circles" }, { k: "usp" },
    { k: "grid", title: { ar: "الأكثر طلباً", en: "Most wanted" } },
    { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
