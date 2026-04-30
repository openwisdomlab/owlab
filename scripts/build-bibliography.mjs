#!/usr/bin/env node
/**
 * Aggregates every per-module refs.json into a single bibliography index
 * consumed by <Cite> / <References> at runtime.
 *
 * Sources scanned:
 *   content/docs/zh/core/0X-*\/evidence/refs.json
 *   content/docs/zh/research/0X-*\/extend/refs.json
 *   content/docs/zh/research/0X-*\/extend/research-updates*.refs.json (optional)
 *
 * Output: src/data/bibliography.generated.json
 *
 * Validation rules (build fails on violation):
 *   - All citation IDs must be unique across the entire corpus
 *   - aliases (if present) must not collide with any other id or alias
 *   - DOI, when present, must match /^10\.\d{4,9}\/\S+$/
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/docs/zh");
const OUT_FILE = path.join(ROOT, "src/data/bibliography.generated.json");

const DOI_RE = /^10\.\d{4,9}\/\S+$/;

function findRefsFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findRefsFiles(full));
    } else if (entry.isFile() && /(^|\W)refs\.json$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function deriveModuleFromPath(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, "/");
  const coreMatch = rel.match(/^core\/(\d{2})-/);
  if (coreMatch) return `M${coreMatch[1]}`;
  const researchMatch = rel.match(/^research\/(\d{2})-/);
  if (researchMatch) return `L${researchMatch[1]}`;
  return null;
}

function normalizeCitation(raw, fallbackModule) {
  const tier = raw.evidence_tier ?? raw.evidence_level;
  return {
    id: raw.id,
    aliases: raw.aliases ?? [],
    type: raw.type ?? "web",
    citation: raw.citation,
    authors: raw.authors,
    year: raw.year,
    title: raw.title,
    venue: raw.venue,
    doi: raw.doi ?? null,
    url: raw.url ?? null,
    evidence_tier: tier ?? "E0",
    evidence_level: tier ?? "E0",
    tags: raw.tags ?? [],
    key_claims: raw.key_claims ?? [],
    used_in: raw.used_in ?? [],
    retrieval_date: raw.retrieval_date ?? null,
    verified: raw.verified ?? false,
    verified_by: raw.verified_by ?? null,
    verified_date: raw.verified_date ?? null,
    notes: raw.notes ?? "",
    module: raw.module ?? fallbackModule,
  };
}

function main() {
  const files = findRefsFiles(CONTENT_DIR);
  /** @type {Record<string, any>} */
  const byId = {};
  /** @type {Record<string, string[]>} */
  const byModule = {};
  /** @type {string[]} */
  const errors = [];
  let total = 0;

  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      errors.push(`[parse] ${path.relative(ROOT, file)}: ${err.message}`);
      continue;
    }
    const fallbackModule = parsed.module ?? deriveModuleFromPath(file);
    const list = Array.isArray(parsed.references) ? parsed.references : [];

    for (const raw of list) {
      const cit = normalizeCitation(raw, fallbackModule);
      if (!cit.id) {
        errors.push(`[no-id] ${path.relative(ROOT, file)}: entry missing id`);
        continue;
      }
      if (cit.doi && !DOI_RE.test(cit.doi)) {
        errors.push(`[bad-doi] ${cit.id}: invalid DOI "${cit.doi}"`);
      }
      if (byId[cit.id]) {
        errors.push(
          `[dup-id] ${cit.id}: defined in ${byId[cit.id].__source} and ${path.relative(ROOT, file)}`,
        );
        continue;
      }
      for (const alias of cit.aliases ?? []) {
        if (byId[alias]) {
          errors.push(`[dup-alias] ${alias} (alias of ${cit.id}) collides with existing id`);
        }
      }
      cit.__source = path.relative(ROOT, file);
      byId[cit.id] = cit;
      const m = cit.module ?? "UNCLASSIFIED";
      (byModule[m] ??= []).push(cit.id);
      total++;
    }
  }

  // Strip internal __source before writing.
  for (const id of Object.keys(byId)) delete byId[id].__source;

  if (errors.length) {
    console.error(`\n[bibliography] ${errors.length} error(s):`);
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }

  const out = {
    generated_at: new Date().toISOString(),
    total,
    byId,
    byModule,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(
    `[bibliography] wrote ${path.relative(ROOT, OUT_FILE)} — ${total} citations across ${Object.keys(byModule).length} modules from ${files.length} refs.json files`,
  );
}

main();
