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

  return (
    <DocsPage toc={data.toc}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
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
