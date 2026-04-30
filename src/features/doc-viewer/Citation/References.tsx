"use client";

import { useCitationContext } from "./CitationContext";
import type { Citation } from "./types";

interface ReferencesProps {
  /**
   * - "page" (default): only cites that <Cite> registered on this page.
   * - "module": all citations belonging to a module (pass via `module` prop).
   */
  scope?: "page" | "module";
  module?: string;
  title?: string;
}

function formatCitation(c: Citation): string {
  if (c.citation) return c.citation;
  const parts: string[] = [];
  if (c.authors?.length) parts.push(c.authors.join(", "));
  if (c.year) parts.push(`(${c.year}).`);
  if (c.title) parts.push(c.title + ".");
  if (c.venue) parts.push(c.venue + ".");
  return parts.join(" ");
}

const tierBadge: Record<string, string> = {
  E3: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  E2: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  E1: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  E0: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
};

export function References({
  scope = "page",
  module,
  title = "参考文献",
}: ReferencesProps) {
  const ctx = useCitationContext();

  let entries: Array<{ index: number; cit: Citation }>;
  if (scope === "module" && module) {
    entries = ctx.byModule(module).map((cit, i) => ({ index: i + 1, cit }));
  } else {
    entries = ctx
      .registered()
      .map((entry) => ({
        index: entry.index,
        cit: ctx.resolve(entry.id),
      }))
      .filter((e): e is { index: number; cit: Citation } => Boolean(e.cit));
  }

  if (entries.length === 0) {
    return (
      <section className="my-8 rounded border border-dashed border-zinc-700 p-4 text-sm text-zinc-500">
        <p>本页暂无引用。在 MDX 中使用 <code>&lt;Cite id="..." /&gt;</code> 后会自动出现在此处。</p>
      </section>
    );
  }

  return (
    <section className="my-10 border-t border-zinc-800 pt-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <ol className="space-y-3 text-sm">
        {entries.map(({ index, cit }) => {
          const tier = cit.evidence_tier ?? cit.evidence_level ?? "E0";
          const linkUrl = cit.doi ? `https://doi.org/${cit.doi}` : cit.url;
          return (
            <li
              key={cit.id}
              id={`cite-${cit.id}`}
              className="flex gap-3 scroll-mt-24"
            >
              <span className="min-w-[2ch] text-right tabular-nums text-zinc-500">
                {index}.
              </span>
              <div className="flex-1">
                <span>{formatCitation(cit)}</span>{" "}
                <span
                  className={`ml-1 inline-block rounded border px-1.5 py-0 align-middle text-[0.7em] ${
                    tierBadge[tier] ?? tierBadge.E0
                  }`}
                  title={`证据等级 ${tier}`}
                >
                  {tier}
                </span>
                {linkUrl && (
                  <>
                    {" "}
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {cit.doi ? `DOI:${cit.doi}` : "链接"}
                    </a>
                  </>
                )}
                {cit.retrieval_date && (
                  <span className="ml-1 text-xs text-zinc-500">
                    （检索 {cit.retrieval_date}）
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
