"use client";
import { useRef } from "react";
import { useFx } from "@/lib/useFx";
import { Nav } from "../site/Nav";
import { useSite } from "../site/Providers";
import { CurtainFooter } from "../platform/Sections";
import { AppPage } from "./AppPromo";

/** غلاف صفحة التطبيق: رأس المنصة وتذييلها وحركات الظهور نفسها */
export function AppShell() {
  const { lang } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  useFx(ref, lang);
  return (
    <div key={lang} ref={ref}>
      <Nav links={[["app", "/app", true], ["templates", "/templates"], ["pricing", "/#pricing"], ["faq", "/#faq"], ["guides", "/guide"]]} />
      <AppPage />
      <CurtainFooter />
    </div>
  );
}
