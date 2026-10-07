import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "bar", card: "classic", logo: "K", foot: { ar: "علامة يمنية مستقلة — إصدار محدود", en: "An independent Yemeni brand — limited drop" },
  def: {
    id: "khatwa", slug: "khatwa", plan: "biz", price: 39, tplName: { ar: "قالب خطوة (منتج واحد)", en: "Khatwa (single product)" },
    name: { ar: "خطوة", en: "Khatwa" },
    cats: [{ ar: "الحذاء", en: "The shoe" }, { ar: "إضافات", en: "Extras" }],
    copy: {
      kick: { ar: "الإصدار ٠١", en: "Drop 01" }, h1: { ar: "حذاء واحد. كل يوم.", en: "One shoe. Every day." }, giant: { ar: "خطوة", en: "KHATWA" },
      sub: { ar: "صُمّم ليرافقك من الصباح حتى المساء: خفيف، يتنفس، ويدوم.", en: "Designed to go from morning to night: light, breathable, built to last." },
      feats: { ar: ["نعل مرن خفيف الوزن", "قماش منسوج يتنفس", "ضمان ٦ أشهر", "استبدال المقاس مجاناً"], en: ["Light, responsive sole", "Breathable knit upper", "6-month warranty", "Free size exchange"] },
      faq: { ar: [["هل المقاسات قياسية؟", "نعم، اختر مقاسك المعتاد، والاستبدال مجاني."], ["متى يصل الطلب؟", "خلال ٢ إلى ٤ أيام لكل المحافظات."]], en: [["Do sizes run true?", "Yes, take your usual size; exchanges are free."], ["When will it arrive?", "Within 2 to 4 days nationwide."]] },
      usp: { ar: [["01", "خفيف", "٢٤٠ غرام فقط"], ["02", "يتنفس", "قماش منسوج"], ["03", "متين", "نعل مطاطي مقوّى"]], en: [["01", "Light", "Only 240g"], ["02", "Breathable", "Knit upper"], ["03", "Durable", "Reinforced rubber"]] },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "خطوة ٠١", en: "Khatwa 01" }, price: 39000, img: "1542291026-7eec264c27ff", badge: "new", variant: { label: { ar: "المقاس", en: "Size" }, options: ["39", "40", "41", "42", "43", "44"] }, desc: { ar: "الحذاء اليومي الكامل.", en: "The complete everyday shoe." } },
      { id: "p2", cat: 1, name: { ar: "جوارب خطوة", en: "Khatwa Socks" }, price: 3000, img: "1600185365926-3a2ce3cdb9eb", desc: { ar: "قطن ممزوج.", en: "Cotton blend." } },
      { id: "p3", cat: 1, name: { ar: "رباط إضافي", en: "Spare Laces" }, price: 1500, img: "1606107557195-0e29a4b5b4aa", desc: { ar: "ثلاثة ألوان.", en: "Three colours." } },
      { id: "p4", cat: 1, name: { ar: "حقيبة الحذاء", en: "Shoe Bag" }, price: 4000, img: "1595950653106-6c9ebd614d3a", desc: { ar: "قماش مقاوم للماء.", en: "Water-resistant fabric." } },
    ],
  },
  sections: [{ k: "hero", v: "product", img: "1542291026-7eec264c27ff" }, { k: "usp" }, { k: "single" }, { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } }],
};
