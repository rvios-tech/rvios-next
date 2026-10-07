import type { StoreDef } from "@/lib/store/types";

export const def: StoreDef = {
  id: "volt", slug: "tech-plus", plan: "biz", price: 39,
  tplName: { ar: "قالب فولت", en: "Volt template" },
  name: { ar: "تقنية بلس", en: "Tech Plus" },
  cats: [{ ar: "صوتيات", en: "Audio" }, { ar: "ساعات", en: "Wearables" }, { ar: "حواسيب", en: "Computers" }, { ar: "كاميرات", en: "Cameras" }],
  copy: {
    badge: { ar: "جديد: سماعة Pro الجيل الثاني", en: "New: Pro headphones, 2nd gen" },
    h1: { ar: "صوت يُرى.", en: "Sound you can see." },
    sub: { ar: "أجهزة أصلية بضمان حقيقي لمدة سنة، وتوصيل لكل المحافظات خلال ٤٨ ساعة.", en: "Genuine devices with a real one-year warranty, delivered to every governorate within 48 hours." },
    buy: { ar: "اطلب الآن", en: "Order now" }, specs: { ar: "المواصفات", en: "Specs" },
    st: [["40", { ar: "ساعة بطارية", en: "hours battery" }], ["52", { ar: "ديسيبل عزل", en: "dB isolation" }], ["5.3", { ar: "بلوتوث", en: "Bluetooth" }]],
    bento: { ar: "مختارات الأسبوع", en: "This week's picks" },
    deal: { ar: "عرض ينتهي الليلة", en: "Deal ends tonight" }, dealSub: { ar: "خصم على سماعات الأذن حتى منتصف الليل.", en: "Earbuds discounted until midnight." },
    shopBy: { ar: "تسوّق حسب الفئة", en: "Shop by category" },
    cmdk: { ar: "ابحث عن منتج…", en: "Search products…" }, noRes: { ar: "لا نتائج", en: "No results" },
    trust: { ar: [["ضمان سنة", "على كل الأجهزة"], ["أصلي ١٠٠٪", "من الوكيل مباشرة"], ["استبدال ٧ أيام", "بدون أسئلة"], ["توصيل ٤٨ ساعة", "لكل المحافظات"]], en: [["1-year warranty", "On every device"], ["100% genuine", "Direct from the dealer"], ["7-day exchange", "No questions asked"], ["48h delivery", "To every governorate"]] },
    h: { ar: "س", en: "h" }, m: { ar: "د", en: "m" }, s: { ar: "ث", en: "s" },
  },
  products: [
    { id: "p1", cat: 0, name: { ar: "سماعة Pro اللاسلكية", en: "Pro Wireless Headphones" }, price: 42000, img: "1505740420928-5e560c06d30e", badge: "best", stock: 4, variant: { label: { ar: "اللون", en: "Color" }, options: [{ ar: "أسود", en: "Black" }, { ar: "فضي", en: "Silver" }] }, specs: [["البطارية", "Battery", "40h"], ["العزل", "ANC", "-52dB"], ["بلوتوث", "Bluetooth", "5.3"]], desc: { ar: "عزل نشط للضوضاء وصوت عالي الدقة مع وضع شفافية.", en: "Active noise cancelling, hi-res audio and a transparency mode." } },
    { id: "p2", cat: 1, name: { ar: "ساعة ذكية S", en: "Smartwatch S" }, price: 36000, img: "1546868871-7041f2a55e12", badge: "new", specs: [["الشاشة", "Display", "1.9\""], ["الماء", "Water", "5ATM"], ["البطارية", "Battery", "7d"]], desc: { ar: "تتبع صحي كامل وإشعارات وGPS.", en: "Full health tracking, notifications and GPS." } },
    { id: "p3", cat: 0, name: { ar: "سماعات أذن Air", en: "Air Earbuds" }, price: 19000, old: 25000, img: "1606220945770-b5b6c2c55bf1", badge: "sale", specs: [["البطارية", "Battery", "30h"], ["الشحن", "Charge", "USB-C"], ["المقاومة", "Rating", "IPX4"]], desc: { ar: "خفيفة جداً مع علبة شحن لاسلكي.", en: "Ultra-light with a wireless charging case." } },
    { id: "p4", cat: 2, name: { ar: "حاسوب محمول 14\"", en: "14\" Laptop" }, price: 520000, img: "1517336714731-489689fd1ca8", stock: 2, specs: [["المعالج", "CPU", "M-class"], ["الذاكرة", "RAM", "16GB"], ["التخزين", "SSD", "512GB"]], desc: { ar: "أداء عالٍ في جسم نحيف وبطارية ليوم كامل.", en: "High performance in a slim body with all-day battery." } },
    { id: "p5", cat: 3, name: { ar: "كاميرا فورية", en: "Instant Camera" }, price: 48000, img: "1526170375885-4d8ecf77b99f", specs: [["الفيلم", "Film", "Mini"], ["الفلاش", "Flash", "Auto"], ["الطاقة", "Power", "AA"]], desc: { ar: "صورك مطبوعة في ثوانٍ.", en: "Your photos printed in seconds." } },
    { id: "p6", cat: 0, name: { ar: "سماعة استوديو", en: "Studio Monitor Headphones" }, price: 55000, img: "1583394838336-acd977736f90", specs: [["المقاومة", "Impedance", "32Ω"], ["الكابل", "Cable", "3m"], ["الوزن", "Weight", "280g"]], desc: { ar: "صوت دقيق للمونتاج والإنتاج.", en: "Accurate sound for editing and production." } },
    { id: "p7", cat: 2, name: { ar: "هاتف ذكي X", en: "Smartphone X" }, price: 310000, img: "1511707171634-5f897ff02aa9", badge: "new", specs: [["الشاشة", "Display", "6.1\""], ["الكاميرا", "Camera", "48MP"], ["التخزين", "Storage", "256GB"]], desc: { ar: "كاميرا احترافية وأداء سريع.", en: "Pro camera and fast performance." } },
    { id: "p8", cat: 3, name: { ar: "كاميرا احترافية", en: "Pro Camera Body" }, price: 690000, img: "1516035069371-29a1b244cc32", specs: [["المستشعر", "Sensor", "FF"], ["الدقة", "Res", "33MP"], ["الفيديو", "Video", "4K"]], desc: { ar: "مستشعر كامل الإطار وفيديو 4K.", en: "Full-frame sensor and 4K video." } },
  ],
};
