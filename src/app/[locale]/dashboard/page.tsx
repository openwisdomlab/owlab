"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Link } from "@/components/ui/Link";
import {
  Rocket,
  Compass,
  Layers,
  Target,
  Wrench,
  Shield,
  GraduationCap,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { brandColors } from "@/lib/brand/colors";
import type { LucideIcon } from "lucide-react";

// ── Constants ──────────────────────────────────────────────

const MODULE_IDS = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09"] as const;
type ModuleId = (typeof MODULE_IDS)[number];

const MODULE_ICONS: Record<ModuleId, LucideIcon> = {
  M01: Rocket,
  M02: Compass,
  M03: Layers,
  M04: Target,
  M05: Wrench,
  M06: Shield,
  M07: GraduationCap,
  M08: BookOpen,
  M09: BarChart3,
};

const MODULE_COLORS: Record<ModuleId, string> = {
  M01: brandColors.modules.M01,
  M02: brandColors.modules.M02,
  M03: brandColors.modules.M03,
  M04: brandColors.modules.M04,
  M05: brandColors.modules.M05,
  M06: brandColors.modules.M06,
  M07: brandColors.modules.M07,
  M08: brandColors.modules.M08,
  M09: brandColors.modules.M09,
};

const MODULE_PATHS: Record<ModuleId, string> = {
  M01: "/docs/core/01-foundations",
  M02: "/docs/core/02-governance",
  M03: "/docs/core/03-space",
  M04: "/docs/core/04-programs",
  M05: "/docs/core/05-tools",
  M06: "/docs/core/06-safety",
  M07: "/docs/core/07-people",
  M08: "/docs/core/08-operations",
  M09: "/docs/core/09-assessment",
};

// Module relationships for recommendations
const MODULE_RELATIONS: Record<ModuleId, ModuleId[]> = {
  M01: ["M03", "M04", "M07"],
  M02: ["M08", "M09"],
  M03: ["M01", "M05", "M06"],
  M04: ["M01", "M05", "M09"],
  M05: ["M03", "M04"],
  M06: ["M03", "M08"],
  M07: ["M01", "M04", "M09"],
  M08: ["M02", "M06"],
  M09: ["M04", "M07", "M02"],
};

// Known checklist IDs from the codebase
const KNOWN_CHECKLISTS = [
  { id: "safety-checklist", module: "M06" as ModuleId, totalItems: 16 },
  { id: "space-setup-checklist", module: "M03" as ModuleId, totalItems: 12 },
];

// ── Types ──────────────────────────────────────────────────

interface ModuleProgress {
  moduleId: ModuleId;
  checklistIds: string[];
  checkedCount: number;
  totalCount: number;
  percentage: number;
  lastActivity: number | null;
}

interface ActivityEntry {
  id: string;
  moduleId: ModuleId;
  checklistId: string;
  timestamp: number;
}

// ── Hooks ──────────────────────────────────────────────────

function useLocalStorageProgress() {
  const [moduleProgress, setModuleProgress] = useState<Map<ModuleId, ModuleProgress>>(new Map());
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const scanProgress = useCallback(() => {
    const progressMap = new Map<ModuleId, ModuleProgress>();
    const allActivities: ActivityEntry[] = [];

    // Initialize all modules
    for (const mid of MODULE_IDS) {
      progressMap.set(mid, {
        moduleId: mid,
        checklistIds: [],
        checkedCount: 0,
        totalCount: 0,
        percentage: 0,
        lastActivity: null,
      });
    }

    // Scan known checklists
    for (const cl of KNOWN_CHECKLISTS) {
      const raw = localStorage.getItem(`checklist-${cl.id}`);
      if (!raw) continue;

      try {
        const checked: string[] = JSON.parse(raw);
        const prog = progressMap.get(cl.module);
        if (prog) {
          prog.checklistIds.push(cl.id);
          prog.checkedCount += checked.length;
          prog.totalCount += cl.totalItems;
          prog.percentage = prog.totalCount > 0 ? (prog.checkedCount / prog.totalCount) * 100 : 0;
          if (checked.length > 0) {
            prog.lastActivity = Date.now(); // We don't track timestamps per-item, use now
          }
        }

        // Create activity entries
        for (const itemId of checked) {
          allActivities.push({
            id: `${cl.id}-${itemId}`,
            moduleId: cl.module,
            checklistId: cl.id,
            timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // approximate
          });
        }
      } catch {
        // skip corrupt entries
      }
    }

    // Also scan for any other checklist- keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("checklist-")) continue;
      const checklistId = key.replace("checklist-", "");

      // Skip known ones already processed
      if (KNOWN_CHECKLISTS.some((cl) => cl.id === checklistId)) continue;

      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const checked: string[] = JSON.parse(raw);
        if (checked.length === 0) continue;

        // Try to guess module from checklist ID
        const moduleGuess = checklistId.match(/m0[1-9]/i)?.[0]?.toUpperCase() as ModuleId | undefined;
        if (moduleGuess && progressMap.has(moduleGuess)) {
          const prog = progressMap.get(moduleGuess)!;
          prog.checklistIds.push(checklistId);
          prog.checkedCount += checked.length;
          prog.totalCount += checked.length; // unknown total, assume checked = total for discovered
          prog.percentage = prog.totalCount > 0 ? (prog.checkedCount / prog.totalCount) * 100 : 0;
          prog.lastActivity = Date.now();
        }
      } catch {
        // skip
      }
    }

    setModuleProgress(progressMap);
    setActivities(allActivities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot localStorage scan on mount; cannot lazy-init because scanProgress depends on stable callback identity for the storage listener
    scanProgress();

    // Listen for storage changes (from other tabs or InteractiveChecklist)
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("checklist-")) {
        scanProgress();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [scanProgress]);

  return { moduleProgress, activities, isLoaded, rescan: scanProgress };
}

// ── Animation Variants ─────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// ── SVG Progress Ring ──────────────────────────────────────

function ProgressRing({ percentage, color, size = 48 }: { percentage: number; color: string; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--glass-border)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}

// ── SVG Progress Bar ───────────────────────────────────────

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="w-full h-2 rounded-full bg-[var(--background)] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const params = useParams();
  const locale = params.locale as string;
  const { moduleProgress, activities, isLoaded } = useLocalStorageProgress();

  // ── Computed Stats ───────────────────────────────────────

  const stats = useMemo(() => {
    if (!isLoaded) return { explored: 0, completedChecklists: 0, totalChecked: 0, lastActive: null as string | null };

    let explored = 0;
    let completedChecklists = 0;
    let totalChecked = 0;
    let latestActivity: number | null = null;

    for (const prog of moduleProgress.values()) {
      if (prog.checkedCount > 0) explored++;
      if (prog.percentage >= 100) completedChecklists++;
      totalChecked += prog.checkedCount;
      if (prog.lastActivity && (!latestActivity || prog.lastActivity > latestActivity)) {
        latestActivity = prog.lastActivity;
      }
    }

    let lastActive: string | null = null;
    if (latestActivity) {
      // eslint-disable-next-line react-hooks/purity -- Date.now() needed for live "X days ago" labels; computed inside useMemo so still stable per render
      const diff = Date.now() - latestActivity;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) lastActive = t("recentActivity.today");
      else if (days === 1) lastActive = t("recentActivity.yesterday");
      else lastActive = t("recentActivity.daysAgo", { days });
    }

    return { explored, completedChecklists, totalChecked, lastActive };
  }, [isLoaded, moduleProgress, t]);

  // ── Recommendations ──────────────────────────────────────

  const recommendations = useMemo(() => {
    if (!isLoaded) return [];

    const completedModules = new Set<ModuleId>();
    const inProgressModules = new Set<ModuleId>();
    const notStartedModules = new Set<ModuleId>();

    for (const [mid, prog] of moduleProgress.entries()) {
      if (prog.percentage >= 100) completedModules.add(mid);
      else if (prog.checkedCount > 0) inProgressModules.add(mid);
      else notStartedModules.add(mid);
    }

    // If nothing started, recommend M01, M03, M06
    if (completedModules.size === 0 && inProgressModules.size === 0) {
      return (["M01", "M03", "M06"] as ModuleId[]).map((mid) => ({
        moduleId: mid,
        reason: "startHere" as const,
      }));
    }

    // Recommend in-progress modules first
    const recs: { moduleId: ModuleId; reason: "continueLearning" | "explore" }[] = [];

    for (const mid of inProgressModules) {
      if (recs.length < 3) {
        recs.push({ moduleId: mid, reason: "continueLearning" });
      }
    }

    // Then recommend related not-started modules
    for (const completedMid of completedModules) {
      for (const relatedMid of MODULE_RELATIONS[completedMid]) {
        if (notStartedModules.has(relatedMid) && !recs.some((r) => r.moduleId === relatedMid) && recs.length < 3) {
          recs.push({ moduleId: relatedMid, reason: "explore" });
        }
      }
    }

    // Fill remaining with lowest-progress not-started
    for (const mid of notStartedModules) {
      if (!recs.some((r) => r.moduleId === mid) && recs.length < 3) {
        recs.push({ moduleId: mid, reason: "explore" });
      }
    }

    return recs.slice(0, 3);
  }, [isLoaded, moduleProgress]);

  // ── Render ───────────────────────────────────────────────

  const overviewCards = [
    {
      key: "modulesExplored",
      value: `${stats.explored}/9`,
      icon: Sparkles,
      color: "var(--neon-cyan)",
    },
    {
      key: "checklistsCompleted",
      value: String(stats.completedChecklists),
      icon: CheckCircle2,
      color: "var(--neon-green)",
    },
    {
      key: "itemsChecked",
      value: String(stats.totalChecked),
      icon: TrendingUp,
      color: "var(--neon-violet)",
    },
    {
      key: "lastActive",
      value: stats.lastActive ?? "--",
      icon: Clock,
      color: "var(--neon-pink)",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
        {/* ── Header ─────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">{t("title")}</h1>
          <p className="text-[var(--muted-foreground)]">{t("description")}</p>
        </motion.div>

        {/* ── A. Overview Cards ───────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => (
            <motion.div
              key={card.key}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{card.value}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t(`overview.${card.key}`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── B. Module Progress Grid ────────────────── */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4">{t("moduleProgress.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULE_IDS.map((mid) => {
              const prog = moduleProgress.get(mid);
              const percentage = prog?.percentage ?? 0;
              const color = MODULE_COLORS[mid];
              const Icon = MODULE_ICONS[mid];
              const status =
                percentage >= 100
                  ? "completed"
                  : percentage > 0
                  ? "inProgress"
                  : "notStarted";

              return (
                <motion.div key={mid} variants={cardVariants} whileHover={{ scale: 1.01 }}>
                  <Link
                    href={`/${locale}${MODULE_PATHS[mid]}`}
                    className="block glass-card p-5 group transition-all hover:border-[color:var(--border)] hover:shadow-lg"
                    style={{
                      borderColor: percentage > 0 ? `${color}30` : undefined,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Progress Ring */}
                      <div className="relative flex-shrink-0">
                        <ProgressRing percentage={percentage} color={color} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${color}15`,
                              color,
                            }}
                          >
                            {mid}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              status === "completed"
                                ? "bg-[var(--neon-green)]/15 text-[var(--neon-green)]"
                                : status === "inProgress"
                                ? "bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]"
                                : "bg-[var(--muted)]/30 text-[var(--muted-foreground)]"
                            }`}
                          >
                            {t(`moduleProgress.${status}`)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm truncate">
                          {t(`modules.${mid}.name`)}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] truncate">
                          {t(`modules.${mid}.tagline`)}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <ProgressBar percentage={percentage} color={color} />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {prog?.checkedCount ?? 0}/{prog?.totalCount ?? 0}
                            </span>
                            <span className="text-xs font-medium" style={{ color }}>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover arrow */}
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                        {t("moduleProgress.viewModule")}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Bottom Row: Activity + Recommendations ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── C. Recent Activity ──────────────────── */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--neon-cyan)]" />
              {t("recentActivity.title")}
            </h2>
            {activities.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] py-8 text-center">
                {t("recentActivity.noActivity")}
              </p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 6).map((activity) => {
                  const Icon = MODULE_ICONS[activity.moduleId];
                  const color = MODULE_COLORS[activity.moduleId];
                  // eslint-disable-next-line react-hooks/purity -- live relative-time display
                  const diff = Date.now() - activity.timestamp;
                  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                  const timeLabel =
                    days === 0
                      ? t("recentActivity.today")
                      : days === 1
                      ? t("recentActivity.yesterday")
                      : t("recentActivity.daysAgo", { days });

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 py-2 border-b border-[var(--glass-border)] last:border-0"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          <span className="font-medium">{t(`modules.${activity.moduleId}.name`)}</span>
                          {" - "}
                          {t("recentActivity.checkedItem")}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">{activity.checklistId}</p>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)] flex-shrink-0">{timeLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── D. Recommended Next Steps ───────────── */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--neon-violet)]" />
              {t("recommendations.title")}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              {t("recommendations.description")}
            </p>
            <div className="space-y-3">
              {recommendations.map((rec) => {
                const Icon = MODULE_ICONS[rec.moduleId];
                const color = MODULE_COLORS[rec.moduleId];
                const prog = moduleProgress.get(rec.moduleId);

                return (
                  <Link
                    key={rec.moduleId}
                    href={`/${locale}${MODULE_PATHS[rec.moduleId]}`}
                    className="flex items-center gap-4 p-3 rounded-xl border border-[var(--glass-border)] hover:border-[color:var(--neon-cyan)] transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono" style={{ color }}>
                          {rec.moduleId}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            rec.reason === "startHere"
                              ? "bg-[var(--neon-green)]/15 text-[var(--neon-green)]"
                              : rec.reason === "continueLearning"
                              ? "bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]"
                              : "bg-[var(--neon-violet)]/15 text-[var(--neon-violet)]"
                          }`}
                        >
                          {t(`recommendations.${rec.reason}`)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm">{t(`modules.${rec.moduleId}.name`)}</h3>
                      {prog && prog.checkedCount > 0 && (
                        <div className="mt-1">
                          <ProgressBar percentage={prog.percentage} color={color} />
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--neon-cyan)] transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
