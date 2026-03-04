#!/usr/bin/env node
/**
 * Fix bare code blocks in MDX files.
 * Replaces ``` (without language specifier) with ```text
 * to prevent Turbopack from evaluating content as JavaScript.
 *
 * Usage: node scripts/fix-bare-codeblocks.js [path]
 */

const fs = require('fs');
const path = require('path');

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

function fixFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  let inCodeBlock = false;
  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        // Opening code fence
        inCodeBlock = true;
        if (trimmed === '```') {
          // Bare opening — add 'text' specifier, preserve leading whitespace
          const leadingWhitespace = lines[i].match(/^(\s*)/)[1];
          lines[i] = leadingWhitespace + '```text';
          fixCount++;
        }
      } else {
        // Closing code fence
        inCodeBlock = false;
      }
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(filepath, lines.join('\n'), 'utf-8');
  }
  return fixCount;
}

function main() {
  const targetPath = process.argv[2] || path.join(process.cwd(), 'content', 'docs');
  console.log(`Scanning: ${targetPath}\n`);

  const files = findMdxFiles(targetPath);
  let totalFixes = 0;
  let filesFixed = 0;

  for (const file of files) {
    const fixes = fixFile(file);
    if (fixes > 0) {
      const rel = path.relative(process.cwd(), file);
      console.log(`  Fixed ${fixes} bare code block(s) in ${rel}`);
      totalFixes += fixes;
      filesFixed++;
    }
  }

  console.log(`\nDone: ${totalFixes} code blocks fixed across ${filesFixed} files.`);
}

main();
