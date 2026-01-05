import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

// Supported locales for URL stripping
const SUPPORTED_LOCALES = ["en", "zh"];

// Create loader without i18n since our content structure has locale folders (zh/, en/)
// The locale is handled by prepending it to the slug path
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

// Helper to get page with locale-prefixed slug
export function getLocalePage(slug: string[] | undefined, locale: string) {
  // Prepend locale to slug since content is at content/docs/{locale}/...
  const localizedSlug = slug ? [locale, ...slug] : [locale];
  return source.getPage(localizedSlug);
}

// Helper to transform URL to proper format for next-intl
// Strips the locale from the content path and adds locale prefix for routing
// e.g., "/docs/zh/living-modules" -> "/{locale}/docs/research"
// e.g., "zh/living-modules" -> "/{locale}/docs/research"
function transformUrlForLocale(url: string, locale: string): string {
  let strippedUrl = url;

  // Remove locale from URL path and ensure proper format
  for (const loc of SUPPORTED_LOCALES) {
    // Handle absolute paths with locale: /docs/zh/... -> /docs/...
    const absPattern = `/docs/${loc}/`;
    const absPatternEnd = `/docs/${loc}`;
    if (url.startsWith(absPattern)) {
      strippedUrl = `/docs/${url.slice(absPattern.length)}`;
      break;
    }
    if (url === absPatternEnd) {
      strippedUrl = "/docs";
      break;
    }

    // Handle relative paths that start with locale: zh/... -> /docs/...
    const relPattern = `${loc}/`;
    if (url.startsWith(relPattern)) {
      strippedUrl = `/docs/${url.slice(relPattern.length)}`;
      break;
    }
    if (url === loc) {
      strippedUrl = "/docs";
      break;
    }
  }

  // Ensure URL starts with /docs if it doesn't already
  if (!strippedUrl.startsWith("/docs") && !strippedUrl.startsWith("/")) {
    strippedUrl = `/docs/${strippedUrl}`;
  }

  // Add locale prefix for proper routing
  // e.g., "/docs/core" -> "/zh/docs/core"
  return `/${locale}${strippedUrl}`;
}

// Helper to recursively transform URLs in a tree node for a specific locale
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformTreeNodeUrls(node: any, locale: string): any {
  if (!node || typeof node !== "object") {
    return node;
  }

  const result = { ...node };

  // Transform URL to proper format (strip locale from path)
  if ("url" in result && typeof result.url === "string") {
    result.url = transformUrlForLocale(result.url, locale);
  }

  // Process index page if present
  if ("index" in result && result.index && typeof result.index === "object") {
    result.index = transformTreeNodeUrls(result.index, locale);
  }

  // Recursively process children
  if ("children" in result && Array.isArray(result.children)) {
    result.children = result.children.map((child: unknown) =>
      transformTreeNodeUrls(child, locale)
    );
  }

  return result;
}

// Helper to check if a tree node belongs to a specific locale by checking its URLs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isLocaleFolder(node: any, locale: string): boolean {
  if (!node || typeof node !== "object") return false;

  // Check if this node has an index with a URL containing the locale
  if (
    "index" in node &&
    node.index &&
    typeof node.index === "object" &&
    "url" in node.index &&
    typeof node.index.url === "string"
  ) {
    const url = node.index.url;
    // Check if URL matches /docs/{locale} or /docs/{locale}/...
    if (url === `/docs/${locale}` || url.startsWith(`/docs/${locale}/`)) {
      return true;
    }
  }

  // Check children URLs to determine if this is the locale folder
  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === "object" && "url" in child) {
        const url = child.url;
        if (
          typeof url === "string" &&
          (url === `/docs/${locale}` || url.startsWith(`/docs/${locale}/`))
        ) {
          return true;
        }
      }
      // Check nested index
      if (
        child &&
        typeof child === "object" &&
        "index" in child &&
        child.index &&
        typeof child.index === "object" &&
        "url" in child.index
      ) {
        const url = child.index.url;
        if (
          typeof url === "string" &&
          (url === `/docs/${locale}` || url.startsWith(`/docs/${locale}/`))
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

// Helper to get page tree for a specific locale
export function getLocalePageTree(locale: string) {
  // Find the subtree for this locale in the page tree
  const tree = source.pageTree;

  // The tree structure has children array, find the locale folder
  if (tree && "children" in tree && Array.isArray(tree.children)) {
    for (const child of tree.children) {
      // Check if this is the locale folder by examining URLs (not name, as name might be localized)
      if (
        child &&
        typeof child === "object" &&
        "children" in child &&
        isLocaleFolder(child, locale)
      ) {
        // Return a new root tree with the locale folder's children
        // Transform URLs to proper format (without locale in path)
        const children = Array.isArray(child.children)
          ? child.children.map((c: unknown) => transformTreeNodeUrls(c, locale))
          : child.children;
        return {
          ...tree,
          children,
        };
      }
    }
  }
  // Fallback to full tree if locale not found
  return tree;
}

// Type for flattened doc item for sidebar search
export interface FlatDocItem {
  title: string;
  href: string;
  type: "page" | "folder";
  breadcrumb?: string;
}

// Helper to flatten page tree into searchable doc items
// Note: tree URLs already include locale prefix from transformUrlForLocale
export function flattenPageTree(
  tree: ReturnType<typeof getLocalePageTree>,
  locale: string,
  breadcrumb: string[] = []
): FlatDocItem[] {
  const items: FlatDocItem[] = [];
  // locale parameter kept for API compatibility

  if (!tree || !("children" in tree) || !Array.isArray(tree.children)) {
    return items;
  }

  for (const child of tree.children) {
    if (!child || typeof child !== "object") continue;

    // Handle page type
    if ("type" in child && child.type === "page") {
      const name = "name" in child && typeof child.name === "string" ? child.name : "";
      const url = "url" in child && typeof child.url === "string" ? child.url : "";

      if (name && url) {
        items.push({
          title: name,
          href: url, // URL already includes locale prefix
          type: "page",
          breadcrumb: breadcrumb.length > 0 ? breadcrumb.join(" / ") : undefined,
        });
      }
    }

    // Handle folder type
    if ("type" in child && child.type === "folder") {
      const name = "name" in child && typeof child.name === "string" ? child.name : "";
      const index = "index" in child ? child.index : null;

      // Add folder itself if it has an index page
      if (index && typeof index === "object" && "url" in index && typeof index.url === "string") {
        items.push({
          title: name,
          href: index.url, // URL already includes locale prefix
          type: "folder",
          breadcrumb: breadcrumb.length > 0 ? breadcrumb.join(" / ") : undefined,
        });
      }

      // Recursively flatten children
      if ("children" in child && Array.isArray(child.children)) {
        const nestedItems = flattenPageTree(
          { children: child.children } as ReturnType<typeof getLocalePageTree>,
          locale,
          [...breadcrumb, name]
        );
        items.push(...nestedItems);
      }
    }

    // Handle separator - skip
    if ("type" in child && child.type === "separator") {
      continue;
    }
  }

  return items;
}
