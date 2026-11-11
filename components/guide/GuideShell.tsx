/* The frame of the guide pages: the platform nav, the page, and a footer that links every guide to
   every other — search engines find all of them from any one, and readers find the one for them. */
import Link from "next/link";
import { PlatformAssistant } from "@/components/assistant/PlatformAssistant";
import { Nav } from "@/components/site/Nav";
import { GUIDE_GROUPS, GUIDES } from "@/lib/guides";

export function GuideShell({ children }: { children: React.ReactNode }) {
  const groups = Object.entries(GUIDE_GROUPS) as [keyof typeof GUIDE_GROUPS, string][];
  return (
    <>
      <Nav links={[["guides", "/guide", true], ["templates", "/templates"], ["pricing", "/#pricing"], ["faq", "/#faq"]]} />
      <main id="main" className="gd">{children}</main>
      <footer className="gd-foot">
        <div className="wrap">
          <div className="gd-fg">
            {groups.map(([g, label]) => (
              <nav key={g} aria-label={label}>
                <h3>{label}</h3>
                {GUIDES.filter((x) => x.group === g).map((x) => <Link key={x.slug} href={`/guide/${x.slug}`}>{x.h1.split("،")[0].split(":")[0]}</Link>)}
              </nav>
            ))}
            <nav aria-label="RVIOS Store">
              <h3>RVIOS Store</h3>
              <Link href="/">منصة المتاجر</Link>
              <Link href="/templates">قوالب المتاجر</Link>
              <Link href="/create">أنشئ متجرك مجانًا</Link>
              <Link href="/custom">متجر بتصميم خاص</Link>
              <Link href="/pay">طرق الدفع</Link>
              <a href="https://www.rvios.com/ar/blog">مدونة RVIOS</a>
            </nav>
          </div>
          <p className="gd-copy">© ٢٠٢٦ RVIOS Technologies — منصة متاجر إلكترونية عربية.</p>
        </div>
      </footer>
      <PlatformAssistant />
    </>
  );
}
