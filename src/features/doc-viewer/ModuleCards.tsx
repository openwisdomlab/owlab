"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/components/ui/Link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { getOwlIcon } from "@/components/icons/OwlIcons";

interface SubModule {
  id: string;
  path: string;
}

interface Module {
  id: string;
  path: string;
  status: "completed" | "in_progress" | "planned";
  color: string;
  subModules: SubModule[];
}

const modules: Module[] = [
  {
    id: "M01",
    path: "/docs/core/01-foundations",
    status: "in_progress",
    color: "var(--neon-yellow)",
    subModules: [
      { id: "curiosity-cultivation", path: "/docs/core/01-foundations/extend/curiosity-cultivation" },
      { id: "4p-creative-learning", path: "/docs/core/01-foundations/extend/4p-creative-learning" },
      { id: "constructionism", path: "/docs/core/01-foundations/extend/constructionism" },
      { id: "ai-maker-education", path: "/docs/core/01-foundations/extend/ai-maker-education" },
    ],
  },
  {
    id: "M02",
    path: "/docs/core/02-governance",
    status: "in_progress",
    color: "var(--neon-violet)",
    subModules: [
      { id: "distributed-innovation", path: "/docs/core/02-governance/extend/distributed-innovation" },
      { id: "node-governance-model", path: "/docs/core/02-governance/extend/node-governance-model" },
      { id: "school-partnership", path: "/docs/core/02-governance/extend/school-partnership" },
      { id: "financial-sustainability", path: "/docs/core/02-governance/extend/financial-sustainability" },
    ],
  },
  {
    id: "M03",
    path: "/docs/core/03-space",
    status: "in_progress",
    color: "var(--neon-cyan)",
    subModules: [
      { id: "core-space-philosophy", path: "/docs/core/03-space/extend/core-space-philosophy" },
      { id: "physical-design", path: "/docs/core/03-space/extend/physical-design" },
      { id: "culture-atmosphere", path: "/docs/core/03-space/extend/culture-atmosphere" },
      { id: "low-cost-renovation", path: "/docs/core/03-space/extend/low-cost-renovation" },
    ],
  },
  {
    id: "M04",
    path: "/docs/core/04-programs",
    status: "in_progress",
    color: "var(--neon-green)",
    subModules: [
      { id: "pbl-design", path: "/docs/core/04-programs/extend/pbl-design" },
      { id: "design-thinking-toolkit", path: "/docs/core/04-programs/extend/design-thinking-toolkit" },
      { id: "ai-in-curriculum", path: "/docs/core/04-programs/extend/ai-in-curriculum" },
      { id: "micro-projects", path: "/docs/core/04-programs/extend/micro-projects" },
    ],
  },
  {
    id: "M05",
    path: "/docs/core/05-tools",
    status: "in_progress",
    color: "var(--neon-orange)",
    subModules: [
      { id: "equipment-catalog", path: "/docs/core/05-tools/extend/equipment-catalog" },
      { id: "ai-tools-guide", path: "/docs/core/05-tools/extend/ai-tools-guide" },
      { id: "digital-fabrication", path: "/docs/core/05-tools/extend/digital-fabrication" },
      { id: "opensource-hardware", path: "/docs/core/05-tools/extend/opensource-hardware" },
    ],
  },
  {
    id: "M06",
    path: "/docs/core/06-safety",
    status: "in_progress",
    color: "var(--neon-red)",
    subModules: [
      { id: "risk-assessment", path: "/docs/core/06-safety/extend/risk-assessment" },
      { id: "psychological-safety", path: "/docs/core/06-safety/extend/psychological-safety" },
      { id: "ai-ethics", path: "/docs/core/06-safety/extend/ai-ethics" },
      { id: "child-protection-policy", path: "/docs/core/06-safety/extend/child-protection-policy" },
    ],
  },
  {
    id: "M07",
    path: "/docs/core/07-people",
    status: "in_progress",
    color: "var(--neon-pink)",
    subModules: [
      { id: "competency-model", path: "/docs/core/07-people/extend/competency-model" },
      { id: "facilitator-guide", path: "/docs/core/07-people/extend/facilitator-guide" },
      { id: "peer-mentoring", path: "/docs/core/07-people/extend/peer-mentoring" },
      { id: "training-system", path: "/docs/core/07-people/extend/training-system" },
    ],
  },
  {
    id: "M08",
    path: "/docs/core/08-operations",
    status: "in_progress",
    color: "var(--neon-blue)",
    subModules: [
      { id: "openday-workshop", path: "/docs/core/08-operations/extend/openday-workshop" },
      { id: "community-culture", path: "/docs/core/08-operations/extend/community-culture" },
      { id: "mentor-network", path: "/docs/core/08-operations/extend/mentor-network" },
      { id: "knowledge-sharing", path: "/docs/core/08-operations/extend/knowledge-sharing" },
    ],
  },
  {
    id: "M09",
    path: "/docs/core/09-assessment",
    status: "in_progress",
    color: "var(--neon-teal)",
    subModules: [
      { id: "portfolio-assessment", path: "/docs/core/09-assessment/extend/portfolio-assessment" },
      { id: "theory-of-change", path: "/docs/core/09-assessment/extend/theory-of-change" },
      { id: "impact-evaluation", path: "/docs/core/09-assessment/extend/impact-evaluation" },
      { id: "tech-literacy-profile", path: "/docs/core/09-assessment/extend/tech-literacy-profile" },
    ],
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
  showHighlights?: boolean;
}

export function ModuleCards({ locale, compact = false, showHighlights = true }: ModuleCardsProps) {
  const t = useTranslations("docs.knowledgeBase");

  // 获取模块的 highlights 数组
  const getHighlights = (moduleId: string): string[] => {
    try {
      const raw = t.raw(`modules.${moduleId}.highlights`);
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  };

  // 获取模块的 tags 数组
  const getTags = (moduleId: string): string[] => {
    try {
      const raw = t.raw(`modules.${moduleId}.tags`);
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  };

  // 获取子模块名称作为额外标签
  const getSubModuleTags = (moduleId: string, subModules: SubModule[]): string[] => {
    return subModules.map(sub => {
      try {
        return t(`subModules.${moduleId}.${sub.id}`);
      } catch {
        return sub.id;
      }
    });
  };

  return (
    <motion.div
      className={compact ? "grid md:grid-cols-2 lg:grid-cols-3 gap-3" : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {modules.map((module) => {
        const highlights = getHighlights(module.id);
        const tags = getTags(module.id);
        const subModuleTags = getSubModuleTags(module.id, module.subModules);
        // 合并相关主题和扩展主题为一个标签列表
        const allTags = [...tags, ...subModuleTags];

        // 检查是否有 subtitle
        let subtitle = "";
        try {
          subtitle = t(`modules.${module.id}.subtitle`);
        } catch {
          subtitle = "";
        }

        return (
          <motion.div key={module.id} variants={itemVariants}>
            <div
              className={`
                h-full glass-card transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                border-l-4 overflow-hidden
                ${compact ? "p-4" : "p-5"}
              `}
              style={{
                borderLeftColor: module.color,
                // @ts-expect-error CSS custom properties
                "--hover-glow": `${module.color}20`,
              }}
            >
              {/* 主卡片区域 - 可点击 */}
              <Link
                href={`/${locale}${module.path}`}
                className="group block"
              >
                <div className="flex items-start gap-4">
                  {/* 猫头鹰图标 */}
                  <div
                    className={`
                      flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden
                      group-hover:scale-110 transition-transform duration-300
                      ${compact ? "w-10 h-10" : "w-14 h-14"}
                    `}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${module.color} 10%, transparent)`,
                    }}
                  >
                    {(() => {
                      const OwlIcon = getOwlIcon(module.id);
                      return (
                        <OwlIcon
                          className={compact ? "w-8 h-8" : "w-12 h-12"}
                          color={module.color}
                        />
                      );
                    })()}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 模块 ID + 功能标签 */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: module.color }}
                      >
                        {module.id}
                      </span>
                      {/* 功能描述小标签 */}
                      {!compact && (
                        <span className="text-[10px] text-[var(--muted-foreground)] opacity-70">
                          {t(`modules.${module.id}.label`)}
                        </span>
                      )}
                    </div>

                    {/* 猫头鹰名称（主标题） */}
                    <h3 className={`
                      font-bold mb-0.5 group-hover:text-[var(--foreground)] transition-colors
                      ${compact ? "text-sm" : "text-lg"}
                    `}>
                      {t(`modules.${module.id}.title`)}
                    </h3>

                    {/* 副标题 */}
                    {!compact && subtitle && (
                      <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" style={{ color: module.color }} />
                        <span className="italic">{subtitle}</span>
                      </p>
                    )}

                    {/* Slogan */}
                    {!compact && (
                      <p className="text-xs text-[var(--muted-foreground)] opacity-80">
                        {t(`modules.${module.id}.slogan`)}
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

                {/* 描述 */}
                {!compact && (
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-3 mb-4">
                    {t(`modules.${module.id}.description`)}
                  </p>
                )}
              </Link>

              {/* 亮点列表 - 2-3个要点 */}
              {!compact && showHighlights && highlights.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: module.color }} />
                    <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                      核心要点
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[var(--muted-foreground)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.5em] before:w-1.5 before:h-1.5 before:rounded-full"
                        style={{
                          // @ts-expect-error CSS custom property for before pseudo-element
                          '--tw-before-bg': `color-mix(in srgb, ${module.color} 60%, transparent)`,
                        }}
                      >
                        <span
                          className="absolute left-0 top-[0.5em] w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: `color-mix(in srgb, ${module.color} 60%, transparent)` }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 合并后的主题标签（相关主题 + 扩展主题） */}
              {!compact && allTags.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="w-3.5 h-3.5" style={{ color: module.color }} />
                    <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                      相关主题
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/${locale}${module.path}`}
                        className="px-2.5 py-1 text-[11px] rounded-full transition-all hover:scale-105"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${module.color} 12%, transparent)`,
                          color: module.color,
                          border: `1px solid color-mix(in srgb, ${module.color} 25%, transparent)`,
                        }}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
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
