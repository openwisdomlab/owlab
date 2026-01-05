"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import {
  BookOpen,
  Compass,
  GraduationCap,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
  FileText,
  Users,
  Sparkles,
  Layers,
  BookMarked,
  Zap,
  Target,
  Rocket,
  GitBranch,
  Layout,
  Lightbulb,
  Wand2,
  Calculator,
  Cpu,
  ChevronRight,
  Bird,
  Gamepad2,
  Swords,
  ScrollText,
  Flower2,
  Brain,
  ChevronDown,
} from "lucide-react";
import { useParams } from "next/navigation";
import Script from "next/script";
import { ModuleCards } from "@/features/doc-viewer/ModuleCards";
import { LearningSpaceTagline } from "@/components/ui/LearningSpaceTagline";
import { EnhancedHero } from "@/components/brand/EnhancedHero";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const floatVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// 阅读路径配置
const readingPaths = [
  {
    id: "new-node",
    icon: Compass,
    color: "var(--neon-cyan)",
    modules: ["M01", "M06", "M02", "M03", "M05", "M07", "M04", "M08"],
    recommended: true,
  },
  {
    id: "curriculum",
    icon: GraduationCap,
    color: "var(--neon-violet)",
    modules: ["M01", "M04", "M07", "M09"],
    recommended: false,
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    color: "var(--neon-green)",
    modules: ["M06", "M02", "M05", "M08"],
    recommended: false,
  },
];

// 三层架构配置
const architectureLayers = [
  {
    id: "core",
    icon: Target,
    color: "var(--neon-cyan)",
    badge: "Core",
  },
  {
    id: "extend",
    icon: Layers,
    color: "var(--neon-violet)",
    badge: "Extend",
  },
  {
    id: "evidence",
    icon: BookMarked,
    color: "var(--neon-green)",
    badge: "Evidence",
  },
];

// 快速开始步骤
const quickStartSteps = [
  { id: "step1", icon: Compass, color: "var(--neon-cyan)" },
  { id: "step2", icon: BookOpen, color: "var(--neon-violet)" },
  { id: "step3", icon: Rocket, color: "var(--neon-green)" },
];

// Seeded random function for deterministic particle positions (avoids hydration mismatch)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Round to fixed precision to avoid hydration mismatch from floating-point differences
const round2 = (n: number) => Math.round(n * 100) / 100;

// Pre-computed particle data for consistent SSR/client rendering
// Round to 2 decimal places to avoid hydration mismatch from floating-point precision differences
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: Math.round(seededRandom(i * 3) * 10000) / 100,
  top: Math.round(seededRandom(i * 3 + 1) * 10000) / 100,
  opacity: Math.round((seededRandom(i * 3 + 2) * 0.5 + 0.2) * 100) / 100,
  duration: Math.round((seededRandom(i * 3 + 3) * 5 + 5) * 100) / 100,
  delay: Math.round(seededRandom(i * 3 + 4) * 500) / 100,
}));

