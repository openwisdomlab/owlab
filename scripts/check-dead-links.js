#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function checkMetaJson(dir) {
  const metaPath = path.join(dir, 'meta.json');
  if (!fs.existsSync(metaPath)) return;

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const pages = meta.pages || [];
  const files = fs.readdirSync(dir);

  for (const page of pages) {
    if (page === '---' || page === '...') continue;
    const exists = files.some(f => f === page + '.mdx' || f === page);
    if (!exists) {
      console.log('MISSING:', path.join(dir, page + '.mdx'));
    }
  }
}

function walkDirs(base) {
  if (!fs.existsSync(base)) return;
  const items = fs.readdirSync(base, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      const full = path.join(base, item.name);
      checkMetaJson(full);
      walkDirs(full);
    }
  }
}

// Also check for directories with MDX files but no meta.json
function checkOrphans(base) {
  if (!fs.existsSync(base)) return;
  const items = fs.readdirSync(base, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      const full = path.join(base, item.name);
      const hasMetaJson = fs.existsSync(path.join(full, 'meta.json'));
      const hasMdx = fs.readdirSync(full).some(f => f.endsWith('.mdx'));
      if (hasMdx && !hasMetaJson) {
        console.log('NO_META:', full);
      }
      checkOrphans(full);
    }
  }
}

walkDirs('content/docs/zh');
checkOrphans('content/docs/zh');
