# RVIOS Store — store.rvios.com

منصة متاجر إلكترونية متعددة المستأجرين: موقع المنصة، متجر القوالب، وستة قوالب متاجر كاملة.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, Flip) · Lenis · WebGL shaders · next/font (Zain, Thmanyah, Yapari)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## رحلة التاجر
1. **إنشاء المتجر** (`/create`): اختيار القالب (مع معاينة حية حاسوب/جوال) ← اختيار الباقة ← بيانات المتجر ← الدفع (للباقات المدفوعة).
2. **مجاني:** القالب الأساسي فقط، يُنشأ المتجر فوراً على `<slug>.rvios.store` مع عبارة **Powered by RVIOS**.
3. **مدفوع (احترافي/أعمال):** قوالب Premium (دفعة واحدة) + اشتراك شهري أو سنوي + ربط دومين خاص. يُنشأ المتجر فوراً ويتفعّل القالب والباقة بعد التحقق من إيصال جيب/الكريمي.
4. **صفحة النجاح** (`/create/success`): رابط المتجر، زيارة المتجر، المشاركة على واتساب، إدارة المتجر عبر AzmSmart (قريباً)، والتواصل مع RVIOS.

**نموذج الربح:** Premium Template دفعة واحدة · Subscription شهري/سنوي · Free Store أداة جذب وتسويق.

## AzmSmart
لا توجد لوحة تحكم داخل RVIOS Store. تسجيل الدخول والحساب وإدارة المتجر (المنتجات والطلبات) ستكون عبر **AzmSmart**.
الروابط جاهزة في `lib/config.ts` (`AZMSMART.login`, `account`, `manageStore(slug)`)، وعند الإطلاق: `live: true`.
يُربط المتجر بصاحبه عبر البريد (`stores.owner_email`) ثم `owner_id`.

## الدومينات
- `middleware.ts` يحوّل `<slug>.rvios.store` إلى `/s/<slug>`.
- الدومين الخاص (للباقات المدفوعة) يُحفظ في `stores.custom_domain` ويمكن حله في نفس الـ middleware.

## تواصل RVIOS
واتساب +967739008083 · Instagram @rvios_tech · Facebook · www.rvios.com (في `lib/config.ts`).

## وضعا التشغيل
- **تجريبي (افتراضي):** بدون أي إعداد. المتاجر المُنشأة تُحفظ في المتصفح وتعمل فوراً على `/s/<slug>`.
- **Supabase:** انسخ `.env.example` إلى `.env.local` وضع `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY`، ثم نفّذ `supabase/migrations/0001_init.sql`. يتحول التطبيق كله تلقائياً لقاعدة البيانات.

## المسارات
| المسار | الصفحة |
|---|---|
| `/` | موقع المنصة (هيرو ثلاثي الأبعاد، المزايا، القوالب، الأسعار…) |
| `/templates` | متجر القوالب: فلترة متحركة (Flip)، مقارنة، شراء |
| `/s/[store]` | الصفحة الرئيسية للمتجر بقالبه |
| `/s/[store]/p/[id]` | صفحة المنتج |
| `/s/[store]/checkout` | إتمام الطلب |
| `/s/[store]/order/[id]` | تتبّع الطلب + التواصل مع المتجر |
| `/create` | إنشاء متجر: قالب ← باقة ← بيانات ← دفع |
| `/create/success` | صفحة نجاح المتجر |

## القوالب (١٨)
| القالب | القطاع | الفئة | السعر | المتجر التجريبي |
|---|---|---|---|---|
| ذهب | مجوهرات | توقيع | ٥٥$ | `/s/al-yaqoot` |
| نوار | عطور | توقيع | ٤٩$ | `/s/oud-alsabaa` |
| ميزون | أزياء | توقيع | ٤٥$ | `/s/dar-alshal` |
| فولت | إلكترونيات | توقيع | ٣٩$ | `/s/tech-plus` |
| خطوة | منتج واحد | توقيع | ٣٩$ | `/s/khatwa` |
| سَتر | عبايات | توقيع | ٣٥$ | `/s/lama-abayas` |
| ندى | تجميل | توقيع | ٣٢$ | `/s/nada-care` |
| بيت | أثاث | قياسي | ٢٩$ | `/s/dar-alsakan` |
| قِطع | قطع غيار | قياسي | ٢٩$ | `/s/jabali-parts` |
| نبض | رياضة | قياسي | ٢٧$ | `/s/nabd-sports` |
| مائدة | مطاعم | قياسي | ٢٥$ | `/s/al-reef` |
| تراث | حِرف يمنية | قياسي | ٢٤$ | `/s/heritage-house` |
| زهر | نباتات وورد | قياسي | ٢٢$ | `/s/sanaa-garden` |
| سُكّر | حلويات | قياسي | ١٩$ | `/s/reem-sweets` |
| عسل | عسل | قياسي | ١٩$ | `/s/doan-apiaries` |
| مرح | أطفال | قياسي | ١٧$ | `/s/fun-world` |
| ورق | كتب | قياسي | ١٥$ | `/s/al-kalima` |
| أساسي | أي نشاط | مجاني | ٠$ | `/s/bunn-haraz` |

