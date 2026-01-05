"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ElementConfig {
  text: string;
  color: string;
  glowColor: string;
  description: string;
  svgPath: React.ReactNode;
}

const elements: ElementConfig[] = [
  {
    text: "有好奇心的人",
    color: "var(--neon-cyan)",
    glowColor: "rgba(37, 99, 235, 0.4)",
    description: "对世界充满好奇，永不停止探索和提问",
    svgPath: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* 人形轮廓 */}
        <circle cx="24" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M12 44 C12 32, 18 26, 24 26 C30 26, 36 32, 36 44"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        {/* 好奇心光芒 - 眼睛上方的星星 */}
        <motion.g
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="21" cy="10" r="1.5" fill="currentColor" />
          <circle cx="27" cy="10" r="1.5" fill="currentColor" />
        </motion.g>
        {/* 头顶的问号/好奇心符号 */}
        <motion.path
          d="M24 0 L24 3 M21 1.5 L27 1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    ),
  },
  {
    text: "有想象力的空间",
    color: "var(--neon-violet)",
    glowColor: "rgba(139, 92, 246, 0.4)",
    description: "激发创意的环境，让想象力自由生长",
    svgPath: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* 空间框架 - 立体房屋轮廓 */}
        <path
          d="M24 6 L42 18 L42 38 L24 46 L6 38 L6 18 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M24 6 L24 46"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
          fill="none"
        />
        <path
          d="M6 18 L24 26 L42 18"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
          fill="none"
        />
        {/* 内部星星 - 代表想象力 */}
        <motion.g
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="24" cy="32" r="2" fill="currentColor" />
        </motion.g>
        {/* 漂浮的灵感火花 */}
        <motion.circle
          cx="18"
          cy="24"
          r="1.5"
          fill="currentColor"
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.circle
          cx="30"
          cy="22"
          r="1.5"
          fill="currentColor"
          animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="24"
          cy="18"
          r="1"
          fill="currentColor"
          animate={{ y: [0, -2, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </svg>
    ),
  },
  {
    text: "有趣的问题",
    color: "var(--neon-pink)",
    glowColor: "rgba(236, 72, 153, 0.4)",
    description: "提出引人深思的问题，开启探索之旅",
    svgPath: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* 大问号 */}
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
          cx="24"
          cy="38"
          r="3"
          fill="currentColor"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* 周围的小问号/思考泡泡 */}
        <motion.g
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          <text x="6" y="20" fontSize="10" fill="currentColor" opacity="0.6">?</text>
          <text x="38" y="14" fontSize="8" fill="currentColor" opacity="0.5">?</text>
          <text x="40" y="32" fontSize="12" fill="currentColor" opacity="0.4">?</text>
        </motion.g>
        {/* 灵感火花 */}
        <motion.g
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: "24px 24px" }}
        >
          <line x1="8" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <line x1="40" y1="8" x2="36" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        </motion.g>
      </svg>
    ),
  },
];

// 连接线动画
const ConnectionLine = ({
  x1,
  y1,
  x2,
  y2,
  delay = 0
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
}) => (
  <motion.line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="url(#curiosity-gradient)"
    strokeWidth="2"
    strokeLinecap="round"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 0.3 }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
  />
);

// 漂浮粒子
const floatingParticles = [
  { x: 10, y: 20, size: 4, duration: 4 },
  { x: 90, y: 30, size: 3, duration: 5 },
  { x: 50, y: 80, size: 5, duration: 4.5 },
  { x: 20, y: 70, size: 3, duration: 5.5 },
  { x: 80, y: 60, size: 4, duration: 4 },
];

interface CuriosityTaglineProps {
  className?: string;
}

