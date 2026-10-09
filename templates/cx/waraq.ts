import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "center", card: "book", logo: "ك", foot: { ar: "الرياض، حي العليا — مكتبة مستقلة منذ ٢٠٠٤", en: "Olaya, Riyadh — independent since 2004" },
  def: {
    id: "waraq", slug: "al-kalima", plan: "pro", price: 15, tplName: { ar: "قالب ورق", en: "Waraq template" },
    name: { ar: "مكتبة الكلمة", en: "Al-Kalima Books" },
    cats: [{ ar: "روايات", en: "Novels" }, { ar: "فكر", en: "Ideas" }, { ar: "أطفال", en: "Kids" }, { ar: "قرطاسية", en: "Stationery" }],
    copy: {
      kick: { ar: "رشّحنا لهذا الشهر", en: "This month's picks" }, h1: { ar: "كتابٌ واحد قد يغيّر شيئاً", en: "One book can change something" },
      sub: { ar: "كتب عربية ومترجمة مختارة بعناية، وتغليف هدية مجاني مع ورقة اقتراح.", en: "Carefully chosen Arabic and translated books, with free gift wrap and a handwritten note." }, cta: { ar: "تصفّح الرفوف", en: "Browse the shelves" },
      mq: { ar: ["اقرأ أكثر", "شحن لكافة المناطق", "تغليف هدية", "طلب كتب غير متوفرة"], en: ["Read more", "Nationwide shipping", "Gift wrapping", "Special orders"] },
      newsT: { ar: "رسالة شهرية بأفضل ما قرأنا", en: "A monthly letter of our best reads" }, email: { ar: "بريدك", en: "Your email" }, join: { ar: "اشترك", en: "Subscribe" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "رواية: ظل الريح", en: "The Shadow of the Wind" }, price: 7000, img: "1544947950-fa07a98d237f", badge: "best", desc: { ar: "رواية عن الكتب والأسرار في برشلونة.", en: "A novel of books and secrets in Barcelona." } },
      { id: "p2", cat: 1, name: { ar: "العادات الذرية", en: "Atomic Habits" }, price: 6500, img: "1512820790803-83ca734da794", badge: "new", desc: { ar: "تغييرات صغيرة ونتائج كبيرة.", en: "Small changes, big results." } },
      { id: "p3", cat: 2, name: { ar: "حكايات قبل النوم", en: "Bedtime Tales" }, price: 4000, img: "1532012197267-da84d127e765", desc: { ar: "قصص مصوّرة للأطفال.", en: "Illustrated stories for kids." } },
      { id: "p4", cat: 3, name: { ar: "دفتر جلد", en: "Leather Notebook" }, price: 5500, old: 6500, img: "1531346878377-a5be20888e57", badge: "sale", desc: { ar: "ورق كريمي ١٢٠ غرام.", en: "120gsm cream paper." } },
      { id: "p5", cat: 0, name: { ar: "مئة عام من العزلة", en: "One Hundred Years of Solitude" }, price: 7500, img: "1519682337058-a94d519337bc", desc: { ar: "ملحمة عائلة بوينديا.", en: "The Buendía family saga." } },
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
