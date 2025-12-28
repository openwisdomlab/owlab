"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/components/ui/Link";
import {
  Lightbulb,
  Network,
  Building2,
  BookOpen,
  Wrench,
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Module {
  id: string;
  icon: LucideIcon;
  path: string;
  status: "completed" | "in_progress" | "planned";
  color: string;
}

const modules: Module[] = [
  {
    id: "M01",
    icon: Lightbulb,
    path: "/docs/zh/knowledge-base/01-foundations",
    status: "in_progress",
    color: "var(--neon-yellow)",
  },
  {
    id: "M02",
    icon: Network,
    path: "/docs/zh/knowledge-base/02-governance",
    status: "in_progress",
    color: "var(--neon-violet)",
  },
  {
    id: "M03",
    icon: Building2,
    path: "/docs/zh/knowledge-base/03-space",
    status: "in_progress",
    color: "var(--neon-cyan)",
  },
  {
    id: "M04",
    icon: BookOpen,
    path: "/docs/zh/knowledge-base/04-programs",
    status: "in_progress",
    color: "var(--neon-green)",
  },
  {
    id: "M05",
    icon: Wrench,
    path: "/docs/zh/knowledge-base/05-tools",
    status: "in_progress",
    color: "var(--neon-orange)",
  },
  {
    id: "M06",
    icon: ShieldCheck,
    path: "/docs/zh/knowledge-base/06-safety",
    status: "in_progress",
    color: "var(--neon-red)",
  },
  {
    id: "M07",
    icon: Users,
    path: "/docs/zh/knowledge-base/07-people",
    status: "in_progress",
    color: "var(--neon-pink)",
  },
  {
    id: "M08",
    icon: ClipboardList,
    path: "/docs/zh/knowledge-base/08-operations",
    status: "in_progress",
    color: "var(--neon-blue)",
  },
  {
    id: "M09",
    icon: BarChart3,
    path: "/docs/zh/knowledge-base/09-assessment",
    status: "in_progress",
    color: "var(--neon-teal)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

interface ModuleCardsProps {
  locale: string;
  compact?: boolean;
}

export function ModuleCards({ locale, compact = false }: ModuleCardsProps) {
  const t = useTranslations("docs.knowledgeBase");

  return (
    <motion.div
      className={compact ? "grid md:grid-cols-2 lg:grid-cols-3 gap-3" : "grid md:grid-cols-2 lg:grid-cols-3 gap-4"}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {modules.map((module) => (
        <motion.div key={module.id} variants={itemVariants}>
          <Link
            href={`/${locale}${module.path}`}
            className="group block h-full"
          >
            <div
              className={`
                h-full glass-card transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                border-l-4
                ${compact ? "p-4" : "p-5"}
              `}
              style={{
                borderLeftColor: module.color,
                // @ts-expect-error CSS custom properties
                "--hover-glow": `${module.color}20`,
              }}
            >
              <div className="flex items-start gap-4">
                {/* 图标 */}
                <div
                  className={`
                    flex-shrink-0 rounded-xl flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300
                    ${compact ? "w-10 h-10" : "w-12 h-12"}
                  `}
                  style={{
                    backgroundColor: `color-mix(in srgb, ${module.color} 15%, transparent)`,
                  }}
                >
                  <module.icon
                    className={compact ? "w-5 h-5" : "w-6 h-6"}
                    style={{ color: module.color }}
                  />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  {/* 模块 ID + 状态 */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: module.color }}
                    >
                      {module.id}
                    </span>
                    <StatusBadge status={module.status} t={t} />
                  </div>

                  {/* 标题 */}
                  <h3 className={`
                    font-semibold mb-1 group-hover:text-[var(--foreground)] transition-colors
                    ${compact ? "text-sm" : "text-base"}
                  `}>
                    {t(`modules.${module.id}.title`)}
                  </h3>

                  {/* 描述 */}
                  {!compact && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                      {t(`modules.${module.id}.description`)}
                    </p>
                  )}
                </div>

                {/* 箭头 */}
                <ArrowRight
                  className={`
                    flex-shrink-0 text-[var(--muted-foreground)]
                    group-hover:text-[var(--foreground)] group-hover:translate-x-1
                    transition-all duration-300
                    ${compact ? "w-4 h-4" : "w-5 h-5"}
                  `}
                />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

interface StatusBadgeProps {
  status: Module["status"];
  t: ReturnType<typeof useTranslations>;
}

function StatusBadge({ status, t }: StatusBadgeProps) {
  const config = {
    completed: {
      className: "bg-green-500/15 text-green-400 border-green-500/30",
    },
    in_progress: {
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    planned: {
      className: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    },
  };

  const { className } = config[status];

  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${className}`}>
      {t(`status.${status}`)}
    </span>
  );
}
