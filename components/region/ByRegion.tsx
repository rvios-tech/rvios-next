import type { ReactNode } from "react";
import { CONTACTS, REGIONS, type Region, type RegionContact } from "@/lib/contact";

/** Renders the block for every region; CSS shows the visitor's copy only (see lib/contact.ts). No hooks — one HTML for every visitor. */
export function ByRegion({ children }: { children: (c: RegionContact, region: Region) => ReactNode }) {
  return <>{REGIONS.map((r) => <span key={r} data-only={r}>{children(CONTACTS[r], r)}</span>)}</>;
}
