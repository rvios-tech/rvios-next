import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "bar", card: "menu", logo: "ر", foot: { ar: "الرياض، طريق الدائري الشمالي — يومياً من ١٢ظ إلى ١١م", en: "Northern Ring Rd, Riyadh — daily 12pm to 11pm" },
  ann: { ar: "🔥 توصيل خلال ٤٥ دقيقة داخل الرياض", en: "🔥 45-minute delivery in Riyadh" },
  def: {
    id: "maida", slug: "al-reef", plan: "pro", price: 25, tplName: { ar: "قالب مائدة", en: "Maida template" },
    name: { ar: "مطعم الريف", en: "Al-Reef Kitchen" },
    cats: [{ ar: "مشويات", en: "Grills" }, { ar: "أطباق رئيسية", en: "Main dishes" }, { ar: "سلطات", en: "Salads" }],
    copy: {
      kick: { ar: "على الحطب منذ ١٩٩٥", en: "Wood-fired since 1995" }, h1: { ar: "طعم البيت، حار من التنور", en: "Home taste, hot from the oven" },
      sub: { ar: "مشويات على الحطب وأطباق رئيسية وسلطات تُحضّر يومياً بمكونات طازجة.", en: "Wood-fired grills, main dishes and salads made daily with fresh ingredients." }, cta: { ar: "اطلب من القائمة", en: "Order from the menu" },
      usp: { ar: [["⏱", "٤٥ دقيقة", "توصيل داخل الرياض"], ["🔥", "طبخ يومي", "على الحطب"], ["🥗", "مكونات طازجة", "من السوق صباحاً"]], en: [["⏱", "45 minutes", "Delivery in Riyadh"], ["🔥", "Cooked daily", "Over wood fire"], ["🥗", "Fresh produce", "Bought every morning"]] },
      dealT: { ar: "وجبة اليوم", en: "Meal of the day" },
    },
    products: [
      { id: "p1", cat: 1, name: { ar: "طبق اللحم المشوي", en: "Grilled Beef Plate" }, price: 9000, img: "1504674900247-0877df9cc836", badge: "best", variant: { label: { ar: "الحجم", en: "Size" }, options: [{ ar: "فردي", en: "Single" }, { ar: "عائلي", en: "Family" }] }, desc: { ar: "شرائح لحم بقري مشوية مع خضار طازجة وصوص الفلفل.", en: "Grilled beef slices with fresh greens and pepper sauce." } },
      { id: "p2", cat: 0, name: { ar: "مشاوي مشكلة", en: "Mixed Grill" }, price: 12000, img: "1555939594-58d7cb561ad1", desc: { ar: "كباب وأوصال ودجاج.", en: "Kebab, tikka and chicken." } },
      { id: "p3", cat: 2, name: { ar: "سلطة الريف", en: "Al-Reef Salad" }, price: 3000, img: "1546069901-ba9599a7e63c", badge: "new", desc: { ar: "قطع سلمون مشوية مع خضار طازجة وبيض.", en: "Grilled salmon bites, fresh greens and egg." } },
      { id: "p4", cat: 0, name: { ar: "برجر مشوي", en: "Flame Burger" }, price: 5000, old: 6000, img: "1568901346375-23c9450c58cd", badge: "sale", desc: { ar: "لحم بقري ١٨٠ غرام.", en: "180g beef patty." } },
      { id: "p5", cat: 2, name: { ar: "سلطة يونانية", en: "Greek Salad" }, price: 3500, img: "1540189549336-e6e99c3679fe", desc: { ar: "جبن فيتا وزيتون وبصل أحمر.", en: "Feta, olives and red onion." } },
      { id: "p6", cat: 2, name: { ar: "بول الكينوا", en: "Quinoa Bowl" }, price: 4500, img: "1512621776951-a57141f2eefd", desc: { ar: "كينوا وأفوكادو وحمص وخضار مشوية.", en: "Quinoa, avocado, chickpeas and roasted veg." } },
    ],
  },
  sections: [
    { k: "hero", v: "center", img: "1504674900247-0877df9cc836" }, { k: "usp" },
    { k: "grid", title: { ar: "القائمة", en: "The menu" } }, { k: "deal", pid: "p1" },
    { k: "stats" }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
