import * as React from "react";

/**
 * Markdown مختصر لردود المساعد — عناصر React فقط بلا HTML: الرد من نموذج لغوي، فلا وسم ولا
 * رابط `javascript:` يصل إلى الصفحة. عناوين، فقرات، قوائم، عريض ومائل، شيفرة، وروابط http(s).
 */
const SAFE = /^(https?:\/\/|\/)/i;

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(`[^`\n]+`)|(\[[^\]\n]+\]\(((?:https?:\/\/|\/)[^)\s]+)\))|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1]) out.push(<code key={k}>{m[1].slice(1, -1)}</code>);
    else if (m[2]) {
      const label = m[2].slice(1, m[2].indexOf("]("));
      const href = m[3];
      out.push(SAFE.test(href) ? <a key={k} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">{label}</a> : label);
    } else if (m[4]) out.push(<strong key={k}>{m[4].slice(2, -2)}</strong>);
    else if (m[5]) out.push(<em key={k}>{m[5].slice(1, -1)}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const LIST = /^\s*([-*•]|\d+[.)])\s+(.*)$/;

export function Md({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let b = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const k = `b${b++}`;
    const h = /^#{1,4}\s+(.*)$/.exec(line);
    if (h) { out.push(<p key={k} className="rvai-h" dir="auto">{inline(h[1], k)}</p>); i++; continue; }
    if (LIST.test(line)) {
      const ordered = /\d/.test(LIST.exec(line)![1]);
      const items: string[] = [];
      while (i < lines.length && LIST.test(lines[i])) items.push(LIST.exec(lines[i++])![2]);
      const Tag = ordered ? "ol" : "ul";
      out.push(<Tag key={k} dir="auto">{items.map((t, j) => <li key={j}>{inline(t, `${k}-${j}`)}</li>)}</Tag>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !LIST.test(lines[i]) && !/^#{1,4}\s/.test(lines[i])) para.push(lines[i++].replace(/^>\s?/, ""));
    out.push(<p key={k} dir="auto">{para.flatMap((l, j) => (j ? [<br key={`${k}br${j}`} />, ...inline(l, `${k}-${j}`)] : inline(l, `${k}-${j}`)))}</p>);
  }
  return <div className="rvai-md">{out}</div>;
}
