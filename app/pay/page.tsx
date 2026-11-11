import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/guide/GuideShell";
import { PayAccounts } from "@/components/pay/PayAccounts";
import { ContactLinks } from "@/components/site/Contact";
import { Analytics } from "@/components/site/Analytics";
import { payAccounts } from "@/lib/pay";
import { breadcrumbs, platformMetadata, platformOrganization } from "@/lib/platform-seo";
import { ldJson } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = platformMetadata(
  "طرق الدفع — بنك الكريمي ومحفظة جيب ومحفظة جوالي | RVIOS Store",
  "ادفع اشتراك متجرك أو قالبك في RVIOS Store بحوالة إلى حساب بنك الكريمي بالريال اليمني أو الدولار، أو عبر محفظة جيب ومحفظة جوالي برمز QR، ثم أرسل الإيصال للفريق ليُفعَّل متجرك.",
  "/pay",
);

export default async function PayPage() {
  const accounts = await payAccounts();
  const ld = { "@context": "https://schema.org", "@graph": [platformOrganization, breadcrumbs([["RVIOS Store", "/"], ["طرق الدفع", "/pay"]])] };
  return (
    <GuideShell>
      <Analytics />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      <div className="wrap gd-art pay-page">
        <header className="gd-hero">
          <span className="gd-kick">طرق الدفع</span>
          <h1 className="disp">ادفع بالطريقة الأسهل لك</h1>
          <p className="gd-lead">اشتراك الباقة والقوالب المدفوعة وخدمات المتجر تُدفع بحوالة إلى أحد حساباتنا أدناه. انسخ الرقم أو امسح رمز المحفظة، ثم أرسل الإيصال لفريقنا ليُفعَّل طلبك.</p>
        </header>

        <section className="gd-sec">
          <PayAccounts accounts={accounts} />
        </section>

        <section className="gd-sec">
          <h2 className="disp">ثلاث خطوات وينتهي الأمر</h2>
          <ol className="pay-steps">
            <li><b>اختر الحساب وحوّل المبلغ</b><small>المبلغ يظهر لك في ملخّص طلبك عند إنشاء المتجر، أو في صفحة «الباقة والفواتير» داخل حسابك في عزم سمارت.</small></li>
            <li><b>صوّر الإيصال</b><small>لقطة شاشة من تطبيق البنك أو المحفظة تكفي، على أن يظهر فيها المبلغ والتاريخ.</small></li>
            <li><b>أرسله لنا ويتفعّل طلبك</b><small>عبر واتساب أو ارفعه من صفحة الفواتير في حسابك؛ يراجعه الفريق ويفعّل الباقة أو القالب.</small></li>
          </ol>
          <div className="pay-help"><b>أرسل الإيصال أو اسأل الفريق</b><ContactLinks compact /></div>
        </section>

        <section className="gd-sec gd-faq">
          <h2 className="disp">أسئلة شائعة</h2>
          <details><summary>بأي عملة أدفع؟</summary><p>الأسعار معلنة بالدولار. تدفع بالدولار إلى حساب الكريمي بالدولار، أو بما يعادله بالريال اليمني إلى حساب الريال بسعر الصرف يوم التحويل، أو عبر المحافظ.</p></details>
          <details><summary>متى يتفعّل متجري بعد الدفع؟</summary><p>بعد أن يراجع الفريق الإيصال، وغالبًا في اليوم نفسه. تصلك رسالة عند التفعيل، وتظهر الباقة الجديدة في حسابك فورًا.</p></details>
          <details><summary>هل أدفع شيئًا للمتجر المجاني؟</summary><p>لا. المتجر المجاني يُنشأ فورًا بلا دفع. الدفع للباقات «احترافي» و«أعمال» وللقوالب المدفوعة فقط، ولا عمولة على مبيعاتك في أي باقة.</p></details>
          <details><summary>أنا خارج اليمن، كيف أدفع؟</summary><p>حوّل إلى حساب الكريمي بالدولار عبر حوالة دولية أو شركة صرافة، أو تواصل مع الفريق ليرسل لك وسيلة أنسب لبلدك.</p></details>
        </section>

        <div className="gd-cta"><Link className="nbtn" href="/create">أنشئ متجرك الآن</Link><Link className="gd-ghost" href="/#pricing">الباقات والأسعار</Link></div>
      </div>
    </GuideShell>
  );
}
