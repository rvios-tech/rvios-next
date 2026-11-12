/**
 * نصوص القوائم في القوالب (المزايا، الشريط المتحرك، الضمانات، الأرقام، الغرف…) قابلة للتعديل
 * عنصرًا عنصرًا من «شكل المتجر».
 *
 * المحرر يعرف النصوص المفردة وحدها؛ فكل قائمة نصوص تُعرض له مسطّحة بمفتاح لكل عنصر:
 * `<key>_<i>` لعنصر نصّي، و`<key>_<i>_<j>` لخانة في عنصر مركّب ([عنوان، وصف]). وما يكتبه التاجر
 * بهذه المفاتيح يُطبَّق على القائمة نفسها عند الدمج (merge.ts) — في الحفظ والمعاينة سواء.
 * الرموز والأيقونات (◆ ✦ 🐝) لا تُعرض للتعديل: لا حروف فيها ولا أرقام.
 */
type BiArr = { ar: unknown[]; en?: unknown[] };

const texty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0 && /[\p{L}\p{N}]/u.test(s);
const listOf = (v: unknown): unknown[] | null =>
  Array.isArray(v) ? v : v && typeof v === "object" && Array.isArray((v as BiArr).ar) ? (v as BiArr).ar : null;

export function listEntries(copy: Record<string, unknown>): { key: string; text: string }[] {
  const out: { key: string; text: string }[] = [];
  for (const [k, v] of Object.entries(copy)) {
    const ar = listOf(v);
    if (!ar) continue;
    ar.forEach((item, i) => {
      if (texty(item)) out.push({ key: `${k}_${i}`, text: item });
      else if (Array.isArray(item)) item.forEach((x, j) => texty(x) && out.push({ key: `${k}_${i}_${j}`, text: x }));
    });
  }
  return out;
}

export function applyListOverrides<T extends Record<string, unknown>>(copy: T, over: Record<string, string> | undefined): T {
  if (!over) return copy;
  const keys = Object.keys(over);
  if (!keys.length) return copy;
  const res: Record<string, unknown> = { ...copy };
  for (const [k, v] of Object.entries(copy)) {
    if (!listOf(v) || !keys.some((o) => o.startsWith(`${k}_`))) continue;
    const patch = (arr: unknown[]) =>
      arr.map((item, i) =>
        typeof item === "string" ? over[`${k}_${i}`] ?? item : Array.isArray(item) ? item.map((x, j) => (typeof x === "string" ? over[`${k}_${i}_${j}`] ?? x : x)) : item,
      );
    res[k] = Array.isArray(v) ? patch(v) : { ...(v as BiArr), ar: patch((v as BiArr).ar), en: patch((v as BiArr).en ?? (v as BiArr).ar) };
  }
  return res as T;
}