## البنية
```
app/                 المسارات + الخطوط (app/fonts) + globals.css (Tailwind tokens)
components/site/     Providers (لغة/ثيم/Lenis/مؤشر/Toast) · Nav · Login · Loader · Logo · Poster · Img
components/platform/ Hero (المشهد ثلاثي الأبعاد) · Sections (Bento, How, Pricing, …)
components/market/   صفحة متجر القوالب + نافذة الشراء
components/store/    محرّك المتجر: Shell · Drawer · DemoBar · ProductPage · Checkout · OrderDone
lib/                 fx (GSAP, shaders, reveals) · catalog (القوالب وأسعارها) · i18n · store/engine (السلة والطلبات)
templates/<id>/      data.ts (المتجر والمنتجات) + index.tsx (Header, Footer, Card, Home)
styles/              CSS مكوّنات المنصة وكل قالب (scoped بـ .tpl-<id>)
```

## نظام Composer (القوالب الـ ١٢ الجديدة)
`templates/cx/composer.tsx` يبني متجراً كاملاً من إعدادات: نوع الهيدر، شكل البطاقة، وقائمة أقسام.
- **الهيرو (٨ أشكال):** split · center · stack · banner · collage · search · product · diag
- **البطاقات (١٠ أشكال):** classic · tall · circle · soft · dense · book · bubble · overlay · framed · menu
- **الأقسام:** marquee · cats (tiles/pills/circles) · grid · feature · usp · deal (بعدّاد) · single (منتج واحد) · news
- **الهوية:** متغيرات CSS لكل قالب في `styles/templates/cx.css` (الألوان، الزوايا، خط العناوين، الزخارف).

قالب جديد بهذا النظام = ملف إعدادات واحد في `templates/cx/` + سطر توكنز في `cx.css` + إدخال في `lib/catalog-cx.ts`.

## إضافة قالب جديد (مخصص بالكامل)
1. `templates/<id>/data.ts` يصدّر `def: StoreDef` (المتجر، التصنيفات، المنتجات، النصوص).
2. `templates/<id>/index.tsx` يصدّر `Header`, `Footer`, `Card`, `Home` ويستخدم `useStore()`.
3. `styles/templates/<id>.css` بتنسيقات تبدأ بـ `.tpl-<id>`، واستيراده في `app/globals.css`.
4. تسجيله في `templates/registry.tsx` و`templates/defs.ts`، وإضافته إلى `lib/catalog.ts` مع السعر والفئة.

المحرّك يوفّر تلقائياً: السلة، الكوبون (`RVIOS10` للمعاينة)، إتمام الطلب، تتبّع الطلب، صفحة المنتج، شارة "أُنشئ بواسطة" في الباقة المجانية، وشريط المعاينة لتجربة الباقات.

## التسعير المطبّق
- الباقات: مجاني · احترافي ٦$ شهرياً أو ٦٠$ سنوياً (توفير ١٢$) · أعمال ١٥$ شهرياً أو ١٥٠$ سنوياً (توفير ٣٠$)
- القوالب: دفعة واحدة لكل متجر، من ١٥$ إلى ٥٥$ (الجدول أعلاه)
- باقة أعمال: القوالب القياسية مشمولة، وقوالب التوقيع بخصم ٤٠٪ (`templatePrice` في `components/market/MarketPage.tsx`)

## البيانات والأمان (Supabase)
- `supabase/migrations/0001_init.sql`: الجداول (المتاجر، التصنيفات، المنتجات، الطلبات، الإيصالات، تراخيص القوالب، الباقات) مع RLS.
- **المتاجر** تُنشأ عبر `create_store` (عامة، بدون حساب): المجاني يعمل فوراً، والمدفوع يُسجَّل إيصاله وينتظر `apply_payment`.
- **الطلبات** تُنشأ عبر الدالة `place_order` التي تقرأ الأسعار من قاعدة البيانات، فلا يمكن للزبون التلاعب بالإجمالي.
- **حقول الباقة** (`plan_id`, `plan_expires_at`, `verified`) محمية بـ trigger، ولا تتغير إلا عبر `apply_payment` التي يشغّلها المشرف عند قبول الإيصال.
- **الإيصالات** في bucket خاص `receipts/<store_id>/` لا يقرؤه إلا صاحب المتجر والمشرف.
- `lib/data/` طبقة بيانات واحدة (`Repo`) بتنفيذين: `demo.ts` و`supabase.ts`؛ الواجهة لا تعرف أيهما يعمل.
- أي قالب يعمل مع بيانات أي تاجر: منتجات التاجر تُوزَّع على خانات منتجات القالب (`StoreLayoutClient`).

## الخطوات التالية للإنتاج
- **مراجعة الإيصالات:** عبر AzmSmart أو لوحة إدارة RVIOS الداخلية، باستدعاء `apply_payment` (جاهزة في قاعدة البيانات).
- **الدومين الخاص:** حل `custom_domain` في `middleware.ts` وإعداد SSL على الاستضافة.
- **الصور:** حالياً من Unsplash عبر `U()` في `lib/u.ts`؛ تُستبدل بتخزين المتجر (Supabase Storage / R2).
- **الدومينات الخاصة:** Middleware يحوّل الدومين إلى `/s/[store]`.
