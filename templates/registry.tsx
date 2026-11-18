"use client";
/* Client registry: template id → its components. */
import type { TemplateModule } from "@/lib/store/module";
import * as noir from "./noir";
import * as maison from "./maison";
import * as volt from "./volt";
import * as sukkar from "./sukkar";
import * as bayt from "./bayt";
import * as essential from "./essential";
import * as rvios from "./rvios";
import { makeTemplate } from "./cx/composer";
import { CX } from "./cx";
export const MODULES: Record<string, TemplateModule> = {
  rvios, noir, maison, volt, sukkar, bayt, essential,
  ...Object.fromEntries(CX.map((c) => [c.def.id, makeTemplate(c)])),
};
