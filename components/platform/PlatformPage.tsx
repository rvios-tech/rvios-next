"use client";
import { useEffect, useRef, useState } from "react";
import { scrollToEl } from "@/lib/lenis";
import { useFx } from "@/lib/useFx";
import { Loader } from "../site/Loader";
import { LoginModal } from "../site/LoginModal";
import { Nav } from "../site/Nav";
import { useSite } from "../site/Providers";
import { Hero } from "./Hero";
import { CurtainFooter, Faq, Features, HowItWorks, Manifesto, OrderFlow, Pricing, StoresMarquee, TemplatesShowcase } from "./Sections";

export function PlatformPage() {
  const { lang } = useSite();
  const [ready, setReady] = useState(false);
  const [login, setLogin] = useState(false);
  const main = useRef<HTMLElement>(null);
  useFx(main, lang);
  // smooth in-page anchors
  useEffect(() => {
    const h = (e: MouseEvent) => { const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null; if (!a) return; const el = document.querySelector(a.getAttribute("href")!); if (el) { e.preventDefault(); scrollToEl(el, -10); } };
    document.addEventListener("click", h); return () => document.removeEventListener("click", h);
  }, []);
  return (
    <div key={lang}>
      <Loader onDone={() => setReady(true)} />
      <Nav links={[["features", "#features"], ["how", "#how"], ["templates", "/templates"], ["pricing", "#pricing"], ["faq", "#faq"]]} />
      <main id="main" ref={main}>
        <Hero ready={ready} />
        <StoresMarquee />
        <Manifesto />
        <Features />
        <HowItWorks />
        <TemplatesShowcase />
        <OrderFlow />
        <Pricing />
        <Faq />
      </main>
      <CurtainFooter />
      <LoginModal open={login} onClose={() => setLogin(false)} />
    </div>
  );
}
