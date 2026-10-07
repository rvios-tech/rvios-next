import type { StoreDef } from "@/lib/store/types";

export const def: StoreDef = {
  id: "sukkar", slug: "reem-sweets", plan: "pro", price: 19,
  tplName: { ar: "قالب سُكّر", en: "Sukkar template" },
  name: { ar: "حلويات ريم", en: "Reem Sweets" },
  cats: [{ ar: "كيك", en: "Cakes" }, { ar: "كوكيز", en: "Cookies" }, { ar: "دونات", en: "Doughnuts" }],
  copy: {
    ann: { ar: "🍰 الطلبات قبل ٢ ظهراً تُسلَّم اليوم", en: "🍰 Order before 2 PM for same-day delivery" },
    h1: { ar: "حلا البيت", en: "Homemade" }, h1b: { ar: "كل يوم", en: "every day" },
    sub: { ar: "كيك وكوكيز ودونات تُخبز بالطلب في مطبخ ريم، بزبدة حقيقية وبدون مواد حافظة.", en: "Cakes, cookies and doughnuts baked to order in Reem's kitchen, with real butter and no preservatives." },
    order: { ar: "اطلب الحين", en: "Order now" }, drag: { ar: "اسحبني!", en: "Drag me!" },
    rib: { ar: ["طازج كل صباح", "زبدة حقيقية", "بدون مواد حافظة", "توصيل لإب"], en: ["Fresh every morning", "Real butter", "No preservatives", "Delivery across Ibb"] },
    menu: { ar: "القائمة", en: "The menu" },
    box: { ar: "اصنع علبتك", en: "Build your box" }, boxSub: { ar: "اختر ٦ قطع كوكيز بالنكهات التي تحبها.", en: "Pick 6 cookies in the flavours you love." }, boxAdd: { ar: "أضف العلبة", en: "Add the box" }, boxLeft: { ar: "باقي {n}", en: "{n} to go" }, boxDone: { ar: "علبتك جاهزة!", en: "Your box is ready!" }, reset: { ar: "إعادة", en: "Reset" },
    flavors: { ar: ["شوكولاتة", "شوفان", "فستق", "توت", "كراميل", "قرفة"], en: ["Chocolate", "Oat", "Pistachio", "Berry", "Caramel", "Cinnamon"] },
    info: { ar: [["🕑", "التوصيل خلال ساعتين"], ["📍", "إب وما حولها"], ["⭐", "٤٫٩ من ٨٠٠ طلب"]], en: [["🕑", "Delivery in 2 hours"], ["📍", "Ibb and nearby"], ["⭐", "4.9 from 800 orders"]] },
  },
  products: [
    { id: "p1", cat: 0, name: { ar: "كيكة الشوكولاتة", en: "Chocolate Cake" }, price: 15000, img: "1578985545062-69928b1d9587", badge: "best", variant: { label: { ar: "الحجم", en: "Size" }, options: [{ ar: "٦ أشخاص", en: "Serves 6" }, { ar: "١٠ أشخاص", en: "Serves 10" }] }, desc: { ar: "طبقات شوكولاتة داكنة وغاناش لامع.", en: "Dark chocolate layers and glossy ganache." } },
    { id: "p2", cat: 1, name: { ar: "كوكيز الشوكولاتة", en: "Choc Chip Cookies" }, price: 3500, img: "1499636136210-6f4ee915583e", desc: { ar: "علبة ٦ حبات طرية من الداخل.", en: "Box of 6, soft in the middle." } },
    { id: "p3", cat: 2, name: { ar: "دونات ملوّنة", en: "Glazed Doughnuts" }, price: 4000, img: "1551024601-bec78aea704b", badge: "new", desc: { ar: "علبة ٤ حبات بتغطيات مختلفة.", en: "Box of 4, assorted glazes." } },
    { id: "p4", cat: 0, name: { ar: "تشيز كيك التوت", en: "Berry Cheesecake" }, price: 13000, img: "1533134242443-d4fd215305ad", desc: { ar: "قاعدة بسكويت وصوص توت طازج.", en: "Biscuit base and fresh berry sauce." } },
    { id: "p5", cat: 1, name: { ar: "كوكيز الشوفان", en: "Oat Cookies" }, price: 3000, img: "1558961363-fa8fdf82db35", desc: { ar: "شوفان وزبيب وقرفة.", en: "Oats, raisins and cinnamon." } },
    { id: "p6", cat: 0, name: { ar: "كب كيك", en: "Cupcakes" }, price: 6000, old: 7000, img: "1486427944299-d1955d23e34d", badge: "sale", desc: { ar: "علبة ٦ حبات بكريمة الفانيليا.", en: "Box of 6 with vanilla frosting." } },
    { id: "p7", cat: 2, name: { ar: "دونات القرفة", en: "Cinnamon Doughnuts" }, price: 3500, img: "1527515545081-5db817172677", desc: { ar: "دونات مقرمشة بالسكر والقرفة.", en: "Crisp doughnuts in cinnamon sugar." } },
    { id: "p8", cat: 0, name: { ar: "كيكة الفراولة", en: "Strawberry Cake" }, price: 16000, img: "1565958011703-44f9829ba187", badge: "new", desc: { ar: "إسفنج فانيليا وفراولة طازجة وكريمة.", en: "Vanilla sponge, fresh strawberries and cream." } },
    { id: "box", cat: 1, name: { ar: "علبة كوكيز مخصصة", en: "Custom Cookie Box" }, price: 9000, img: "1499636136210-6f4ee915583e", hidden: true, desc: { ar: "٦ قطع من اختيارك.", en: "6 pieces of your choice." } },
  ],
};
