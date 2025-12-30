import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { TOCItemType } from "fumadocs-core/toc";
import type { Locale } from "@/i18n";
import { ModuleCards } from "@/components/docs/ModuleCards";
import { ExtendCards } from "@/components/docs/ExtendCards";
import { BackToSection } from "@/components/docs/BackToSection";

type Props = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

interface DocPageData {
  title: string;
  description?: string;
  body: React.ComponentType<{ components?: Record<string, unknown> }>;
  toc: TOCItemType[];
  structuredData?: unknown;
}

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const data = page.data as unknown as DocPageData;
  const MDX = data.body;

  // 获取页面树以计算上一页/下一页
  const tree = source.pageTree[locale as Locale] as unknown as TreeNode;

  // 计算导航链接
  const neighbours = findNeighbours(tree, page.url);

  return (
    <DocsPage
      toc={data.toc}
      full={data.toc.length === 0}
      footer={{
        items: {
          previous: neighbours.previous ? {
            name: neighbours.previous.name,
            url: neighbours.previous.url,
          } : undefined,
          next: neighbours.next ? {
            name: neighbours.next.name,
            url: neighbours.next.url,
          } : undefined,
        },
      }}
      breadcrumb={{
        includeRoot: true,
        includeSeparator: true,
      }}
    >
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{
          ...defaultMdxComponents,
          ModuleCards: () => <ModuleCards locale={locale} />,
          ExtendCards: (props: { cards: Array<{ title: string; description: string; href: string; type: "extend" | "evidence" | "checklist" | "sop"; status?: "completed" | "in_progress" | "planned" }> }) => (
            <ExtendCards {...props} locale={locale} />
          ),
          BackToSection: (props: { href: string; label?: string; moduleId?: string; moduleName?: string }) => (
            <BackToSection {...props} locale={locale} />
          ),
        }} />
      </DocsBody>
    </DocsPage>
  );
}

// 辅助函数：查找页面树中的相邻页面
interface PageNode {
  name: string;
  url: string;
}

interface TreeNode {
  type: string;
  name?: string;
  url?: string;
  children?: TreeNode[];
}

function findNeighbours(
  tree: TreeNode,
  currentUrl: string
): { previous?: PageNode; next?: PageNode } {
  const pages: PageNode[] = [];

  function collect(node: TreeNode) {
    if (node.type === "page" && node.url && node.name) {
      pages.push({ name: node.name, url: node.url });
    }
    if (node.children) {
      for (const child of node.children) {
        collect(child);
      }
    }
  }

  collect(tree);

  const currentIndex = pages.findIndex(p => p.url === currentUrl);

  return {
    previous: currentIndex > 0 ? pages[currentIndex - 1] : undefined,
    next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined,
  };
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const data = page.data as unknown as DocPageData;

  return {
    title: data.title,
    description: data.description,
  };
}
