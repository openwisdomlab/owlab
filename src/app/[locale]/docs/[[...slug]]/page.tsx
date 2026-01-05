import { source, getLocalePage, getLocalePageTree } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { TOCItemType } from "fumadocs-core/toc";
import { ModuleCards } from "@/features/doc-viewer/ModuleCards";
import { ExtendCards } from "@/features/doc-viewer/ExtendCards";
import { BackToSection } from "@/features/doc-viewer/BackToSection";
import { TheoryLineage } from "@/features/doc-viewer/TheoryLineage";
import { FourPFramework } from "@/features/doc-viewer/FourPFramework";
import { FlowChart, EQUIPMENT_ACCESS_FLOW, SPACE_PLANNING_FLOW } from "@/features/doc-viewer/FlowChart";
import { KnowledgeGraph } from "@/features/doc-viewer/KnowledgeGraph";
import { ModuleSummary } from "@/features/doc-viewer/ModuleSummary";
import { ConceptExplorer } from "@/features/doc-viewer/ConceptExplorer";
import {
  GovernanceExplorer,
  SpaceExplorer,
  CurriculumExplorer,
  ToolsExplorer,
  SafetyExplorer,
  PeopleExplorer,
  OperationsExplorer,
  AssessmentExplorer,
} from "@/features/doc-viewer/ModuleExplorers";

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
  const page = getLocalePage(slug, locale);
  if (!page) notFound();

  const data = page.data as unknown as DocPageData;
  const MDX = data.body;

  // 获取页面树以计算上一页/下一页
  const tree = getLocalePageTree(locale) as unknown as TreeNode | undefined;

  // 计算导航链接 (only if tree is available)
  const neighbours = tree ? findNeighbours(tree, page.url) : { previous: undefined, next: undefined };

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
          ExtendCards: (props: { cards: Array<{ title: string; description: string; href: string; type: "extend" | "evidence" | "checklist" | "sop"; status?: "completed" | "in_progress" | "planned" | "draft" }> }) => (
            <ExtendCards {...props} locale={locale} />
          ),
          BackToSection: (props: { href: string; label?: string; moduleId?: string; moduleName?: string }) => (
            <BackToSection {...props} locale={locale} />
          ),
          TheoryLineage: (props: { className?: string; interactive?: boolean }) => (
            <TheoryLineage {...props} />
          ),
          FourPFramework: (props: { className?: string; interactive?: boolean; compact?: boolean }) => (
            <FourPFramework {...props} />
          ),
          FlowChart: FlowChart,
          KnowledgeGraph: (props: { module?: string; depth?: number; interactive?: boolean; className?: string }) => (
            <KnowledgeGraph {...props} />
          ),
          ModuleSummary: (props: { moduleId: string; tagline: string; philosophy: string; insights: string[]; className?: string }) => (
            <ModuleSummary {...props} />
          ),
          ConceptExplorer: (props: { className?: string }) => (
            <ConceptExplorer {...props} />
          ),
          GovernanceExplorer: (props: { className?: string }) => (
            <GovernanceExplorer {...props} />
          ),
          SpaceExplorer: (props: { className?: string }) => (
            <SpaceExplorer {...props} />
          ),
          CurriculumExplorer: (props: { className?: string }) => (
            <CurriculumExplorer {...props} />
          ),
          ToolsExplorer: (props: { className?: string }) => (
            <ToolsExplorer {...props} />
          ),
          SafetyExplorer: (props: { className?: string }) => (
            <SafetyExplorer {...props} />
          ),
          PeopleExplorer: (props: { className?: string }) => (
            <PeopleExplorer {...props} />
          ),
          OperationsExplorer: (props: { className?: string }) => (
            <OperationsExplorer {...props} />
          ),
          AssessmentExplorer: (props: { className?: string }) => (
            <AssessmentExplorer {...props} />
          ),
          EQUIPMENT_ACCESS_FLOW,
          SPACE_PLANNING_FLOW,
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

// Helper to normalize URL for comparison
// Converts both formats to a common format: /docs/path (without locale)
// Input formats:
// - "/docs/zh/living-modules" (from fumadocs source) -> "/docs/research"
// - "/zh/docs/research" (from transformed tree) -> "/docs/research"
function normalizeUrlForComparison(url: string): string {
  const locales = ["en", "zh"];
  for (const loc of locales) {
    // Handle fumadocs source format: /docs/{locale}/...
    const sourcePattern = `/docs/${loc}/`;
    const sourcePatternEnd = `/docs/${loc}`;
    if (url.startsWith(sourcePattern)) {
      return `/docs/${url.slice(sourcePattern.length)}`;
    }
    if (url === sourcePatternEnd) {
      return "/docs";
    }

    // Handle transformed tree format: /{locale}/docs/...
    const treePattern = `/${loc}/docs/`;
    const treePatternEnd = `/${loc}/docs`;
    if (url.startsWith(treePattern)) {
      return `/docs/${url.slice(treePattern.length)}`;
    }
    if (url === treePatternEnd) {
      return "/docs";
    }
  }
  return url;
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

  // Normalize currentUrl for comparison
  // currentUrl format: /docs/zh/... (from fumadocs source)
  // tree URLs format: /zh/docs/... (transformed)
  const normalizedCurrentUrl = normalizeUrlForComparison(currentUrl);
  const currentIndex = pages.findIndex(p => normalizeUrlForComparison(p.url) === normalizedCurrentUrl);

  return {
    previous: currentIndex > 0 ? pages[currentIndex - 1] : undefined,
    next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined,
  };
}

export async function generateStaticParams() {
  const params = source.generateParams();
  const locales = ["en", "zh"];

  // Transform params: extract locale from slug and create proper locale/slug pairs
  const result: { locale: string; slug?: string[] }[] = [];

  for (const param of params) {
    const slug = param.slug;
    if (!slug || slug.length === 0) continue;

    // Check if first segment is a locale
    const firstSegment = slug[0];
    if (locales.includes(firstSegment)) {
      const locale = firstSegment;
      const remainingSlug = slug.slice(1);
      result.push({
        locale,
        slug: remainingSlug.length > 0 ? remainingSlug : undefined,
      });
    }
  }

  return result;
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const page = getLocalePage(slug, locale);
  if (!page) notFound();

  const data = page.data as unknown as DocPageData;

  return {
    title: data.title,
    description: data.description,
  };
}
