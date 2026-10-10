"use client";
import { useSyncExternalStore } from "react";
import { DEFAULT_REGION, isRegion, type Region } from "@/lib/contact";

const read = (): Region => { const r = document.documentElement.dataset.region; return isRegion(r) ? r : DEFAULT_REGION; };

/** The visitor's region where two copies can't be rendered (an attribute like a placeholder). The server renders the default; the real one is read from <html> after hydration. */
export function useRegion(): Region {
  return useSyncExternalStore(() => () => {}, read, () => DEFAULT_REGION);
}
