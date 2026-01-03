"use client";

import { motion } from "framer-motion";
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
  Quote,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface ModuleSummaryProps {
  moduleId: string;
  tagline: string;
  philosophy: string;
  summary?: string;
  insights: string[];
  className?: string;
}

const moduleConfig: Record<string, { icon: LucideIcon; color: string; gradient: string }> = {
  M01: {
    icon: Lightbulb,
    color: "var(--neon-yellow)",
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
  },
  M02: {
    icon: Network,
    color: "var(--neon-violet)",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  M03: {
    icon: Building2,
    color: "var(--neon-cyan)",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  M04: {
    icon: BookOpen,
    color: "var(--neon-green)",
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
  },
  M05: {
    icon: Wrench,
    color: "var(--neon-orange)",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
  },
  M06: {
    icon: ShieldCheck,
    color: "var(--neon-red)",
    gradient: "from-red-500/20 via-rose-500/10 to-transparent",
  },
  M07: {
    icon: Users,
    color: "var(--neon-pink)",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
  },
  M08: {
    icon: ClipboardList,
    color: "var(--neon-blue)",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  M09: {
    icon: BarChart3,
    color: "var(--neon-teal)",
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
  },
};

export function ModuleSummary({
  moduleId,
  tagline,
  philosophy,
  summary,
  insights,
  className = "",
}: ModuleSummaryProps) {
  const config = moduleConfig[moduleId] || moduleConfig.M01;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border-2 mb-8 ${className}`}
      style={{
        borderColor: config.color,
        background: "var(--glass-bg)",
      }}
    >
      {/* 渐变背景装饰 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`}
      />

      {/* 顶部装饰线 */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: config.color }}
      />

      {/* 装饰性圆形 */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10"
        style={{ background: config.color }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-5"
        style={{ background: config.color }}
      />

      <div className="relative z-10 p-6 md:p-8">
        {/* 头部区域 */}
        <div className="flex items-start gap-4 mb-6">
          {/* 图标 */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
              border: `2px solid ${config.color}40`,
            }}
          >
            <Icon className="w-8 h-8" style={{ color: config.color }} />
          </motion.div>

          {/* 标题区域 */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-sm font-mono font-bold tracking-wider"
                style={{ color: config.color }}
              >
                {moduleId}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-border)] text-[var(--muted-foreground)]">
                摘要
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)]">
              {tagline}
            </h2>
          </div>
        </div>

        {/* 哲学理念引用 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-6 pl-6 py-4"
        >
          <Quote
            className="absolute left-0 top-3 w-5 h-5 opacity-50"
            style={{ color: config.color }}
          />
          <p className="text-base md:text-lg italic text-[var(--muted-foreground)] leading-relaxed">
            {philosophy}
          </p>
        </motion.div>

        {/* 总结段落 */}
        {summary && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm md:text-base text-[var(--foreground)] leading-relaxed mb-6"
          >
            {summary}
          </motion.p>
        )}

        {/* 核心洞见 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: config.color }} />
            <span className="text-sm font-semibold" style={{ color: config.color }}>
              核心洞见
            </span>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {insights.map((insight, index) => {
              // 提取标签（冒号前的部分）
              const colonIndex = insight.indexOf("：");
              const hasTag = colonIndex > 0 && colonIndex < 20;
              const tag = hasTag ? insight.substring(0, colonIndex) : null;
              const content = hasTag ? insight.substring(colonIndex + 1) : insight;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-3 rounded-lg bg-[var(--background)]/50 border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors"
                >
                  {tag && (
                    <span
                      className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mb-1.5"
                      style={{
                        background: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      {tag}
                    </span>
                  )}
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">
                    {content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
