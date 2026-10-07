import { Img } from "./Img";
import type { TemplateMeta } from "@/lib/catalog";
import type { Lang } from "@/lib/u";

/** A designed mini-poster of each template: real typography, palette and imagery, scaled with container units. */
export function Poster({ tp, lang }: { tp: TemplateMeta; lang: Lang }) {
  const en = lang === "en";
  const store = tp.store[lang];
  const img = <Img id={tp.img} w={900} fb={store.charAt(0)} />;
  switch (tp.id) {
    case "noir":
      return <div className="pz pz-noir"><div className="pz-nav"><span /><b>{store}</b><span /></div><div className="pz-arch">{img}</div><div className="pz-t1">{en ? "A scent" : "رائحة"}</div><div className="pz-t2">{en ? "that stays" : "تبقى"}</div></div>;
    case "maison":
      return <div className="pz pz-maison">{img}<div className="pz-nav"><b className="ya">DAR AL-SHAL</b></div><div className="pz-t1">{en ? "TAILORED, SLOWLY" : "أناقة تُخاط على مهل"}</div><span className="pz-s ya">AW—26</span></div>;
    case "volt":
      return <div className="pz pz-volt"><div className="pz-grid" /><div className="pz-nav"><i /><b>{store}</b><span>⌘K</span></div><div className="pz-t1">{en ? "Sound you can see." : "صوت يُرى."}</div><div className="pz-prod">{img}</div><div className="pz-pill">-52dB</div></div>;
    case "bayt":
      return <div className="pz pz-bayt"><div className="pz-nav"><i /><b>{store}</b></div><div className="pz-t1">{en ? "A home that feels like you" : "بيتٌ يشبهك"}</div><div className="pz-arch">{img}</div><div className="pz-dot" /></div>;
    case "sukkar":
      return <div className="pz pz-sukkar"><div className="pz-nav"><i>ر</i><b>{store}</b></div><div className="pz-t1">{en ? "Homemade" : "حلا البيت"}</div><div className="pz-t2">{en ? "every day" : "كل يوم"}</div><div className="pz-circ">{img}</div><div className="pz-rib">{en ? "FRESH · REAL BUTTER · FRESH" : "طازج · زبدة حقيقية · طازج"}</div></div>;
    case "essential":
      return <div className="pz pz-essential"><div className="pz-nav"><i>ب</i><b>{store}</b></div><div className="pz-cover">{img}<div className="pz-t1">{en ? "Mountain coffee" : "بنّ الجبال"}</div></div><div className="pz-cards"><i /><i /><i /></div></div>;
    default:
      return <CxPoster tp={tp} lang={lang} />;
  }
}

/** Generic poster for composer templates: palette + hero layout + real headline. */
function CxPoster({ tp, lang }: { tp: TemplateMeta; lang: Lang }) {
  const [bg, acc, ink] = tp.pal; const v = tp.poster?.v ?? "split"; const store = tp.store[lang];
  const img = <Img id={tp.img} w={900} fb={store.charAt(0)} />;
  return (
    <div className={`pz pz-cx pv-${v}`} style={{ ["--pb" as string]: bg, ["--pa" as string]: acc, ["--pi" as string]: ink }}>
      <div className="pz-nav"><i>{store.charAt(0)}</i><b>{store}</b><span /></div>
      <div className="pz-img">{img}</div>
      <div className="pz-t1">{tp.poster?.t[lang]}</div>
      <div className="pz-btn">{lang === "ar" ? "تسوّق" : "Shop"}</div>
      {v === "product" && <div className="pz-giant">{tp.name[lang]}</div>}
      {v === "search" && <div className="pz-find"><i /><i /><i /></div>}
    </div>
  );
}
