import type { StoreDef } from "@/lib/store/types";

export const def: StoreDef = {
  id: "maison", slug: "dar-alshal", plan: "biz", price: 45,
  tplName: { ar: "قالب ميزون", en: "Maison template" },
  name: { ar: "دار الشال", en: "Dar Al-Shal" },
  cats: [{ ar: "معاطف", en: "Coats" }, { ar: "قمصان", en: "Shirts" }, { ar: "أحذية", en: "Shoes" }, { ar: "إكسسوار", en: "Accessories" }],
  copy: {
    season: { ar: "شتاء ٢٠٢٦", en: "Winter 2026" },
    h1: { ar: "أناقة تُخاط على مهل", en: "Tailored, slowly" },
    sub: { ar: "معاطف صوف وشالات كشمير مطرّزة يدوياً. قطع قليلة، تدوم طويلاً.", en: "Wool coats and hand-embroidered cashmere shawls. Few pieces, made to last." },
    shop: { ar: "تسوّق المجموعة", en: "Shop the collection" },
    cats: { ar: "تسوّق حسب الفئة", en: "Shop by category" },
    look: { ar: "دفتر الموسم", en: "The Lookbook" }, lookSub: { ar: "ست إطلالات من مجموعة الشتاء.", en: "Six looks from the winter collection." },
    newIn: { ar: "وصل حديثاً", en: "New arrivals" },
    stl: { ar: "تسوّق الإطلالة", en: "Shop the look" }, stlSub: { ar: "اضغط على النقاط لترى القطع.", en: "Tap the dots to see each piece." },
    quote: { ar: "«الملابس الجيدة لا تصرخ. تتحدث بهدوء، وتُسمع من بعيد.»", en: "“Good clothes don't shout. They speak quietly and are heard from afar.”" },
    news: { ar: "انضم لقائمة الدار", en: "Join the house list" }, newsSub: { ar: "أول من يعرف بالمجموعات الجديدة.", en: "Be first to know about new collections." }, email: { ar: "بريدك الإلكتروني", en: "Your email" }, join: { ar: "اشترك", en: "Subscribe" },
    mq: { ar: ["صوف", "كشمير", "تطريز يدوي", "قصّة إيطالية", "حياكة فاخرة"], en: ["Wool", "Cashmere", "Hand embroidery", "Italian cut", "Fine tailoring"] },
  },
  looks: ["1507679799987-c73779587ccf", "1500648767791-00dcc994a43e", "1519085360753-af0119f7cbe7", "1488161628813-04466f872be2", "1506794778202-cad84cf45f1d", "1552374196-1ab2a1c593e8"],
  products: [
    { id: "p1", cat: 0, name: { ar: "معطف صوف كلاسيكي", en: "Classic Wool Coat" }, price: 68000, img: "1617137968427-85924c800a22", alt: "1591047139829-d91aecb6caea", badge: "new", variant: { label: { ar: "المقاس", en: "Size" }, options: ["S", "M", "L", "XL"] }, desc: { ar: "صوف ممزوج بقصة مستقيمة وبطانة حريرية، أزرار من القرن الطبيعي.", en: "Wool blend in a straight cut with a silk lining and natural horn buttons." } },
    { id: "p2", cat: 1, name: { ar: "قميص قطن أوكسفورد", en: "Oxford Cotton Shirt" }, price: 14000, img: "1596755094514-f87e34085b2c", alt: "1602810318383-e386cc2a3ccf", variant: { label: { ar: "المقاس", en: "Size" }, options: ["S", "M", "L", "XL"] }, desc: { ar: "قطن أوكسفورد ناعم بياقة بأزرار.", en: "Soft Oxford cotton with a button-down collar." } },
    { id: "p3", cat: 3, name: { ar: "ساعة جلدية", en: "Leather Watch" }, price: 32000, img: "1523275335684-37898b6baf30", alt: "1524592094714-0f0654e20314", badge: "best", desc: { ar: "ساعة كلاسيكية بسوار جلد طبيعي.", en: "A classic watch on a genuine leather strap." } },
    { id: "p4", cat: 2, name: { ar: "حذاء جلد ديربي", en: "Leather Derby" }, price: 36000, old: 42000, img: "1614252235316-8c857d38b5f4", alt: "1491553895911-0055eca6402d", badge: "sale", variant: { label: { ar: "المقاس", en: "Size" }, options: ["40", "41", "42", "43", "44"] }, desc: { ar: "جلد عجل مصقول ونعل مخيط يدوياً.", en: "Polished calf leather with a hand-stitched sole." } },
    { id: "p5", cat: 3, name: { ar: "نظارة شمسية", en: "Sunglasses" }, price: 12000, img: "1572635196237-14b3f281503f", alt: "1511499767150-a48a237f0083", desc: { ar: "إطار أسيتات وعدسات مستقطبة.", en: "Acetate frame with polarised lenses." } },
    { id: "p6", cat: 0, name: { ar: "جاكيت مبطّن", en: "Quilted Jacket" }, price: 54000, img: "1591047139829-d91aecb6caea", alt: "1551028719-00167b16eac5", badge: "new", variant: { label: { ar: "المقاس", en: "Size" }, options: ["M", "L", "XL"] }, desc: { ar: "خفيف ودافئ للمساءات الباردة.", en: "Light and warm for cold evenings." } },
    { id: "p7", cat: 1, name: { ar: "تيشيرت ثقيل", en: "Heavy Tee" }, price: 7000, img: "1521572163474-6864f9cf17ab", alt: "1618354691373-d851c5c3a990", variant: { label: { ar: "اللون", en: "Color" }, options: [{ ar: "أبيض", en: "White" }, { ar: "أسود", en: "Black" }] }, desc: { ar: "قطن ثقيل بقصة مريحة.", en: "Heavyweight cotton, relaxed fit." } },
    { id: "p8", cat: 3, name: { ar: "حقيبة جلد", en: "Leather Bag" }, price: 41000, img: "1548036328-c9fa89d128fa", alt: "1553062407-98eeb64c6a62", desc: { ar: "حقيبة يومية من جلد مدبوغ نباتياً.", en: "A daily bag in vegetable-tanned leather." } },
  ],
};
