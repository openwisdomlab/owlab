"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { brandColors } from "@/lib/brand/colors";
import { useTheme } from "@/components/ui/ThemeProvider";
import { ScienceCircles } from "./ScienceCircles";
import { CuriosityPopover } from "./CuriosityPopover";

interface EnhancedHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function EnhancedHero({ locale, t }: EnhancedHeroProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: isDark ? '#0E0E14' : '#F8FAFC' }} />

      {/* Science Circles - Interactive Question Universe */}
      <ScienceCircles circleCount={28} />

      {/* Map/Blueprint Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="blueprint-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? brandColors.neonCyan : brandColors.blue}
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
            <pattern id="blueprint-grid-major" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M 200 0 L 0 0 0 200"
                fill="none"
                stroke={isDark ? brandColors.neonCyan : brandColors.blue}
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
          <rect width="100%" height="100%" fill="url(#blueprint-grid-major)" />
        </svg>
      </div>


      {/* Geometric Framework Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left corner frame */}
        <svg className="absolute top-0 left-0 w-64 h-64 opacity-30" viewBox="0 0 200 200">
          <motion.path
            d="M 0 0 L 200 0 L 200 50 M 200 0 L 150 0 L 150 200 M 0 0 L 0 200 L 50 200"
            stroke={brandColors.neonCyan}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* Bottom-right corner frame */}
        <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-30" viewBox="0 0 200 200">
          <motion.path
            d="M 200 200 L 0 200 L 0 150 M 0 200 L 50 200 L 50 0 M 200 200 L 200 0 L 150 0"
            stroke={brandColors.neonPink}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Center hexagonal frame */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: 1, rotate: 360, opacity: 0.15 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <svg width="800" height="800" viewBox="0 0 400 400">
            <polygon
              points="200,50 320,125 320,275 200,350 80,275 80,125"
              stroke={brandColors.violet}
              strokeWidth="2"
              fill="none"
              strokeDasharray="10 5"
            />
            <motion.polygon
              points="200,100 280,150 280,250 200,300 120,250 120,150"
              stroke={brandColors.blue}
              strokeWidth="1.5"
              fill="none"
              animate={{
                rotate: 360,
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {/* "Open Wisdom Lab" Typography - Refined Size */}
          <motion.h1
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* OPEN with Eye replacing O - 👁PEN */}
            <span
              className="inline-flex items-baseline justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter pointer-events-auto"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                letterSpacing: '-0.03em'
              }}
            >
              {/* 眼睛作为"O" - 与PEN文字对齐 */}
              <CuriosityPopover isDark={isDark} isMobile={isMobile} inline={true} />
              {/* PEN 文字 */}
              <span
                style={{
                  backgroundImage: isDark
                    ? `linear-gradient(135deg, ${brandColors.neonCyan} 0%, ${brandColors.violet} 30%, ${brandColors.neonPink} 60%, ${brandColors.blue} 100%)`
                    : `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.violet} 50%, ${brandColors.neonPink} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PEN
              </span>
            </span>
            <span
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter -mt-2"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                backgroundImage: isDark
                  ? `linear-gradient(135deg, ${brandColors.violet} 0%, ${brandColors.neonPink} 50%, ${brandColors.neonCyan} 100%)`
                  : `linear-gradient(135deg, ${brandColors.violet} 0%, ${brandColors.neonPink} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em'
              }}
            >
              WISDOM
            </span>
            <span
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter -mt-2"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                backgroundImage: isDark
                  ? `linear-gradient(135deg, ${brandColors.neonPink} 0%, ${brandColors.blue} 50%, ${brandColors.violet} 100%)`
                  : `linear-gradient(135deg, ${brandColors.neonPink} 0%, ${brandColors.blue} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em'
              }}
            >
              LAB
            </span>
          </motion.h1>

          {/* Chinese Subtitle + Guide Label */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
              style={{
                fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                color: isDark ? brandColors.neonCyan : brandColors.blue,
                letterSpacing: '0.05em'
              }}
            >
              开放智慧实验室
            </h2>
            <div className="relative inline-block">
              {/* Map decoration markers around the badge */}
              <motion.div
                className="absolute -left-12 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <path d="M0 20 L35 20 M30 15 L35 20 L30 25" stroke={brandColors.violet} strokeWidth="2" fill="none" />
                  <circle cx="5" cy="20" r="2" fill={brandColors.violet} />
                </svg>
              </motion.div>

              <motion.div
                className="absolute -right-12 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <path d="M40 20 L5 20 M10 15 L5 20 L10 25" stroke={brandColors.neonPink} strokeWidth="2" fill="none" />
                  <circle cx="35" cy="20" r="2" fill={brandColors.neonPink} />
                </svg>
              </motion.div>

              {/* Coordinate/dimension lines */}
              <motion.div
                className="absolute -top-8 left-0 right-0 flex items-center justify-center gap-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${brandColors.neonCyan}, transparent)` }} />
                <span className="text-xs px-2" style={{ color: brandColors.neonCyan, fontFamily: 'monospace' }}>GUIDE</span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${brandColors.neonCyan}, transparent)` }} />
              </motion.div>

              {/* Waypoint indicator markers */}
              <motion.div
                className="absolute -top-3 -left-3"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="2" fill="none" stroke={brandColors.neonCyan} strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="0.5" fill={brandColors.neonCyan} />
                </svg>
              </motion.div>

              <motion.div
                className="absolute -top-3 -right-3"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="2" fill="none" stroke={brandColors.violet} strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="0.5" fill={brandColors.violet} />
                </svg>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 -left-3"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="2" fill="none" stroke={brandColors.neonPink} strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="0.5" fill={brandColors.neonPink} />
                </svg>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 -right-3"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="2" fill="none" stroke={brandColors.emerald} strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="0.5" fill={brandColors.emerald} />
                </svg>
              </motion.div>

              {/* The main badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-auto"
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, ${brandColors.violet}20, ${brandColors.neonPink}15)`
                    : `linear-gradient(135deg, ${brandColors.violet}15, ${brandColors.neonPink}10)`,
                  border: `1px solid ${isDark ? brandColors.violet : brandColors.violet}40`,
                  boxShadow: isDark ? `0 0 20px ${brandColors.violet}20` : 'none'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="w-4 h-4" style={{ color: isDark ? brandColors.neonPink : brandColors.violet }} />
                <span
                  className="text-sm sm:text-base md:text-lg font-semibold"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${isDark ? brandColors.neonPink : brandColors.violet}, ${isDark ? brandColors.violet : brandColors.neonPink})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '0.08em'
                  }}
                >
                  建设和运营指南
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Philosophy Text - Refined */}
          <motion.div
            className="max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div
              className="relative p-6 rounded-2xl backdrop-blur-xl border"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(14,14,20,0.6), rgba(26,26,46,0.4))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.6))',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: brandColors.neonPink }} />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: isDark ? brandColors.neonCyan : brandColors.blue }} />

              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium text-center"
                style={{
                  fontFamily: "'Source Han Sans CN', 'Noto Sans SC', sans-serif",
                  backgroundImage: isDark
                    ? `linear-gradient(135deg, ${brandColors.neonCyan}, ${brandColors.neonPink})`
                    : `linear-gradient(135deg, ${brandColors.blue}, ${brandColors.neonPink})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.02em'
                }}
              >
                一个开放、包容、创新的学习空间。
                <br />
                让有好奇心的人和天马行空的想法在此汇聚和激发。
              </p>
            </div>
          </motion.div>

          {/* OWL 汇聚 - Three Elements Row */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <h3
              className="text-center text-sm md:text-base font-medium mb-4"
              style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
            >
              OWL 汇聚
            </h3>
            <div className="flex flex-row items-center justify-center gap-4 md:gap-6">
              {/* 有好奇心的人 - 神经网络连接的探索者 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 relative overflow-hidden"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${brandColors.neonCyan}20, ${brandColors.neonCyan}10)`
                      : `linear-gradient(135deg, ${brandColors.blue}15, ${brandColors.blue}05)`,
                    border: `1px solid ${isDark ? brandColors.neonCyan : brandColors.blue}40`
                  }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 md:w-10 md:h-10" style={{ color: isDark ? brandColors.neonCyan : brandColors.blue }}>
                    {/* 头部 - 发光的圆形 */}
                    <motion.circle
                      cx="24" cy="14" r="8"
                      stroke="currentColor" strokeWidth="2" fill="none"
                      animate={{ filter: ['drop-shadow(0 0 2px currentColor)', 'drop-shadow(0 0 6px currentColor)', 'drop-shadow(0 0 2px currentColor)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* 神经元发散的连接线 */}
                    <motion.g
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <line x1="24" y1="6" x2="24" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="16" y1="8" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="32" y1="8" x2="36" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="24" cy="2" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                      <circle cx="36" cy="4" r="1.5" fill="currentColor" />
                    </motion.g>
                    {/* 好奇闪烁的眼睛 */}
                    <motion.g
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <circle cx="20" cy="13" r="2" fill="currentColor" />
                      <circle cx="28" cy="13" r="2" fill="currentColor" />
                      {/* 眼睛高光 */}
                      <circle cx="21" cy="12" r="0.5" fill={isDark ? '#fff' : '#fff'} />
                      <circle cx="29" cy="12" r="0.5" fill={isDark ? '#fff' : '#fff'} />
                    </motion.g>
                    {/* 身体 - 简化的能量形态 */}
                    <path d="M16 44 C16 34, 18 28, 24 26 C30 28, 32 34, 32 44" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
                    {/* 环绕的能量光环 */}
                    <motion.circle
                      cx="24" cy="24" r="18"
                      stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3"
                      strokeDasharray="3 5"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: '24px 24px' }}
                    />
                  </svg>
                </div>
                <span
                  className="text-xs md:text-sm font-medium whitespace-nowrap"
                  style={{ color: isDark ? brandColors.neonCyan : brandColors.blue }}
                >
                  有好奇心的人
                </span>
              </motion.div>

              {/* 连接符 × */}
              <span className="text-xl md:text-2xl" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }}>×</span>

              {/* 有想象力的空间 - 无限门户/星门概念 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.violet}20, ${brandColors.violet}10)`,
                    border: `1px solid ${brandColors.violet}40`
                  }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 md:w-10 md:h-10" style={{ color: brandColors.violet }}>
                    {/* 外圈门户框架 */}
                    <motion.circle
                      cx="24" cy="24" r="18"
                      stroke="currentColor" strokeWidth="2" fill="none"
                      strokeDasharray="4 2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: '24px 24px' }}
                    />
                    {/* 内圈旋转门户 */}
                    <motion.circle
                      cx="24" cy="24" r="13"
                      stroke="currentColor" strokeWidth="1.5" fill="none"
                      strokeDasharray="8 4"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: '24px 24px' }}
                    />
                    {/* 门户中心 - 渐变深度效果 */}
                    <motion.circle
                      cx="24" cy="24" r="8"
                      fill="currentColor" opacity="0.15"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    {/* 门户内的星星/银河 */}
                    <motion.g
                      animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
                      transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 2, repeat: Infinity } }}
                      style={{ transformOrigin: '24px 24px' }}
                    >
                      <circle cx="24" cy="20" r="1" fill="currentColor" />
                      <circle cx="20" cy="25" r="0.8" fill="currentColor" />
                      <circle cx="28" cy="26" r="0.6" fill="currentColor" />
                      <circle cx="24" cy="28" r="1.2" fill="currentColor" />
                      <circle cx="22" cy="22" r="0.5" fill="currentColor" />
                    </motion.g>
                    {/* 飘散的想象力粒子 */}
                    <motion.circle
                      cx="8" cy="12" r="1.5" fill="currentColor"
                      animate={{ y: [0, -5, 0], x: [0, 2, 0], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, type: "tween" }}
                    />
                    <motion.circle
                      cx="40" cy="14" r="1" fill="currentColor"
                      animate={{ y: [0, -4, 0], x: [0, -2, 0], opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, type: "tween" }}
                    />
                    <motion.circle
                      cx="10" cy="38" r="1.2" fill="currentColor"
                      animate={{ y: [0, -3, 0], opacity: [0.2, 0.7, 0.2] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: 1, type: "tween" }}
                    />
                    <motion.circle
                      cx="38" cy="36" r="0.8" fill="currentColor"
                      animate={{ y: [0, -4, 0], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 3.2, repeat: Infinity, delay: 0.3, type: "tween" }}
                    />
                  </svg>
                </div>
                <span
                  className="text-xs md:text-sm font-medium whitespace-nowrap"
                  style={{ color: brandColors.violet }}
                >
                  有想象力的空间
                </span>
              </motion.div>

              {/* 连接符 × */}
              <span className="text-xl md:text-2xl" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }}>×</span>

              {/* 有趣的问题 - 灯泡+问号+螺旋创意 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.neonPink}20, ${brandColors.neonPink}10)`,
                    border: `1px solid ${brandColors.neonPink}40`
                  }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 md:w-10 md:h-10" style={{ color: brandColors.neonPink }}>
                    {/* 灯泡轮廓 */}
                    <motion.path
                      d="M24 4 C14 4, 8 12, 8 20 C8 26, 12 30, 16 34 L16 38 L32 38 L32 34 C36 30, 40 26, 40 20 C40 12, 34 4, 24 4"
                      stroke="currentColor" strokeWidth="1.5" fill="none"
                      animate={{ filter: ['drop-shadow(0 0 2px currentColor)', 'drop-shadow(0 0 8px currentColor)', 'drop-shadow(0 0 2px currentColor)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* 灯泡底座 */}
                    <path d="M18 38 L18 42 L30 42 L30 38" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <line x1="18" y1="44" x2="30" y2="44" stroke="currentColor" strokeWidth="1.5" />
                    {/* 问号在灯泡内 - 核心创意 */}
                    <motion.g
                      animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path
                        d="M20 16 Q20 10, 24 10 Q30 10, 30 16 Q30 20, 24 22"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
                      />
                      <circle cx="24" cy="28" r="2" fill="currentColor" />
                    </motion.g>
                    {/* 发散的灵感火花 */}
                    <motion.g
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <line x1="24" y1="0" x2="24" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="4" y1="20" x2="6" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="42" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>
                    <motion.g
                      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <line x1="8" y1="8" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="40" y1="8" x2="38" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="6" y1="32" x2="8" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="42" y1="32" x2="40" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </motion.g>
                    {/* 小型思考符号 */}
                    <motion.text
                      x="2" y="14" fontSize="6" fill="currentColor" fontWeight="bold"
                      animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -2, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      !
                    </motion.text>
                    <motion.text
                      x="44" y="30" fontSize="5" fill="currentColor" fontWeight="bold"
                      animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
                    >
                      *
                    </motion.text>
                  </svg>
                </div>
                <span
                  className="text-xs md:text-sm font-medium whitespace-nowrap"
                  style={{ color: brandColors.neonPink }}
                >
                  有趣的问题
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${locale}/docs/core`}
                className="group relative inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${brandColors.neonPink}, ${brandColors.violet})`,
                  boxShadow: isDark
                    ? `0 0 30px ${brandColors.neonPink}50, 0 8px 20px rgba(0,0,0,0.3)`
                    : `0 4px 20px ${brandColors.neonPink}40`,
                  color: '#FFFFFF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${isDark ? brandColors.neonCyan : brandColors.blue}, ${brandColors.blue})`
                  }}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <BookOpen className="w-5 h-5 relative z-10" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                <span className="relative z-10" style={{ fontWeight: 700 }}>{t("hero.cta.start")}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${locale}/lab`}
                className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg backdrop-blur-xl transition-all duration-300"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `2px solid ${isDark ? brandColors.neonCyan : brandColors.blue}`,
                  color: isDark ? brandColors.neonCyan : brandColors.blue,
                  boxShadow: isDark ? `0 0 15px ${brandColors.neonCyan}20` : 'none'
                }}
              >
                <Sparkles className="w-5 h-5" />
                AI Lab
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              animate={{
                y: [0, 8, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                type: "tween"
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <span
                  className="text-xs md:text-sm"
                  style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
                >
                  探索更多
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M12 5v14m0 0l-7-7m7 7l7-7"
                    stroke={isDark ? brandColors.neonCyan : brandColors.blue}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Curiosity Capture - Eye is now integrated into the OPEN text as 👁PEN */}
      {/* The mini icon appears in bottom-left when scrolled down - handled by CuriosityPopover */}

      {/* Mobile Curiosity Capture - Bottom Fixed */}
      {isMobile && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{
            left: 16,
            bottom: 80,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <CuriosityPopover isDark={isDark} isMobile={isMobile} />
        </motion.div>
      )}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at center, transparent 0%, #0E0E14 100%)'
            : 'radial-gradient(circle at center, transparent 0%, rgba(248,250,252,0.8) 100%)',
          opacity: isDark ? 0.6 : 0.4
        }}
      />
    </section>
  );
}
