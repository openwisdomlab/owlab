"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useParams } from "next/navigation";
import Script from "next/script";
import { ModuleCards } from "@/components/docs/ModuleCards";

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

// Pre-computed particle data for consistent SSR/client rendering
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: seededRandom(i * 3) * 100,
  top: seededRandom(i * 3 + 1) * 100,
  opacity: seededRandom(i * 3 + 2) * 0.5 + 0.2,
  duration: seededRandom(i * 3 + 3) * 5 + 5,
  delay: seededRandom(i * 3 + 4) * 5,
}));

export default function HomePage() {
  const t = useTranslations("home");
  const params = useParams();
  const locale = params.locale as string;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OWL 建设与运营标准手册",
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

      {/* Hero Section - Cosmic Curiosity Design */}
      <section className="relative py-16 lg:py-24 px-4 overflow-hidden min-h-[85vh] flex items-center">
        {/* Starfield Background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-transparent via-[var(--background)] to-[var(--background)]">
          {/* Animated nebula clouds */}
          <motion.div
            className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[var(--neon-cyan)] opacity-[0.08] blur-[150px] rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
              opacity: [0.08, 0.12, 0.08]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-[var(--neon-violet)] opacity-[0.06] blur-[140px] rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 50, 0],
              opacity: [0.06, 0.1, 0.06]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[var(--neon-pink)] opacity-[0.04] blur-[160px] rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 80, repeat: Infinity, ease: "linear" },
              scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Floating particles - stars */}
          {PARTICLES.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                opacity: particle.opacity,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative max-w-7xl mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center">
            {/* Version Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-8"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              {t("hero.version")}
            </motion.div>

            {/* Bilingual Subtitle - Open Wisdom Lab / 开放智慧实验室 - V4 Two Lines Above */}
            <motion.div
              className="relative mb-6 flex flex-col items-center gap-2"
              variants={itemVariants}
            >
              {/* English Title - First Line */}
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center"
                style={{
                  background: "linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-violet) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Open Wisdom Lab
              </motion.h2>

              {/* Chinese Title - Second Line */}
              <motion.h3
                className="text-xl md:text-2xl lg:text-3xl font-light tracking-[0.25em] text-center"
                style={{
                  fontFamily: "'Noto Serif SC', 'STKaiti', serif",
                  color: "var(--muted-foreground)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                开放智慧实验室
              </motion.h3>

              {/* Decorative dots underneath */}
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--neon-violet)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--neon-pink)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Main Title - OWL 建设与运营标准手册 */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight"
              variants={itemVariants}
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontWeight: 900,
                background: "linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-violet) 50%, var(--neon-pink) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 80px rgba(6, 182, 212, 0.3)",
              }}
            >
              OWL 建设与运营<br/>标准手册
            </motion.h1>

            {/* Core Philosophy Tagline */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-[var(--foreground)] font-medium max-w-5xl mx-auto leading-relaxed mb-10"
              variants={itemVariants}
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.02em",
              }}
            >
              让有好奇心的人、天马行空的想法和有趣的问题在此汇聚和激发
            </motion.p>

            {/* Einstein Quote */}
            <motion.div
              className="relative max-w-4xl mx-auto mb-12"
              variants={itemVariants}
            >
              <div className="relative p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]/50 backdrop-blur-xl">
                {/* Quote Mark */}
                <div className="absolute -top-4 left-8 text-6xl text-[var(--neon-cyan)] opacity-20 font-serif">"</div>

                {/* Quote Text */}
                <blockquote className="relative text-base md:text-lg text-[var(--foreground)] leading-relaxed italic text-center mb-4">
                  想象力比知识更重要，因为知识是有限的，而想象力概括着世界上的一切，推动着进步，并且是知识进化的源泉。
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]"></div>
                  <cite className="not-italic text-sm md:text-base text-[var(--muted-foreground)] font-medium">
                    阿尔伯特·爱因斯坦
                  </cite>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]"></div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--neon-cyan)]/30 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[var(--neon-cyan)]/30 rounded-bl-2xl"></div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-12"
              variants={itemVariants}
            >
              <Link
                href={`/${locale}/docs/knowledge-base`}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-pink)] text-white font-semibold text-lg hover:shadow-2xl hover:shadow-[var(--neon-cyan)]/50 transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-violet)] to-[var(--neon-cyan)]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <BookOpen className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t("hero.cta.start")}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={`/${locale}/docs/knowledge-base/ARCHITECTURE-V2`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl glass-card hover:border-[var(--neon-cyan)] transition-all duration-300 text-lg font-medium backdrop-blur-xl"
              >
                <GitBranch className="w-5 h-5" />
                {t("hero.cta.architecture")}
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="inline-flex flex-col items-center gap-2 text-xs text-[var(--muted-foreground)]"
              variants={itemVariants}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-mono tracking-wider">向下探索</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* 空间核心理念 Section - Four Core Principles */}
      <section className="relative py-8 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-[var(--neon-cyan)] opacity-[0.02] blur-[100px] rounded-full"
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-64 h-64 bg-[var(--neon-violet)] opacity-[0.02] blur-[100px] rounded-full"
            animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-2"
              whileHover={{ scale: 1.05 }}
            >
              <Lightbulb className="w-3.5 h-3.5 text-[var(--neon-yellow)]" />
              空间哲学
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-pink)] bg-clip-text text-transparent">
              四大核心理念
            </h2>
          </motion.div>

          {/* Principle Cards - 2x2 Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-3 lg:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Principle 1: 以学生为中心 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.005 }}
              className="group relative"
            >
              <div className="relative h-full p-4 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Number Badge */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                  <span className="text-lg font-black text-[var(--neon-cyan)]">01</span>
                </div>

                {/* Icon with SVG Visualization - Student-Centered (Radial Pattern) */}
                <div className="relative mb-3 w-24 h-24">
                  {/* SVG Background Pattern */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="radial-student" cx="50%" cy="50%">
                        <stop offset="0%" style={{ stopColor: 'var(--neon-cyan)', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--neon-cyan)', stopOpacity: 0.1 }} />
                      </radialGradient>
                    </defs>
                    {/* Center circle */}
                    <circle cx="50" cy="50" r="8" fill="var(--neon-cyan)" opacity="0.8" />
                    {/* Radial lines */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const x1 = 50 + Math.cos(rad) * 12;
                      const y1 = 50 + Math.sin(rad) * 12;
                      const x2 = 50 + Math.cos(rad) * 35;
                      const y2 = 50 + Math.sin(rad) * 35;
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
                    {/* Outer circles */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const cx = 50 + Math.cos(rad) * 35;
                      const cy = 50 + Math.sin(rad) * 35;
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
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative text-lg font-bold mb-1.5 text-[var(--neon-cyan)]">
                  以学生为中心
                </h3>
                <p className="relative text-base text-[var(--foreground)] font-medium mb-2">
                  开放自由的氛围，没有标准答案
                </p>
                <p className="relative text-sm text-[var(--muted-foreground)] leading-relaxed">
                  我们相信每个学生都有独特的学习路径。空间应支持学习者的自主探索和个性化成长。
                </p>

                {/* Decorative Line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-cyan)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Principle 2: 鼓励大胆探索 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.005 }}
              className="group relative"
            >
              <div className="relative h-full p-4 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                  <span className="text-lg font-black text-[var(--neon-green)]">02</span>
                </div>

                {/* Icon with SVG Visualization - Exploration (Ascending Path) */}
                <div className="relative mb-3 w-24 h-24">
                  {/* SVG Background Pattern */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="path-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'var(--neon-green)', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--neon-green)', stopOpacity: 0.8 }} />
                      </linearGradient>
                    </defs>
                    {/* Ascending spiral path */}
                    <path
                      d="M 20 80 Q 30 60, 40 55 T 60 45 T 75 25"
                      stroke="var(--neon-green)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.4"
                      strokeDasharray="4,4"
                    />
                    {/* Checkpoint circles along path */}
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
                    {/* Arrow at end */}
                    <path
                      d="M 75 25 L 70 30 M 75 25 L 80 30"
                      stroke="var(--neon-green)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                  </div>
                </div>

                <h3 className="relative text-lg font-bold mb-1.5 text-[var(--neon-green)]">
                  鼓励大胆探索
                </h3>
                <p className="relative text-base text-[var(--foreground)] font-medium mb-2">
                  允许犯错，包容失败
                </p>
                <p className="relative text-sm text-[var(--muted-foreground)] leading-relaxed">
                  在探索未知的过程中，错误是最宝贵的学习机会。我们营造心理安全的环境，让创新自由生长。
                </p>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-green)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Principle 3: 科技感与未来感 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.005 }}
              className="group relative"
            >
              <div className="relative h-full p-4 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                  <span className="text-lg font-black text-[var(--neon-violet)]">03</span>
                </div>

                {/* Icon with SVG Visualization - Tech & Future (Circuit Grid) */}
                <div className="relative mb-3 w-24 h-24">
                  {/* SVG Background Pattern */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="tech-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'var(--neon-violet)', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--neon-violet)', stopOpacity: 0.2 }} />
                      </linearGradient>
                    </defs>
                    {/* Tech grid pattern */}
                    <g opacity="0.4">
                      {/* Horizontal lines */}
                      <line x1="20" y1="30" x2="80" y2="30" stroke="var(--neon-violet)" strokeWidth="1.5" />
                      <line x1="20" y1="50" x2="80" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" />
                      <line x1="20" y1="70" x2="80" y2="70" stroke="var(--neon-violet)" strokeWidth="1.5" />
                      {/* Vertical lines */}
                      <line x1="30" y1="20" x2="30" y2="80" stroke="var(--neon-violet)" strokeWidth="1.5" />
                      <line x1="50" y1="20" x2="50" y2="80" stroke="var(--neon-violet)" strokeWidth="1.5" />
                      <line x1="70" y1="20" x2="70" y2="80" stroke="var(--neon-violet)" strokeWidth="1.5" />
                    </g>
                    {/* Circuit nodes */}
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
                    {/* Corner squares */}
                    <rect x="18" y="18" width="6" height="6" fill="var(--neon-violet)" opacity="0.6" />
                    <rect x="76" y="18" width="6" height="6" fill="var(--neon-violet)" opacity="0.6" />
                    <rect x="18" y="76" width="6" height="6" fill="var(--neon-violet)" opacity="0.6" />
                    <rect x="76" y="76" width="6" height="6" fill="var(--neon-violet)" opacity="0.6" />
                  </svg>
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                  </div>
                </div>

                <h3 className="relative text-lg font-bold mb-1.5 text-[var(--neon-violet)]">
                  科技感与未来感
                </h3>
                <p className="relative text-base text-[var(--foreground)] font-medium mb-2">
                  激发创新想法诞生
                </p>
                <p className="relative text-sm text-[var(--muted-foreground)] leading-relaxed">
                  具有科技感和未来感的设计，让学习空间成为灵感的孵化器，点燃对未来技术的好奇心。
                </p>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-violet)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Principle 4: 灵活流动的空间 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.005 }}
              className="group relative"
            >
              <div className="relative h-full p-4 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                  <span className="text-lg font-black text-[var(--neon-pink)]">04</span>
                </div>

                {/* Icon with SVG Visualization - Flexible Space (Flowing Curves) */}
                <div className="relative mb-3 w-24 h-24">
                  {/* SVG Background Pattern */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'var(--neon-pink)', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--neon-pink)', stopOpacity: 0.2 }} />
                      </linearGradient>
                    </defs>
                    {/* Flowing wave curves */}
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
                    {/* Modular grid elements */}
                    <g opacity="0.3">
                      <rect x="15" y="22" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                      <rect x="46" y="22" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                      <rect x="77" y="22" width="8" height="8" fill="var(--neon-pink)" rx="1" />

                      <rect x="15" y="42" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                      <rect x="46" y="42" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                      <rect x="77" y="42" width="8" height="8" fill="var(--neon-pink)" rx="1" />

                      <rect x="15" y="62" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                      <rect x="46" y="62" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                      <rect x="77" y="62" width="8" height="8" fill="var(--neon-pink)" rx="1" />
                    </g>
                    {/* Connection points */}
                    <circle cx="19" cy="26" r="2" fill="var(--neon-pink)" opacity="0.7" />
                    <circle cx="50" cy="26" r="2" fill="var(--neon-pink)" opacity="0.7" />
                    <circle cx="81" cy="26" r="2" fill="var(--neon-pink)" opacity="0.7" />
                  </svg>
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GitBranch className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                  </div>
                </div>

                <h3 className="relative text-lg font-bold mb-1.5 text-[var(--neon-pink)]">
                  灵活流动的空间
                </h3>
                <p className="relative text-base text-[var(--foreground)] font-medium mb-2">
                  灵活、流动和多样化
                </p>
                <p className="relative text-sm text-[var(--muted-foreground)] leading-relaxed">
                  灵活流动的学习空间代替隔离、固定的空间。空间可以随需求快速重构，支持多种学习模式。
                </p>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-pink)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* CTA to Detail Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-5 flex justify-center"
          >
            <Link
              href={`/${locale}/docs/knowledge-base/03-space/extend/core-space-philosophy`}
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-lg glass-card hover:border-[var(--neon-cyan)] transition-all duration-300 backdrop-blur-xl text-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
              <span className="font-medium">深入了解空间理念</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 前沿理念模块 Section - 独立展示 */}
      <section className="py-20 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              {t("livingModules.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 text-[var(--foreground)]">{t("livingModules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("livingModules.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* L01 空间的塑造 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/living-modules/01-space-as-educator`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
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
            </motion.div>

            {/* L02 思维的延伸 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/living-modules/02-extended-mind`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-[var(--neon-violet)]" />
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
            </motion.div>

            {/* L03 涌现的智慧 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/living-modules/03-emergent-wisdom`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
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
            </motion.div>

            {/* L04 技术的诗意 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/living-modules/04-poetics-of-technology`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group">
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
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/living-modules`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookMarked className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("livingModules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 知识库模块 Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3 text-[var(--foreground)]">{t("modules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("modules.description")}
            </p>
          </motion.div>

          <ModuleCards locale={locale} showHighlights={false} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <Link
              href={`/${locale}/docs/knowledge-base`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookOpen className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("modules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 行动层工具 Section */}
      <section className="py-20 px-4 bg-[var(--glass-bg)]/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <Wand2 className="w-4 h-4 text-[var(--neon-violet)]" />
              {t("actionTools.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 text-[var(--foreground)]">{t("actionTools.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("actionTools.description")}
            </p>
          </motion.div>

          {/* OWL 生境 - 突出入口卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
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
              <Link href={`/${locale}/docs/knowledge-base/05-tools`}>
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
              <Link href={`/${locale}/docs/knowledge-base/05-tools/extend/ai-tools-guide`}>
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
              <Link href={`/${locale}/docs/knowledge-base/05-tools#预算模板`}>
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
              <Link href={`/${locale}/docs/knowledge-base/05-tools/extend/opensource-hardware`}>
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[#D91A7A]" />
              Brand Identity
            </motion.div>
            <h2 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[#D91A7A] via-[#5C5470] to-[#D91A7A] bg-clip-text text-transparent">
                品牌视觉系统
              </span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              「夜视者」—— 在深夜星空中洞察光明，于未知领域激发创意
            </p>
          </motion.div>

          {/* Color Palette Display */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="group">
              <div
                className="h-24 rounded-xl flex items-end p-4 transition-transform group-hover:scale-105"
                style={{ background: '#D91A7A' }}
              >
                <div className="text-white">
                  <div className="font-semibold text-sm">Logo紫色</div>
                  <div className="text-xs opacity-70">Magenta Pink</div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div
                className="h-24 rounded-xl flex items-end p-4 transition-transform group-hover:scale-105"
                style={{ background: '#2563EB' }}
              >
                <div className="text-white">
                  <div className="font-semibold text-sm">Logo蓝色</div>
                  <div className="text-xs opacity-70">OWL Blue</div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div
                className="h-24 rounded-xl flex items-end p-4 transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #D91A7A 0%, #2563EB 100%)' }}
              >
                <div className="text-white">
                  <div className="font-semibold text-sm">蓝紫渐变</div>
                  <div className="text-xs opacity-70">Magenta-Blue Gradient</div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div
                className="h-24 rounded-xl flex items-end p-4 border border-[var(--glass-border)] transition-transform group-hover:scale-105"
                style={{ background: '#0E0E14' }}
              >
                <div className="text-white">
                  <div className="font-semibold text-sm">深夜星空</div>
                  <div className="text-xs opacity-70">Night Sky</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Brand Values */}
          <motion.div
            className="grid md:grid-cols-5 gap-4 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { label: '开放', en: 'Open', color: '#D91A7A' },
              { label: '交叉', en: 'Cross', color: '#6A809A' },
              { label: '连接', en: 'Connect', color: '#7A8490' },
              { label: '可持续', en: 'Sustainable', color: '#8A8A7A' },
              { label: '黑科技', en: 'Tech', color: '#A49464' },
            ].map((value, i) => (
              <motion.div
                key={value.label}
                variants={itemVariants}
                className="glass-card p-4 text-center hover:border-[var(--glass-border)] transition-all"
                style={{ borderColor: `${value.color}30` }}
                whileHover={{ y: -3, borderColor: value.color }}
              >
                <div className="font-bold text-lg" style={{ color: value.color }}>
                  {value.label}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">{value.en}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/knowledge-base/10-brand`}
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
      <section className="py-12 px-4 bg-[var(--glass-bg)]/10">
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
              <Link href={`/${locale}/docs/living-modules`}>
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
              <Link href={`/${locale}/docs/knowledge-base`}>
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
              <Link href={`/${locale}/docs/knowledge-base/ARCHITECTURE-V2`}>
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

      {/* Footer */}
      {/* 教育理念 Section - Three Learning Principles */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/3 w-80 h-80 bg-[var(--neon-cyan)] opacity-[0.04] blur-[120px] rounded-full"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--neon-violet)] opacity-[0.04] blur-[120px] rounded-full"
            animate={{ scale: [1.15, 1, 1.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Lightbulb className="w-4 h-4 text-[var(--neon-cyan)]" />
              教育理念
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--foreground)]">
              我们如何培养创新人才
            </h2>
            <p className="text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              从真实问题出发，跨越学科边界，在实践中成长
            </p>
          </motion.div>

          {/* Three Principle Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Principle 1: 问题驱动学习 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)]/8 via-[var(--background)] to-[var(--background)] border border-[var(--neon-cyan)]/20 hover:border-[var(--neon-cyan)]/50 transition-all duration-300 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* SVG Visualization - Question Mark with Lightbulb */}
                <div className="absolute top-6 right-6 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Question mark path */}
                    <path
                      d="M 50 20 Q 65 20, 65 35 Q 65 45, 50 50 L 50 60"
                      stroke="var(--neon-cyan)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="70" r="4" fill="var(--neon-cyan)" />
                    {/* Radiating thought lines */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const x2 = 50 + Math.cos(rad) * 35;
                      const y2 = 50 + Math.sin(rad) * 35;
                      return (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2={x2}
                          y2={y2}
                          stroke="var(--neon-cyan)"
                          strokeWidth="2"
                          opacity="0.3"
                          strokeDasharray="2,3"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] text-xs font-mono font-bold mb-4">
                    001
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--foreground)]">
                    问题驱动学习
                  </h3>
                  <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
                    从真实问题出发，在探索中学习，在解决问题中成长。
                  </p>
                  <p className="text-sm font-medium text-[var(--neon-cyan)] italic">
                    Learning by questioning.
                  </p>
                </div>

                {/* Bottom Accent */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-cyan)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Principle 2: 跨学科融合 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-[var(--neon-violet)]/8 via-[var(--background)] to-[var(--background)] border border-[var(--neon-violet)]/20 hover:border-[var(--neon-violet)]/50 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* SVG Visualization - Intersecting Circles (Venn Diagram) */}
                <div className="absolute top-6 right-6 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Left circle - Science */}
                    <circle
                      cx="40"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke="var(--neon-violet)"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                    {/* Right circle - Art */}
                    <circle
                      cx="60"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke="var(--neon-violet)"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                    {/* Center intersection highlight */}
                    <circle
                      cx="50"
                      cy="50"
                      r="8"
                      fill="var(--neon-violet)"
                      opacity="0.5"
                    />
                    {/* Connection lines */}
                    <line x1="30" y1="35" x2="50" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                    <line x1="70" y1="35" x2="50" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                    <line x1="30" y1="65" x2="50" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                    <line x1="70" y1="65" x2="50" y2="50" stroke="var(--neon-violet)" strokeWidth="1.5" opacity="0.4" />
                  </svg>
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--neon-violet)]/10 text-[var(--neon-violet)] text-xs font-mono font-bold mb-4">
                    002
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--foreground)]">
                    跨学科融合
                  </h3>
                  <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
                    打破学科边界，培养综合思维和创新能力。
                  </p>
                  <p className="text-sm font-medium text-[var(--neon-violet)] italic">
                    Cross-disciplinary thinking.
                  </p>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-violet)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Principle 3: 实践导向 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-[var(--neon-green)]/8 via-[var(--background)] to-[var(--background)] border border-[var(--neon-green)]/20 hover:border-[var(--neon-green)]/50 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* SVG Visualization - Hands and Tools (Gear) */}
                <div className="absolute top-6 right-6 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Gear/Cog wheel */}
                    <g transform="translate(50, 50)">
                      {/* Center circle */}
                      <circle cx="0" cy="0" r="12" fill="none" stroke="var(--neon-green)" strokeWidth="3" />
                      {/* Gear teeth */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const x1 = Math.cos(rad) * 12;
                        const y1 = Math.sin(rad) * 12;
                        const x2 = Math.cos(rad) * 22;
                        const y2 = Math.sin(rad) * 22;
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="var(--neon-green)"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        );
                      })}
                      {/* Outer circle */}
                      <circle cx="0" cy="0" r="28" fill="none" stroke="var(--neon-green)" strokeWidth="2" opacity="0.5" strokeDasharray="4,4" />
                    </g>
                    {/* Hand/Tool representation - wrench shape */}
                    <path
                      d="M 25 70 L 30 65 L 35 70 L 30 75 Z"
                      fill="var(--neon-green)"
                      opacity="0.4"
                    />
                    <path
                      d="M 65 70 L 70 65 L 75 70 L 70 75 Z"
                      fill="var(--neon-green)"
                      opacity="0.4"
                    />
                  </svg>
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--neon-green)]/10 text-[var(--neon-green)] text-xs font-mono font-bold mb-4">
                    003
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--foreground)]">
                    实践导向
                  </h3>
                  <p className="text-base text-[var(--muted-foreground)] mb-4 leading-relaxed">
                    动手实践，在做中学，培养解决实际问题的能力。
                  </p>
                  <p className="text-sm font-medium text-[var(--neon-green)] italic">
                    Hands-on learning.
                  </p>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--neon-green)] to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
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
                  href={`/${locale}/docs/knowledge-base/ARCHITECTURE-V2`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.architecture")}
                </Link>
                <Link
                  href={`/${locale}/docs/knowledge-base/COLLABORATION-PROTOCOL`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.collaboration")}
                </Link>
                <Link
                  href={`/${locale}/docs/knowledge-base/CHANGELOG`}
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
