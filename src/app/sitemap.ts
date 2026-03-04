import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://owlab.ai";

function getMdxPaths(dir: string, basePath: string): string[] {
  const paths: string[] = [];
  if (!fs.existsSync(dir)) return paths;

  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name.startsWith("_")) continue;
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      paths.push(...getMdxPaths(fullPath, `${basePath}/${item.name}`));
    } else if (item.name.endsWith(".mdx")) {
      const slug = item.name === "index.mdx" ? basePath : `${basePath}/${item.name.replace(".mdx", "")}`;
      paths.push(slug);
    }
  }
  return paths;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["zh", "en"];
  const staticPages = ["", "/docs", "/lab", "/explore", "/journey", "/dashboard"];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Documentation pages (Chinese only for now)
  const docsDir = path.join(process.cwd(), "content", "docs", "zh");
  const docPaths = getMdxPaths(docsDir, "");

  for (const docPath of docPaths) {
    entries.push({
      url: `${siteUrl}/zh/docs${docPath}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
