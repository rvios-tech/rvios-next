import type { ComponentType } from "react";
import type { Product } from "./types";
/** What every template provides. The engine supplies cart, checkout, orders and the product page. */
export type TemplateModule = {
  Header: ComponentType; Footer: ComponentType; Home: ComponentType;
  Card: ComponentType<{ p: Product; i?: number }>;
};
