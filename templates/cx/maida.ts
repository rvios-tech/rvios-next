import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "bar", card: "menu", logo: "ر", foot: { ar: "صنعاء، شارع الستين — يومياً من ١٢ظ إلى ١١م", en: "60th St, Sana'a — daily 12pm to 11pm" },
  ann: { ar: "🔥 توصيل خلال ٤٥ دقيقة داخل صنعاء", en: "🔥 45-minute delivery in Sana'a" },
  def: {
    id: "maida", slug: "al-reef", plan: "pro", price: 25, tplName: { ar: "قالب مائدة", en: "Maida template" },
    name: { ar: "مطعم الريف", en: "Al-Reef Kitchen" },
    cats: [{ ar: "مشويات", en: "Grills" }, { ar: "أطباق يمنية", en: "Yemeni dishes" }, { ar: "سلطات", en: "Salads" }],
    copy: {
      kick: { ar: "على الحطب منذ ١٩٩٥", en: "Wood-fired since 1995" }, h1: { ar: "طعم البيت، حار من التنور", en: "Home taste, hot from the oven" },
      sub: { ar: "مندي ومشويات وأطباق يمنية تُطبخ يومياً بمكونات طازجة.", en: "Mandi, grills and Yemeni dishes cooked daily with fresh ingredients." }, cta: { ar: "اطلب من القائمة", en: "Order from the menu" },
      usp: { ar: [["⏱", "٤٥ دقيقة", "توصيل داخل صنعاء"], ["🔥", "طبخ يومي", "على الحطب"], ["🥗", "مكونات طازجة", "من السوق صباحاً"]], en: [["⏱", "45 minutes", "Delivery in Sana'a"], ["🔥", "Cooked daily", "Over wood fire"], ["🥗", "Fresh produce", "Bought every morning"]] },
      dealT: { ar: "وجبة اليوم", en: "Meal of the day" },
    },
    products: [
      { id: "p1", cat: 1, name: { ar: "مندي لحم", en: "Lamb Mandi" }, price: 9000, img: "1504674900247-0877df9cc836", badge: "best", variant: { label: { ar: "الحجم", en: "Size" }, options: [{ ar: "فردي", en: "Single" }, { ar: "عائلي", en: "Family" }] }, desc: { ar: "لحم بلدي على رز مدخن.", en: "Local lamb on smoked rice." } },
      { id: "p2", cat: 0, name: { ar: "مشاوي مشكلة", en: "Mixed Grill" }, price: 12000, img: "1555939594-58d7cb561ad1", desc: { ar: "كباب وأوصال ودجاج.", en: "Kebab, tikka and chicken." } },
      { id: "p3", cat: 2, name: { ar: "سلطة الريف", en: "Al-Reef Salad" }, price: 3000, img: "1546069901-ba9599a7e63c", badge: "new", desc: { ar: "خضار طازجة وصوص الرمان.", en: "Fresh greens, pomegranate dressing." } },
      { id: "p4", cat: 0, name: { ar: "برجر مشوي", en: "Flame Burger" }, price: 5000, old: 6000, img: "1568901346375-23c9450c58cd", badge: "sale", desc: { ar: "لحم بقري ١٨٠ غرام.", en: "180g beef patty." } },
      { id: "p5", cat: 1, name: { ar: "سلتة", en: "Saltah" }, price: 3500, img: "1540189549336-e6e99c3679fe", desc: { ar: "طبق صنعاني تقليدي بالحلبة.", en: "Traditional Sana'ani fenugreek stew." } },
      { id: "p6", cat: 2, name: { ar: "بول الكينوا", en: "Quinoa Bowl" }, price: 4500, img: "1512621776951-a57141f2eefd", desc: { ar: "كينوا وخضار مشوية.", en: "Quinoa and roasted veg." } },
    ],
  },
  sections: [
    { k: "hero", v: "center", img: "1504674900247-0877df9cc836" }, { k: "usp" },
    { k: "grid", title: { ar: "القائمة", en: "The menu" } }, { k: "deal", pid: "p1" },
    { k: "stats" }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
