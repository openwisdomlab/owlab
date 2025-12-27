"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { ChevronRight, FileText, FolderOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

type SidebarItem = {
  title: string;
  href?: string;
  items?: SidebarItem[];
};

type SidebarProps = {
  locale: Locale;
  items: SidebarItem[];
};

export function Sidebar({ locale, items }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 sidebar-glass rounded-lg p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <nav className="space-y-1">
          {items.map((item) => (
            <SidebarNode key={item.title} item={item} locale={locale} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarNode({ item, locale }: { item: SidebarItem; locale: Locale }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasItems = item.items && item.items.length > 0;
  const isActive = item.href && pathname === item.href;

  if (hasItems) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.span>
          <FolderOpen className="w-4 h-4 shrink-0" />
          <span className="truncate">{item.title}</span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-4 pl-3 border-l border-[var(--glass-border)] overflow-hidden"
            >
              {item.items?.map((child) => (
                <SidebarNode key={child.title} item={child} locale={locale} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all",
        isActive
          ? "sidebar-item-active text-[var(--neon-cyan)] font-medium"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]"
      )}
    >
      <FileText className="w-4 h-4 shrink-0" />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}
