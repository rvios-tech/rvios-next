"use client";
import { useCallback, useEffect, useState } from "react";
import { demoRepo } from "./demo";
import { supabaseRepo } from "./supabase";
import { unifiedRepo } from "./unified";
import type { Repo } from "./types";

/** The unified backend (AzmSmart) when configured, then Supabase, otherwise the self-contained demo. */
export const repo: Repo = process.env.NEXT_PUBLIC_UNIFIED_API_URL
  ? unifiedRepo
  : process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? supabaseRepo : demoRepo;

/** Load data from the repo and reload whenever it changes. */
export function useRepo<T>(load: (r: Repo) => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => load(repo).then((d) => { setData(d); setLoaded(true); }).catch((e: Error) => { setError(e.message); setLoaded(true); }), deps);
  useEffect(() => { run(); return repo.subscribe(run); }, [run]);
  return { data, error, loaded, reload: run };
}
export * from "./types";
