"use client";

import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { BookOpen, ArrowRight, Sparkles, Eye } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { brandColors } from "@/lib/brand/colors";

interface EnhancedHeroProps {
  locale: string;
  t: any;
}

export function EnhancedHero({ locale, t }: EnhancedHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Field Background */}
      <div className="absolute inset-0 bg-[#0E0E14]">
        <ParticleField
          count={100}
          connectionThreshold={180}
          maxConnections={25}
          speed={0.4}
          mouseInfluence={true}
        />
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

          {/* MASSIVE "Open Wisdom Lab" Typography */}
          <motion.h1
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none tracking-tighter"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                background: `linear-gradient(135deg, ${brandColors.neonCyan} 0%, ${brandColors.violet} 30%, ${brandColors.neonPink} 60%, ${brandColors.blue} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: `0 0 80px ${brandColors.neonCyan}50`,
                letterSpacing: '-0.05em'
              }}
            >
              OPEN
            </span>
            <span
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none tracking-tighter -mt-4"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                background: `linear-gradient(135deg, ${brandColors.violet} 0%, ${brandColors.neonPink} 50%, ${brandColors.neonCyan} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em'
              }}
            >
              WISDOM
            </span>
            <span
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-none tracking-tighter -mt-4"
              style={{
                fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif",
                background: `linear-gradient(135deg, ${brandColors.neonPink} 0%, ${brandColors.blue} 50%, ${brandColors.violet} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em'
              }}
            >
              LAB
            </span>
          </motion.h1>

          {/* Chinese Subtitle */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{
                fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                color: brandColors.neonCyan,
                letterSpacing: '0.05em'
              }}
            >
              开放智慧实验室
            </h2>
          </motion.div>

          {/* Philosophy Text - NEW */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#0E0E14]/60 to-[#1a1a2e]/40 border border-white/10">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: brandColors.neonPink }} />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: brandColors.neonCyan }} />

              <p
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium"
                style={{
                  fontFamily: "'Source Han Sans CN', 'Noto Sans SC', sans-serif",
                  background: `linear-gradient(135deg, ${brandColors.neonCyan}, ${brandColors.neonPink})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.02em'
                }}
              >
                一个开放、包容、创新的学习空间。
                <br />
                <span className="inline-block mt-2">
                  让有好奇心的人、天马行空的想法
                </span>
                <br />
                <span className="inline-block mt-2">
                  和有趣的问题在此汇聚和激发。
                </span>
              </p>

              {/* Animated particles inside the box */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? brandColors.neonPink : brandColors.neonCyan,
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6"
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
                href={`/${locale}/docs/knowledge-base`}
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl overflow-hidden text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandColors.neonPink}, ${brandColors.violet})`,
                  boxShadow: `0 0 40px ${brandColors.neonPink}60, 0 10px 30px rgba(0,0,0,0.3)`
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.neonCyan}, ${brandColors.blue})`
                  }}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <BookOpen className="w-6 h-6 relative z-10" />
                <span className="relative z-10">{t("hero.cta.start")}</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${locale}/lab`}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                style={{
                  border: `2px solid ${brandColors.neonCyan}`,
                  color: brandColors.neonCyan,
                  boxShadow: `0 0 20px ${brandColors.neonCyan}30`
                }}
              >
                <Sparkles className="w-6 h-6" />
                AI Lab
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm opacity-60">探索更多</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M12 5v14m0 0l-7-7m7 7l7-7"
                    stroke={brandColors.neonCyan}
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
          background: 'radial-gradient(circle at center, transparent 0%, #0E0E14 100%)',
          opacity: 0.6
        }}
      />
    </section>
  );
}
