"use client";
import { brandBySlug, fallbackBrand, type Brand } from "@/lib/brands";
import { useStoreMaybe } from "@/lib/store/engine";

const SHAPES: Record<Brand["emblem"], (bg: string, fg: string) => React.ReactNode> = {
  circle: (bg) => <circle cx="32" cy="32" r="30" fill={bg} />,
  arch: (bg) => <path d="M6 62V30a26 26 0 0 1 52 0v32Z" fill={bg} />,
  hex: (bg) => <path d="M32 2l26 15v30L32 62 6 47V17Z" fill={bg} />,
  diamond: (bg, fg) => <><path d="M32 2l30 30-30 30L2 32Z" fill={bg} /><path d="M32 9l23 23-23 23L9 32Z" fill="none" stroke={fg} strokeOpacity=".35" /></>,
  squircle: (bg) => <rect x="2" y="2" width="60" height="60" rx="20" fill={bg} />,
  shield: (bg, fg) => <><path d="M32 2l27 9v19c0 17-12 28-27 32C17 58 5 47 5 30V11Z" fill={bg} /><path d="M32 8l21 7v15c0 13-9 22-21 26-12-4-21-13-21-26V15Z" fill="none" stroke={fg} strokeOpacity=".3" /></>,
  leaf: (bg) => <path d="M32 2C50 14 60 30 32 62 4 30 14 14 32 2Z" fill={bg} />,
  drop: (bg) => <path d="M32 2c14 18 26 30 26 40a26 26 0 0 1-52 0c0-10 12-22 26-40Z" fill={bg} />,
  seal: (bg, fg) => <><circle cx="32" cy="32" r="30" fill={bg} /><circle cx="32" cy="32" r="25" fill="none" stroke={fg} strokeOpacity=".45" strokeDasharray="2 3" /></>,
  ring: (bg, fg) => <><circle cx="32" cy="32" r="30" fill={bg} /><circle cx="32" cy="32" r="21" fill="none" stroke={fg} strokeWidth="3" /></>,
};
const FONT = { zain: "var(--f-zain)", ya: "var(--f-ya)", th: "var(--f-th)" };

const LOGO_SLUGS = new Set([
  "sanaa-garden", "bunn-haraz", "heritage-house", "tech-plus", "khatwa",
  "dar-alsakan", "dar-alshal", "fun-world", "lama-abayas", "oud-alsabaa",
  "al-yaqoot", "al-reef", "al-kalima", "doan-apiaries", "nabd-sports",
  "nada-care", "reem-sweets",
]);

export function StoreEmblem({ slug, size = 40, color }: { slug: string; size?: number; color?: string }) {
  const st = useStoreMaybe();
  const b = brandBySlug(slug) ?? (st ? fallbackBrand(slug, st.def.name.ar, st.def.accent ?? "#C1272D") : null);
  if (!b) return null;

  if (LOGO_SLUGS.has(slug)) {
    return (
      <img
        className="st-emblem st-logo-img"
        src={`/logos/${slug}.png`}
        alt={slug}
        width={size}
        height={size}
        style={{ width: Math.round(size * 1.4), height: Math.round(size * 1.4), objectFit: "contain", display: "inline-block", verticalAlign: "middle", flexShrink: 0, borderRadius: 8 }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  const bg = color ?? b.bg;
  const fs = b.font === "ya" ? (b.glyph.length > 1 ? 19 : 26) : b.glyph.length > 1 ? 24 : 34;
  return (
    <svg className="st-emblem" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      {SHAPES[b.emblem](bg, b.fg)}
      <text x="32" y={b.emblem === "arch" ? 44 : b.emblem === "drop" ? 46 : 40} textAnchor="middle" fill={b.fg} fontFamily={FONT[b.font]} fontWeight="700" fontSize={fs} style={{ direction: "ltr" }}>{b.glyph}</text>
    </svg>
  );
}

export function StoreLogo({ slug, name, sub, color, size = 40 }: { slug: string; name: string; sub?: string; color?: string; size?: number }) {
  return (
    <span className="st-logo"><StoreEmblem slug={slug} size={size} color={color} /><span className="st-word"><b>{name}</b>{sub && <small>{sub}</small>}</span></span>
  );
}

