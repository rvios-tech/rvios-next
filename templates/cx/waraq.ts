import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "center", card: "book", logo: "ك", foot: { ar: "الرياض، حي العليا — مكتبة مستقلة منذ ٢٠٠٤", en: "Olaya, Riyadh — independent since 2004" },
  def: {
    id: "waraq", slug: "al-kalima", plan: "pro", price: 15, tplName: { ar: "قالب ورق", en: "Waraq template" },
    name: { ar: "مكتبة الكلمة", en: "Al-Kalima Books" },
    cats: [{ ar: "أدب", en: "Literature" }, { ar: "فكر", en: "Ideas" }, { ar: "أطفال", en: "Kids" }, { ar: "قرطاسية", en: "Stationery" }],
    copy: {
      kick: { ar: "رشّحنا لهذا الشهر", en: "This month's picks" }, h1: { ar: "كتابٌ واحد قد يغيّر شيئاً", en: "One book can change something" },
      sub: { ar: "كتب عربية ومترجمة مختارة بعناية، وتغليف هدية مجاني مع ورقة اقتراح.", en: "Carefully chosen Arabic and translated books, with free gift wrap and a handwritten note." }, cta: { ar: "تصفّح الرفوف", en: "Browse the shelves" },
      mq: { ar: ["اقرأ أكثر", "شحن لكافة المناطق", "تغليف هدية", "طلب كتب غير متوفرة"], en: ["Read more", "Nationwide shipping", "Gift wrapping", "Special orders"] },
      newsT: { ar: "رسالة شهرية بأفضل ما قرأنا", en: "A monthly letter of our best reads" }, email: { ar: "بريدك", en: "Your email" }, join: { ar: "اشترك", en: "Subscribe" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "ديوان: حليب وعسل", en: "Milk and Honey" }, price: 7000, img: "1544947950-fa07a98d237f", badge: "best", desc: { ar: "قصائد قصيرة عن الحب والفقد والشفاء.", en: "Short poems on love, loss and healing." } },
      { id: "p2", cat: 1, name: { ar: "من الصفر إلى الواحد", en: "Zero to One" }, price: 6500, img: "1512820790803-83ca734da794", badge: "new", desc: { ar: "كيف تبني شركات تصنع المستقبل.", en: "How to build companies that create the future." } },
      { id: "p3", cat: 2, name: { ar: "حكايات قبل النوم", en: "Bedtime Tales" }, price: 4000, img: "1532012197267-da84d127e765", desc: { ar: "قصص مصوّرة للأطفال.", en: "Illustrated stories for kids." } },
      { id: "p4", cat: 3, name: { ar: "دفتر سلكي مع قلم", en: "Spiral Notebook & Pen" }, price: 5500, old: 6500, img: "1531346878377-a5be20888e57", badge: "sale", desc: { ar: "ورق أبيض ١٢٠ غرام مع قلم حبر.", en: "120gsm white paper with an ink pen." } },
      { id: "p5", cat: 0, name: { ar: "مجموعة روايات الشهر", en: "Novels of the Month Bundle" }, price: 7500, img: "1519682337058-a94d519337bc", desc: { ar: "خمس روايات نختارها لك من رفوفنا كل شهر.", en: "Five novels hand-picked from our shelves each month." } },
      { id: "p6", cat: 1, name: { ar: "مقدمة ابن خلدون", en: "The Muqaddimah" }, price: 9000, img: "1495446815901-a7297e633e8d", desc: { ar: "طبعة محققة.", en: "An annotated edition." } },
    ],
  },
  sections: [
    { k: "hero", v: "stack", img: "1495446815901-a7297e633e8d", imgs: ["1544947950-fa07a98d237f", "1512820790803-83ca734da794", "1532012197267-da84d127e765", "1519682337058-a94d519337bc"] }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "marquee" },
    { k: "grid", title: { ar: "على الرف", en: "On the shelf" } },
    { k: "feature", img: "1495446815901-a7297e633e8d", title: { ar: "اطلب أي كتاب", en: "Ask for any book" }, body: { ar: "إن لم تجد كتابك، أرسل لنا عنوانه ونوفّره لك خلال أسبوعين.", en: "Can't find it? Send us the title and we'll get it within two weeks." } },
    { k: "news" },
    { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
