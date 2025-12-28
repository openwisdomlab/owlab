"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import {
  ChevronRight,
  FileText,
  FolderOpen,
  Layers,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n";

type SidebarItem = {
  title: string;
  href?: string;
  items?: SidebarItem[];
  icon?: LucideIcon;
  badge?: string;
};

type SidebarProps = {
  locale: Locale;
  items: SidebarItem[];
};

// 定义文档层类型及其图标/颜色
const layerConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  extend: {
    icon: Layers,
    color: "var(--neon-violet)",
    label: "扩展层",
  },
  evidence: {
    icon: BookOpen,
    color: "var(--neon-green)",
    label: "证据层",
  },
  checklists: {
    icon: FileText,
    color: "var(--neon-orange)",
    label: "检查清单",
  },
  sops: {
    icon: FileText,
    color: "var(--neon-blue)",
    label: "标准流程",
  },
};

export function Sidebar({ locale, items }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 sidebar-glass rounded-lg p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* 搜索提示 */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs text-[var(--muted-foreground)]">
          <span className="opacity-70">⌘K</span> 快速搜索
        </div>

        {/* 导航 */}
        <nav className="space-y-1">
          {items.map((item, index) => (
            <SidebarNode key={`${item.title}-${index}`} item={item} locale={locale} depth={0} />
          ))}
        </nav>

        {/* 图例 */}
        <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
          <div className="text-xs text-[var(--muted-foreground)] mb-2 px-3">内容层级</div>
          <div className="space-y-1 px-3">
            {Object.entries(layerConfig).map(([key, { icon: Icon, color, label }]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <Icon className="w-3 h-3" style={{ color }} />
                <span className="text-[var(--muted-foreground)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

interface SidebarNodeProps {
  item: SidebarItem;
  locale: Locale;
  depth: number;
}

function SidebarNode({ item, locale, depth }: SidebarNodeProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasItems = item.items && item.items.length > 0;
  const isActive = item.href && pathname === item.href;

  // 检测当前路径是否在此项的子树中
  const isInPath = useMemo(() => {
    if (!item.href) return false;
    return pathname.startsWith(item.href);
  }, [pathname, item.href]);

  // 获取层配置（如果适用）
  const layerInfo = useMemo(() => {
    const segments = item.href?.split("/") || [];
    const lastSegment = segments[segments.length - 1];
    return layerConfig[lastSegment];
  }, [item.href]);

  if (hasItems) {
    return (
      <div className={cn(depth > 0 && "ml-2")}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            isInPath
              ? "text-[var(--foreground)] bg-[var(--glass-bg)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]"
          )}
        >
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.span>
          {layerInfo ? (
            <layerInfo.icon className="w-4 h-4 shrink-0" style={{ color: layerInfo.color }} />
          ) : (
            <FolderOpen className="w-4 h-4 shrink-0 text-[var(--neon-cyan)]" />
          )}
          <span className="truncate flex-1 text-left">{item.title}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
              {item.badge}
            </span>
          )}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 pl-3 border-l border-[var(--glass-border)] overflow-hidden"
            >
              {item.items?.map((child, index) => (
                <SidebarNode
                  key={`${child.title}-${index}`}
                  item={child}
                  locale={locale}
                  depth={depth + 1}
                />
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
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all group",
        depth > 0 && "ml-2",
        isActive
          ? "sidebar-item-active text-[var(--neon-cyan)] font-medium"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]"
      )}
    >
      {layerInfo ? (
        <layerInfo.icon
          className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
          style={{ color: isActive ? "var(--neon-cyan)" : layerInfo.color }}
        />
      ) : (
        <FileText
          className={cn(
            "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
            isActive ? "text-[var(--neon-cyan)]" : ""
          )}
        />
      )}
      <span className="truncate">{item.title}</span>
      {item.badge && (
        <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
