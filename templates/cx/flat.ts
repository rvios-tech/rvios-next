import type { Bi } from "@/lib/u";
import type { CxConfig } from "./composer";
import { GEN } from "./gen";

type BiList<T> = { ar: T[]; en: T[] };

/**
 * يجعل كل نص في قوالب المُركِّب قابلًا للتعديل من «شكل المتجر»: عناوين الأقسام ونصوصها،
 * والأرقام والخطوات والأسئلة العامة، والتذييل والإعلان (والقوائم الأخرى عامة في copy-lists.ts).
 *
 * المحرر (EditorBridge) والدمج (merge.ts) يعرفان النصوص المفردة وحدها — المفاتيح التي قيمتها
 * نص أو {ar,en}. فتُنسخ كل قائمة هنا إلى مفاتيح مفردة (`s3t`، `st0n`…)، والمكوّنات تقرأ المفتاح
 * أولًا ثم القيمة الأصلية. النصّ الافتراضي لا يتغيّر؛ ما يكتبه التاجر يحلّ محلّه.
 */
export function flattenCopy(c: CxConfig): CxConfig {
  const copy: Record<string, unknown> = { ...c.def.copy };
  const put = (k: string, v: Bi | undefined) => {
    if (v && (v.ar || v.en) && copy[k] === undefined) copy[k] = v;
  };
  const bi = (ar: string | undefined, en: string | undefined): Bi | undefined => (ar ? { ar, en: en ?? ar } : undefined);

  c.sections.forEach((s, i) => {
    if ("title" in s) put(`s${i}t`, s.title);
    if ("body" in s) put(`s${i}b`, s.body);
  });



  const has = (k: string) => c.sections.some((s) => s.k === k);
  const gen = <T,>(k: keyof typeof GEN) => (c.def.copy[k] as BiList<T> | undefined) ?? (GEN[k] as unknown as BiList<T>);
  if (has("stats")) gen<string[]>("stats").ar.forEach((x, i) => {
    const en = gen<string[]>("stats").en[i];
    put(`st${i}n`, bi(x[0], en?.[0]));
    put(`st${i}l`, bi(x[1], en?.[1]));
  });
  if (has("steps")) gen<string[]>("steps").ar.forEach((x, i) => {
    const en = gen<string[]>("steps").en[i];
    put(`sp${i}t`, bi(x[0], en?.[0]));
    put(`sp${i}b`, bi(x[1], en?.[1]));
  });
  if (has("faq")) gen<string[]>("faqs").ar.forEach((x, i) => {
    const en = gen<string[]>("faqs").en[i];
    put(`fq${i}q`, bi(x[0], en?.[0]));
    put(`fq${i}a`, bi(x[1], en?.[1]));
  });

  put("foot", c.foot);
  put("ann", c.ann);
  return { ...c, def: { ...c.def, copy: copy as typeof c.def.copy } };
}
