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
