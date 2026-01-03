"use client";

import { SidebarSearch } from "./SidebarSearch";
import type { FlatDocItem } from "@/lib/source";

interface SidebarSearchWrapperProps {
  locale: string;
  docs: FlatDocItem[];
}

export function SidebarSearchWrapper({ locale, docs }: SidebarSearchWrapperProps) {
  return (
    <SidebarSearch
      locale={locale}
      docs={docs}
      className="mb-4"
    />
  );
}
