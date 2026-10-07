/* Server-safe registry of store data (used for static params and metadata). */
import { def as noir } from "./noir/data";
import { def as maison } from "./maison/data";
import { def as volt } from "./volt/data";
import { def as sukkar } from "./sukkar/data";
import { def as bayt } from "./bayt/data";
import { def as essential } from "./essential/data";
import { CX } from "./cx";
import { extend } from "./extend";
export const DEFS = [noir, maison, volt, sukkar, bayt, essential, ...CX.map((c) => c.def)].map(extend);
export const defBySlug = (slug: string) => DEFS.find((d) => d.slug === slug);
