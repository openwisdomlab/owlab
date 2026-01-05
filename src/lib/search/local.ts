import fs from "fs/promises";
import path from "path";
import { UnifiedSearchQuery, UnifiedSearchResponse } from "@/lib/schemas";

/**
 * Local Search Service - Dev Mode Only
 * Scans .mdx files in content directory and performs simple regex/string matching.
 */

interface LocalSearchResult {
    id: string;
    title: string;
    excerpt: string;
    url: string;
    score: number;
}

// Helper to recursively find files
async function getFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        })
    );
    return Array.prototype.concat(...files);
}

// Simple frontmatter parser
function parseFrontmatter(content: string) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { title: "Untitled", description: "" };

    const frontmatter = match[1];
    const titleMatch = frontmatter.match(/title:\s*(.*)/);
    const descMatch = frontmatter.match(/description:\s*(.*)/);

    return {
        title: titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, "") : "Untitled",
        description: descMatch ? descMatch[1].trim().replace(/^['"]|['"]$/g, "") : "",
    };
}

// Extract excerpt around match
function getExcerpt(content: string, query: string, windowSize = 100): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) return content.slice(0, windowSize) + "...";

    const start = Math.max(0, index - windowSize / 2);
    const end = Math.min(content.length, index + query.length + windowSize / 2);

    return (start > 0 ? "..." : "") + content.slice(start, end).replace(/\n/g, " ") + (end < content.length ? "..." : "");
}

export async function searchWithLocalContent(
    query: UnifiedSearchQuery
): Promise<UnifiedSearchResponse> {
    const startTime = performance.now();
    const contentDir = path.join(process.cwd(), "content");

    try {
        const allFiles = await getFiles(contentDir);
        const mdxFiles = allFiles.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
        const lcQuery = query.query.toLowerCase();

        const results: LocalSearchResult[] = [];

        for (const file of mdxFiles) {
            const rawContent = await fs.readFile(file, "utf-8");
            const { title } = parseFrontmatter(rawContent);

            // Calculate relative URL with correct locale prefix
            // e.g., /Users/user/project/content/docs/zh/foo.mdx -> /zh/docs/foo
            const relativePath = path.relative(contentDir, file);
            // relativePath: "docs/zh/knowledge-base/..." or "docs/en/knowledge-base/..."
            const pathWithoutExt = relativePath
                .replace(/\.(mdx|md)$/, "")
                .replace(/\/index$/, ""); // Remove /index for root leaves

            // Extract locale from path: docs/zh/... -> zh, docs/en/... -> en
            const pathParts = pathWithoutExt.split("/");
            // pathParts: ["docs", "zh", "knowledge-base", ...]
            const locale = pathParts[1]; // "zh" or "en"
            const remainingPath = pathParts.slice(2).join("/"); // "knowledge-base/..."

            // Build correct URL: /<locale>/docs/<path>
            const urlPath = `/${locale}/docs/${remainingPath}`;

            // Simple scoring
            let score = 0;
            if (title.toLowerCase().includes(lcQuery)) score += 10;
            if (rawContent.toLowerCase().includes(lcQuery)) score += 1;

            if (score > 0) {
                results.push({
                    id: urlPath,
                    title,
                    url: urlPath,
                    excerpt: getExcerpt(rawContent.replace(/^---\n[\s\S]*?\n---/, ""), query.query),
                    score,
                });
            }
        }

        // Sort by score
        results.sort((a, b) => b.score - a.score);
        const topResults = results.slice(0, query.limit);

        const endTime = performance.now();

        return {
            query: query.query,
            mode: "basic", // Local search simulates basic
            escalated: false,
            results: topResults,
            total: results.length,
            processingTime: endTime - startTime,
        };

    } catch (error) {
        console.error("Local search failed:", error);
        return {
            query: query.query,
            mode: "basic",
            escalated: false,
            results: [],
            total: 0,
            processingTime: performance.now() - startTime,
        };
    }
}
