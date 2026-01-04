"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Globe,
  Heart,
  Lightbulb,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface KeywordConfig {
  text: string;
  color: string;
  glowColor: string;
  icon: LucideIcon;
  description: string;
}

const keywords: KeywordConfig[] = [
  {
    text: "开放",
    color: "var(--neon-cyan)",
    glowColor: "rgba(37, 99, 235, 0.4)",
    icon: Globe,
    description: "向世界敞开大门，拥抱多元视角与全球资源",
  },
  {
    text: "包容",
    color: "var(--neon-green)",
    glowColor: "rgba(122, 154, 107, 0.4)",
    icon: Heart,
    description: "尊重每一个独特的想法，让每个人都能找到归属",
  },
  {
    text: "创新",
    color: "var(--neon-violet)",
    glowColor: "rgba(92, 84, 112, 0.4)",
    icon: Lightbulb,
    description: "鼓励突破边界，将天马行空的想法变为现实",
  },
];

// 装饰性粒子
const decorativeParticles = [
  { x: -120, y: -40, size: 4, delay: 0 },
  { x: 80, y: -60, size: 3, delay: 0.5 },
  { x: 150, y: 20, size: 5, delay: 1 },
  { x: -80, y: 50, size: 3, delay: 1.5 },
  { x: 200, y: -30, size: 4, delay: 2 },
];

interface LearningSpaceTaglineProps {
  className?: string;
  showDescription?: boolean;
}

export function LearningSpaceTagline({
  className = "",
  showDescription = true,
}: LearningSpaceTaglineProps) {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (delay: number) => ({
      opacity: [0.3, 0.8, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        delay,
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    }),
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  const hoveredConfig = keywords.find((k) => k.text === hoveredKeyword);

  return (
    <motion.div
      className={`relative ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      onViewportEnter={() => setIsVisible(true)}
    >
      {/* 装饰性粒子 */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {decorativeParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                x: particle.x,
                y: particle.y,
                background: `linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))`,
              }}
              variants={particleVariants}
              custom={particle.delay}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>
      )}

      {/* 主标语 */}
      <motion.div
        className="text-center text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed"
        variants={wordVariants}
      >
        <motion.span
          className="text-[var(--muted-foreground)]"
          variants={wordVariants}
        >
          一个
        </motion.span>

        {keywords.map((keyword, index) => (
          <span key={keyword.text}>
            <motion.span
              className="relative inline-block mx-1 cursor-pointer font-bold"
              variants={wordVariants}
              onHoverStart={() => setHoveredKeyword(keyword.text)}
              onHoverEnd={() => setHoveredKeyword(null)}
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
              style={{
                color: keyword.color,
              }}
            >
              {/* 发光效果层 */}
              <motion.span
                className="absolute inset-0 blur-lg rounded-lg -z-10"
                style={{ backgroundColor: keyword.glowColor }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hoveredKeyword === keyword.text ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* 底部装饰线 */}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 rounded-full"
                style={{ backgroundColor: keyword.color }}
                initial={{ width: 0 }}
                animate={{
                  width: hoveredKeyword === keyword.text ? "100%" : 0,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* 图标 */}
              <AnimatePresence>
                {hoveredKeyword === keyword.text && (
                  <motion.span
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.5 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
                  >
                    {(() => {
                      const IconComponent = keyword.icon;
                      return (
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: keyword.color }}
                        />
                      );
                    })()}
                  </motion.span>
                )}
              </AnimatePresence>

              {keyword.text}
            </motion.span>

            {index < keywords.length - 1 && (
              <motion.span
                className="text-[var(--muted-foreground)]"
                variants={wordVariants}
              >
                、
              </motion.span>
            )}
          </span>
        ))}

        <motion.span
          className="text-[var(--muted-foreground)]"
          variants={wordVariants}
        >
          的
        </motion.span>

        {/* 研究性学习空间 - 特殊处理 */}
        <motion.span
          className="relative inline-block ml-1"
          variants={wordVariants}
          whileHover={{
            scale: 1.02,
          }}
        >
          <span
            className="font-bold"
            style={{
              background:
                "linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-violet) 50%, var(--neon-pink) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            研究性学习空间
          </span>
          <motion.span
            className="absolute -bottom-2 left-0 right-0 h-1 rounded-full opacity-30"
            style={{
              background:
                "linear-gradient(90deg, var(--neon-cyan), var(--neon-violet), var(--neon-pink))",
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.span>
      </motion.div>

      {/* 悬停时显示的描述卡片 */}
      {showDescription && (
        <AnimatePresence mode="wait">
          {hoveredConfig && (
            <motion.div
              key={hoveredConfig.text}
              className="absolute left-1/2 -translate-x-1/2 mt-8 z-10"
              variants={descriptionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div
                className="glass-card px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg max-w-md"
                style={{
                  borderColor: hoveredConfig.color,
                  borderWidth: "1px",
                }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${hoveredConfig.color}20` }}
                >
                  {(() => {
                    const IconComponent = hoveredConfig.icon;
                    return (
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: hoveredConfig.color }}
                      />
                    );
                  })()}
                </div>
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: hoveredConfig.color }}
                  >
                    {hoveredConfig.text}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {hoveredConfig.description}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 底部装饰 - 书本图标 */}
      <motion.div
        className="flex justify-center mt-6 gap-4"
        variants={wordVariants}
      >
        <motion.div
          className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"
          whileHover={{ scale: 1.05 }}
        >
          <BookOpen className="w-4 h-4" />
          <span>从好奇到创造</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>点燃未来创新者</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default LearningSpaceTagline;
