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
    socials: { instagram: "alsabaa.oud", tiktok: "alsabaa.oud", snapchat: "alsabaa", whatsapp: "967770000101" },
    about: D("بيت عطور يمني يعتّق العود ويخلط البخور بوصفات ثلاثة أجيال.", "A Yemeni house that ages oud and blends incense by three-generation recipes."), address: D("صنعاء، شارع جمال", "Jamal St, Sana'a"), hours: H, phone: "+967 770 000 101", delivery: D("كل المحافظات خلال ٤٨ ساعة", "Nationwide within 48h") },
  { slug: "dar-alshal", emblem: "seal", bg: "#141312", fg: "#EEEAE3", glyph: "DS", font: "ya", tagline: D("خياطة رجالية", "Menswear atelier"),
    socials: { instagram: "daralshal", tiktok: "daralshal", facebook: "daralshal", whatsapp: "967770000102" },
    about: D("معاطف وشالات كشمير تُخاط وتُطرّز يدوياً في عدن منذ ٢٠٠٩.", "Coats and cashmere shawls tailored and hand-embroidered in Aden since 2009."), address: D("عدن، كريتر", "Crater, Aden"), hours: H, phone: "+967 770 000 102", delivery: D("عدن خلال يوم، والمحافظات خلال ٣ أيام", "Aden next day, nationwide in 3 days") },
  { slug: "tech-plus", emblem: "hex", bg: "#05070B", fg: "#C6FF3D", glyph: "T+", font: "ya", tagline: D("إلكترونيات أصلية", "Genuine electronics"),
    socials: { instagram: "techplus.ye", tiktok: "techplus.ye", x: "techplus_ye", whatsapp: "967770000103" },
    about: D("وكيل معتمد لأجهزة الصوت والساعات الذكية بضمان حقيقي.", "Authorised dealer of audio and wearables with a real warranty."), address: D("تعز، شارع جمال", "Jamal St, Taiz"), hours: H, phone: "+967 770 000 103", delivery: D("توصيل لكل المحافظات خلال ٤٨ ساعة", "Nationwide within 48h") },
  { slug: "reem-sweets", emblem: "drop", bg: "#E0284F", fg: "#FFF3F1", glyph: "ر", font: "zain", tagline: D("حلا البيت", "Homemade sweets"),
    socials: { instagram: "reem.sweets", tiktok: "reem.sweets", snapchat: "reemsweets", whatsapp: "967770000104" },
    about: D("مطبخ منزلي يخبز بالطلب يومياً بزبدة حقيقية وبدون مواد حافظة.", "A home kitchen baking to order daily with real butter and no preservatives."), address: D("إب، شارع العدين", "Al-Udayn St, Ibb"), hours: D("يومياً، ٨ص إلى ٨م", "Daily, 8am to 8pm"), phone: "+967 770 000 104", delivery: D("داخل إب خلال ساعتين", "Within Ibb in 2 hours") },
  { slug: "dar-alsakan", emblem: "arch", bg: "#B98B5E", fg: "#F1ECE4", glyph: "د", font: "th", tagline: D("أثاث بالطلب", "Furniture to order"),
    socials: { instagram: "daralsakan", facebook: "daralsakan", whatsapp: "967770000105" },
    about: D("أثاث بخشب طبيعي يُصنع بالطلب ويُركّب مجاناً.", "Natural-wood furniture made to order with free assembly."), address: D("صنعاء، حدة", "Hadda, Sana'a"), hours: H, phone: "+967 770 000 105", delivery: D("تركيب مجاني داخل صنعاء", "Free assembly in Sana'a") },
  { slug: "bunn-haraz", emblem: "circle", bg: "#C1272D", fg: "#FFF7EE", glyph: "ب", font: "zain", tagline: D("بن وعسل يمني", "Yemeni coffee & honey"),
    socials: { instagram: "bunn.haraz", tiktok: "bunn.haraz", whatsapp: "967770000106" },
    about: D("نشتري البن مباشرة من مزارعي حراز ونحمّصه بكميات صغيرة.", "We buy straight from Haraz farmers and roast in small batches."), address: D("صنعاء، باب اليمن", "Bab Al-Yemen, Sana'a"), hours: H, phone: "+967 770 000 106", delivery: D("صنعاء خلال ٢٤ ساعة", "Sana'a within 24h") },
  { slug: "al-yaqoot", emblem: "diamond", bg: "#1C1712", fg: "#D9B26A", glyph: "ي", font: "zain", tagline: D("مجوهرات منذ ١٩٨٥", "Jewellers since 1985"),
    socials: { instagram: "alyaqoot.jewels", snapchat: "alyaqoot", facebook: "alyaqoot", whatsapp: "967770000107" },
    about: D("صاغة ثلاثة أجيال، ذهب عيار ٢١ و١٨ بشهادة وزن مع كل قطعة.", "Three generations of goldsmiths; 21k and 18k gold certified by weight."), address: D("صنعاء، شارع الزبيري", "Al-Zubairi St, Sana'a"), hours: H, phone: "+967 770 000 107", delivery: D("توصيل مؤمّن داخل صنعاء وعدن", "Insured delivery in Sana'a & Aden") },
  { slug: "lama-abayas", emblem: "leaf", bg: "#6E5A4B", fg: "#F3EEE7", glyph: "ل", font: "th", tagline: D("عبايات بالمقاس", "Made-to-measure abayas"),
    socials: { instagram: "lama.abayas", tiktok: "lama.abayas", snapchat: "lamaabayas", whatsapp: "967770000108" },
    about: D("عبايات من الكريب والحرير، تُفصّل بالمقاس وتُطرّز يدوياً.", "Crepe and silk abayas tailored to size and embroidered by hand."), address: D("صنعاء، حدة", "Hadda, Sana'a"), hours: H, phone: "+967 770 000 108", delivery: D("تفصيل خلال ٥ أيام وتوصيل لكل اليمن", "Tailored in 5 days, delivered nationwide") },
  { slug: "khatwa", emblem: "squircle", bg: "#E63B2E", fg: "#FFFFFF", glyph: "K", font: "ya", tagline: D("علامة يمنية", "A Yemeni brand"),
    socials: { instagram: "khatwa.ye", tiktok: "khatwa.ye", x: "khatwa_ye", whatsapp: "967770000109" },
    about: D("علامة ناشئة تصنع حذاءً يومياً واحداً بأفضل ما يمكن.", "A young brand making one everyday shoe as well as possible."), address: D("صنعاء", "Sana'a"), hours: H, phone: "+967 770 000 109", delivery: D("٢ إلى ٤ أيام لكل المحافظات", "2 to 4 days nationwide") },
  { slug: "nada-care", emblem: "drop", bg: "#E77F86", fg: "#FFF1EE", glyph: "ن", font: "zain", tagline: D("عناية لطيفة", "Gentle care"),
    socials: { instagram: "nada.care", tiktok: "nada.care", snapchat: "nadacare", whatsapp: "967770000110" },
    about: D("منتجات عناية أصلية مختارة لمناخنا، مع استشارة مجانية لروتينك.", "Genuine skincare chosen for our climate, with a free routine consultation."), address: D("عدن، المعلا", "Mualla, Aden"), hours: H, phone: "+967 770 000 110", delivery: D("عدن خلال يوم، والمحافظات خلال ٣ أيام", "Aden next day, nationwide in 3 days") },
  { slug: "jabali-parts", emblem: "shield", bg: "#14171A", fg: "#F26B1D", glyph: "ج", font: "zain", tagline: D("قطع غيار أصلية", "Genuine spare parts"),
    socials: { facebook: "jabali.parts", instagram: "jabali.parts", whatsapp: "967770000111" },
    about: D("مستورد وموزّع قطع غيار سيارات ودراجات نارية، أصلية وتجارية بضمان.", "Importer of car and motorcycle parts, OEM and aftermarket with warranty."), address: D("صنعاء، شارع تعز", "Taiz St, Sana'a"), hours: D("يومياً، ٨ص إلى ٩م", "Daily, 8am to 9pm"), phone: "+967 770 000 111", delivery: D("شحن لكل المحافظات خلال ٤٨ ساعة", "Nationwide shipping in 48h") },
  { slug: "nabd-sports", emblem: "ring", bg: "#FF2D3D", fg: "#0C0C0C", glyph: "N", font: "ya", tagline: D("معدات رياضية", "Sports gear"),
    socials: { instagram: "nabd.sports", tiktok: "nabd.sports", x: "nabd_sports", whatsapp: "967770000112" },
    about: D("أحذية وملابس ومعدات رياضية أصلية لمن يتدرب بجدية.", "Genuine shoes, apparel and gear for people who train seriously."), address: D("عدن، خور مكسر", "Khormaksar, Aden"), hours: H, phone: "+967 770 000 112", delivery: D("عدن خلال يوم، والمحافظات خلال ٣ أيام", "Aden next day, nationwide in 3 days") },
  { slug: "al-reef", emblem: "circle", bg: "#F2A33A", fg: "#1A1310", glyph: "ر", font: "zain", tagline: D("مطبخ على الحطب", "Wood-fired kitchen"),
    socials: { instagram: "alreef.kitchen", tiktok: "alreef.kitchen", snapchat: "alreef", whatsapp: "967770000113" },
    about: D("مندي ومشويات وأطباق يمنية تُطبخ يومياً على الحطب منذ ١٩٩٥.", "Mandi, grills and Yemeni dishes cooked daily over wood since 1995."), address: D("صنعاء، شارع الستين", "60th St, Sana'a"), hours: D("يومياً، ١٢ظ إلى ١١م", "Daily, 12pm to 11pm"), phone: "+967 770 000 113", delivery: D("٤٥ دقيقة داخل صنعاء", "45 minutes in Sana'a") },
  { slug: "heritage-house", emblem: "seal", bg: "#A4472B", fg: "#F4E9DA", glyph: "ت", font: "zain", tagline: D("حِرف يمنية", "Yemeni crafts"),
    socials: { instagram: "heritage.house.ye", facebook: "heritagehouseye", whatsapp: "967770000114" },
    about: D("نعرض حِرف صنّاع من صنعاء وحضرموت وتهامة، ونعيد لهم نصف الربح.", "Crafts by makers from Sana'a, Hadramout and Tihama; half the profit goes back to them."), address: D("صنعاء القديمة، سوق الملح", "Souq Al-Milh, Old Sana'a"), hours: H, phone: "+967 770 000 114", delivery: D("تغليف آمن وشحن داخل اليمن وخارجه", "Safe packaging, local & international shipping") },
  { slug: "sanaa-garden", emblem: "leaf", bg: "#3F6B3A", fg: "#F1F4EC", glyph: "ز", font: "zain", tagline: D("مشتل وورد", "Nursery & florist"),
    socials: { instagram: "sanaa.garden", tiktok: "sanaa.garden", whatsapp: "967770000115" },
    about: D("نباتات داخلية سهلة العناية وورد يُقطف صباحاً، مع دليل رعاية لكل نبتة.", "Easy-care plants and morning-cut flowers, with a care guide for each."), address: D("صنعاء، بيت بوس", "Bait Bous, Sana'a"), hours: H, phone: "+967 770 000 115", delivery: D("صنعاء في نفس اليوم", "Same day in Sana'a") },
  { slug: "doan-apiaries", emblem: "hex", bg: "#E59A12", fg: "#3B2408", glyph: "د", font: "zain", tagline: D("عسل من المنحل", "From the apiary"),
    socials: { instagram: "doan.honey", facebook: "doanhoney", whatsapp: "967770000116" },
    about: D("نحّالون منذ أربعة أجيال في وادي دوعن، نبيع ما نحصده فقط.", "Beekeepers for four generations in Wadi Doan, selling only what we harvest."), address: D("وادي دوعن، حضرموت", "Wadi Doan, Hadramout"), hours: H, phone: "+967 770 000 116", delivery: D("شحن مبرّد لكل المحافظات", "Cool-packed shipping nationwide") },
  { slug: "fun-world", emblem: "squircle", bg: "#FF5A5F", fg: "#FFFBEA", glyph: "م", font: "zain", tagline: D("ألعاب تعليمية", "Learning toys"),
    socials: { instagram: "funworld.ye", tiktok: "funworld.ye", facebook: "funworldye", whatsapp: "967770000117" },
    about: D("ألعاب آمنة ومعتمدة تنمّي التفكير والإبداع لكل الأعمار.", "Safe, certified toys that build thinking and creativity for every age."), address: D("إب، الشارع العام", "Main St, Ibb"), hours: H, phone: "+967 770 000 117", delivery: D("توصيل خلال يومين", "Delivery within 2 days") },
  { slug: "al-kalima", emblem: "arch", bg: "#2F5D50", fg: "#F5F0E6", glyph: "ك", font: "th", tagline: D("مكتبة مستقلة", "Independent bookshop"),
    socials: { instagram: "alkalima.books", x: "alkalima_books", facebook: "alkalimabooks", whatsapp: "967770000118" },
    about: D("مكتبة مستقلة منذ ٢٠٠٤، نختار الكتب بعناية ونوفّر ما ليس متوفراً.", "Independent since 2004; we choose books carefully and order what's missing."), address: D("تعز، شارع ٢٦", "26th St, Taiz"), hours: H, phone: "+967 770 000 118", delivery: D("شحن لكل اليمن", "Shipping across Yemen") },
  { slug: "bahar-attar", emblem: "seal", bg: "#7A2E1C", fg: "#F6D9A8", glyph: "ب", font: "zain", tagline: D("عطارة وبهارات", "Spices & apothecary"),
    socials: { instagram: "bahar.attar", tiktok: "bahar.attar", whatsapp: "967770000119" },
    about: D("بهارات تُطحن طازجة وأعشاب ومستخلصات من سوق صنعاء القديم.", "Freshly ground spices, herbs and extracts from Old Sana'a's market."), address: D("صنعاء القديمة، سوق العطارين", "Attar Souq, Old Sana'a"), hours: H, phone: "+967 770 000 119", delivery: D("كل المحافظات خلال ٤٨ ساعة", "Nationwide within 48h") },
  { slug: "motor-garage", emblem: "shield", bg: "#0E0E10", fg: "#E8E8EA", glyph: "M", font: "ya", tagline: D("معرض دراجات", "Motorcycle showroom"),
    socials: { instagram: "motor.garage.ye", tiktok: "motor.garage.ye", facebook: "motorgarageye", whatsapp: "967770000120" },
    about: D("معرض دراجات نارية جديدة ومستعملة مفحوصة، مع صيانة وقطع أصلية.", "New and inspected used motorcycles, with service and genuine parts."), address: D("صنعاء، شارع الخمسين", "50th St, Sana'a"), hours: H, phone: "+967 770 000 120", delivery: D("تسليم في المعرض أو توصيل بالشاحنة", "Showroom pickup or truck delivery") },
];
export const brandBySlug = (s: string) => BRANDS.find((b) => b.slug === s);

/** Brand for a merchant-created store that has no hand-made identity yet. */
export function fallbackBrand(slug: string, name: string, color: string, whatsapp?: string): Brand {
  return { slug, emblem: "circle", bg: color, fg: "#FFFFFF", glyph: name.trim().charAt(0) || "R", font: "zain", tagline: D("", ""),
    socials: whatsapp ? { whatsapp } : {}, about: D(`${name} — متجر على منصة RVIOS Store.`, `${name} — a store on RVIOS Store.`),
    address: D("اليمن", "Yemen"), hours: H, phone: whatsapp ? "+" + whatsapp : "", delivery: D("يُنسّق التوصيل بعد تأكيد الطلب", "Delivery arranged after confirmation") };
}
