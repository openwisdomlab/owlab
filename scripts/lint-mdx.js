#!/usr/bin/env node
/**
 * MDX Lint Script
 *
 * Detects potential issues in MDX files that could cause Turbopack build errors:
 * 1. Code blocks without language specifiers containing JS-like patterns
 * 2. Patterns like (r=+0.72) that could be interpreted as JavaScript
 * 3. JSX string attributes containing un-escaped inner double quotes
 *    (e.g. <Tag prop="...含 "内嵌" 引号..." />), which cause Turbopack to
 *    terminate the attribute early and choke on the next character.
 *
 * Usage: node scripts/lint-mdx.js [path]
 *
 * Examples:
 *   node scripts/lint-mdx.js                           # Scan all content/docs
 *   node scripts/lint-mdx.js content/docs/zh/research  # Scan specific directory
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Patterns that could trigger Turbopack JS evaluation errors
const PROBLEMATIC_PATTERNS = [
  {
    regex: /\([a-zA-Z]=[\+\-]?[0-9]/,
    description: 'Assignment in parentheses (e.g., "(r=+0.72)")',
    suggestion: 'Use text format: "r = 0.72" or escape the pattern',
  },
  {
    regex: /\{[^}]*=[^}]*\}/,
    description: 'Curly braces with assignment (could be interpreted as JSX)',
    suggestion: 'Use text language specifier or avoid curly braces in diagrams',
  },
];

function findMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Detect a JSX attribute line whose value contains an un-escaped inner double
// quote. The Turbopack MDX parser terminates the attribute at the first inner
// `"`, then chokes on whatever follows.
//
// Pattern flagged: a line that *starts* (after leading whitespace) with
// `<TagName ` or `attrName="`, where the *first* attribute on the line has the
// shape  attr="...PRE..."INNER..."POST..." — i.e. 3+ ASCII double quotes after
// the `=`.
//
// To avoid false positives on lines like `<Cite id="A" /> ... <Cite id="B" />`
// (legitimate, multiple separate attributes), we only flag lines where the
// first `"` after a `=` is *not* immediately followed by the matching closing
// `"` before whitespace / `/>` / another `\w+=`.
function findUnclosedJsxAttribute(line) {
  // Trim leading whitespace; only inspect lines that look like JSX attributes.
  const m = line.match(/^\s*(\w+)="([^]*)$/);
  if (!m) return null;

  const attrName = m[1];
  const rest = m[2];

  // Walk through `rest`. The attribute should close at the first un-escaped `"`.
  // After that closer, the remainder of the line must be empty / start a new
  // JSX-shaped token (whitespace, `/>`, `>`, `\w+=`). If instead we see
  // additional non-whitespace characters before another `"`, it's a buggy line.
  const closeIdx = rest.indexOf('"');
  if (closeIdx === -1) return null;
  const after = rest.slice(closeIdx + 1).trim();
  // Empty / closing tag / next attribute → fine.
  if (after === '' || /^[/>]/.test(after) || /^\w+\s*=/.test(after)) return null;
  // Another `"` later on the line → likely an inner quote that closed early.
  if (after.includes('"')) {
    return { attrName, snippet: line.trim().slice(0, 100) };
  }
  return null;
}

function lintMdxFile(filepath) {
  const issues = [];
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');

  let inCodeBlock = false;
  let codeBlockStart = 0;
  let hasLangSpec = false;
  let blockContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for buggy JSX attribute lines (only outside code blocks).
    if (!inCodeBlock) {
      const bad = findUnclosedJsxAttribute(line);
      if (bad) {
        issues.push({
          file: filepath,
          line: i + 1,
          type: 'jsx_unclosed_attribute',
          pattern: `JSX attribute "${bad.attrName}" appears to contain an un-escaped inner double quote`,
          suggestion: 'Replace inner ASCII " with CJK quotes 「」 or with &quot;',
          preview: bad.snippet,
        });
      }
    }

    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockStart = i + 1; // 1-indexed
        // Check for language specifier
        hasLangSpec = trimmed.length > 3 && trimmed.slice(3).trim() !== '';
        blockContent = [];

        // Flag any bare opening code fence (no language specifier)
        if (!hasLangSpec) {
          issues.push({
            file: filepath,
            line: codeBlockStart,
            type: 'bare_code_block',
            pattern: 'Code block without language specifier',
            suggestion: 'Add a language specifier (e.g., ```text, ```bash, ```typescript)',
            preview: '',
          });
        }
      } else {
        // End of code block
        if (!hasLangSpec) {
          const fullContent = blockContent.join('\n');

          // Additionally check for JS-like patterns that are especially dangerous
          for (const pattern of PROBLEMATIC_PATTERNS) {
            if (pattern.regex.test(fullContent)) {
              issues.push({
                file: filepath,
                line: codeBlockStart,
                type: 'js_pattern_in_bare_block',
                pattern: pattern.description,
                suggestion: pattern.suggestion,
                preview: fullContent.slice(0, 100).replace(/\n/g, ' '),
              });
            }
          }
        }
        inCodeBlock = false;
        hasLangSpec = false;
        blockContent = [];
      }
    } else if (inCodeBlock) {
      blockContent.push(line);
    }
  }

  return issues;
}

function main() {
  const targetPath = process.argv[2] || path.join(process.cwd(), 'content', 'docs');

  console.log(`${colors.blue}🔍 Scanning MDX files for potential Turbopack issues...${colors.reset}\n`);
  console.log(`   Target: ${targetPath}\n`);

  if (!fs.existsSync(targetPath)) {
    console.error(`${colors.red}Error: Path does not exist: ${targetPath}${colors.reset}`);
    process.exit(1);
  }

  const files = findMdxFiles(targetPath);
  console.log(`   Found ${files.length} MDX files\n`);

  const allIssues = [];

  for (const file of files) {
    const issues = lintMdxFile(file);
    allIssues.push(...issues);
  }

  if (allIssues.length > 0) {
    console.log(`${colors.red}⚠️  Found ${allIssues.length} potential issue(s):${colors.reset}\n`);

    for (const issue of allIssues) {
      console.log(`${colors.yellow}File: ${issue.file}:${issue.line}${colors.reset}`);
      console.log(`  Type: ${issue.type}`);
      console.log(`  Pattern: ${issue.pattern}`);
      console.log(`  Suggestion: ${issue.suggestion}`);
      console.log(`  Preview: ${issue.preview.slice(0, 60)}...`);
      console.log();
    }

    console.log(`${colors.red}Please fix the above issues before building.${colors.reset}`);
    console.log(`\nTip: Add a language specifier to code blocks (e.g., \`\`\`text)`);
    console.log(`     or restructure content to avoid patterns that look like JS expressions.`);

    process.exit(1);
  } else {
    console.log(`${colors.green}✅ No issues found. All MDX files are safe for Turbopack.${colors.reset}`);
    process.exit(0);
  }
}

main();
