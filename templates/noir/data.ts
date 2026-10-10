import type { StoreDef } from "@/lib/store/types";

export const def: StoreDef = {
  id: "noir", slug: "oud-alsabaa", plan: "biz", price: 49,
  tplName: { ar: "قالب نوار", en: "Noir template" },
  name: { ar: "عطور السبعة", en: "Al-Sabaa Oud" },
  cats: [{ ar: "دهن عود", en: "Oud oil" }, { ar: "عطور", en: "Parfum" }, { ar: "بخور", en: "Incense" }, { ar: "هدايا", en: "Gifts" }],
  copy: {
    ann: { ar: "تغليف هدايا فاخر ومجاني لكل الطلبات", en: "Complimentary signature gift wrapping on every order" },
    h1a: { ar: "رائحة", en: "A scent" }, h1b: { ar: "تبقى", en: "that stays" },
    heroSub: { ar: "دهن عود وبخور ومسك، مختارة من أندر المصادر وتُعتّق بعناية منذ ١٩٩٨.", en: "Oud oil, incense and musk from the rarest origins, carefully aged since 1998." },
    discover: { ar: "اكتشف المجموعة", en: "Discover the collection" },
    coll: { ar: "المجموعة", en: "The Collection" }, collSub: { ar: "ثمانية عطور، ثمانية حكايات.", en: "Eight scents, eight stories." },
    notes: { ar: "هرم العطر", en: "The scent pyramid" },
    tiers: { ar: [["المقدمة", "زعفران · برغموت · هيل"], ["القلب", "ورد طائفي · عنبر · ياسمين"], ["القاعدة", "عود كمبودي · مسك · صندل"]], en: [["Top", "Saffron · Bergamot · Cardamom"], ["Heart", "Taifi rose · Amber · Jasmine"], ["Base", "Cambodian oud · Musk · Sandalwood"]] },
    story: { ar: "العود لا يُصنع، بل يُنتظر.", en: "Oud is not made. It is waited for." },
    storyTxt: { ar: "كل قطرة من دهن العود عندنا عتّقت سنوات قبل أن تصل إليك. نختار الخشب بأيدينا، ونقطّره ببطء، ونتركه يكتمل.", en: "Every drop of our oud oil has aged for years before it reaches you. We choose the wood by hand, distil it slowly, and let it come into its own." },
    gift: { ar: "صندوق السبعة", en: "The Sabaa Box" }, giftTxt: { ar: "دهن عود، مسك أبيض، وبخور مروكي في صندوق خشبي محفور يدوياً.", en: "Oud oil, white musk and Maroki incense in a hand-carved wooden box." },
    all: { ar: "كل العطور", en: "All fragrances" },
    marquee: { ar: ["عود", "عنبر", "مسك", "ورد طائفي", "زعفران", "صندل"], en: ["Oud", "Amber", "Musk", "Taifi rose", "Saffron", "Sandalwood"] },
  },
  products: [
    { id: "p1", cat: 0, name: { ar: "دهن عود كمبودي", en: "Cambodian Oud Oil" }, price: 45000, img: "1608571423902-eed4a5ad8108", badge: "best", stock: 3, variant: { label: { ar: "الحجم", en: "Size" }, options: ["3ml", "6ml", "12ml"] }, desc: { ar: "عود معتّق بثبات يدوم ساعات طويلة، بقلب خشبي دافئ وذيل من العسل.", en: "Aged oud with long-lasting depth, a warm woody heart and a honeyed trail." } },
    { id: "p2", cat: 1, name: { ar: "عطر الليل", en: "Nuit Parfum" }, price: 38000, img: "noir/4a01a733655ef6aece379e16f12ec4db", variant: { label: { ar: "الحجم", en: "Size" }, options: ["50ml", "100ml"] }, desc: { ar: "عنبر وورد طائفي وفانيليا مدخّنة.", en: "Amber, Taifi rose and smoked vanilla." } },
    { id: "p3", cat: 1, name: { ar: "عطر العنبر", en: "Amber Parfum" }, price: 16000, img: "noir/9bb68eb97a5c85667f1cdfcb9c29338d", badge: "new", desc: { ar: "عنبر دافئ بلمسة من الزعفران والفانيليا.", en: "Warm amber with a touch of saffron and vanilla." } },
    { id: "p4", cat: 2, name: { ar: "عطر بخور أريج", en: "Areej Bakhoor Parfum" }, price: 9000, img: "noir/c1f6f1f5e9aa35bad9c12e8506ba5965", desc: { ar: "نفحات البخور المروكي بخلطة البيت السرية منذ ثلاثة أجيال، في عطر يدوم.", en: "Maroki bakhoor notes from our three-generation house blend, in a lasting parfum." } },
    { id: "p5", cat: 3, name: { ar: "صندوق السبعة", en: "The Sabaa Box" }, price: 85000, old: 95000, img: "1549465220-1a8b9238cd48", badge: "sale", desc: { ar: "دهن عود ومسك وبخور في صندوق خشبي فاخر.", en: "Oud oil, musk and incense in a wooden presentation box." } },
    { id: "p6", cat: 1, name: { ar: "عطر السهرة", en: "Soiree Parfum" }, price: 29000, img: "1594035910387-fea47794261f", desc: { ar: "ورد جوري داكن مع عود ناعم وفانيليا، لإطلالة المساء.", en: "Dark rose, soft oud and vanilla for the evening." } },
    { id: "p7", cat: 0, name: { ar: "دهن عود هندي", en: "Indian Oud Oil" }, price: 62000, img: "1608571423902-eed4a5ad8108|0.5|0.42|1.5", stock: 2, desc: { ar: "عود هندي حيواني عميق لعشاق الثقل.", en: "Deep, animalic Indian oud for those who love weight." } },
    { id: "p8", cat: 1, name: { ar: "ورد طائفي", en: "Taifi Rose" }, price: 34000, img: "1592945403244-b3fbafd7f539", badge: "new", desc: { ar: "ورد طائفي مقطّر مع لمسة ليمون.", en: "Distilled Taifi rose with a touch of citrus." } },
  ],
};
