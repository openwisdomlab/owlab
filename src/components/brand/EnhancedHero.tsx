"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Eye } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { brandColors } from "@/lib/brand/colors";
import { useTheme } from "@/components/ui/ThemeProvider";

interface EnhancedHeroProps {
  locale: string;
  t: any;
}

export function EnhancedHero({ locale, t }: EnhancedHeroProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: isDark ? '#0E0E14' : '#F8FAFC' }} />

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

      {/* Waypoint Markers - Map Navigation Style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left waypoint */}
        <motion.div
          className="absolute top-[15%] left-[10%]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="8" fill="none" stroke={brandColors.neonCyan} strokeWidth="2" />
            <circle cx="30" cy="30" r="3" fill={brandColors.neonCyan} />
            <motion.circle
              cx="30" cy="30" r="15"
              fill="none"
              stroke={brandColors.neonCyan}
              strokeWidth="1"
              strokeDasharray="2 3"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Top-right waypoint */}
        <motion.div
          className="absolute top-[20%] right-[15%]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="8" fill="none" stroke={brandColors.violet} strokeWidth="2" />
            <circle cx="30" cy="30" r="3" fill={brandColors.violet} />
            <motion.circle
              cx="30" cy="30" r="15"
              fill="none"
              stroke={brandColors.violet}
              strokeWidth="1"
              strokeDasharray="2 3"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Bottom-left waypoint */}
        <motion.div
          className="absolute bottom-[25%] left-[12%]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="8" fill="none" stroke={brandColors.neonPink} strokeWidth="2" />
            <circle cx="30" cy="30" r="3" fill={brandColors.neonPink} />
            <motion.circle
              cx="30" cy="30" r="15"
              fill="none"
              stroke={brandColors.neonPink}
              strokeWidth="1"
              strokeDasharray="2 3"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Bottom-right waypoint */}
        <motion.div
          className="absolute bottom-[20%] right-[10%]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="8" fill="none" stroke={brandColors.emerald} strokeWidth="2" />
            <circle cx="30" cy="30" r="3" fill={brandColors.emerald} />
            <motion.circle
              cx="30" cy="30" r="15"
              fill="none"
              stroke={brandColors.emerald}
              strokeWidth="1"
              strokeDasharray="2 3"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Connecting paths between waypoints */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
          <motion.path
            d="M 10% 15%, Q 50% 10%, 85% 20%"
            fill="none"
            stroke={brandColors.neonCyan}
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.path
            d="M 10% 15%, L 12% 75%"
            fill="none"
            stroke={brandColors.violet}
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
          <motion.path
            d="M 85% 20%, L 90% 80%"
            fill="none"
            stroke={brandColors.neonPink}
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.4 }}
          />
          <motion.path
            d="M 12% 75%, Q 50% 90%, 90% 80%"
            fill="none"
            stroke={brandColors.emerald}
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.6 }}
          />
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {/* Curious Owl Eye Icon */}
          <motion.div
            className="inline-flex items-center justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              className="relative w-20 h-20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${brandColors.blue}40, transparent)`,
                  filter: 'blur(20px)'
                }}
              />
              <Eye className="w-20 h-20 relative z-10" style={{ color: brandColors.neonCyan }} />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: brandColors.neonPink }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* "Open Wisdom Lab" Typography - Refined Size */}
          <motion.h1
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                backgroundImage: isDark
                  ? `linear-gradient(135deg, ${brandColors.neonCyan} 0%, ${brandColors.violet} 30%, ${brandColors.neonPink} 60%, ${brandColors.blue} 100%)`
                  : `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.violet} 50%, ${brandColors.neonPink} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: isDark ? `0 0 60px ${brandColors.neonCyan}40` : 'none',
                letterSpacing: '-0.03em'
              }}
            >
              OPEN
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
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
              {/* 有好奇心的人 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${brandColors.neonCyan}20, ${brandColors.neonCyan}10)`
                      : `linear-gradient(135deg, ${brandColors.blue}15, ${brandColors.blue}05)`,
                    border: `1px solid ${isDark ? brandColors.neonCyan : brandColors.blue}40`
                  }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 md:w-10 md:h-10" style={{ color: isDark ? brandColors.neonCyan : brandColors.blue }}>
                    <circle cx="24" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M12 44 C12 32, 18 26, 24 26 C30 26, 36 32, 36 44" stroke="currentColor" strokeWidth="2" fill="none" />
                    <motion.g
                      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <circle cx="21" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="27" cy="10" r="1.5" fill="currentColor" />
                    </motion.g>
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

              {/* 有想象力的空间 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.violet}20, ${brandColors.violet}10)`,
                    border: `1px solid ${brandColors.violet}40`
                  }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 md:w-10 md:h-10" style={{ color: brandColors.violet }}>
                    {/* 空间框架 - 3D透视房间轮廓 */}
                    <path d="M8 36 L8 16 L24 8 L40 16 L40 36 L24 44 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                    <path d="M8 16 L24 24 L40 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M24 24 L24 44" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    {/* 想象力星星 - 动画闪烁 */}
                    <motion.g
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M18 18 L19 20 L18 22 L17 20 Z" fill="currentColor" />
                    </motion.g>
                    <motion.g
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M30 14 L31.5 17 L30 20 L28.5 17 Z" fill="currentColor" />
                    </motion.g>
                    <motion.circle
                      cx="34" cy="26" r="1.5"
                      fill="currentColor"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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

              {/* 有趣的问题 */}
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.neonPink}20, ${brandColors.neonPink}10)`,
                    border: `1px solid ${brandColors.neonPink}40`
                  }}
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 md:w-10 md:h-10" style={{ color: brandColors.neonPink }}>
                    <motion.path
                      d="M18 16 Q18 8, 24 8 Q32 8, 32 16 Q32 22, 24 24 L24 30"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      animate={{ pathLength: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.circle
                      cx="24" cy="38" r="3"
                      fill="currentColor"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
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
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
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
                className="group relative inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg overflow-hidden text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandColors.neonPink}, ${brandColors.violet})`,
                  boxShadow: isDark
                    ? `0 0 30px ${brandColors.neonPink}50, 0 8px 20px rgba(0,0,0,0.3)`
                    : `0 4px 20px ${brandColors.neonPink}40`
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
                <BookOpen className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t("hero.cta.start")}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
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
                ease: "easeInOut"
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
