/**
 * Citation type definitions for the OWL bibliography system.
 *
 * Per-module bibliographies live at:
 *   content/docs/zh/core/0X-*\/evidence/refs.json
 *   content/docs/zh/research/0X-*\/extend/refs.json
 *
 * They are aggregated at build time into src/data/bibliography.generated.json
 * by scripts/build-bibliography.mjs and consumed by <Cite> / <References>.
 */

export type EvidenceTier = "E0" | "E1" | "E2" | "E3";

export type CitationType =
  | "journal"
  | "book"
  | "preprint"
  | "report"
  | "standard"
  | "web"
  | "dataset";

export interface Citation {
  /** Unique slug across the whole knowledge base. */
  id: string;
  /** Optional alternative IDs for backwards compatibility. */
  aliases?: string[];
  type: CitationType;
  /** Pre-formatted citation string (APA-ish), kept for legacy refs.json compatibility. */
  citation?: string;
  authors?: string[];
  year?: number;
  title?: string;
  venue?: string;
  doi?: string;
  url?: string;
  evidence_tier?: EvidenceTier;
  /** Legacy field kept for migration compatibility. */
  evidence_level?: EvidenceTier;
  tags?: string[];
  key_claims?: string[];
  /** Files where this reference is used, relative to content/docs/zh. */
  used_in?: string[];
  retrieval_date?: string;
  verified?: boolean;
  verified_by?: string | null;
  verified_date?: string | null;
  notes?: string;
  /** Module owner (M01-M09 or L01-L04). */
  module?: string;
}

export interface BibliographyIndex {
  generated_at: string;
  total: number;
  byId: Record<string, Citation>;
  byModule: Record<string, string[]>;
}
