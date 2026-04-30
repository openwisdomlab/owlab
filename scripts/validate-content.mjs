
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

let errors = 0;
let checkedFiles = 0;
let mdxSyntaxErrors = 0;
let citationErrors = 0;

/**
 * Build the set of valid citation IDs by scanning every refs.json under
 * content/docs. IDs and aliases both count as resolvable.
 */
function loadCitationIds() {
    const ids = new Set();
    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.isFile() && /(^|\W)refs\.json$/.test(entry.name)) {
                try {
                    const parsed = JSON.parse(fs.readFileSync(full, 'utf-8'));
                    for (const ref of parsed.references ?? []) {
                        if (ref.id) ids.add(ref.id);
                        for (const a of ref.aliases ?? []) ids.add(a);
                    }
                } catch {
                    /* ignore — build-bibliography.mjs reports parse errors */
                }
            }
        }
    }
    walk(CONTENT_DIR);
    return ids;
}

const VALID_CITE_IDS = loadCitationIds();
const DOI_RE = /^10\.\d{4,9}\/\S+$/;

/**
 * Scan MDX content for <Cite id="..."/> and <Cite ids="a,b"/> usage.
 * Fail when a referenced id does not exist in any refs.json.
 */
function checkCitations(content, filePath) {
    const rel = path.relative(ROOT_DIR, filePath);
    const singleRe = /<Cite\s+[^>]*\bid=["']([^"']+)["']/g;
    const multiRe = /<Cite\s+[^>]*\bids=["']([^"']+)["']/g;

    let m;
    while ((m = singleRe.exec(content)) !== null) {
        const id = m[1].trim();
        if (!VALID_CITE_IDS.has(id)) {
            console.error(`[CITATION ERROR] ${rel}: unresolved <Cite id="${id}" />`);
            citationErrors++;
        }
    }
    while ((m = multiRe.exec(content)) !== null) {
        const ids = m[1].split(',').map((s) => s.trim()).filter(Boolean);
        for (const id of ids) {
            if (!VALID_CITE_IDS.has(id)) {
                console.error(`[CITATION ERROR] ${rel}: unresolved <Cite ids="...,${id},..." />`);
                citationErrors++;
            }
        }
    }
}

/**
 * Check for MDX syntax issues that would cause build errors.
 * Specifically: unescaped `<` followed by numbers, which MDX interprets as JSX.
 *
 * Valid patterns (already escaped): \<50, \<100
 * Invalid patterns: <50, <100 (not preceded by \)
 */
function checkMdxSyntax(content, filePath) {
    const lines = content.split('\n');
    const issues = [];

    lines.forEach((line, index) => {
        // Skip lines inside code blocks (``` or `inline`)
        // Simple heuristic: skip if line starts with ```
        if (line.trim().startsWith('```')) return;

        // Find `<` followed by a digit that is NOT preceded by `\`
        // Pattern: (?<!\\)< followed by \d
        // Use a different approach since JS doesn't support lookbehind in all versions
        const matches = [];
        const regex = /<(\d)/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
            const pos = match.index;
            // Check if preceded by backslash
            if (pos === 0 || line[pos - 1] !== '\\') {
                matches.push({
                    lineNum: index + 1,
                    column: pos + 1,
                    char: match[1],
                    context: line.substring(Math.max(0, pos - 10), Math.min(line.length, pos + 15))
                });
            }
        }

        issues.push(...matches);
    });

    if (issues.length > 0) {
        const relPath = path.relative(ROOT_DIR, filePath);
        issues.forEach(issue => {
            console.error(`[MDX ERROR] ${relPath}:${issue.lineNum}:${issue.column}: Unescaped '<' before number '${issue.char}'. Use '\\<' instead. Context: "...${issue.context}..."`);
            mdxSyntaxErrors++;
        });
    }
}

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath, callback);
        } else {
            callback(filePath);
        }
    });
}

