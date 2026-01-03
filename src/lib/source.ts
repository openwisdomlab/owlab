import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

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

// Helper to get page tree for a specific locale
export function getLocalePageTree(locale: string) {
  // Find the subtree for this locale in the page tree
  const tree = source.pageTree;

  // The tree structure has children array, find the locale folder
  if (tree && "children" in tree && Array.isArray(tree.children)) {
    for (const child of tree.children) {
      // Check if this is the locale folder (type: "folder" with matching name)
      if (
        child &&
        typeof child === "object" &&
        "name" in child &&
        typeof child.name === "string" &&
        child.name.toLowerCase() === locale &&
        "children" in child
      ) {
        // Return a new root tree with the locale folder's children
        return {
          ...tree,
          children: child.children,
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
export function flattenPageTree(
  tree: ReturnType<typeof getLocalePageTree>,
  locale: string,
  breadcrumb: string[] = []
): FlatDocItem[] {
  const items: FlatDocItem[] = [];

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
          href: `/${locale}${url}`,
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
          href: `/${locale}${index.url}`,
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
