"use client";

import { useCitationContext } from "./CitationContext";
import type { Citation } from "./types";

interface CiteProps {
  /** Single citation id (slug). Use either `id` or `ids`. */
  id?: string;
  /** Comma-separated list of citation ids for grouped cites e.g. "a,b,c". */
  ids?: string;
  /** Optional inline label override (rare; defaults to numeric superscript). */
  children?: React.ReactNode;
}

const tierColor: Record<string, string> = {
  E3: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  E2: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  E1: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  E0: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
};

function summary(c: Citation): string {
  if (c.citation) return c.citation;
  const parts: string[] = [];
  if (c.authors?.length) parts.push(c.authors.join(", "));
  if (c.year) parts.push(`(${c.year})`);
  if (c.title) parts.push(c.title);
  if (c.venue) parts.push(c.venue);
  return parts.join(". ");
}

export function Cite({ id, ids, children }: CiteProps) {
  const ctx = useCitationContext();
  const list = (ids ? ids.split(",") : id ? [id] : [])
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length === 0) return null;

  return (
    <sup className="cite-group inline-flex gap-0.5 text-[0.7em] leading-none">
      {list.map((cid, i) => {
        const cit = ctx.resolve(cid);
        if (!cit) {
          return (
            <span
              key={cid}
              title={`未解析的引用: ${cid}`}
              className="text-red-400 underline decoration-dotted"
            >
              [?{cid}]
            </span>
          );
        }
        const { index } = ctx.register(cit.id);
        const tier = cit.evidence_tier ?? cit.evidence_level ?? "E0";
        const tooltip = `${summary(cit)}${cit.doi ? ` — DOI: ${cit.doi}` : ""}${
          cit.url && !cit.doi ? ` — ${cit.url}` : ""
        } [${tier}]`;
        return (
          <a
            key={cid}
            href={`#cite-${cit.id}`}
            title={tooltip}
            data-cite-id={cit.id}
            data-cite-tier={tier}
            className={`inline-block rounded border px-1 no-underline hover:opacity-80 ${
              tierColor[tier] ?? tierColor.E0
            }`}
          >
            {children ?? (index > 0 ? index : cit.id)}
            {i < list.length - 1 && ","}
          </a>
        );
      })}
    </sup>
  );
}