export default function HomePage() {
  const t = useTranslations("home");
  const params = useParams();
  const locale = params.locale as string;

  // State for expandable core principles
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const togglePrinciples = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OWL 开放智慧实验室建设与运营标准手册",
    description: "开放式学习空间的模块化知识库，涵盖理念、治理、空间、课程、工具、安全、人员、运营和评价九大核心模块",
    url: "https://owl.openwisdomlab.org",
  };

  return (
    <div className="relative">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section - Enhanced OWL Visual Identity */}
      <EnhancedHero locale={locale} t={t} />



      {/* 前沿理念模块 Section - 独立展示 */}
      <section className="py-14 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              {t("livingModules.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{t("livingModules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("livingModules.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-5 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* L01 空间的塑造 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/01-space-as-educator`}>
                <div className="glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-[var(--neon-cyan)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-cyan)]">
                            {t("livingModules.modules.spaceAsEducator.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.spaceAsEducator.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.spaceAsEducator.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.spaceAsEducator.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                      {t("livingModules.modules.spaceAsEducator.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                      {t("livingModules.modules.spaceAsEducator.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L01")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-cyan)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-cyan)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L01" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L01" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L01 */}
              <AnimatePresence>
                {expandedModule === "L01" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 以学生为中心 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="8" fill="var(--neon-cyan)" opacity="0.8" />
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                  const rad = (angle * Math.PI) / 180;
                                  const x1 = round2(50 + Math.cos(rad) * 12);
                                  const y1 = round2(50 + Math.sin(rad) * 12);
                                  const x2 = round2(50 + Math.cos(rad) * 35);
                                  const y2 = round2(50 + Math.sin(rad) * 35);
                                  return (
                                    <line
                                      key={i}
                                      x1={x1}
                                      y1={y1}
                                      x2={x2}
                                      y2={y2}
                                      stroke="var(--neon-cyan)"
                                      strokeWidth="1.5"
                                      opacity="0.4"
                                    />
                                  );
                                })}
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                  const rad = (angle * Math.PI) / 180;
                                  const cx = round2(50 + Math.cos(rad) * 35);
                                  const cy = round2(50 + Math.sin(rad) * 35);
                                  return (
                                    <circle
                                      key={i}
                                      cx={cx}
                                      cy={cy}
                                      r="4"
                                      fill="var(--neon-cyan)"
                                      opacity="0.5"
                                    />
                                  );
                                })}
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                以学生为中心
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                开放自由的氛围，没有标准答案
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 鼓励大胆探索 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M 20 80 Q 30 60, 40 55 T 60 45 T 75 25"
                                  stroke="var(--neon-green)"
                                  strokeWidth="2"
                                  fill="none"
                                  opacity="0.4"
                                  strokeDasharray="4,4"
                                />
                                {[
                                  { cx: 20, cy: 80, r: 3 },
                                  { cx: 35, cy: 62, r: 3.5 },
                                  { cx: 50, cy: 50, r: 4 },
                                  { cx: 65, cy: 38, r: 4.5 },
                                  { cx: 75, cy: 25, r: 5 }
                                ].map((circle, i) => (
                                  <circle
                                    key={i}
                                    cx={circle.cx}
                                    cy={circle.cy}
                                    r={circle.r}
                                    fill="var(--neon-green)"
                                    opacity={0.3 + i * 0.15}
                                  />
                                ))}
                                <path
                                  d="M 75 25 L 70 30 M 75 25 L 80 30"
                                  stroke="var(--neon-green)"
                                  strokeWidth="2"
                                  fill="none"
                                  opacity="0.6"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Rocket className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                鼓励大胆探索
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                允许犯错，包容失败
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 科技感与未来感 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.4">
                                  <line x1="20" y1="30" x2="80" y2="30" stroke="var(--neon-violet)" strokeWidth="1.5" />
                                  <line x1="20" y1="50" x2="80" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" />
                                  <line x1="20" y1="70" x2="80" y2="70" stroke="var(--neon-violet)" strokeWidth="1.5" />
                                  <line x1="30" y1="20" x2="30" y2="80" stroke="var(--neon-violet)" strokeWidth="1.5" />
                                  <line x1="50" y1="20" x2="50" y2="80" stroke="var(--neon-violet)" strokeWidth="1.5" />
                                  <line x1="70" y1="20" x2="70" y2="80" stroke="var(--neon-violet)" strokeWidth="1.5" />
                                </g>
                                {[
                                  { cx: 30, cy: 30 }, { cx: 50, cy: 30 }, { cx: 70, cy: 30 },
                                  { cx: 30, cy: 50 }, { cx: 50, cy: 50 }, { cx: 70, cy: 50 },
                                  { cx: 30, cy: 70 }, { cx: 50, cy: 70 }, { cx: 70, cy: 70 }
                                ].map((node, i) => (
                                  <circle
                                    key={i}
                                    cx={node.cx}
                                    cy={node.cy}
                                    r="3"
                                    fill="var(--neon-violet)"
                                    opacity={0.5 + (i % 3) * 0.15}
                                  />
                                ))}
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                科技感与未来感
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                点燃技术好奇心
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: 灵活流动的空间 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M 10 30 Q 30 20, 50 30 T 90 30"
                                  stroke="var(--neon-pink)"
                                  strokeWidth="2"
                                  fill="none"
                                  opacity="0.5"
                                />
                                <path
                                  d="M 10 50 Q 30 40, 50 50 T 90 50"
                                  stroke="var(--neon-pink)"
                                  strokeWidth="2.5"
                                  fill="none"
                                  opacity="0.6"
                                />
                                <path
                                  d="M 10 70 Q 30 60, 50 70 T 90 70"
                                  stroke="var(--neon-pink)"
                                  strokeWidth="2"
                                  fill="none"
                                  opacity="0.5"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GitBranch className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                灵活流动的空间
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                灵活、流动和多样化
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* L02 思维的延伸 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/02-extended-mind`}>
                <div className="glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6 text-[var(--neon-violet)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-violet)]">
                            {t("livingModules.modules.extendedMind.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.extendedMind.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.extendedMind.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.extendedMind.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]">
                      {t("livingModules.modules.extendedMind.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]">
                      {t("livingModules.modules.extendedMind.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L02")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-violet)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-violet)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L02" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L02" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L02 */}
              <AnimatePresence>
                {expandedModule === "L02" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 工具即思维 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Brain circle */}
                                <circle cx="35" cy="50" r="15" fill="none" stroke="var(--neon-violet)" strokeWidth="2" opacity="0.5" />
                                {/* Tool/Wrench */}
                                <rect x="55" y="35" width="25" height="8" rx="2" fill="var(--neon-violet)" opacity="0.4" />
                                <rect x="60" y="43" width="5" height="20" rx="1" fill="var(--neon-violet)" opacity="0.4" />
                                {/* Connection lines */}
                                <line x1="50" y1="50" x2="60" y2="45" stroke="var(--neon-violet)" strokeWidth="2" opacity="0.6" strokeDasharray="2,2" />
                                <line x1="45" y1="45" x2="62" y2="40" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                工具即思维
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                AI 和设备是认知系统的延伸部分
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 预测-验证循环 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Circular arrow */}
                                <path
                                  d="M 70 30 A 25 25 0 1 1 30 30"
                                  stroke="var(--neon-cyan)"
                                  strokeWidth="3"
                                  fill="none"
                                  opacity="0.6"
                                />
                                {/* Arrow head */}
                                <path d="M 28 30 L 32 25 L 36 30" fill="var(--neon-cyan)" opacity="0.6" />
                                {/* Bottom arc */}
                                <path
                                  d="M 30 70 A 25 25 0 1 1 70 70"
                                  stroke="var(--neon-cyan)"
                                  strokeWidth="3"
                                  fill="none"
                                  opacity="0.6"
                                />
                                {/* Arrow head bottom */}
                                <path d="M 72 70 L 68 75 L 64 70" fill="var(--neon-cyan)" opacity="0.6" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Target className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                预测-验证循环
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                用原型测试假设，失败即学习
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 身体锚定思维 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Hand silhouette */}
                                <path
                                  d="M 35 65 L 35 45 L 40 40 L 45 45 L 45 35 L 50 30 L 55 35 L 55 40 L 60 35 L 65 40 L 65 60 Q 65 70, 50 70 Q 35 70, 35 65"
                                  fill="var(--neon-pink)"
                                  opacity="0.3"
                                />
                                {/* Brain connection */}
                                <circle cx="50" cy="25" r="8" fill="var(--neon-pink)" opacity="0.5" />
                                <line x1="50" y1="33" x2="50" y2="42" stroke="var(--neon-pink)" strokeWidth="2" opacity="0.6" strokeDasharray="2,2" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Wand2 className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                身体锚定思维
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                抽象概念需要触觉和动作支撑
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: 人机协作智能 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Human node */}
                                <circle cx="35" cy="50" r="12" fill="none" stroke="var(--neon-green)" strokeWidth="2" opacity="0.5" />
                                {/* AI node */}
                                <rect x="53" y="38" width="24" height="24" rx="3" fill="none" stroke="var(--neon-green)" strokeWidth="2" opacity="0.5" />
                                {/* Connection */}
                                <line x1="47" y1="50" x2="53" y2="50" stroke="var(--neon-green)" strokeWidth="3" opacity="0.7" />
                                {/* Network nodes */}
                                <circle cx="35" cy="30" r="3" fill="var(--neon-green)" opacity="0.4" />
                                <circle cx="65" cy="30" r="3" fill="var(--neon-green)" opacity="0.4" />
                                <circle cx="35" cy="70" r="3" fill="var(--neon-green)" opacity="0.4" />
                                <circle cx="65" cy="70" r="3" fill="var(--neon-green)" opacity="0.4" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                人机协作智能
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                与 AI 共同思考，而非被替代
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* L03 涌现的智慧 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/03-emergent-wisdom`}>
                <div className="glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-[var(--neon-green)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-green)]">
                            {t("livingModules.modules.emergentWisdom.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.emergentWisdom.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.emergentWisdom.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.emergentWisdom.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-green)]/10 text-[var(--neon-green)]">
                      {t("livingModules.modules.emergentWisdom.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-green)]/10 text-[var(--neon-green)]">
                      {t("livingModules.modules.emergentWisdom.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L03")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-green)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-green)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L03" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L03" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L03 */}
              <AnimatePresence>
                {expandedModule === "L03" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 对话即智能 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Speech bubbles */}
                                <path
                                  d="M 25 35 Q 25 25, 35 25 L 50 25 Q 60 25, 60 35 L 60 45 Q 60 55, 50 55 L 40 55 L 35 60 L 35 55 L 35 55 Q 25 55, 25 45 Z"
                                  fill="none"
                                  stroke="var(--neon-green)"
                                  strokeWidth="2"
                                  opacity="0.5"
                                />
                                <path
                                  d="M 40 45 Q 40 35, 50 35 L 65 35 Q 75 35, 75 45 L 75 55 Q 75 65, 65 65 L 55 65 L 50 70 L 50 65 L 50 65 Q 40 65, 40 55 Z"
                                  fill="none"
                                  stroke="var(--neon-green)"
                                  strokeWidth="2"
                                  opacity="0.5"
                                />
                                {/* Intersection highlight */}
                                <circle cx="50" cy="45" r="6" fill="var(--neon-green)" opacity="0.3" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                对话即智能
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                思想在交流中变得更强大
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 边缘参与路径 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Concentric circles representing periphery to core */}
                                <circle cx="50" cy="50" r="35" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.5" opacity="0.2" />
                                <circle cx="50" cy="50" r="25" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" opacity="0.4" />
                                <circle cx="50" cy="50" r="15" fill="none" stroke="var(--neon-cyan)" strokeWidth="2.5" opacity="0.6" />
                                <circle cx="50" cy="50" r="6" fill="var(--neon-cyan)" opacity="0.8" />
                                {/* Arrow path from edge to center */}
                                <path d="M 85 50 L 60 50" stroke="var(--neon-cyan)" strokeWidth="2" opacity="0.6" markerEnd="url(#arrowhead)" />
                                <defs>
                                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                                    <polygon points="0 0, 10 3, 0 6" fill="var(--neon-cyan)" opacity="0.6" />
                                  </marker>
                                </defs>
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Compass className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                边缘参与路径
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                从观察者到贡献者的成长阶梯
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 知识自组织 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Network nodes */}
                                {[
                                  { cx: 50, cy: 30 },
                                  { cx: 30, cy: 50 },
                                  { cx: 70, cy: 50 },
                                  { cx: 40, cy: 70 },
                                  { cx: 60, cy: 70 }
                                ].map((node, i) => (
                                  <circle
                                    key={i}
                                    cx={node.cx}
                                    cy={node.cy}
                                    r="5"
                                    fill="var(--neon-violet)"
                                    opacity={0.6}
                                  />
                                ))}
                                {/* Connections */}
                                <line x1="50" y1="30" x2="30" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                                <line x1="50" y1="30" x2="70" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                                <line x1="30" y1="50" x2="40" y2="70" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                                <line x1="70" y1="50" x2="60" y2="70" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                                <line x1="40" y1="70" x2="60" y2="70" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                                <line x1="30" y1="50" x2="70" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GitBranch className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                知识自组织
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                分享-迭代-精炼的循环产生集体智慧
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: AI 辅助协作 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* AI center node */}
                                <rect x="40" y="40" width="20" height="20" rx="3" fill="var(--neon-pink)" opacity="0.5" />
                                {/* Human nodes around */}
                                {[0, 90, 180, 270].map((angle, i) => {
                                  const rad = (angle * Math.PI) / 180;
                                  const cx = round2(50 + Math.cos(rad) * 30);
                                  const cy = round2(50 + Math.sin(rad) * 30);
                                  return (
                                    <g key={i}>
                                      <circle cx={cx} cy={cy} r="6" fill="var(--neon-pink)" opacity="0.4" />
                                      <line x1="50" y1="50" x2={cx} y2={cy} stroke="var(--neon-pink)" strokeWidth="1.5" opacity="0.5" />
                                    </g>
                                  );
                                })}
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                AI 辅助协作
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                技术降低协作门槛，放大集体智能
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* L04 持续的进化 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/04-poetics-of-technology`}>
                <div className="glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-pink)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-[var(--neon-pink)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-pink)]">
                            {t("livingModules.modules.poeticsOfTechnology.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.poeticsOfTechnology.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.poeticsOfTechnology.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.poeticsOfTechnology.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]">
                      {t("livingModules.modules.poeticsOfTechnology.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]">
                      {t("livingModules.modules.poeticsOfTechnology.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L04")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-pink)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-pink)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L04" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L04" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L04 */}
              <AnimatePresence>
                {expandedModule === "L04" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 挑战即成长 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Mountain/stairs ascending */}
                                <path d="M 20 80 L 20 70 L 35 70 L 35 55 L 50 55 L 50 40 L 65 40 L 65 25 L 80 25" stroke="var(--neon-pink)" strokeWidth="3" fill="none" opacity="0.6" />
                                {/* Steps */}
                                <rect x="20" y="70" width="15" height="10" fill="var(--neon-pink)" opacity="0.2" />
                                <rect x="35" y="55" width="15" height="15" fill="var(--neon-pink)" opacity="0.3" />
                                <rect x="50" y="40" width="15" height="15" fill="var(--neon-pink)" opacity="0.4" />
                                <rect x="65" y="25" width="15" height="15" fill="var(--neon-pink)" opacity="0.5" />
                                {/* Summit flag */}
                                <path d="M 80 25 L 80 15 L 90 20 L 80 25" fill="var(--neon-pink)" opacity="0.6" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Target className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                挑战即成长
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                困难是能力扩展的信号
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 失败即反馈 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* X transforming to checkmark */}
                                <g opacity="0.3">
                                  <line x1="30" y1="30" x2="45" y2="45" stroke="var(--neon-green)" strokeWidth="3" />
                                  <line x1="45" y1="30" x2="30" y2="45" stroke="var(--neon-green)" strokeWidth="3" />
                                </g>
                                {/* Arrow */}
                                <path d="M 48 37 L 58 37" stroke="var(--neon-green)" strokeWidth="2" opacity="0.5" markerEnd="url(#arrow-green)" />
                                <defs>
                                  <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
                                    <polygon points="0 0, 8 2, 0 4" fill="var(--neon-green)" opacity="0.5" />
                                  </marker>
                                </defs>
                                {/* Checkmark */}
                                <path d="M 60 32 L 66 40 L 78 25" stroke="var(--neon-green)" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Lightbulb className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                失败即反馈
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                错误提供更新认知模型的数据
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 战略性生成 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Central point */}
                                <circle cx="50" cy="50" r="6" fill="var(--neon-cyan)" opacity="0.7" />
                                {/* Diverging paths */}
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                  const rad = (angle * Math.PI) / 180;
                                  const x = round2(50 + Math.cos(rad) * 35);
                                  const y = round2(50 + Math.sin(rad) * 35);
                                  return (
                                    <g key={i}>
                                      <line x1="50" y1="50" x2={x} y2={y} stroke="var(--neon-cyan)" strokeWidth="2" opacity="0.4" />
                                      <circle cx={x} cy={y} r="4" fill="var(--neon-cyan)" opacity="0.5" />
                                    </g>
                                  );
                                })}
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GitBranch className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                战略性生成
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                主动创造解决方法而非套用公式
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: 元认知循环 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                {/* Spiral loop */}
                                <path
                                  d="M 50 20 Q 70 25, 75 45 Q 80 65, 60 75 Q 40 85, 25 65 Q 10 45, 30 30 Q 45 20, 55 30"
                                  stroke="var(--neon-violet)"
                                  strokeWidth="2.5"
                                  fill="none"
                                  opacity="0.6"
                                />
                                {/* Arrow at end */}
                                <path d="M 55 30 L 52 25 M 55 30 L 60 28" stroke="var(--neon-violet)" strokeWidth="2" opacity="0.6" />
                                {/* Nodes along spiral */}
                                <circle cx="50" cy="20" r="3" fill="var(--neon-violet)" opacity="0.5" />
                                <circle cx="75" cy="45" r="3" fill="var(--neon-violet)" opacity="0.5" />
                                <circle cx="60" cy="75" r="3" fill="var(--neon-violet)" opacity="0.5" />
                                <circle cx="25" cy="65" r="3" fill="var(--neon-violet)" opacity="0.5" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                元认知循环
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                觉察-规划-监控-调整的持续迭代
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/research`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookMarked className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("livingModules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 五大核心价值 Section */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)]">OWL 核心价值</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-sm">
              构建创新学习空间的五大支柱
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              {
                label: '开放',
                en: 'Open',
                color: '#9A6A8A',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                    <circle cx="40" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="40" cy="40" r="6" fill="currentColor" />
                    <line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" strokeWidth="2" />
                    <line x1="40" y1="58" x2="40" y2="70" stroke="currentColor" strokeWidth="2" />
                    <line x1="10" y1="40" x2="22" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="58" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                desc: '开放式创新，拥抱多元视角'
              },
              {
                label: '交叉',
                en: 'Cross',
                color: '#6A809A',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <circle cx="55" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <circle cx="40" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <circle cx="40" cy="35" r="5" fill="currentColor" opacity="0.8" />
                  </svg>
                ),
                desc: '跨学科融合，突破边界思考'
              },
              {
                label: '连接',
                en: 'Connect',
                color: '#7A8490',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="20" cy="40" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="60" cy="40" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="40" cy="20" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="40" cy="60" r="8" fill="currentColor" opacity="0.8" />
                    <line x1="28" y1="40" x2="52" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="40" y1="28" x2="40" y2="52" stroke="currentColor" strokeWidth="2" />
                    <line x1="26" y1="34" x2="34" y2="26" stroke="currentColor" strokeWidth="2" />
                    <line x1="46" y1="26" x2="54" y2="34" stroke="currentColor" strokeWidth="2" />
                    <line x1="26" y1="46" x2="34" y2="54" stroke="currentColor" strokeWidth="2" />
                    <line x1="46" y1="54" x2="54" y2="46" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                desc: '连接全球资源，构建协作网络'
              },
              {
                label: '可持续',
                en: 'Sustainable',
                color: '#4A9A6A',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    {/* 循环箭头 - 经典的可持续发展符号 */}
                    <path
                      d="M40 16 C55 16 66 27 66 40 C66 47 63 53 58 57"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon points="58,50 64,58 52,58" fill="currentColor" />
                    <path
                      d="M58 57 C50 66 38 68 27 62 C20 58 16 50 16 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon points="16,47 10,39 22,39" fill="currentColor" />
                    <path
                      d="M16 40 C16 27 27 16 40 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon points="33,16 40,10 40,22" fill="currentColor" />
                    {/* 中心叶子 */}
                    <ellipse cx="40" cy="40" rx="8" ry="12" fill="currentColor" opacity="0.6" transform="rotate(-30, 40, 40)" />
                    <path d="M40 34 L40 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  </svg>
                ),
                desc: '持续发展，生生不息的创新生态'
              },
              {
                label: '黑科技',
                en: 'Tech',
                color: '#A49464',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <rect x="22" y="22" width="36" height="36" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="30" y="30" width="20" height="20" rx="2" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="22" x2="32" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="40" y1="22" x2="40" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="48" y1="22" x2="48" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="32" y1="58" x2="32" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="40" y1="58" x2="40" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="48" y1="58" x2="48" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="40" x2="14" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="48" x2="14" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="32" x2="66" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="40" x2="66" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="48" x2="66" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="5" fill="currentColor" />
                  </svg>
                ),
                desc: 'AI时代的前沿工具与创新思维'
              },
            ].map((value) => (
              <motion.div
                key={value.label}
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className="px-5 py-3 rounded-xl glass-card cursor-pointer transition-all duration-300 hover:shadow-lg flex items-center gap-3"
                  style={{
                    borderColor: `${value.color}40`,
                    boxShadow: `0 0 0 1px ${value.color}20`,
                  }}
                >
                  <div
                    className="w-8 h-8 flex-shrink-0"
                    style={{ color: value.color }}
                  >
                    {value.svg}
                  </div>
                  <div>
                    <span className="font-semibold text-sm" style={{ color: value.color }}>
                      {value.label}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-1">
                      {value.en}
                    </span>
                  </div>
                </div>

                {/* Hover Card with Description */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                  <div
                    className="relative p-4 rounded-xl glass-card border min-w-[200px] shadow-xl"
                    style={{ borderColor: `${value.color}40`, background: 'var(--glass-bg)' }}
                  >
                    {/* Arrow */}
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l border-t glass-card"
                      style={{ borderColor: `${value.color}40` }}
                    />

                    {/* SVG Visualization */}
                    <div
                      className="w-16 h-16 mx-auto mb-3"
                      style={{ color: value.color }}
                    >
                      {value.svg}
                    </div>

                    {/* Title */}
                    <div className="text-center mb-2">
                      <span className="font-bold" style={{ color: value.color }}>
                        {value.label}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-1">
                        {value.en}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[var(--muted-foreground)] text-center leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p
              className="text-lg md:text-xl font-medium"
              style={{
                background: "linear-gradient(135deg, var(--neon-yellow) 0%, var(--neon-cyan) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              没有问题是太愚蠢的，没有想法是太疯狂的
            </p>
          </motion.div>
        </div>
      </section>

      {/* 知识库模块 Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{t("modules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("modules.description")}
            </p>
          </motion.div>

          <ModuleCards locale={locale} showHighlights={false} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 flex justify-center"
          >
            <Link
              href={`/${locale}/docs/core`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookOpen className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("modules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Einstein Quote Section */}
      <section className="py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-6 md:p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)]/50 backdrop-blur-xl">
            {/* Quote Mark */}
            <div className="absolute -top-4 left-8 text-6xl text-[var(--neon-cyan)] opacity-20 font-serif">"</div>

            {/* Quote Text */}
            <blockquote className="relative text-lg md:text-xl text-[var(--foreground)] leading-relaxed italic text-center mb-6">
              提出一个问题往往比解决一个问题更重要。因为解决问题也许仅是一个数学上或实验上的技能而已，而提出新的问题，却需要有创造性的想象力，标志着科学的真正进步。
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]"></div>
              <cite className="not-italic text-sm md:text-base text-[var(--muted-foreground)] font-medium">
                阿尔伯特·爱因斯坦
              </cite>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]"></div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--neon-cyan)]/30 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[var(--neon-cyan)]/30 rounded-bl-2xl"></div>
          </div>
        </motion.div>
      </section>

      {/* 行动层工具 Section */}
      <section className="py-14 px-4 bg-[var(--glass-bg)]/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <Wand2 className="w-4 h-4 text-[var(--neon-violet)]" />
              {t("actionTools.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{t("actionTools.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("actionTools.description")}
            </p>
          </motion.div>

          {/* OWL 创意工具箱 - 突出入口卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <Link href={`/${locale}/lab/habitat`}>
              <motion.div
                whileHover={{ scale: 1.01, y: -4 }}
                whileTap={{ scale: 0.99 }}
                className="relative overflow-hidden rounded-2xl p-8 group cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.12) 50%, rgba(139, 92, 246, 0.15) 100%)",
                  border: "2px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                {/* 背景动画光效 */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -top-20 -right-20 w-60 h-60 bg-[var(--neon-green)] opacity-10 blur-[80px] rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--neon-cyan)] opacity-10 blur-[80px] rounded-full"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* 左侧：标题和描述 */}
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Bird className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                          {t("actionTools.habitat.title")}
                        </h3>
                        <p className="text-[var(--muted-foreground)] mb-3">
                          {t("actionTools.habitat.subtitle")}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)] max-w-xl">
                          {t("actionTools.habitat.description")}
                        </p>
                      </div>
                    </div>

                    {/* 右侧：工具标签和CTA */}
                    <div className="flex flex-col items-start lg:items-end gap-4">
                      {/* 6个工具标签 */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: Layout, label: t("actionTools.habitat.tools.spaceDesigner"), color: "cyan" },
                          { icon: Gamepad2, label: t("actionTools.habitat.tools.gameWorkshop"), color: "pink" },
                          { icon: Swords, label: t("actionTools.habitat.tools.questEngine"), color: "orange" },
                          { icon: ScrollText, label: t("actionTools.habitat.tools.memoryHeritage"), color: "amber" },
                          { icon: Flower2, label: t("actionTools.habitat.tools.ideaGarden"), color: "green" },
                          { icon: Brain, label: t("actionTools.habitat.tools.wisdomAdvisor"), color: "violet" },
                        ].map((tool, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `var(--neon-${tool.color})15`,
                              color: `var(--neon-${tool.color})`,
                              border: `1px solid var(--neon-${tool.color})30`,
                            }}
                          >
                            <tool.icon className="w-3.5 h-3.5" />
                            {tool.label}
                          </div>
                        ))}
                      </div>

                      {/* 统计和CTA */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {t("actionTools.habitat.stats")}
                        </span>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-medium group-hover:bg-emerald-500/30 transition-colors">
                          <span>{t("actionTools.habitat.enter")}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover 边框效果 */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-500/50 transition-colors pointer-events-none" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* T01 AI 实验室布局生成器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/floor-plan`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layout className="w-6 h-6 text-[var(--neon-cyan)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-cyan)]">
                      {t("actionTools.tools.floorPlan.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.floorPlan.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.floorPlan.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium group-hover:gap-3 transition-all">
                    <span>立即使用</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T02 智能规划向导 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Wand2 className="w-6 h-6 text-[var(--neon-violet)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-violet)]">
                      {t("actionTools.tools.wizard.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.wizard.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.wizard.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-violet)] font-medium group-hover:gap-3 transition-all">
                    <span>开始规划</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T03 设备选型向导 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/core/05-tools`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FlaskConical className="w-6 h-6 text-[var(--neon-green)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-green)]">
                      {t("actionTools.tools.equipmentGuide.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.equipmentGuide.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.equipmentGuide.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-green)] font-medium group-hover:gap-3 transition-all">
                    <span>查看指南</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T04 AI 工具链指南 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/core/05-tools/extend/ai-tools-guide`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-pink)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-[var(--neon-pink)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-pink)]">
                      {t("actionTools.tools.aiToolsGuide.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.aiToolsGuide.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.aiToolsGuide.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-pink)] font-medium group-hover:gap-3 transition-all">
                    <span>探索工具</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T05 成本计算器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/core/05-tools#预算模板`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-yellow)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-yellow)]/20 to-[var(--neon-yellow)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calculator className="w-6 h-6 text-[var(--neon-yellow)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-yellow)]">
                      {t("actionTools.tools.costCalculator.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.costCalculator.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.costCalculator.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-yellow)] font-medium group-hover:gap-3 transition-all">
                    <span>计算预算</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T06 开源硬件选型 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/core/05-tools/extend/opensource-hardware`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-orange)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-orange)]/20 to-[var(--neon-orange)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Cpu className="w-6 h-6 text-[var(--neon-orange)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-orange)]">
                      {t("actionTools.tools.hardwareSelector.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.hardwareSelector.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.hardwareSelector.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-orange)] font-medium group-hover:gap-3 transition-all">
                    <span>选择硬件</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/lab`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-violet)]/10 to-[var(--neon-pink)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-violet)] transition-colors group"
            >
              <FlaskConical className="w-5 h-5 text-[var(--neon-violet)]" />
              <span className="font-medium">{t("actionTools.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Visual System Section */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[#D91A7A]" />
              Brand Identity
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#D91A7A] via-[#5C5470] to-[#D91A7A] bg-clip-text text-transparent">
                品牌视觉系统
              </span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              「夜视者」—— 在深夜星空中洞察光明，于未知领域激发创意
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/core/10-brand`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--glass-border)] hover:border-[#D91A7A] transition-colors group"
              style={{ background: 'linear-gradient(135deg, rgba(217,26,122,0.08), rgba(92,84,112,0.08))' }}
            >
              <Sparkles className="w-5 h-5 text-[#D91A7A]" />
              <span className="font-medium">查看完整品牌规范</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 知识体系导航 Section - 紧凑版 */}
      <section className="py-8 px-4 bg-[var(--glass-bg)]/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">{t("threeLayerNav.title")}</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("threeLayerNav.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* 前沿理念 */}
            <motion.div variants={itemVariants}>
              <Link href={`/${locale}/docs/research`}>
                <div className="glass-card p-4 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-[var(--neon-cyan)]" />
                    <h4 className="font-semibold text-[var(--foreground)]">
                      {t("threeLayerNav.layers.philosophy.title")}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("threeLayerNav.layers.philosophy.description")}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* 核心知识库 */}
            <motion.div variants={itemVariants}>
              <Link href={`/${locale}/docs/core`}>
                <div className="glass-card p-4 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="w-5 h-5 text-[var(--neon-violet)]" />
                    <h4 className="font-semibold text-[var(--foreground)]">
                      {t("threeLayerNav.layers.action.title")}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("threeLayerNav.layers.action.description")}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* 协作文档 */}
            <motion.div variants={itemVariants}>
              <Link href={`/${locale}/docs/core/ARCHITECTURE-V2`}>
                <div className="glass-card p-4 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-[var(--neon-green)]" />
                    <h4 className="font-semibold text-[var(--foreground)]">
                      {t("threeLayerNav.layers.docs.title")}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("threeLayerNav.layers.docs.description")}
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Main footer row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo & Copyright */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Open Wisdom Lab"
                  className="h-10 w-auto opacity-80"
                />
                <p className="text-sm text-[var(--muted-foreground)]">
                  © 2025 Open Wisdom Lab
                </p>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 text-sm">
                <Link
                  href={`/${locale}/docs/core/ARCHITECTURE-V2`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.architecture")}
                </Link>
                <Link
                  href={`/${locale}/docs/core/COLLABORATION-PROTOCOL`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.collaboration")}
                </Link>
                <Link
                  href={`/${locale}/docs/core/CHANGELOG`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.changelog")}
                </Link>
                <a
                  href="https://github.com/openwisdomlab/owlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* AI Space description */}
            <div className="pt-4 border-t border-[var(--glass-border)]/50 text-center">
              <Link
                href={`/${locale}/docs`}
                className="inline-flex items-center gap-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>{t("footer.aiSpace")}</span>
                <span className="opacity-60">·</span>
                <span className="opacity-60">{t("footer.aiSpaceDesc")}</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