export function CuriosityTagline({ className = "" }: CuriosityTaglineProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 自动循环高亮效果
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (hoveredElement) return null; // 如果用户在悬停，暂停自动循环
        return prev === null ? 0 : (prev + 1) % elements.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, hoveredElement]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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

  const hoveredConfig = elements.find((e) => e.text === hoveredElement);
  const displayConfig = hoveredConfig || (activeIndex !== null ? elements[activeIndex] : null);

  return (
    <motion.div
      className={`relative py-12 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      onViewportEnter={() => setIsVisible(true)}
    >
      {/* 背景装饰 SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curiosity-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-cyan)" />
              <stop offset="50%" stopColor="var(--neon-violet)" />
              <stop offset="100%" stopColor="var(--neon-pink)" />
            </linearGradient>
          </defs>

          {isVisible && (
            <>
              <ConnectionLine x1={20} y1={50} x2={50} y2={50} delay={0.5} />
              <ConnectionLine x1={50} y1={50} x2={80} y2={50} delay={0.7} />
            </>
          )}
        </svg>

        {/* 漂浮粒子 */}
        {isVisible && floatingParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* 主标题 */}
      <motion.div
        className="text-center mb-8"
        variants={itemVariants}
      >
        <h3 className="text-lg md:text-xl text-[var(--muted-foreground)] font-medium">
          OWL 汇聚
        </h3>
      </motion.div>

      {/* 三个核心元素卡片 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto px-4">
        {elements.map((element, index) => {
          const isActive = hoveredElement === element.text || (!hoveredElement && activeIndex === index);

          return (
            <motion.div
              key={element.text}
              className="relative group cursor-pointer"
              variants={itemVariants}
              onHoverStart={() => {
                setHoveredElement(element.text);
                setActiveIndex(null);
              }}
              onHoverEnd={() => setHoveredElement(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 卡片容器 */}
              <motion.div
                className="relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300"
                style={{
                  borderColor: isActive ? element.color : "var(--glass-border)",
                  backgroundColor: isActive
                    ? `color-mix(in srgb, ${element.color} 5%, transparent)`
                    : "var(--glass-bg)",
                }}
                animate={{
                  boxShadow: isActive
                    ? `0 0 30px ${element.glowColor}, 0 0 60px ${element.glowColor}`
                    : "0 0 0 transparent",
                }}
              >
                {/* SVG 图标 */}
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 mb-4"
                  style={{ color: element.color }}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {element.svgPath}
                </motion.div>

                {/* 文字 */}
                <motion.span
                  className="text-lg md:text-xl font-bold whitespace-nowrap"
                  style={{ color: isActive ? element.color : "var(--foreground)" }}
                >
                  {element.text}
                </motion.span>

                {/* 装饰角标 */}
                <div
                  className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl transition-opacity duration-300"
                  style={{
                    borderColor: element.color,
                    opacity: isActive ? 0.6 : 0.2,
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-2xl transition-opacity duration-300"
                  style={{
                    borderColor: element.color,
                    opacity: isActive ? 0.6 : 0.2,
                  }}
                />
              </motion.div>

              {/* 连接符号 - 仅在非最后一个元素显示 */}
              {index < elements.length - 1 && (
                <motion.div
                  className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 text-2xl text-[var(--muted-foreground)]"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ×
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 描述文字区域 */}
      <div className="h-16 mt-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {displayConfig && (
            <motion.div
              key={displayConfig.text}
              className="text-center px-6 py-3 rounded-xl border max-w-md mx-auto"
              style={{
                borderColor: `color-mix(in srgb, ${displayConfig.color} 50%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${displayConfig.color} 5%, transparent)`,
              }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm md:text-base text-[var(--muted-foreground)]">
                {displayConfig.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部装饰线 */}
      <motion.div
        className="flex justify-center mt-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="h-px w-12 md:w-24"
            style={{
              background: "linear-gradient(90deg, transparent, var(--neon-cyan))",
            }}
            animate={{ scaleX: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))",
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-px w-12 md:w-24"
            style={{
              background: "linear-gradient(90deg, var(--neon-violet), transparent)",
            }}
            animate={{ scaleX: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CuriosityTagline;
