"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/fx";
import { SITE_STR, type SiteKey } from "@/lib/i18n-site";
import { Brand } from "./Logo";
import { IconMoon, IconSun } from "./Icons";
import { useSite } from "./Providers";
import { LoginModal } from "./LoginModal";

export function Nav({ links }: { links: [SiteKey, string, boolean?][] }) {
  const { lang, toggleLang, toggleTheme } = useSite();
  const s = SITE_STR[lang];
  const ref = useRef<HTMLElement>(null);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    let last = 0;
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (t) => { const y = t.scroll(); ref.current?.classList.toggle("solid", y > 30); ref.current?.classList.toggle("hide", y > last && y > 600); last = y; } });
    return () => st.kill();
  }, []);
  return (
    <>
      <header className="nav" ref={ref}>
        <div className="nav-in">
          <Link href="/" aria-label="RVIOS Store"><Brand /></Link>
          <nav className="nav-links">{links.map(([k, href, on]) => <Link key={k} href={href} className={on ? "on" : ""}>{s[k]}</Link>)}</nav>
          <div className="nav-act">
            <button className="nav-login" onClick={() => setLogin(true)}>{s.login}</button>
            <button className="icb nav-ic" onClick={toggleLang} aria-label="Language"><span className={lang === "ar" ? "ya" : ""} style={{ fontSize: lang === "ar" ? 11 : 18 }}>{lang === "ar" ? "EN" : "ع"}</span></button>
            <button className="icb nav-ic" onClick={toggleTheme} aria-label="Theme"><IconMoon /><IconSun /></button>
            <Link className="nbtn" href="/create">{s.start}</Link>
          </div>
        </div>
      </header>
      <LoginModal open={login} onClose={() => setLogin(false)} />
    </>
  );
}
