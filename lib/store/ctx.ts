"use client";
/* The storefront context on its own, so shared components (store logos on the platform pages)
   can read it without pulling the store engine and its data layer into every page. */
import { createContext, useContext } from "react";
import type { StoreCtxValue } from "./engine";

export const StoreCtx = createContext<StoreCtxValue | null>(null);
/** Same as useStore but returns null outside a store (for shared components). */
export const useStoreMaybe = () => useContext(StoreCtx);
