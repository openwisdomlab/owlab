import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { getLocalePageTree, flattenPageTree } from "@/lib/source";
import { SidebarSearchWrapper } from "@/components/search/SidebarSearchWrapper";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  const tree = getLocalePageTree(locale);
  const flatDocs = flattenPageTree(tree, locale);

  return (
    <RootProvider>
      <DocsLayout
        tree={tree}
        nav={{
          title: "AI Space Docs",
        }}
        sidebar={{
          defaultOpenLevel: 1,
          banner: (
            <SidebarSearchWrapper locale={locale} docs={flatDocs} />
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
