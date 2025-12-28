"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  locale: string;
  className?: string;
}

// 路径段落的中文映射
const pathLabels: Record<string, Record<string, string>> = {
  zh: {
    docs: "文档",
    lab: "实验室",
    dashboard: "仪表盘",
    "knowledge-base": "知识库",
    "floor-plan": "平面图编辑器",
    concepts: "概念可视化",
    "case-studies": "案例研究",
    "01-foundations": "M01 理念与理论",
    "02-governance": "M02 治理与网络",
    "03-space": "M03 空间与环境",
    "04-programs": "M04 课程与项目",
    "05-tools": "M05 工具与资产",
    "06-safety": "M06 安全与伦理",
    "07-people": "M07 人员与能力",
    "08-operations": "M08 运营手册",
    "09-assessment": "M09 评价与影响",
    extend: "扩展内容",
    evidence: "证据层",
    checklists: "检查清单",
    sops: "标准流程",
    _meta: "元数据",
    _templates: "模板",
  },
  en: {
    docs: "Documentation",
    lab: "Lab",
    dashboard: "Dashboard",
    "knowledge-base": "Knowledge Base",
    "floor-plan": "Floor Plan Editor",
    concepts: "Concepts",
    "case-studies": "Case Studies",
    "01-foundations": "M01 Philosophy & Theory",
    "02-governance": "M02 Governance & Network",
    "03-space": "M03 Space & Environment",
    "04-programs": "M04 Courses & Projects",
    "05-tools": "M05 Tools & Assets",
    "06-safety": "M06 Safety & Ethics",
    "07-people": "M07 People & Capability",
    "08-operations": "M08 Operations Manual",
    "09-assessment": "M09 Assessment & Impact",
    extend: "Extended Content",
    evidence: "Evidence",
    checklists: "Checklists",
    sops: "SOPs",
    _meta: "Meta",
    _templates: "Templates",
  },
};

function getLabel(segment: string, locale: string): string {
  const labels = pathLabels[locale] || pathLabels.en;
  return labels[segment] || segment.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase());
}

export function Breadcrumbs({ locale, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // 解析路径
  const segments = pathname.split("/").filter(Boolean);

  // 移除 locale 前缀
  const pathSegments = segments.slice(1);

  if (pathSegments.length === 0) {
    return null;
  }

  // 构建面包屑项
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${locale}/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = getLabel(segment, locale);
    const isLast = index === pathSegments.length - 1;

    return { href, label, isLast, segment };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1 text-sm text-[var(--muted-foreground)] mb-4 flex-wrap",
        className
      )}
    >
      {/* 首页 */}
      <Link
        href={`/${locale}`}
        className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">{locale === "zh" ? "首页" : "Home"}</span>
      </Link>

      {breadcrumbs.map(({ href, label, isLast, segment }) => (
        <div key={segment} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]/50" />
          {isLast ? (
            <span className="text-[var(--foreground)] font-medium truncate max-w-[200px]">
              {label}
            </span>
          ) : (
            <Link
              href={href}
              className="hover:text-[var(--foreground)] transition-colors truncate max-w-[150px]"
            >
              {label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
