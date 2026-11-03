/**
 * Social accounts a store shows. The merchant types a handle or pastes a link; both open the right page.
 * Order is the display order; colours are each network's own.
 */
export const NETWORKS = [
  { key: "instagram", label: "Instagram", color: "#E1306C", url: (h: string) => `https://instagram.com/${h}` },
  { key: "tiktok", label: "TikTok", color: "#111111", url: (h: string) => `https://tiktok.com/@${h}` },
  { key: "snapchat", label: "Snapchat", color: "#E7C200", url: (h: string) => `https://snapchat.com/add/${h}` },
  { key: "x", label: "X", color: "#111111", url: (h: string) => `https://x.com/${h}` },
  { key: "facebook", label: "Facebook", color: "#1877F2", url: (h: string) => `https://facebook.com/${h}` },
  { key: "youtube", label: "YouTube", color: "#FF0000", url: (h: string) => `https://youtube.com/@${h}` },
  { key: "telegram", label: "Telegram", color: "#229ED9", url: (h: string) => `https://t.me/${h}` },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", url: (h: string) => `https://wa.me/${h.replace(/\D/g, "")}` },
] as const;

export type SocialKey = (typeof NETWORKS)[number]["key"];
export type Placement = "info" | "footer" | "both";

export const socialHref = (key: string, value: string) => {
  if (/^https?:\/\//.test(value)) return value;
  return NETWORKS.find((n) => n.key === key)?.url(value.replace(/^@/, "")) ?? "#";
};

/** What a link shows next to the icon: the handle, or the link's last part */
export const socialHandle = (value: string) => {
  if (!/^https?:\/\//.test(value)) return `@${value.replace(/^@/, "")}`;
  const last = value.replace(/\/+$/, "").split("/").pop() ?? "";
  return last ? (last.startsWith("@") ? last : `@${last}`) : value;
};
