import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideShell } from "@/components/guide/GuideShell";
import { Analytics } from "@/components/site/Analytics";
import { GUIDE_GROUPS, GUIDE_TEMPLATES, GUIDES, guideBySlug } from "@/lib/guides";
import { breadcrumbs, faqPage, PLATFORM_ORIGIN, platformMetadata, platformOrganization } from "@/lib/platform-seo";
import { ldJson } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  return g ? platformMetadata(g.title, g.description, `/guide/${g.slug}`, g.keywords) : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const url = `${PLATFORM_ORIGIN}/guide/${g.slug}`;
  const related = GUIDES.filter((x) => x.slug !== g.slug && (x.group === g.group || x.group === "start")).slice(0, 6);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      platformOrganization,
      { "@type": "WebPage", "@id": url, url, name: g.title, headline: g.h1, description: g.description, inLanguage: "ar", keywords: g.keywords.join("، "), publisher: { "@id": `${PLATFORM_ORIGIN}/#org` }, isPartOf: { "@id": `${PLATFORM_ORIGIN}/#site` } },
      breadcrumbs([["RVIOS Store", "/"], ["الأدلة", "/guide"], [g.h1, `/guide/${g.slug}`]]),
      faqPage(g.faq),
    ],
  };
  return (
    <GuideShell>
      <Analytics />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      <article className="wrap gd-art">
        <nav className="gd-crumbs" aria-label="مسار الصفحة">
          <Link href="/">RVIOS Store</Link><span>/</span><Link href="/guide">الأدلة</Link><span>/</span><span>{GUIDE_GROUPS[g.group]}</span>
        </nav>
        <header className="gd-hero">
          <span className="gd-kick">{g.kicker}</span>
          <h1 className="disp">{g.h1}</h1>
          {g.intro.map((p, i) => <p key={i} className={i === 0 ? "gd-lead" : ""}>{p}</p>)}
          <div className="gd-cta">
            <Link className="nbtn" href="/create">أنشئ متجرك مجانًا</Link>
            <Link className="gd-ghost" href="/templates">تصفّح القوالب</Link>
          </div>
        </header>

        {g.sections.map((s) => (
          <section key={s.h} className="gd-sec">
            <h2 className="disp">{s.h}</h2>
            {s.p?.map((p, i) => <p key={i}>{p}</p>)}
            {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
          </section>
        ))}

        <section className="gd-sec">
          <h2 className="disp">قوالب تناسب {g.group === "sector" ? "نشاطك" : "متجرك"}</h2>
          <div className="gd-tpls">
            {g.templates.map((id) => {
              const [name, demo, fits] = GUIDE_TEMPLATES[id];
              return (
                <Link key={id} href={`/s/${demo}`} className="gd-tpl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/previews/${id}-desk.webp`} alt={`قالب ${name} لمتجر ${fits} — معاينة حية`} loading="lazy" width={640} height={400} />
                  <span><b>قالب {name}</b><small>{fits}</small></span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="gd-sec gd-faq">
          <h2 className="disp">أسئلة شائعة</h2>
          {g.faq.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}
        </section>

        <section className="gd-band">
          <h2 className="disp">ابدأ متجرك اليوم، مجانًا</h2>
          <p>رابط خاص، وقالب بهويتك، وطلبات منظّمة عبر واتساب — دون بطاقة ائتمان ودون عمولة.</p>
          <Link className="nbtn" href="/create">أنشئ متجرك الآن</Link>
        </section>

        <nav className="gd-sec gd-rel" aria-label="أدلة ذات صلة">
          <h2 className="disp">اقرأ أيضًا</h2>
          <div>{related.map((x) => <Link key={x.slug} href={`/guide/${x.slug}`}><b>{x.h1}</b><small>{x.description}</small></Link>)}</div>
        </nav>
      </article>
    </GuideShell>
  );
}
