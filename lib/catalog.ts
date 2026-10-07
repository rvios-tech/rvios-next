import type { Bi } from "./u";
export type Tier = "free" | "standard" | "signature";
export type Sector = "fragrance" | "fashion" | "electronics" | "home" | "food" | "any" | "modest" | "jewelry" | "honey" | "beauty" | "auto" | "books" | "kids" | "sports" | "plants" | "restaurant" | "crafts" | "brand";
export type TemplateId = "noir" | "maison" | "volt" | "bayt" | "sukkar" | "essential" | "satr" | "dahab" | "asal" | "nada" | "qita" | "waraq" | "marah" | "nabd" | "zahr" | "maida" | "turath" | "khatwa";
export type TemplateMeta = {
  id: TemplateId; file: string; tier: Tier; price: number; sector: Sector;
  name: Bi; store: Bi; tag: Bi; desc: Bi; feats: { ar: string[]; en: string[] }; pal: string[]; img: string;
  /** generic poster layout for composer templates */ poster?: { v: string; t: Bi };
};
/** Template catalog — single source of truth for the platform page and the template store. */
const CORE: TemplateMeta[] = [
  { id: "noir", file: "/s/oud-alsabaa", tier: "signature", price: 49, sector: "fragrance",
    name: { ar: "نوار", en: "Noir" }, store: { ar: "عطور السبعة", en: "Al-Sabaa Oud" },
    tag: { ar: "فخامة هادئة للعطور والهدايا", en: "Quiet luxury for fragrance & gifts" },
    desc: { ar: "خلفية دخان ذهبي حية بتقنية WebGL، مجموعة أفقية تتحرك مع التمرير، هرم العطر التفاعلي، وقائمة منتجات تُظهر الصورة مع المؤشر.", en: "A live golden-smoke WebGL backdrop, a horizontal collection driven by scroll, an interactive scent pyramid and a product list that reveals images under the cursor." },
    feats: { ar: ["خلفية WebGL حية", "مجموعة أفقية مثبّتة", "هرم العطر التفاعلي", "قائمة بمعاينة الصورة", "عنوان بخط ممدود متحرك"], en: ["Live WebGL backdrop", "Pinned horizontal collection", "Interactive scent pyramid", "Hover-image product list", "Animated swash headline"] },
    pal: ["#0B0908", "#C8A46A", "#F1E6D4"], img: "1594035910387-fea47794261f" },
  { id: "maison", file: "/s/dar-alshal", tier: "signature", price: 45, sector: "fashion",
    name: { ar: "ميزون", en: "Maison" }, store: { ar: "دار الشال", en: "Dar Al-Shal" },
    tag: { ar: "تحريري بروح مجلات الأزياء", en: "Editorial, fashion-magazine spirit" },
    desc: { ar: "صورة غلاف تتسع مع التمرير، دفتر إطلالات أفقي، صور منتجات تتبدّل عند المرور، وصورة «تسوّق الإطلالة» بنقاط تفاعلية.", en: "A cover image that expands on scroll, a horizontal lookbook, product images that swap on hover, and a shoppable “shop the look” photo." },
    feats: { ar: ["غلاف يتسع مع التمرير", "دفتر إطلالات أفقي", "تبديل صورة المنتج", "تسوّق الإطلالة", "نشرة بريدية"], en: ["Scroll-expanding cover", "Horizontal lookbook", "Hover image swap", "Shop the look", "Newsletter block"] },
    pal: ["#EEEAE3", "#141312", "#8A8378"], img: "1515886657613-9f3515b0c78f" },
  { id: "volt", file: "/s/tech-plus", tier: "signature", price: 39, sector: "electronics",
    name: { ar: "فولت", en: "Volt" }, store: { ar: "تقنية بلس", en: "Tech Plus" },
    tag: { ar: "تقني داكن بطاقة عالية", en: "Dark, high-voltage tech" },
    desc: { ar: "شبكة WebGL متحركة، بحث فوري بلوحة أوامر ⌘K، شبكة Bento بإضاءة تتبع المؤشر، عدّاد عرض حقيقي، ومواصفات ظاهرة على كل بطاقة.", en: "An animated WebGL grid, instant ⌘K command search, a spotlight Bento grid, a live deal countdown and specs on every card." },
    feats: { ar: ["شبكة WebGL متحركة", "بحث ⌘K فوري", "Bento بإضاءة المؤشر", "عدّاد عرض حي", "شريط المخزون"], en: ["Animated WebGL grid", "Instant ⌘K search", "Spotlight Bento", "Live deal timer", "Stock indicator"] },
    pal: ["#05070B", "#C6FF3D", "#3D7BFF"], img: "1505740420928-5e560c06d30e" },
  { id: "bayt", file: "/s/dar-alsakan", tier: "standard", price: 29, sector: "home",
    name: { ar: "بيت", en: "Bayt" }, store: { ar: "دار السكن", en: "Dar Al-Sakan" },
    tag: { ar: "دافئ وهادئ للأثاث والمنزل", en: "Warm and calm for furniture & home" },
    desc: { ar: "صورة غرفة قابلة للتسوّق بنقاط تفاعلية، تسوّق حسب الغرفة، عيّنات خامات، واختيار لون القماش من البطاقة.", en: "A shoppable room photo with hotspots, shop by room, material swatches, and fabric colour picking on the card." },
    feats: { ar: ["غرفة قابلة للتسوّق", "تسوّق حسب الغرفة", "عيّنات الخامات", "اختيار لون القماش"], en: ["Shoppable room", "Shop by room", "Material swatches", "Fabric colour picker"] },
    pal: ["#F1ECE4", "#22201C", "#B98B5E"], img: "1555041469-a586c61ea9bc" },
  { id: "sukkar", file: "/s/reem-sweets", tier: "standard", price: 19, sector: "food",
    name: { ar: "سُكّر", en: "Sukkar" }, store: { ar: "حلويات ريم", en: "Reem Sweets" },
    tag: { ar: "مرح وشهي للحلويات والمطابخ المنزلية", en: "Playful and delicious for home kitchens" },
    desc: { ar: "حلويات عائمة تُسحب بالمؤشر، أشرطة متقاطعة، قائمة بتبويبات ثابتة، منتج يطير إلى السلة، وصانع علب تفاعلي.", en: "Draggable floating sweets, crossing ribbons, a sticky-tab menu, fly-to-cart, and an interactive box builder." },
    feats: { ar: ["عناصر قابلة للسحب", "منتج يطير للسلة", "صانع العلب", "قائمة بتبويبات ثابتة"], en: ["Draggable elements", "Fly-to-cart", "Box builder", "Sticky-tab menu"] },
    pal: ["#FFF3F1", "#E0284F", "#FFE7A3"], img: "1578985545062-69928b1d9587" },
  { id: "essential", file: "/s/bunn-haraz", tier: "free", price: 0, sector: "any",
    name: { ar: "أساسي", en: "Essential" }, store: { ar: "بن حراز", en: "Bunn Haraz" },
    tag: { ar: "نظيف ومحايد لأي نشاط", en: "Clean and neutral for any business" },
    desc: { ar: "القالب المجاني لكل الباقات: غلاف كبير، تصنيفات، شبكة منتجات، وقصة المتجر. بهوية المتجر وألوانه.", en: "The free template on every plan: a large cover, categories, a product grid and the store story, in the store's own identity." },
    feats: { ar: ["غلاف بتأثير عمق", "تصنيفات وفلترة", "قصة المتجر", "متوافق مع كل الباقات"], en: ["Parallax cover", "Categories & filters", "Store story", "Works on every plan"] },
    pal: ["#FFF7EE", "#C1272D", "#1F1412"], img: "1442512595331-e89e73853f31" },
];
export const SECTORS: Record<Sector, Bi> = { fragrance: { ar: "عطور", en: "Fragrance" }, fashion: { ar: "أزياء", en: "Fashion" }, modest: { ar: "عبايات", en: "Modest wear" }, jewelry: { ar: "مجوهرات", en: "Jewellery" }, beauty: { ar: "تجميل", en: "Beauty" }, electronics: { ar: "إلكترونيات", en: "Electronics" }, auto: { ar: "قطع غيار", en: "Auto parts" }, home: { ar: "أثاث", en: "Home" }, plants: { ar: "نباتات وورد", en: "Plants" }, food: { ar: "حلويات", en: "Sweets" }, restaurant: { ar: "مطاعم", en: "Restaurants" }, honey: { ar: "عسل", en: "Honey" }, crafts: { ar: "حِرف", en: "Crafts" }, books: { ar: "كتب", en: "Books" }, kids: { ar: "أطفال", en: "Kids" }, sports: { ar: "رياضة", en: "Sports" }, brand: { ar: "منتج واحد", en: "Single product" }, any: { ar: "أي نشاط", en: "Any" } };
export const TIERS: Record<Tier, Bi> = { free: { ar: "مجاني", en: "Free" }, standard: { ar: "قياسي", en: "Standard" }, signature: { ar: "توقيع", en: "Signature" } };


import { CX_META } from "./catalog-cx";
/** Signature first, then standard, free last — sorted by price inside each tier. */
const order: Record<Tier, number> = { signature: 0, standard: 1, free: 2 };
export const CATALOG: TemplateMeta[] = [...CORE, ...CX_META].sort((a, b) => order[a.tier] - order[b.tier] || b.price - a.price);
/** The six original showcase templates (used by the hero laptop). */
export const FEATURED: TemplateMeta[] = CORE;
