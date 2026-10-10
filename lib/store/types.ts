import type { Bi } from "../u";
import type { TemplateId } from "../catalog";
export type Plan = "free" | "pro" | "biz";
export type Opt = string | Bi;
export type Product = {
  id: string; cat: number; name: Bi; price: number; old?: number; img: string; alt?: string;
  badge?: "best" | "new" | "sale"; stock?: number; desc: Bi; hidden?: boolean;
  variant?: { label: Bi; options: Opt[] }; specs?: [string, string, string][]; swatches?: string[];
  /** real database id when the template slot id differs (merchant data mapped onto a template) */ srcId?: string;
};
export type StoreDef = {
  id: TemplateId; slug: string; plan: Plan; price: number; tplName: Bi; name: Bi; cats: Bi[];
  copy: Record<string, unknown>; products: Product[]; looks?: string[]; accent?: string; whatsapp?: string;
  /** a merchant's live store (not the template demo): heroes show its own products */
  merchant?: boolean;
};
