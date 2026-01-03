
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

console.log(`Validation Complete. Checked ${checkedFiles} files.`);

if (errors > 0) {
    console.error(`Found ${errors} errors.`);
    process.exit(1);
} else {
    console.log('All links valid! ✨');
    process.exit(0);
}
