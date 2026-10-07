import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconCart = (p: P) => (<svg {...base} {...p}><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" /><circle cx="10" cy="20.5" r="1.2" /><circle cx="17" cy="20.5" r="1.2" /></svg>);
export const IconBag = (p: P) => (<svg {...base} {...p}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>);
export const IconSearch = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const IconX = (p: P) => (<svg {...base} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>);
export const IconHeart = (p: P) => (<svg {...base} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>);
export const IconArrow = (p: P) => (<svg {...base} className="ar" {...p}><path d="M19 12H5m6-6-6 6 6 6" /></svg>);
export const IconPlus = (p: P) => (<svg {...base} strokeWidth={1.8} {...p}><path d="M12 5v14M5 12h14" /></svg>);
export const IconChat = (p: P) => (<svg {...base} {...p}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /></svg>);
export const IconCheck = (p: P) => (<svg {...base} strokeWidth={2} {...p}><path d="m5 12 4.5 4.5L19 7" /></svg>);
export const IconSun = (p: P) => (<svg {...base} className="sun" {...p}><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
export const IconMoon = (p: P) => (<svg {...base} className="moon" {...p}><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" /></svg>);
export const IconGoogle = () => (<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" /></svg>);
