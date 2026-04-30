"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import bibliographyData from "@/data/bibliography.generated.json";
import type { BibliographyIndex, Citation } from "./types";

const bibliography = bibliographyData as unknown as BibliographyIndex;

type RegistryEntry = { id: string; index: number };

interface CitationContextValue {
  /** Returns the in-page numeric index for the given id (1-based), registering on first call. */
  register: (id: string) => RegistryEntry;
  /** All IDs registered on this page, in encounter order. */
  registered: () => RegistryEntry[];
  /** Look up a citation by id (or alias). */
  resolve: (id: string) => Citation | undefined;
  /** Filter citations by module (e.g., "M03"). */
  byModule: (module: string) => Citation[];
}

const CitationCtx = createContext<CitationContextValue | null>(null);

function buildAliasMap(): Map<string, string> {
  const m = new Map<string, string>();
  for (const [id, cit] of Object.entries(bibliography.byId ?? {})) {
    for (const a of cit.aliases ?? []) m.set(a, id);
  }
  return m;
}

const aliasMap = buildAliasMap();

export function resolveCitation(id: string): Citation | undefined {
  const direct = bibliography.byId?.[id];
  if (direct) return direct;
  const aliased = aliasMap.get(id);
  if (aliased) return bibliography.byId?.[aliased];
  return undefined;
}

export function CitationProvider({ children }: { children: ReactNode }) {
  // Refs survive across renders without triggering re-renders.
  const orderRef = useRef<RegistryEntry[]>([]);
  const indexRef = useRef<Map<string, number>>(new Map());

  const value = useMemo<CitationContextValue>(
    () => ({
      register: (id: string) => {
        const existing = indexRef.current.get(id);
        if (existing !== undefined) return { id, index: existing };
        const next = orderRef.current.length + 1;
        indexRef.current.set(id, next);
        const entry = { id, index: next };
        orderRef.current.push(entry);
        return entry;
      },
      registered: () => orderRef.current.slice(),
      resolve: resolveCitation,
      byModule: (module: string) => {
        const ids = bibliography.byModule?.[module] ?? [];
        return ids
          .map((id) => bibliography.byId?.[id])
          .filter((c): c is Citation => Boolean(c));
      },
    }),
    [],
  );

  return <CitationCtx.Provider value={value}>{children}</CitationCtx.Provider>;
}

export function useCitationContext(): CitationContextValue {
  const ctx = useContext(CitationCtx);
  if (ctx) return ctx;
  // Graceful fallback when used outside provider — citations still render
  // but without per-page numbering.
  return {
    register: (id) => ({ id, index: 0 }),
    registered: () => [],
    resolve: resolveCitation,
    byModule: (module: string) => {
      const ids = bibliography.byModule?.[module] ?? [];
      return ids
        .map((id) => bibliography.byId?.[id])
        .filter((c): c is Citation => Boolean(c));
    },
  };
}

export { bibliography };
