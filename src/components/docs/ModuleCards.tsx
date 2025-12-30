"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  type LucideIcon,
} from "lucide-react";

interface SubModule {
  id: string;
  path: string;
}

interface Module {
  id: string;
  icon: LucideIcon;
  path: string;
  status: "completed" | "in_progress" | "planned";
  color: string;
  keywords: string[];
  subModules: SubModule[];
}

const modules: Module[] = [
  {
    id: "M01",
    icon: Lightbulb,
    path: "/docs/zh/knowledge-base/01-foundations",
    status: "in_progress",
    color: "var(--neon-yellow)",
    keywords: ["建构主义", "4P理论", "使命愿景"],
    subModules: [
      { id: "learning-theories", path: "/docs/zh/knowledge-base/01-foundations/extend/learning-theories" },
    ],
  },
  {
    id: "M02",
    icon: Network,
    path: "/docs/zh/knowledge-base/02-governance",
    status: "in_progress",
    color: "var(--neon-violet)",
    keywords: ["分布式网络", "合作模式", "节点分类"],
    subModules: [
      { id: "distributed-innovation", path: "/docs/zh/knowledge-base/02-governance/extend/distributed-innovation" },
    ],
  },
  {
    id: "M03",
    icon: Building2,
    path: "/docs/zh/knowledge-base/03-space",
    status: "in_progress",
    color: "var(--neon-cyan)",
    keywords: ["物理空间", "数字环境", "文化氛围"],
    subModules: [
      { id: "physical-design", path: "/docs/zh/knowledge-base/03-space/extend/physical-design" },
      { id: "digital-environment", path: "/docs/zh/knowledge-base/03-space/extend/digital-environment" },
      { id: "culture-atmosphere", path: "/docs/zh/knowledge-base/03-space/extend/culture-atmosphere" },
      { id: "accessibility", path: "/docs/zh/knowledge-base/03-space/extend/accessibility" },
      { id: "innovation-friendly", path: "/docs/zh/knowledge-base/03-space/extend/innovation-friendly" },
      { id: "environmental-psychology", path: "/docs/zh/knowledge-base/03-space/extend/environmental-psychology" },
    ],
  },
  {
    id: "M04",
    icon: BookOpen,
    path: "/docs/zh/knowledge-base/04-programs",
    status: "in_progress",
    color: "var(--neon-green)",
    keywords: ["逆向设计", "PBL", "AI融入"],
    subModules: [
      { id: "pbl-design", path: "/docs/zh/knowledge-base/04-programs/extend/pbl-design" },
    ],
  },
  {
    id: "M05",
    icon: Wrench,
    path: "/docs/zh/knowledge-base/05-tools",
    status: "in_progress",
    color: "var(--neon-orange)",
    keywords: ["设备分级", "数字制造", "开源硬件"],
    subModules: [
      { id: "equipment-catalog", path: "/docs/zh/knowledge-base/05-tools/extend/equipment-catalog" },
      { id: "digital-fabrication", path: "/docs/zh/knowledge-base/05-tools/extend/digital-fabrication" },
      { id: "ai-tools-guide", path: "/docs/zh/knowledge-base/05-tools/extend/ai-tools-guide" },
      { id: "opensource-hardware", path: "/docs/zh/knowledge-base/05-tools/extend/opensource-hardware" },
      { id: "maintenance-guide", path: "/docs/zh/knowledge-base/05-tools/extend/maintenance-guide" },
    ],
  },
  {
    id: "M06",
    icon: ShieldCheck,
    path: "/docs/zh/knowledge-base/06-safety",
    status: "in_progress",
    color: "var(--neon-red)",
    keywords: ["风险分级", "应急响应", "AI伦理"],
    subModules: [
      { id: "risk-assessment", path: "/docs/zh/knowledge-base/06-safety/extend/risk-assessment" },
      { id: "safety-training", path: "/docs/zh/knowledge-base/06-safety/extend/safety-training" },
      { id: "emergency-response", path: "/docs/zh/knowledge-base/06-safety/extend/emergency-response" },
      { id: "equipment-access", path: "/docs/zh/knowledge-base/06-safety/extend/equipment-access" },
      { id: "digital-security", path: "/docs/zh/knowledge-base/06-safety/extend/digital-security" },
      { id: "ai-ethics", path: "/docs/zh/knowledge-base/06-safety/extend/ai-ethics" },
      { id: "age-guidelines", path: "/docs/zh/knowledge-base/06-safety/extend/age-guidelines" },
    ],
  },
  {
    id: "M07",
    icon: Users,
    path: "/docs/zh/knowledge-base/07-people",
    status: "in_progress",
    color: "var(--neon-pink)",
    keywords: ["角色体系", "能力分级", "师资认证"],
    subModules: [],
  },
  {
    id: "M08",
    icon: ClipboardList,
    path: "/docs/zh/knowledge-base/08-operations",
    status: "in_progress",
    color: "var(--neon-blue)",
    keywords: ["SOP标准", "会员制度", "社区文化"],
    subModules: [
      { id: "openday-workshop", path: "/docs/zh/knowledge-base/08-operations/extend/openday-workshop" },
      { id: "mentor-network", path: "/docs/zh/knowledge-base/08-operations/extend/mentor-network" },
      { id: "community-culture", path: "/docs/zh/knowledge-base/08-operations/extend/community-culture" },
      { id: "knowledge-sharing", path: "/docs/zh/knowledge-base/08-operations/extend/knowledge-sharing" },
      { id: "cross-generational", path: "/docs/zh/knowledge-base/08-operations/extend/cross-generational" },
      { id: "incentive-certification", path: "/docs/zh/knowledge-base/08-operations/extend/incentive-certification" },
    ],
  },
  {
    id: "M09",
    icon: BarChart3,
    path: "/docs/zh/knowledge-base/09-assessment",
    status: "in_progress",
    color: "var(--neon-teal)",
    keywords: ["多元评价", "档案袋", "数字画像"],
    subModules: [],
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
  showSubModules?: boolean;
}

export function ModuleCards({ locale, compact = false, showSubModules = true }: ModuleCardsProps) {
  const t = useTranslations("docs.knowledgeBase");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleExpand = (moduleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      className={compact ? "grid md:grid-cols-2 lg:grid-cols-3 gap-3" : "grid md:grid-cols-2 lg:grid-cols-3 gap-5"}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {modules.map((module) => {
        const isExpanded = expandedModules.has(module.id);
        const hasSubModules = module.subModules.length > 0;

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
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-2">
                        {t(`modules.${module.id}.description`)}
                      </p>
                    )}

                    {/* 关键词标签 */}
                    {!compact && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {module.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-0.5 text-[10px] rounded-full"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${module.color} 10%, transparent)`,
                              color: module.color,
                              border: `1px solid color-mix(in srgb, ${module.color} 20%, transparent)`,
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
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
              </Link>

              {/* 子模块展开区域 */}
              {showSubModules && hasSubModules && !compact && (
                <>
                  {/* 展开按钮 */}
                  <button
                    onClick={(e) => toggleExpand(module.id, e)}
                    className="w-full mt-3 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {t("subModules.count", { count: module.subModules.length })}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* 子模块列表 */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-1.5">
                          {module.subModules.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/${locale}${sub.path}`}
                              className="group/sub flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                              <span className="text-xs flex-1">
                                {t(`subModules.${module.id}.${sub.id}`)}
                              </span>
                              <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* 无子模块时的占位提示 */}
              {showSubModules && !hasSubModules && !compact && (
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                  <span className="text-xs text-[var(--muted-foreground)] opacity-60 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {t("subModules.coreOnly")}
                  </span>
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
