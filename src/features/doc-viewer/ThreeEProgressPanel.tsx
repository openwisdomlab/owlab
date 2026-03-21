"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { RotateCcw, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useLearningProgressStore,
  DECK_MODULES,
  ALL_MODULES,
  type Dimension,
  type ModuleId,
} from "@/stores/learning-progress-store";

// 3E dimension config: colors aligned with existing brand system
const DIMENSION_CONFIG: Record<
  Dimension,
  {
    colorVar: string;
    hex: string;
    hexRgb: string;
    gradient: string;
  }
> = {
  enlighten: {
    colorVar: "var(--neon-amber)",
    hex: "#F59E0B",
    hexRgb: "245, 158, 11",
    gradient: "from-amber-500 to-yellow-400",
  },
  empower: {
    colorVar: "var(--neon-cyan)",
    hex: "#00D9FF",
    hexRgb: "0, 217, 255",
    gradient: "from-cyan-500 to-blue-400",
  },
  engage: {
    colorVar: "var(--neon-green)",
    hex: "#10B981",
    hexRgb: "16, 185, 129",
    gradient: "from-emerald-500 to-green-400",
  },
};

const DIMENSIONS: Dimension[] = ["enlighten", "empower", "engage"];

// Module names mapping
const MODULE_NAMES: Record<ModuleId, { zh: string; en: string }> = {
  M01: { zh: "理念与理论", en: "Philosophy" },
  M02: { zh: "治理与网络", en: "Governance" },
  M03: { zh: "空间与环境", en: "Space" },
  M04: { zh: "课程与项目", en: "Programs" },
  M05: { zh: "工具与资产", en: "Tools" },
  M06: { zh: "安全与伦理", en: "Safety" },
  M07: { zh: "人员与能力", en: "People" },
  M08: { zh: "运营管理", en: "Operations" },
  M09: { zh: "评估与影响", en: "Assessment" },
};

interface ThreeEProgressPanelProps {
  className?: string;
  compact?: boolean;
  locale?: string;
}

// SVG Radar chart component
function RadarChart({
  data,
  size = 200,
}: {
  data: Record<Dimension, number>;
  size?: number;
}) {
  const center = size / 2;
  const maxRadius = size / 2 - 24;
  const angleOffset = -Math.PI / 2; // Start from top

  // Calculate point positions for each dimension
  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 3 + angleOffset;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100];

  // Data points
  const points = DIMENSIONS.map((dim, i) => getPoint(i, data[dim]));
  const pathD =
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  // Axis endpoints (100%)
  const axisPoints = DIMENSIONS.map((_, i) => getPoint(i, 100));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
      role="img"
      aria-label="3E Progress Radar Chart"
    >
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={DIMENSION_CONFIG.enlighten.hex} stopOpacity="0.3" />
          <stop offset="50%" stopColor={DIMENSION_CONFIG.empower.hex} stopOpacity="0.3" />
          <stop offset="100%" stopColor={DIMENSION_CONFIG.engage.hex} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={DIMENSION_CONFIG.enlighten.hex} />
          <stop offset="50%" stopColor={DIMENSION_CONFIG.empower.hex} />
          <stop offset="100%" stopColor={DIMENSION_CONFIG.engage.hex} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid circles */}
      {gridLevels.map((level) => {
        const gridPoints = DIMENSIONS.map((_, i) => getPoint(i, level));
        const gridPath =
          gridPoints
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ") + " Z";
        return (
          <path
            key={level}
            d={gridPath}
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth={level === 100 ? 1.5 : 0.5}
            opacity={0.6}
          />
        );
      })}

      {/* Axis lines */}
      {axisPoints.map((point, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={point.x}
          y2={point.y}
          stroke="var(--glass-border)"
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}

      {/* Data area */}
      <motion.path
        d={pathD}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth={2}
        filter="url(#glow)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {points.map((point, i) => {
        const dim = DIMENSIONS[i];
        const config = DIMENSION_CONFIG[dim];
        return (
          <motion.circle
            key={dim}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={config.hex}
            stroke="var(--background)"
            strokeWidth={2}
            filter="url(#glow)"
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 1, r: 4 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          />
        );
      })}

      {/* Axis labels */}
      {axisPoints.map((point, i) => {
        const dim = DIMENSIONS[i];
        const config = DIMENSION_CONFIG[dim];
        // Push labels further out from the axis endpoint
        const labelOffset = 16;
        const angle = (i * 2 * Math.PI) / 3 + (-Math.PI / 2);
        const lx = point.x + labelOffset * Math.cos(angle);
        const ly = point.y + labelOffset * Math.sin(angle);
        return (
          <text
            key={dim}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={config.hex}
            fontSize={11}
            fontWeight={600}
            className="select-none"
          >
            {data[dim]}%
          </text>
        );
      })}
    </svg>
  );
}

