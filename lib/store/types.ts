import type { Bi } from "../u";
import type { TemplateId } from "../catalog";
export type Plan = "free" | "pro" | "biz";
export type Opt = string | Bi;
export type Product = {
  id: string; cat: number; name: Bi; price: number; old?: number; img: string; alt?: string;
  badge?: "best" | "new" | "sale"; stock?: number; desc: Bi; hidden?: boolean;
  variant?: { label: Bi; options: Opt[] }; specs?: [string, string, string][]; swatches?: string[];
  /** real database id when the template slot id differs (merchant data mapped onto a template) */ srcId?: string;
  /** a merchant product repeated only to fill another layout slot — lists and filters skip it */ dup?: boolean;
  /** the merchant's brand — the shared «all products» page filters by it */ brand?: string;
};
export type StoreDef = {
  id: TemplateId; slug: string; plan: Plan; price: number; tplName: Bi; name: Bi; cats: Bi[];
  copy: Record<string, unknown>; products: Product[]; looks?: string[]; accent?: string; whatsapp?: string;
  /** a merchant's live store (not the template demo): heroes show its own products */
  merchant?: boolean;
  /** the merchant's look on the Essential template (the "شكل المتجر" editor in AzmSmart) */
  look?: { logo: string; heroImg: string; storyImg: string; hidden: string[]; images: Record<string, string>; fonts: { display?: string; body?: string }; social: Record<string, string>; extras?: import("@/components/store/StoreExtras").StoreExtras };
  /** the merchant's own details for the store info section (template demos use lib/brands) */
  info?: { about: string; address: string; hours: string; phone: string; payMethods: string[]; payNote: string; deliveryNote: string };
  /** the merchant has an active discount code — the cart shows the code field only then */
  coupons?: boolean;
  /** homepage product sections from the merchant's dashboard */
  sections?: import("@/lib/data/unified-map").MSection[];
  /** ISO 4217 of the merchant's currency — ad-platform events */
  currencyCode?: string;
  /** the platform verified the owner's identity (KYC) */
  verified?: boolean;
  /** customer accounts (phone + code) are available — a message provider is connected */
  accounts?: boolean;
  /** wholesale: prices hidden (the server sends none) and orders are quote requests */
  wholesale?: boolean;
  /** the AI shopping assistant is on */
  storeAI?: boolean;
  /** show «Built with RVIOS» (plans without removeBadge) */
  badge?: boolean;
  /** bumps with each editor draft, so split/reveal effects remount over the new text */
  editRev?: number;
};
