import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "pill", card: "classic", logo: "د", foot: { ar: "أبها، طريق السودة — عسل من المنحل مباشرة", en: "Al-Soudah Rd, Abha — straight from the apiary" },
  ann: { ar: "🐝 فحص مختبري لكل دفعة عسل", en: "🐝 Lab-tested, every batch" },
  def: {
    id: "asal", slug: "doan-apiaries", plan: "pro", price: 19, tplName: { ar: "قالب عسل", en: "Asal template" },
    name: { ar: "مناحل دوعن", en: "Doan Apiaries" },
    cats: [{ ar: "سدر", en: "Sidr" }, { ar: "سمر وزهور", en: "Samar & blossom" }, { ar: "عسل القرص", en: "Comb honey" }],
    copy: {
      kick: { ar: "موسم ٢٠٢٦", en: "Season 2026" }, h1: { ar: "عسل سدر، كما خرج من الخلية", en: "Sidr honey, straight from the hive" },
      sub: { ar: "من مناحلنا الطبيعية، بدون تسخين أو خلط، ومع شهادة فحص معتمدة.", en: "From our natural apiaries, never heated or blended, with a certified lab report." }, cta: { ar: "اطلب عسلك", en: "Order your honey" },
      usp: { ar: [["🐝", "من المنحل مباشرة", "بدون وسطاء"], ["🧪", "فحص مختبري", "لكل دفعة"], ["🚚", "توصيل آمن", "تغليف محكم"]], en: [["🐝", "Straight from the apiary", "No middlemen"], ["🧪", "Lab tested", "Every batch"], ["🚚", "Safe delivery", "Sealed packaging"]] },
      catsT: { ar: "أنواع العسل", en: "Honey types" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "سدر جبلي ملكي", en: "Royal Mountain Sidr" }, price: 45000, img: "cx-asal/520ae684f3de59cc83ff419a705d9a08", badge: "best", variant: { label: { ar: "الوزن", en: "Weight" }, options: ["½ kg", "1 kg"] }, desc: { ar: "أجود أنواع السدر الطبيعي الصافي.", en: "The finest pure natural Sidr honey." } },
      { id: "p2", cat: 1, name: { ar: "عسل سمر جبلي", en: "Mountain Samar" }, price: 22000, img: "1558642452-9d2a7deb7f62", desc: { ar: "داكن وقوي الطعم.", en: "Dark and bold." } },
      { id: "p3", cat: 2, name: { ar: "عسل القرص الطازج", en: "Fresh Comb Honey" }, price: 9000, img: "cx-asal/298a33a27c15fb10455abac8556dd97c", badge: "new", desc: { ar: "قرص شمع مليء بالعسل، من الخلية مباشرة.", en: "Wax comb brimming with honey, straight from the hive." } },
      { id: "p4", cat: 0, name: { ar: "سدر عصيمي", en: "Usaimi Sidr" }, price: 38000, old: 42000, img: "cx-asal/af42c4e684ae175fcdc5baf0663b7953", badge: "sale", desc: { ar: "سدر بنكهة زهرية.", en: "Sidr with floral notes." } },
      { id: "p5", cat: 2, name: { ar: "قطع قرص العسل", en: "Honeycomb Chunks" }, price: 18000, img: "cx-asal/52c37e4e94d5183356e0b6705cc33595", desc: { ar: "قطع شمع طبيعية مليئة بالعسل الخام.", en: "Natural wax comb filled with raw honey." } },
      { id: "p6", cat: 1, name: { ar: "عسل زهر الحمضيات", en: "Citrus Blossom Honey" }, price: 25000, img: "1471943311424-646960669fbc", desc: { ar: "عسل فاتح بنكهة زهر الليمون والبرتقال.", en: "A light honey with lemon and orange blossom notes." } },
    ],
  },
  sections: [
    { k: "hero", v: "banner", img: "cx-asal/7ffa9a4008557fcaa09d1efcf63f6836" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "usp" },
    { k: "grid", title: { ar: "عسلنا", en: "Our honey" } },
    { k: "feature", img: "cx-asal/af42c4e684ae175fcdc5baf0663b7953", title: { ar: "نحّال، لا تاجر", en: "Beekeepers, not traders" }, body: { ar: "نربي النحل منذ أربعة أجيال، ونبيع فقط ما نحصده بأيدينا.", en: "We have kept bees for four generations and only sell what we harvest ourselves." } },
    { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
