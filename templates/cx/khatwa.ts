import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "bar", card: "classic", logo: "K", foot: { ar: "علامة عصرية مستقلة — إصدار محدود", en: "An independent modern brand — limited drop" },
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
      { id: "p2", cat: 1, name: { ar: "نعل خطوة البديل", en: "Khatwa Replacement Insole" }, price: 3000, img: "1542291026-7eec264c27ff|0.72|0.7|2.2", desc: { ar: "رغوة مرنة تمتص الصدمات بنفس قالب النعل.", en: "Shock-absorbing foam shaped to the sole." } },
      { id: "p3", cat: 1, name: { ar: "رباط إضافي", en: "Spare Laces" }, price: 1500, img: "1542291026-7eec264c27ff|0.46|0.4|2.4", desc: { ar: "ثلاثة ألوان.", en: "Three colours." } },
      { id: "p4", cat: 1, name: { ar: "بطاقة هدية خطوة", en: "Khatwa Gift Card" }, price: 4000, img: "cx-khatwa/hero", desc: { ar: "تُخصم قيمتها من أي طلب، وتصل برسالة إهداء.", en: "Redeemable on any order, delivered with a gift note." } },
    ],
  },
  sections: [{ k: "hero", v: "product", img: "1542291026-7eec264c27ff" }, { k: "usp" }, { k: "single" }, { k: "stats" }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } }],
};
