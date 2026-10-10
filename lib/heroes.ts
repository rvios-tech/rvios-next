import { HEROES } from "./local-images";
import type { StoreDef } from "./store/types";

/** Hero cutouts from template-images/<template>/hero*.png — demo stores only. */
export const heroesOf = (def: StoreDef): string[] => (def.merchant ? [] : HEROES[def.id] ?? []);
