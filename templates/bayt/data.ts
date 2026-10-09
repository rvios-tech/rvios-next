import type { StoreDef } from "@/lib/store/types";

export const def: StoreDef = {
  id: "bayt", slug: "dar-alsakan", plan: "pro", price: 29,
  tplName: { ar: "قالب بيت", en: "Bayt template" },
  name: { ar: "دار السكن", en: "Dar Al-Sakan" },
  cats: [{ ar: "جلوس", en: "Seating" }, { ar: "إضاءة", en: "Lighting" }, { ar: "طاولات", en: "Tables" }, { ar: "ديكور", en: "Decor" }],
  copy: {
    h1: { ar: "بيتٌ يشبهك", en: "A home that feels like you" },
    sub: { ar: "أثاث بخشب طبيعي وأقمشة هادئة، يُصنع بالطلب ويُركّب مجاناً في الرياض.", en: "Furniture in natural wood and calm fabrics, made to order with free assembly in Riyadh." },
    explore: { ar: "استكشف الغرف", en: "Explore rooms" },
    room: { ar: "غرفة المعيشة", en: "The living room" }, roomSub: { ar: "اضغط على النقاط لتسوّق ما تراه في الصورة.", en: "Tap the points to shop what you see." },
    rooms: { ar: "تسوّق حسب الغرفة", en: "Shop by room" },
    roomsL: { ar: ["المعيشة", "النوم", "الطعام", "المكتب"], en: ["Living", "Bedroom", "Dining", "Study"] },
    picks: { ar: "قطع مختارة", en: "Selected pieces" },
    mats: { ar: "الخامات", en: "Materials" },
    matsL: { ar: [["بلوط", "خشب صلب مزيّت"], ["كتان", "قماش طبيعي يتنفس"], ["بوكليه", "ملمس دافئ ناعم"], ["جوز", "عروق داكنة غنية"]], en: [["Oak", "Oiled solid wood"], ["Linen", "Natural, breathable"], ["Bouclé", "Warm and soft"], ["Walnut", "Rich dark grain"]] },
    promise: { ar: [["تركيب مجاني", "داخل الرياض"], ["ضمان سنتين", "على الهيكل"], ["صنع بالطلب", "خلال ٣ أسابيع"]], en: [["Free assembly", "Within Riyadh"], ["2-year warranty", "On the frame"], ["Made to order", "Within 3 weeks"]] },
    fabric: { ar: "القماش", en: "Fabric" },
  },
  products: [
    { id: "p1", cat: 0, name: { ar: "كنبة لينا", en: "Lina Sofa" }, price: 340000, img: "1555041469-a586c61ea9bc", badge: "best", swatches: ["#D9CFC1", "#8A9A86", "#B98B6E"], variant: { label: { ar: "القماش", en: "Fabric" }, options: [{ ar: "كتان رملي", en: "Sand linen" }, { ar: "زيتي", en: "Olive" }, { ar: "تيراكوتا", en: "Terracotta" }] }, desc: { ar: "ثلاثة مقاعد بوسائد ريش وهيكل خشب بلوط.", en: "Three seats, feather cushions and an oak frame." } },
    { id: "p2", cat: 0, name: { ar: "كرسي أوك", en: "Oak Lounge Chair" }, price: 120000, img: "1567538096630-e0c55bd6374c", swatches: ["#E8E1D6", "#3B3A36"], desc: { ar: "كرسي استرخاء بمساند خشبية منحنية.", en: "A lounge chair with curved wooden arms." } },
    { id: "p3", cat: 1, name: { ar: "مصباح أرضي", en: "Arc Floor Lamp" }, price: 45000, img: "1507473885765-e6ed057f782c", badge: "new", desc: { ar: "ضوء دافئ ومنحنى نحاسي.", en: "Warm light on a brass arc." } },
    { id: "p4", cat: 2, name: { ar: "طاولة قهوة دائرية", en: "Round Coffee Table" }, price: 78000, old: 90000, img: "1532372320572-cda25653a26d", badge: "sale", desc: { ar: "خشب جوز صلب بحواف ناعمة.", en: "Solid walnut with soft edges." } },
    { id: "p5", cat: 3, name: { ar: "مزهرية سيراميك", en: "Ceramic Vase" }, price: 12000, img: "1578500494198-246f612d3b3d", desc: { ar: "سيراميك مصنوع يدوياً بلمسة مطفية.", en: "Handmade ceramic with a matte finish." } },
    { id: "p6", cat: 0, name: { ar: "كرسي طعام", en: "Dining Chair" }, price: 38000, img: "1503602642458-232111445657", swatches: ["#C9A27A", "#2D2C2A"], desc: { ar: "خشب منحني بمقعد مريح.", en: "Bent wood with a comfortable seat." } },
    { id: "p7", cat: 1, name: { ar: "مصباح طاولة", en: "Table Lamp" }, price: 22000, img: "1513506003901-1e6a229e2d15", desc: { ar: "قاعدة حجرية وغطاء كتان.", en: "Stone base with a linen shade." } },
    { id: "p8", cat: 3, name: { ar: "سجادة صوف", en: "Wool Rug" }, price: 95000, img: "1600166898405-da9535204843", badge: "new", desc: { ar: "صوف منسوج يدوياً بألوان ترابية.", en: "Hand-woven wool in earthy tones." } },
  ],
};
