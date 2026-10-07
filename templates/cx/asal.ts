import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "pill", card: "classic", logo: "د", foot: { ar: "وادي دوعن، حضرموت — عسل من المنحل مباشرة", en: "Wadi Doan, Hadramout — straight from the apiary" },
  ann: { ar: "🐝 فحص مختبري لكل دفعة عسل", en: "🐝 Lab-tested, every batch" },
  def: {
    id: "asal", slug: "doan-apiaries", plan: "pro", price: 19, tplName: { ar: "قالب عسل", en: "Asal template" },
    name: { ar: "مناحل دوعن", en: "Doan Apiaries" },
    cats: [{ ar: "سدر", en: "Sidr" }, { ar: "سمر", en: "Samar" }, { ar: "منتجات النحل", en: "Bee products" }],
    copy: {
      kick: { ar: "موسم ٢٠٢٦", en: "Season 2026" }, h1: { ar: "عسل سدر، كما خرج من الخلية", en: "Sidr honey, straight from the hive" },
      sub: { ar: "من مناحلنا في وادي دوعن، بدون تسخين أو خلط، ومع شهادة فحص.", en: "From our apiaries in Wadi Doan, never heated or blended, with a lab certificate." }, cta: { ar: "اطلب عسلك", en: "Order your honey" },
      usp: { ar: [["🐝", "من المنحل مباشرة", "بدون وسطاء"], ["🧪", "فحص مختبري", "لكل دفعة"], ["🚚", "توصيل آمن", "تغليف محكم"]], en: [["🐝", "Straight from the apiary", "No middlemen"], ["🧪", "Lab tested", "Every batch"], ["🚚", "Safe delivery", "Sealed packaging"]] },
      catsT: { ar: "أنواع العسل", en: "Honey types" },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "سدر دوعني ملكي", en: "Royal Doani Sidr" }, price: 45000, img: "1587049352846-4a222e784d38", badge: "best", variant: { label: { ar: "الوزن", en: "Weight" }, options: ["½ kg", "1 kg"] }, desc: { ar: "أجود أنواع السدر من وادي دوعن.", en: "The finest Sidr from Wadi Doan." } },
      { id: "p2", cat: 1, name: { ar: "عسل سمر جبلي", en: "Mountain Samar" }, price: 22000, img: "1558642452-9d2a7deb7f62", desc: { ar: "داكن وقوي الطعم.", en: "Dark and bold." } },
      { id: "p3", cat: 2, name: { ar: "حبوب لقاح", en: "Bee Pollen" }, price: 9000, img: "1471943311424-646960669fbc", badge: "new", desc: { ar: "طبيعية ومجففة بعناية.", en: "Natural and carefully dried." } },
      { id: "p4", cat: 0, name: { ar: "سدر عصيمي", en: "Usaimi Sidr" }, price: 38000, old: 42000, img: "1587049352846-4a222e784d38", badge: "sale", desc: { ar: "سدر بنكهة زهرية.", en: "Sidr with floral notes." } },
      { id: "p5", cat: 2, name: { ar: "شمع العسل", en: "Honeycomb" }, price: 18000, img: "1558642452-9d2a7deb7f62", desc: { ar: "قرص عسل طبيعي.", en: "Natural comb honey." } },
      { id: "p6", cat: 1, name: { ar: "سمر مع الحبة السوداء", en: "Samar with Black Seed" }, price: 25000, img: "1471943311424-646960669fbc", desc: { ar: "خلطة تقليدية.", en: "A traditional blend." } },
    ],
  },
  sections: [
    { k: "hero", v: "banner", img: "1587049352846-4a222e784d38" }, { k: "slider", title: { ar: "الأكثر طلباً", en: "Best sellers" } }, { k: "usp" },
    { k: "grid", title: { ar: "عسلنا", en: "Our honey" } },
    { k: "feature", img: "1558642452-9d2a7deb7f62", title: { ar: "نحّال، لا تاجر", en: "Beekeepers, not traders" }, body: { ar: "نربي النحل منذ أربعة أجيال، ونبيع فقط ما نحصده بأيدينا.", en: "We have kept bees for four generations and only sell what we harvest ourselves." } },
    { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