// Dimension progress bar
function DimensionBar({
  dimension,
  progress,
  label,
}: {
  dimension: Dimension;
  progress: number;
  label: string;
}) {
  const config = DIMENSION_CONFIG[dimension];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium" style={{ color: config.hex }}>
          {label}
        </span>
        <span className="text-[var(--muted-foreground)]">{progress}%</span>
      </div>
      <div className="h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Module mini badge
function ModuleBadge({
  moduleId,
  progress,
  locale,
}: {
  moduleId: ModuleId;
  progress: number;
  locale: string;
}) {
  const name = MODULE_NAMES[moduleId];
  const label = locale === "zh" ? name.zh : name.en;
  const opacity = progress > 0 ? 1 : 0.4;

  return (
    <div
      className="flex items-center gap-1.5 text-xs group"
      style={{ opacity }}
      title={`${moduleId}: ${label} - ${progress}%`}
    >
      <div className="relative w-6 h-6 rounded-md bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center overflow-hidden">
        {/* Fill indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--neon-cyan)] to-transparent opacity-30"
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        <span className="relative text-[10px] font-mono font-bold text-[var(--muted-foreground)]">
          {moduleId.replace("M0", "")}
        </span>
      </div>
      <span className="hidden sm:inline text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors truncate max-w-[80px]">
        {label}
      </span>
    </div>
  );
}

export function ThreeEProgressPanel({
  className = "",
  compact = false,
  locale = "zh",
}: ThreeEProgressPanelProps) {
  const t = useTranslations("threeE");
  const store = useLearningProgressStore();

  // Sync with any existing checklist data on mount
  useEffect(() => {
    for (const mod of ALL_MODULES) {
      const key = `checklist-${mod.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const items = JSON.parse(saved) as string[];
          // Estimate total items as 10 per module (reasonable default)
          const estimatedTotal = 10;
          store.importChecklistProgress(
            mod.toLowerCase(),
            items.length,
            estimatedTotal
          );
        } catch {
          // Skip invalid data
        }
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const radarData = useMemo(() => store.getRadarData(), [store]);
  const overallProgress = useMemo(() => store.getOverallProgress(), [store]);

  if (compact) {
    return (
      <div
        className={`bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] p-3 ${className}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp
            className="w-4 h-4"
            style={{ color: "var(--neon-cyan)" }}
          />
          <span className="text-sm font-medium">{t("title")}</span>
          <span className="ml-auto text-xs text-[var(--muted-foreground)]">
            {overallProgress}%
          </span>
        </div>
        <div className="space-y-1.5">
          {DIMENSIONS.map((dim) => (
            <DimensionBar
              key={dim}
              dimension={dim}
              progress={radarData[dim]}
              label={t(`dimensions.${dim}`)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp
              className="w-5 h-5"
              style={{ color: "var(--neon-cyan)" }}
            />
            <h3 className="font-semibold text-sm">{t("title")}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)]">
              {t("overall")}: {overallProgress}%
            </span>
            <button
              onClick={() => store.resetProgress()}
              className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-[var(--muted-foreground)] hover:text-red-400"
              title={t("reset")}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-4">
        <div className="w-full max-w-[220px] mx-auto aspect-square">
          <RadarChart data={radarData} size={220} />
        </div>
      </div>

      {/* Dimension bars */}
      <div className="px-4 pb-3 space-y-2">
        {DIMENSIONS.map((dim) => (
          <DimensionBar
            key={dim}
            dimension={dim}
            progress={radarData[dim]}
            label={t(`dimensions.${dim}`)}
          />
        ))}
      </div>

      {/* Module breakdown by deck */}
      <div className="px-4 pb-4">
        <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium">
          {t("modules")}
        </div>
        <div className="space-y-2">
          {DIMENSIONS.map((dim) => (
            <div key={dim} className="flex flex-wrap gap-2">
              {DECK_MODULES[dim].map((moduleId) => (
                <ModuleBadge
                  key={moduleId}
                  moduleId={moduleId}
                  progress={store.getModuleTotalProgress(moduleId)}
                  locale={locale}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Demo controls -- for testing, remove in production */}
      <div className="px-4 pb-4 border-t border-[var(--glass-border)] pt-3">
        <div className="text-xs text-[var(--muted-foreground)] mb-2">
          {t("demo")}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_MODULES.map((mod) => (
            <button
              key={mod}
              onClick={() => {
                const dim = Object.entries(DECK_MODULES).find(([, mods]) =>
                  mods.includes(mod)
                )?.[0] as Dimension;
                if (dim) store.markProgress(mod, dim, 15);
              }}
              className="px-2 py-1 text-[10px] font-mono rounded bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
            >
              +{mod}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
