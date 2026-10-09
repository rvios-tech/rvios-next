import type { StoreDef } from "@/lib/store/types";

export const def: StoreDef = {
  id: "essential", slug: "bunn-haraz", plan: "free", price: 0,
  tplName: { ar: "القالب الأساسي", en: "Essential template" },
  name: { ar: "بن حراز", en: "Bunn Haraz" },
  cats: [{ ar: "بن", en: "Coffee" }, { ar: "عسل", en: "Honey" }, { ar: "أدوات", en: "Tools" }],
  copy: {
    h1: { ar: "بنّ الجبال، من المزرعة إلى فنجانك", en: "Mountain coffee, farm to cup" },
    sub: { ar: "بن فاخر محمّص طازجاً كل أسبوع، وعسل سدر نقي.", en: "Specialty coffee roasted fresh every week, and pure Sidr honey." },
    shop: { ar: "تسوّق الآن", en: "Shop now" }, prods: { ar: "منتجاتنا", en: "Our products" },
    story: { ar: "من أجود المحاصيل", en: "From premium harvests" }, storyTxt: { ar: "نشتري البن مباشرة من مزارعين نعرفهم بالاسم، ونحمّصه بكميات صغيرة طازجة.", en: "We buy directly from farmers we know by name, and roast in fresh small batches." },
    city: { ar: "بن وعسل مختص", en: "Specialty coffee & honey" },
  },
  products: [
    { id: "p1", cat: 0, name: { ar: "بن مختص محمّص", en: "Roasted Specialty Coffee" }, price: 9000, img: "1559056199-641a0ac8b55e", badge: "best", variant: { label: { ar: "الوزن", en: "Weight" }, options: ["250g", "500g", "1kg"] }, desc: { ar: "أرابيكا فاخر بتحميص متوسط متوازن.", en: "Premium Arabica, balanced medium roast." } },
    { id: "p2", cat: 0, name: { ar: "قشر بن فاخر", en: "Premium Qishr" }, price: 4500, img: "1447933601403-0c6688de566e", desc: { ar: "للقهوة التقليدية بالزنجبيل.", en: "For traditional ginger coffee." } },
    { id: "p3", cat: 1, name: { ar: "عسل سدر طبيعي", en: "Natural Sidr Honey" }, price: 28000, old: 32000, img: "1587049352846-4a222e784d38", badge: "sale", desc: { ar: "عسل سدر نقي من أحدث المواسم.", en: "Pure Sidr honey from the latest season." } },
    { id: "p4", cat: 1, name: { ar: "عسل سمر", en: "Samar Honey" }, price: 18000, img: "1558642452-9d2a7deb7f62", desc: { ar: "عسل جبلي داكن بطعم قوي.", en: "Dark mountain honey, bold in taste." } },
    { id: "p5", cat: 2, name: { ar: "دلة نحاسية", en: "Copper Dallah" }, price: 15000, img: "1495474472287-4d71bcdd2085", desc: { ar: "دلة يدوية لتقديم القهوة.", en: "A handmade coffee pot." } },
    { id: "p6", cat: 0, name: { ar: "بن مطري", en: "Matari Coffee" }, price: 11000, img: "1497935586351-b67a49e012bf", badge: "new", desc: { ar: "بحموضة متوازنة ونكهة فاكهة.", en: "Balanced acidity, fruity notes." } },
  ],
};
