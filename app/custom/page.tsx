import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/guide/GuideShell";
import { CustomStoreForm } from "@/components/pay/CustomStoreForm";
import { Analytics } from "@/components/site/Analytics";
import { breadcrumbs, PLATFORM_ORIGIN, platformMetadata, platformOrganization } from "@/lib/platform-seo";
import { ldJson } from "@/lib/seo";

export const metadata: Metadata = platformMetadata(
  "متجر إلكتروني بتصميم خاص لعلامتك — فريق تصميم RVIOS | RVIOS Store",
  "لا تريد قالبًا جاهزًا؟ يصمم فريق RVIOS متجرك من الصفر بهويتك: صفحات مخصّصة، ومزايا خاصة مثل الحجز والولاء والطلب المسبق، وتصوير وإدخال المنتجات، مع إدارته من حسابك في عزم سمارت.",
  "/custom",
);

const STEPS = [
  ["أخبرنا بفكرتك", "املأ الموجز أدناه في دقيقتين: نشاطك، والصفحات والمزايا، والأسلوب الذي يشبهك."],
  ["نرسل لك العرض", "خلال يوم عمل يصلك على واتساب تصوّر التصميم والمدة والتكلفة — بلا التزام."],
  ["نصمم ونبني", "نصمم الواجهة بهويتك ونراجعها معك خطوة بخطوة حتى ترضى عن كل تفصيل."],
  ["تطلق وتدير بنفسك", "متجرك يعمل على RVIOS Store، وتديره من حسابك في عزم سمارت وتطبيق عزم على جوالك."],
];

const IDEAS = [
  ["متجر علامة فاخرة", "صفحة رئيسية سينمائية، وقصة العلامة، وصور منتجات احترافية — للعطور والمجوهرات والأزياء الراقية."],
  ["متجر حجز وخدمات", "صالونات وعيادات ومصورون: مواعيد محجوزة، وباقات خدمات، وتذكير على واتساب."],
  ["متجر طلب مسبق", "حلويات ومخبوزات وهدايا مخصّصة: اختيار التاريخ والكمية والنقش، وتأكيد الطلب قبل التنفيذ."],
  ["متجر جملة وتجار", "أسعار حسب الكمية، وطلب سريع بالجدول، وحسابات للتجار — للموزعين والمصانع."],
  ["متجر متعدد الفروع", "توصيل حسب المدينة والفرع، ومخزون لكل فرع، وطلبات تصل للفرع الأقرب."],
  ["متجر محتوى وعلامة شخصية", "مدونة ودروس ومنتجات رقمية بجانب المنتجات — للمدربين وصنّاع المحتوى."],
];

export default function CustomStorePage() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      platformOrganization,
      { "@type": "Service", "@id": `${PLATFORM_ORIGIN}/custom#service`, name: "تصميم متجر إلكتروني خاص", provider: { "@id": platformOrganization["@id"] }, areaServed: ["YE", "SA", "AE", "EG"], url: `${PLATFORM_ORIGIN}/custom` },
      breadcrumbs([["RVIOS Store", "/"], ["متجر بتصميم خاص", "/custom"]]),
    ],
  };
  return (
    <GuideShell>
      <Analytics />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      <div className="wrap gd-art cs-page">
        <header className="gd-hero">
          <span className="gd-kick">تصميم خاص</span>
          <h1 className="disp">متجر صُمم لعلامتك وحدها</h1>
          <p className="gd-lead">القوالب الجاهزة تبدأ بك سريعًا. وحين تريد متجرًا لا يشبه غيره، يصممه فريق RVIOS من الصفر بهويتك ومزاياك، ثم تديره بنفسك كأي متجر على المنصة.</p>
          <div className="gd-cta"><a className="nbtn" href="#brief">ابدأ موجز التصميم</a><Link className="gd-ghost" href="/templates">أو تصفّح القوالب الجاهزة</Link></div>
        </header>

        <section className="gd-sec">
          <h2 className="disp">كيف نعمل معك</h2>
          <ol className="pay-steps">{STEPS.map(([t, d]) => <li key={t}><b>{t}</b><small>{d}</small></li>)}</ol>
        </section>

        <section className="gd-sec">
          <h2 className="disp">أفكار نبنيها كثيرًا</h2>
          <div className="cs-ideas">{IDEAS.map(([t, d]) => <article key={t}><b>{t}</b><p>{d}</p></article>)}</div>
        </section>

        <section className="gd-sec" id="brief">
          <h2 className="disp">موجز التصميم</h2>
          <p className="mut">كلما كتبت أكثر كان العرض أدق. الحقول المعلَّمة بنجمة فقط إلزامية.</p>
          <CustomStoreForm />
        </section>

        <section className="gd-sec gd-faq">
          <h2 className="disp">أسئلة شائعة</h2>
          <details><summary>كم يكلّف المتجر بتصميم خاص؟</summary><p>يعتمد على الصفحات والمزايا. نرسل لك عرضًا مفصّلًا بعد قراءة الموجز، ويبدأ من تخصيص قالب جاهز بهويتك وحتى متجر وهوية كاملين من الصفر.</p></details>
          <details><summary>هل أدفع عمولة على مبيعاتي بعد الإطلاق؟</summary><p>لا. متجرك يعمل على باقات RVIOS Store نفسها، ولا عمولة على المبيعات في أي باقة.</p></details>
          <details><summary>هل أستطيع تعديل متجري بعد التسليم؟</summary><p>نعم. تدير المنتجات والطلبات والإعدادات والشكل من حسابك في عزم سمارت أو من تطبيق عزم، ونبقى معك للتعديلات الكبيرة.</p></details>
          <details><summary>كم يستغرق التصميم؟</summary><p>التخصيص البسيط أيامًا قليلة، والمتجر الكامل بهوية جديدة من أسبوعين إلى أربعة أسابيع حسب حجمه وسرعة المراجعات.</p></details>
        </section>
      </div>
    </GuideShell>
  );
}
