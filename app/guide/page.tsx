import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/guide/GuideShell";
import { Analytics } from "@/components/site/Analytics";
import { GUIDE_GROUPS, GUIDES } from "@/lib/guides";
import { breadcrumbs, PLATFORM_ORIGIN, platformMetadata, platformOrganization } from "@/lib/platform-seo";
import { ldJson } from "@/lib/seo";

export const metadata: Metadata = platformMetadata(
  "دليل إنشاء وتصميم المتاجر الإلكترونية — حسب الدولة والنشاط | RVIOS Store",
  "كل ما تحتاجه لإنشاء متجرك الإلكتروني: البدء خطوة بخطوة، وتصميم المتجر، والمتجر المجاني، والبيع عبر واتساب، ومتاجر اليمن والسعودية ومصر، وأدلة لمتاجر العطور والأزياء والإلكترونيات والحلويات والمجوهرات والمطاعم.",
  "/guide",
);

export default function GuideIndex() {
  const groups = Object.entries(GUIDE_GROUPS) as [keyof typeof GUIDE_GROUPS, string][];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      platformOrganization,
      { "@type": "CollectionPage", "@id": `${PLATFORM_ORIGIN}/guide`, url: `${PLATFORM_ORIGIN}/guide`, name: "دليل المتاجر الإلكترونية", inLanguage: "ar",
        hasPart: GUIDES.map((g) => ({ "@type": "WebPage", name: g.h1, url: `${PLATFORM_ORIGIN}/guide/${g.slug}` })) },
      breadcrumbs([["RVIOS Store", "/"], ["الأدلة", "/guide"]]),
    ],
  };
  return (
    <GuideShell>
      <Analytics />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      <div className="wrap gd-art">
        <header className="gd-hero">
          <span className="gd-kick">الأدلة</span>
          <h1 className="disp">دليلك لإنشاء متجر إلكتروني ناجح</h1>
          <p className="gd-lead">من أول خطوة إلى أول طلب: أدلة عملية لإنشاء متجرك وتصميمه وبيعه في بلدك ولنشاطك، كلها مبنية على ما يعمل فعلًا في متاجر عربية حقيقية.</p>
          <div className="gd-cta"><Link className="nbtn" href="/create">أنشئ متجرك مجانًا</Link></div>
        </header>
        {groups.map(([g, label]) => (
          <section key={g} className="gd-sec gd-rel">
            <h2 className="disp">{label}</h2>
            <div>{GUIDES.filter((x) => x.group === g).map((x) => <Link key={x.slug} href={`/guide/${x.slug}`}><b>{x.h1}</b><small>{x.description}</small></Link>)}</div>
          </section>
        ))}
      </div>
    </GuideShell>
  );
}