function checkLink(url, sourceFile) {
    // Ignore external links
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
        return;
    }

    // Ignore anchors
    if (url.startsWith('#')) return;

    let targetPath = '';

    // Absolute paths (from root)
    if (url.startsWith('/')) {
        if (url.startsWith('/docs')) {
            // Map /docs/foo to content/docs/foo...
            // But multi-language? /en/docs/foo -> content/docs/en/foo
            // Or just /docs/foo (no locale). content/docs/zh/foo
            // The content structure is content/docs/[lang]/... or data?
            // Let's assume standard Fumadocs structure: content/docs/index.mdx

            // Heuristic: Check existence in public first (assets)
            const publicPath = path.join(PUBLIC_DIR, url);
            if (fs.existsSync(publicPath)) return;

            // Check content? Mapping URL to file system is complex with Next.js dynamic routes.
            // For now, let's just warn if it looks suspicious, or skip validation of route URLs 
            // and validte only asset URLs.

            // Let's strict check assets (images)
            if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
                if (!fs.existsSync(publicPath)) {
                    console.error(`[ERROR] Broken Asset Link in ${path.relative(ROOT_DIR, sourceFile)}: ${url}`);
                    errors++;
                }
            }
            return;
        }
        // Check public assets
        const publicPath = path.join(PUBLIC_DIR, url);
        if (fs.existsSync(publicPath)) return;

        // If it's a page link (e.g. /dashboard), we assume it exists for now unless we Map routes.
        return;
    }

    // Relative paths
    if (!url.startsWith('/')) {
        // Resolve relative to sourceFile
        const dir = path.dirname(sourceFile);
        // Remove anchor
        const urlClean = url.split('#')[0];
        if (!urlClean) return; // just anchor

        const absolutePath = path.resolve(dir, urlClean);

        // Check if file exists
        if (fs.existsSync(absolutePath)) return;

        // Maybe it links to a directory (index.mdx)?
        if (fs.existsSync(absolutePath + '/index.mdx')) return;
        if (fs.existsSync(absolutePath + '.mdx')) return;
        if (fs.existsSync(absolutePath + '.md')) return;
        if (fs.existsSync(absolutePath + '.tsx')) return; // unlikely

        console.error(`[ERROR] Broken Relative Link in ${path.relative(ROOT_DIR, sourceFile)}: ${url}`);
        errors++;
    }
}

console.log('Starting Content Validation...');

if (fs.existsSync(CONTENT_DIR)) {
    walkDir(CONTENT_DIR, (filePath) => {
        if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
            checkedFiles++;
            const content = fs.readFileSync(filePath, 'utf-8');

            // Check for MDX syntax issues (unescaped < before numbers)
            if (filePath.endsWith('.mdx')) {
                checkMdxSyntax(content, filePath);
                checkCitations(content, filePath);
            }

            // Match [text](url)
            const linkRegex = /\[.*?\]\((.*?)\)/g;
            let match;
            while ((match = linkRegex.exec(content)) !== null) {
                checkLink(match[1], filePath);
            }

            // Match markdown images: ![][url] - handled by above regex (captured group 1 is url)
            // Match HTML img tags? <img src="...">
            const imgRegex = /<img[^>]+src=["'](.*?)["']/g;
            while ((match = imgRegex.exec(content)) !== null) {
                checkLink(match[1], filePath);
            }
        }
    });
} else {
    console.warn('No content directory found.');
}

console.log(`Validation Complete. Checked ${checkedFiles} files. Loaded ${VALID_CITE_IDS.size} citation ids.`);

const totalErrors = errors + mdxSyntaxErrors + citationErrors;

if (totalErrors > 0) {
    if (errors > 0) {
        console.error(`Found ${errors} link errors.`);
    }
    if (mdxSyntaxErrors > 0) {
        console.error(`Found ${mdxSyntaxErrors} MDX syntax errors.`);
        console.error(`\nTo fix MDX syntax errors: Replace '<' with '\\<' before numbers (e.g., '<50' → '\\<50')`);
    }
    if (citationErrors > 0) {
        console.error(`Found ${citationErrors} unresolved <Cite> references.`);
        console.error(`\nTo fix: ensure each <Cite id="..."/> id matches an entry in any content/docs/zh/**\/refs.json.`);
    }
    process.exit(1);
} else {
    console.log('All content valid! ✨');
    process.exit(0);
}
