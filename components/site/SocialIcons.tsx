/** Social network icons (store info, platform contact links). */
const P = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <svg {...P}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>,
  tiktok: <svg {...P}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.5 3 2.5 4.5 5 4.8" /></svg>,
  facebook: <svg {...P}><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V21M6 11h8" /></svg>,
  snapchat: <svg {...P}><path d="M12 3c3 0 5 2.2 5 5.2v2.3l2 .8-1.6 1.4c.5 1.6 1.8 2.6 3.1 3-1.4 1-3 .9-3.6 1.7-.5.8-.6 1.6-1.6 1.6-1 0-1.8-.8-3.3-.8s-2.3.8-3.3.8-1.1-.8-1.6-1.6c-.6-.8-2.2-.7-3.6-1.7 1.3-.4 2.6-1.4 3.1-3L4 11.3l2-.8V8.2C6 5.2 9 3 12 3Z" /></svg>,
  x: <svg {...P}><path d="M4 4l16 16M20 4 4 20" /></svg>,
  whatsapp: <svg {...P}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /><path d="M9 9.5c.3 2 2 3.8 4 4.3l1.2-1.2 1.8.8" /></svg>,
};
