/* Brand identity of every demo store: emblem logo, socials and store information.
   Used by the store header, the store info section and the platform's stores marquee. */
import type { Bi } from "./u";

export type Emblem = "circle" | "arch" | "hex" | "diamond" | "squircle" | "shield" | "leaf" | "drop" | "seal" | "ring";
export type Brand = {
  slug: string; emblem: Emblem; bg: string; fg: string; glyph: string; font: "zain" | "ya" | "th"; tagline: Bi;
  socials: { instagram?: string; tiktok?: string; facebook?: string; snapchat?: string; x?: string; whatsapp?: string };
  about: Bi; address: Bi; hours: Bi; phone: string; delivery: Bi;
};
const H = { ar: "السبت إلى الخميس، ٩ص إلى ١٠م", en: "Sat to Thu, 9am to 10pm" };
const D = (ar: string, en: string): Bi => ({ ar, en });

export const BRANDS: Brand[] = [
  { slug: "oud-alsabaa", emblem: "arch", bg: "#0B0908", fg: "#C8A46A", glyph: "س", font: "zain", tagline: D("عطور منذ ١٩٩٨", "Fragrance since 1998"),
    socials: { instagram: "alsabaa.oud", tiktok: "alsabaa.oud", snapchat: "alsabaa", whatsapp: "966500000101" },
    about: D("بيت عطور يعتّق العود ويخلط البخور بوصفات ثلاثة أجيال.", "A fragrance house that ages oud and blends incense by three-generation recipes."), address: D("الرياض، طريق الملك فهد", "King Fahd Rd, Riyadh"), hours: H, phone: "+966 50 000 0101", delivery: D("كافة المدن خلال ٤٨ ساعة", "Nationwide within 48h") },
  { slug: "dar-alshal", emblem: "seal", bg: "#141312", fg: "#EEEAE3", glyph: "DS", font: "ya", tagline: D("خياطة رجالية", "Menswear atelier"),
    socials: { instagram: "daralshal", tiktok: "daralshal", facebook: "daralshal", whatsapp: "966500000102" },
    about: D("معاطف وشالات كشمير تُخاط وتُطرّز يدوياً منذ ٢٠٠٩.", "Coats and cashmere shawls tailored and hand-embroidered since 2009."), address: D("جدة، حي الروضة", "Al-Rawdah, Jeddah"), hours: H, phone: "+966 50 000 0102", delivery: D("جدة خلال يوم، وباقي المدن خلال ٣ أيام", "Jeddah next day, nationwide in 3 days") },
  { slug: "tech-plus", emblem: "hex", bg: "#05070B", fg: "#C6FF3D", glyph: "T+", font: "ya", tagline: D("إلكترونيات أصلية", "Genuine electronics"),
    socials: { instagram: "techplus.sa", tiktok: "techplus.sa", x: "techplus_sa", whatsapp: "966500000103" },
    about: D("وكيل معتمد لأجهزة الصوت والساعات الذكية بضمان حقيقي.", "Authorised dealer of audio and wearables with a real warranty."), address: D("الرياض، العليا", "Olaya, Riyadh"), hours: H, phone: "+966 50 000 0103", delivery: D("توصيل لكافة المدن خلال ٤٨ ساعة", "Nationwide within 48h") },
  { slug: "reem-sweets", emblem: "drop", bg: "#E0284F", fg: "#FFF3F1", glyph: "ر", font: "zain", tagline: D("حلا البيت", "Homemade sweets"),
    socials: { instagram: "reem.sweets", tiktok: "reem.sweets", snapchat: "reemsweets", whatsapp: "966500000104" },
    about: D("مطبخ منزلي يخبز بالطلب يومياً بزبدة حقيقية وبدون مواد حافظة.", "A home kitchen baking to order daily with real butter and no preservatives."), address: D("الدمام، حي الشاطئ", "Al-Shati, Dammam"), hours: D("يومياً، ٨ص إلى ٨م", "Daily, 8am to 8pm"), phone: "+966 50 000 0104", delivery: D("داخل الدمام خلال ساعتين", "Within Dammam in 2 hours") },
  { slug: "dar-alsakan", emblem: "arch", bg: "#B98B5E", fg: "#F1ECE4", glyph: "د", font: "th", tagline: D("أثاث بالطلب", "Furniture to order"),
    socials: { instagram: "daralsakan", facebook: "daralsakan", whatsapp: "966500000105" },
    about: D("أثاث بخشب طبيعي يُصنع بالطلب ويُركّب مجاناً.", "Natural-wood furniture made to order with free assembly."), address: D("الرياض، حي النرجس", "Al-Narjis, Riyadh"), hours: H, phone: "+966 50 000 0105", delivery: D("تركيب مجاني داخل الرياض", "Free assembly in Riyadh") },
  { slug: "bunn-haraz", emblem: "circle", bg: "#C1272D", fg: "#FFF7EE", glyph: "ب", font: "zain", tagline: D("بن وعسل مختص", "Specialty coffee & honey"),
    socials: { instagram: "bunn.haraz", tiktok: "bunn.haraz", whatsapp: "966500000106" },
    about: D("نشتري البن مباشرة من المزارعين ونحمّصه بكميات صغيرة.", "We buy straight from farmers and roast in small batches."), address: D("الرياض، حي السليمانية", "Sulaimaniyah, Riyadh"), hours: H, phone: "+966 50 000 0106", delivery: D("الرياض خلال ٢٤ ساعة", "Riyadh within 24h") },
  { slug: "al-yaqoot", emblem: "diamond", bg: "#1C1712", fg: "#D9B26A", glyph: "ي", font: "zain", tagline: D("مجوهرات منذ ١٩٨٥", "Jewellers since 1985"),
    socials: { instagram: "alyaqoot.jewels", snapchat: "alyaqoot", facebook: "alyaqoot", whatsapp: "966500000107" },
    about: D("صاغة ثلاثة أجيال، ذهب عيار ٢١ و١٨ بشهادة وزن مع كل قطعة.", "Three generations of goldsmiths; 21k and 18k gold certified by weight."), address: D("الرياض، طريق الملك عبد العزيز", "King Abdulaziz Rd, Riyadh"), hours: H, phone: "+966 50 000 0107", delivery: D("توصيل مؤمّن داخل الرياض وجدة", "Insured delivery in Riyadh & Jeddah") },
  { slug: "lama-abayas", emblem: "leaf", bg: "#6E5A4B", fg: "#F3EEE7", glyph: "ل", font: "th", tagline: D("عبايات بالمقاس", "Made-to-measure abayas"),
    socials: { instagram: "lama.abayas", tiktok: "lama.abayas", snapchat: "lamaabayas", whatsapp: "966500000108" },
    about: D("عبايات من الكريب والحرير، تُفصّل بالمقاس وتُطرّز يدوياً.", "Crepe and silk abayas tailored to size and embroidered by hand."), address: D("الرياض، حي حطين", "Hittin, Riyadh"), hours: H, phone: "+966 50 000 0108", delivery: D("تفصيل خلال ٥ أيام وتوصيل لكافة المدن", "Tailored in 5 days, delivered nationwide") },
  { slug: "khatwa", emblem: "squircle", bg: "#E63B2E", fg: "#FFFFFF", glyph: "K", font: "ya", tagline: D("أحذية عصرية", "Contemporary footwear"),
    socials: { instagram: "khatwa.sa", tiktok: "khatwa.sa", x: "khatwa_sa", whatsapp: "966500000109" },
    about: D("علامة ناشئة تصنع حذاءً يومياً واحداً بأفضل ما يمكن.", "A young brand making one everyday shoe as well as possible."), address: D("الرياض", "Riyadh"), hours: H, phone: "+966 50 000 0109", delivery: D("٢ إلى ٤ أيام لكافة المدن", "2 to 4 days nationwide") },
  { slug: "nada-care", emblem: "drop", bg: "#E77F86", fg: "#FFF1EE", glyph: "ن", font: "zain", tagline: D("عناية لطيفة", "Gentle care"),
    socials: { instagram: "nada.care", tiktok: "nada.care", snapchat: "nadacare", whatsapp: "966500000110" },
    about: D("منتجات عناية أصلية مختارة لمناخنا، مع استشارة مجانية لروتينك.", "Genuine skincare chosen for our climate, with a free routine consultation."), address: D("جدة، حي الزهراء", "Al-Zahra, Jeddah"), hours: H, phone: "+966 50 000 0110", delivery: D("جدة خلال يوم، وباقي المدن خلال ٣ أيام", "Jeddah next day, nationwide in 3 days") },
  { slug: "jabali-parts", emblem: "shield", bg: "#14171A", fg: "#F26B1D", glyph: "ج", font: "zain", tagline: D("قطع غيار أصلية", "Genuine spare parts"),
    socials: { facebook: "jabali.parts", instagram: "jabali.parts", whatsapp: "966500000111" },
    about: D("مستورد وموزّع قطع غيار سيارات ودراجات نارية، أصلية وتجارية بضمان.", "Importer of car and motorcycle parts, OEM and aftermarket with warranty."), address: D("الرياض، الصناعية القديمة", "Old Industrial, Riyadh"), hours: D("يومياً، ٨ص إلى ٩م", "Daily, 8am to 9pm"), phone: "+966 50 000 0111", delivery: D("شحن لكافة المدن خلال ٤٨ ساعة", "Nationwide shipping in 48h") },
  { slug: "nabd-sports", emblem: "ring", bg: "#FF2D3D", fg: "#0C0C0C", glyph: "N", font: "ya", tagline: D("معدات رياضية", "Sports gear"),
    socials: { instagram: "nabd.sports", tiktok: "nabd.sports", x: "nabd_sports", whatsapp: "966500000112" },
    about: D("أحذية وملابس ومعدات رياضية أصلية لمن يتدرب بجدية.", "Genuine shoes, apparel and gear for people who train seriously."), address: D("الخبر، طريق الكورنيش", "Corniche Rd, Khobar"), hours: H, phone: "+966 50 000 0112", delivery: D("الخبر خلال يوم، وباقي المدن خلال ٣ أيام", "Khobar next day, nationwide in 3 days") },
  { slug: "al-reef", emblem: "circle", bg: "#F2A33A", fg: "#1A1310", glyph: "ر", font: "zain", tagline: D("مطبخ على الحطب", "Wood-fired kitchen"),
    socials: { instagram: "alreef.kitchen", tiktok: "alreef.kitchen", snapchat: "alreef", whatsapp: "966500000113" },
    about: D("مندي ومشويات وأطباق أصيلة تُطبخ يومياً على الحطب منذ ١٩٩٥.", "Mandi, grills and authentic dishes cooked daily over wood since 1995."), address: D("الرياض، طريق الدائري الشمالي", "Northern Ring Rd, Riyadh"), hours: D("يومياً، ١٢ظ إلى ١١م", "Daily, 12pm to 11pm"), phone: "+966 50 000 0113", delivery: D("٤٥ دقيقة داخل الرياض", "45 minutes in Riyadh") },
  { slug: "heritage-house", emblem: "seal", bg: "#A4472B", fg: "#F4E9DA", glyph: "ت", font: "zain", tagline: D("حِرف يدوية", "Handcrafted pieces"),
    socials: { instagram: "heritage.house.sa", facebook: "heritagehousesa", whatsapp: "966500000114" },
    about: D("نعرض حِرف صنّاع محليين، ونعيد لهم نصف الربح.", "Crafts by local makers; half the profit goes back to them."), address: D("جدة التاريخية، البلد", "Al-Balad, Historic Jeddah"), hours: H, phone: "+966 50 000 0114", delivery: D("تغليف آمن وشحن محلي ودولي", "Safe packaging, local & international shipping") },
  { slug: "sanaa-garden", emblem: "leaf", bg: "#3F6B3A", fg: "#F1F4EC", glyph: "ز", font: "zain", tagline: D("مشتل وورد", "Nursery & florist"),
    socials: { instagram: "riyadh.garden", tiktok: "riyadh.garden", whatsapp: "966500000115" },
    about: D("نباتات داخلية سهلة العناية وورد يُقطف صباحاً، مع دليل رعاية لكل نبتة.", "Easy-care plants and morning-cut flowers, with a care guide for each."), address: D("الرياض، حي الملقا", "Al-Malqa, Riyadh"), hours: H, phone: "+966 50 000 0115", delivery: D("الرياض في نفس اليوم", "Same day in Riyadh") },
  { slug: "doan-apiaries", emblem: "hex", bg: "#E59A12", fg: "#3B2408", glyph: "د", font: "zain", tagline: D("عسل من المنحل", "From the apiary"),
    socials: { instagram: "doan.honey", facebook: "doanhoney", whatsapp: "966500000116" },
    about: D("نحّالون منذ أربعة أجيال، نبيع ما نحصده فقط.", "Beekeepers for four generations, selling only what we harvest."), address: D("أبها، طريق السودة", "Al-Soudah Rd, Abha"), hours: H, phone: "+966 50 000 0116", delivery: D("شحن مبرّد لكافة المدن", "Cool-packed shipping nationwide") },
  { slug: "fun-world", emblem: "squircle", bg: "#FF5A5F", fg: "#FFFBEA", glyph: "م", font: "zain", tagline: D("ألعاب تعليمية", "Learning toys"),
    socials: { instagram: "funworld.sa", tiktok: "funworld.sa", facebook: "funworldsa", whatsapp: "966500000117" },
    about: D("ألعاب آمنة ومعتمدة تنمّي التفكير والإبداع لكل الأعمار.", "Safe, certified toys that build thinking and creativity for every age."), address: D("الرياض، طريق الملك فهد", "King Fahd Rd, Riyadh"), hours: H, phone: "+966 50 000 0117", delivery: D("توصيل خلال يومين", "Delivery within 2 days") },
  { slug: "al-kalima", emblem: "arch", bg: "#2F5D50", fg: "#F5F0E6", glyph: "ك", font: "th", tagline: D("مكتبة مستقلة", "Independent bookshop"),
    socials: { instagram: "alkalima.books", x: "alkalima_books", facebook: "alkalimabooks", whatsapp: "966500000118" },
    about: D("مكتبة مستقلة منذ ٢٠٠٤، نختار الكتب بعناية ونوفّر ما ليس متوفراً.", "Independent since 2004; we choose books carefully and order what's missing."), address: D("الرياض، حي العليا", "Olaya, Riyadh"), hours: H, phone: "+966 50 000 0118", delivery: D("شحن لكافة المدن", "Nationwide shipping") },
  { slug: "bahar-attar", emblem: "seal", bg: "#7A2E1C", fg: "#F6D9A8", glyph: "ب", font: "zain", tagline: D("عطارة وبهارات", "Spices & apothecary"),
    socials: { instagram: "bahar.attar", tiktok: "bahar.attar", whatsapp: "966500000119" },
    about: D("بهارات تُطحن طازجة وأعشاب ومستخلصات فاخرة.", "Freshly ground spices, herbs and premium extracts."), address: D("الرياض، سوق المعيقلية", "Muaiqilia Souq, Riyadh"), hours: H, phone: "+966 50 000 0119", delivery: D("كافة المدن خلال ٤٨ ساعة", "Nationwide within 48h") },
  { slug: "motor-garage", emblem: "shield", bg: "#0E0E10", fg: "#E8E8EA", glyph: "M", font: "ya", tagline: D("معرض دراجات", "Motorcycle showroom"),
    socials: { instagram: "motor.garage.sa", tiktok: "motor.garage.sa", facebook: "motorgaragesa", whatsapp: "966500000120" },
    about: D("معرض دراجات نارية جديدة ومستعملة مفحوصة، مع صيانة وقطع أصلية.", "New and inspected used motorcycles, with service and genuine parts."), address: D("الرياض، طريق خريص", "Khurais Rd, Riyadh"), hours: H, phone: "+966 50 000 0120", delivery: D("تسليم في المعرض أو توصيل بالشاحنة", "Showroom pickup or truck delivery") },
];
export const brandBySlug = (s: string) => BRANDS.find((b) => b.slug === s);

/** Brand for a merchant-created store that has no hand-made identity yet. */
export function fallbackBrand(slug: string, name: string, color: string, whatsapp?: string): Brand {
  return { slug, emblem: "circle", bg: color, fg: "#FFFFFF", glyph: name.trim().charAt(0) || "R", font: "zain", tagline: D("", ""),
    socials: whatsapp ? { whatsapp } : {}, about: D(`${name} — متجر على منصة RVIOS Store.`, `${name} — a store on RVIOS Store.`),
    address: D("المملكة العربية السعودية", "Saudi Arabia"), hours: H, phone: whatsapp ? "+" + whatsapp : "", delivery: D("يُنسّق التوصيل بعد تأكيد الطلب", "Delivery arranged after confirmation") };
}
