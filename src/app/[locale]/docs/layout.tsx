import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { getLocalePageTree, flattenPageTree } from "@/lib/source";
import { SidebarSearchWrapper } from "@/components/search/SidebarSearchWrapper";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  const tree = getLocalePageTree(locale);
  const flatDocs = flattenPageTree(tree, locale);

  return (
    <RootProvider
      search={{
        enabled: false,
      }}
    >
      <DocsLayout
        tree={tree}
        nav={{
          title: t("layoutTitle"),
        }}
        sidebar={{
          defaultOpenLevel: 2,
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
