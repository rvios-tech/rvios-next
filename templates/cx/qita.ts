import type { CxConfig } from "./composer";
export const cfg: CxConfig = {
  header: "bar", card: "dense", logo: "ج", foot: { ar: "الرياض، الصناعية القديمة — قطع أصلية وتجارية بضمان", en: "Old Industrial, Riyadh — OEM & aftermarket parts with warranty" },
  ann: { ar: "اكتب رقم الشاصي وسنجد لك القطعة المطابقة", en: "Send your VIN and we will find the exact part" },
  def: {
    id: "qita", slug: "jabali-parts", plan: "biz", price: 29, tplName: { ar: "قالب قِطع", en: "Qita template" },
    name: { ar: "قطع غيار الجبلي", en: "Jabali Parts" },
    cats: [{ ar: "محرك", en: "Engine" }, { ar: "فرامل", en: "Brakes" }, { ar: "كهرباء", en: "Electrical" }, { ar: "دراجات نارية", en: "Motorcycles" }],
    copy: {
      kick: { ar: "أكثر من ٥٠٠٠ قطعة", en: "5,000+ parts" }, h1: { ar: "القطعة الصحيحة، من أول مرة", en: "The right part, first time" },
      sub: { ar: "اختر الماركة والموديل وابحث عن القطعة، أو أرسل رقم الشاصي.", en: "Pick the make and model and search the part, or send your VIN." }, cta: { ar: "تصفح القطع", en: "Browse parts" },
      brands: { ar: ["تويوتا", "هيونداي", "نيسان", "هوندا", "ياماها"], en: ["Toyota", "Hyundai", "Nissan", "Honda", "Yamaha"] }, models: { ar: ["هايلكس ٢٠١٨", "لاندكروزر ٢٠١٥", "إلنترا ٢٠٢٠", "سوناتا ٢٠١٩"], en: ["Hilux 2018", "Land Cruiser 2015", "Elantra 2020", "Sonata 2019"] },
      partQ: { ar: "اسم القطعة أو رقمها", en: "Part name or number" }, find: { ar: "بحث", en: "Search" },
      usp: { ar: [["⚙", "أصلي وتجاري", "خيارات لكل ميزانية"], ["✓", "ضمان ٦ أشهر", "على القطع الأصلية"], ["⇄", "استبدال مجاني", "إذا لم تطابق"], ["🚚", "شحن للمحافظات", "خلال ٤٨ ساعة"]], en: [["⚙", "OEM & aftermarket", "For every budget"], ["✓", "6-month warranty", "On OEM parts"], ["⇄", "Free exchange", "If it doesn't fit"], ["🚚", "Nationwide shipping", "Within 48h"]] },
    },
    products: [
      { id: "p1", cat: 0, name: { ar: "فلتر زيت أصلي", en: "OEM Oil Filter" }, price: 4500, img: "1486262715619-67b85e0b08d3", badge: "best", specs: [["الماركة", "Make", "Toyota"], ["النوع", "Type", "OEM"], ["الرقم", "No.", "90915"]], stock: 40, desc: { ar: "لمحركات تويوتا ٢.٧ و٤.٠.", en: "For Toyota 2.7 and 4.0 engines." } },
      { id: "p2", cat: 1, name: { ar: "فحمات فرامل أمامية", en: "Front Brake Pads" }, price: 12000, old: 14000, img: "1492144534655-ae79c964c9d7", badge: "sale", specs: [["الماركة", "Make", "Hyundai"], ["النوع", "Type", "Ceramic"], ["الضمان", "Warranty", "6M"]], stock: 6, desc: { ar: "سيراميك بضوضاء منخفضة.", en: "Low-noise ceramic." } },
      { id: "p3", cat: 2, name: { ar: "بطارية ٧٠ أمبير", en: "70Ah Battery" }, price: 65000, img: "1619642751034-765dfdf7c58e", specs: [["السعة", "Capacity", "70Ah"], ["الضمان", "Warranty", "12M"], ["النوع", "Type", "AGM"]], stock: 3, desc: { ar: "بطارية جافة بضمان سنة.", en: "Maintenance-free, one-year warranty." } },
      { id: "p4", cat: 3, name: { ar: "سلسلة دراجة نارية", en: "Motorcycle Chain" }, price: 9000, img: "1558981806-ec527fa84c39", badge: "new", specs: [["المقاس", "Size", "428"], ["الوصلات", "Links", "120"], ["الماركة", "Make", "Honda"]], desc: { ar: "فولاذ مقوّى.", en: "Hardened steel." } },
      { id: "p5", cat: 0, name: { ar: "بواجي إيريديوم", en: "Iridium Spark Plugs" }, price: 8000, img: "1486262715619-67b85e0b08d3", specs: [["العدد", "Qty", "4"], ["النوع", "Type", "Iridium"], ["الماركة", "Make", "NGK"]], desc: { ar: "طقم ٤ قطع.", en: "Set of 4." } },
      { id: "p6", cat: 3, name: { ar: "إطار دراجة ١٧", en: "17\" Motorcycle Tyre" }, price: 28000, img: "1449426468159-d96dbf08f19f", specs: [["المقاس", "Size", "17\""], ["النوع", "Type", "Tubeless"], ["الماركة", "Make", "IRC"]], desc: { ar: "بدون أنبوب.", en: "Tubeless." } },
    ],
  },
  sections: [
    { k: "hero", v: "search", img: "1486262715619-67b85e0b08d3" }, { k: "usp" },
    { k: "cats", v: "tiles", imgs: ["1486262715619-67b85e0b08d3", "1492144534655-ae79c964c9d7", "1619642751034-765dfdf7c58e", "1558981806-ec527fa84c39"] },
    { k: "grid", title: { ar: "قطع متوفرة الآن", en: "In stock now" } },
    { k: "stats" }, { k: "steps", title: { ar: "كيف تطلب", en: "How to order" } }, { k: "faq", title: { ar: "أسئلة شائعة", en: "Questions" } },
  ],
};
