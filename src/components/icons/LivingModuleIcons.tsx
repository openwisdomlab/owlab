"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  color?: string;
  isHovered?: boolean;
}

/**
 * L01 - 空间的塑造 (Space as Educator)
 * 设计理念：3D等距立方体空间 + 浮动粒子 + 呼吸光晕
 */
export function SpaceIcon({ className = "", color = "var(--neon-cyan)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* 发光滤镜 */}
        <filter id="space-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 渐变 */}
        <linearGradient id="space-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 背景光晕 - 呼吸动画 */}
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill={color}
        opacity={0.05}
        animate={{
          r: isHovered ? [40, 44, 40] : [40, 42, 40],
          opacity: isHovered ? [0.08, 0.12, 0.08] : [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 等距立方体 - 底部 */}
      <motion.path
        d="M 50 65 L 30 55 L 50 45 L 70 55 Z"
        fill={color}
        opacity={0.15}
        animate={{ opacity: isHovered ? [0.15, 0.25, 0.15] : 0.15 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 等距立方体 - 左侧 */}
      <motion.path
        d="M 30 55 L 30 35 L 50 25 L 50 45 Z"
        fill="url(#space-gradient)"
        opacity={0.3}
        animate={{ opacity: isHovered ? [0.3, 0.45, 0.3] : 0.3 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 等距立方体 - 右侧 */}
      <motion.path
        d="M 70 55 L 70 35 L 50 25 L 50 45 Z"
        fill={color}
        opacity={0.2}
        animate={{ opacity: isHovered ? [0.2, 0.35, 0.2] : 0.2 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 立方体边框 */}
      <g filter="url(#space-glow)">
        <motion.path
          d="M 50 25 L 30 35 L 30 55 L 50 65 L 70 55 L 70 35 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity={0.6}
          animate={{ strokeWidth: isHovered ? [1.5, 2, 1.5] : 1.5 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <line x1="50" y1="25" x2="50" y2="45" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <line x1="50" y1="45" x2="30" y2="55" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <line x1="50" y1="45" x2="70" y2="55" stroke={color} strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* 浮动粒子 */}
      {[
        { cx: 25, cy: 30, delay: 0 },
        { cx: 75, cy: 28, delay: 0.3 },
        { cx: 20, cy: 60, delay: 0.6 },
        { cx: 80, cy: 62, delay: 0.9 },
        { cx: 50, cy: 80, delay: 1.2 },
      ].map((particle, i) => (
        <motion.circle
          key={i}
          cx={particle.cx}
          cy={particle.cy}
          r="2"
          fill={color}
          opacity={0.4}
          animate={{
            cy: [particle.cy, particle.cy - 6, particle.cy],
            opacity: isHovered ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 顶点高亮 */}
      <motion.circle
        cx="50"
        cy="25"
        r="3"
        fill={color}
        opacity={0.8}
        filter="url(#space-glow)"
        animate={{
          r: isHovered ? [3, 4, 3] : 3,
          opacity: isHovered ? [0.8, 1, 0.8] : 0.8,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * L02 - 思维的延伸 (Extended Mind)
 * 设计理念：神经网络 + 脉冲信号传递 + 连接动画
 */
export function MindIcon({ className = "", color = "var(--neon-violet)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="mind-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="mind-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 背景辐射 */}
      <motion.circle
        cx="50"
        cy="45"
        r="35"
        fill={color}
        opacity={0.03}
        animate={{
          r: isHovered ? [35, 40, 35] : [35, 37, 35],
          opacity: isHovered ? [0.05, 0.1, 0.05] : [0.03, 0.05, 0.03],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 神经元中心 - 大脑形状简化 */}
      <motion.ellipse
        cx="50"
        cy="40"
        rx="18"
        ry="15"
        fill={color}
        opacity={0.15}
        animate={{ opacity: isHovered ? [0.15, 0.25, 0.15] : 0.15 }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 大脑轮廓 */}
      <motion.path
        d="M 35 45 Q 25 40, 30 30 Q 35 20, 50 20 Q 65 20, 70 30 Q 75 40, 65 45 Q 70 50, 65 55 Q 55 60, 50 55 Q 45 60, 35 55 Q 30 50, 35 45"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity={0.5}
        filter="url(#mind-glow)"
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
          strokeWidth: isHovered ? [1.5, 2, 1.5] : 1.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 神经突触连接线 - 带脉冲动画 */}
      {[
        { x1: 50, y1: 40, x2: 25, y2: 25, delay: 0 },
        { x1: 50, y1: 40, x2: 75, y2: 25, delay: 0.4 },
        { x1: 50, y1: 40, x2: 20, y2: 55, delay: 0.8 },
        { x1: 50, y1: 40, x2: 80, y2: 55, delay: 1.2 },
        { x1: 50, y1: 40, x2: 35, y2: 75, delay: 1.6 },
        { x1: 50, y1: 40, x2: 65, y2: 75, delay: 2 },
      ].map((line, i) => (
        <g key={i}>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
          {/* 脉冲信号 */}
          <motion.circle
            r="2.5"
            fill={color}
            filter="url(#mind-glow)"
            animate={{
              cx: [line.x1, line.x2],
              cy: [line.y1, line.y2],
              opacity: isHovered ? [0.8, 0.8, 0] : [0.5, 0.5, 0],
            }}
            transition={{
              duration: 1.5,
              delay: line.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </g>
      ))}

      {/* 外围节点 */}
      {[
        { cx: 25, cy: 25 },
        { cx: 75, cy: 25 },
        { cx: 20, cy: 55 },
        { cx: 80, cy: 55 },
        { cx: 35, cy: 75 },
        { cx: 65, cy: 75 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="4"
          fill={color}
          opacity={0.5}
          animate={{
            r: isHovered ? [4, 5, 4] : 4,
            opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
          }}
          transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
        />
      ))}

      {/* 中心核心点 */}
      <motion.circle
        cx="50"
        cy="40"
        r="5"
        fill={color}
        opacity={0.9}
        filter="url(#mind-glow)"
        animate={{
          r: isHovered ? [5, 7, 5] : [5, 6, 5],
          opacity: isHovered ? [0.9, 1, 0.9] : [0.8, 0.9, 0.8],
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * L03 - 涌现的智慧 (Emergent Wisdom)
 * 设计理念：多个粒子汇聚涌现 + 连接网络 + 能量场
 */
export function EmergenceIcon({ className = "", color = "var(--neon-green)", isHovered = false }: IconProps) {
  // 粒子位置 - 从边缘向中心
  const particles = [
    { startX: 15, startY: 20, endX: 45, endY: 45 },
    { startX: 85, startY: 25, endX: 55, endY: 45 },
    { startX: 10, startY: 70, endX: 45, endY: 55 },
    { startX: 90, startY: 75, endX: 55, endY: 55 },
    { startX: 50, startY: 90, endX: 50, endY: 60 },
    { startX: 30, startY: 10, endX: 48, endY: 42 },
    { startX: 70, startY: 10, endX: 52, endY: 42 },
  ];

  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="emergence-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="emergence-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 能量场背景 */}
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        fill="url(#emergence-radial)"
        animate={{
          r: isHovered ? [30, 38, 30] : [30, 33, 30],
          opacity: isHovered ? [0.8, 1, 0.8] : [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 连接网络线 */}
      <g opacity={0.2}>
        <motion.line
          x1="30" y1="35" x2="70" y2="35"
          stroke={color} strokeWidth="1"
          animate={{ opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line
          x1="30" y1="65" x2="70" y2="65"
          stroke={color} strokeWidth="1"
          animate={{ opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.line
          x1="35" y1="25" x2="35" y2="75"
          stroke={color} strokeWidth="1"
          animate={{ opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
        <motion.line
          x1="65" y1="25" x2="65" y2="75"
          stroke={color} strokeWidth="1"
          animate={{ opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
        />
        {/* 对角线连接 */}
        <line x1="30" y1="35" x2="50" y2="50" stroke={color} strokeWidth="1" />
        <line x1="70" y1="35" x2="50" y2="50" stroke={color} strokeWidth="1" />
        <line x1="30" y1="65" x2="50" y2="50" stroke={color} strokeWidth="1" />
        <line x1="70" y1="65" x2="50" y2="50" stroke={color} strokeWidth="1" />
      </g>

      {/* 涌动粒子 - 从边缘向中心汇聚 */}
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          r="2.5"
          fill={color}
          opacity={0.6}
          animate={{
            cx: isHovered
              ? [p.startX, p.endX, p.startX]
              : [p.startX, (p.startX + p.endX) / 2, p.startX],
            cy: isHovered
              ? [p.startY, p.endY, p.startY]
              : [p.startY, (p.startY + p.endY) / 2, p.startY],
            opacity: [0.3, 0.8, 0.3],
            r: [2, 3.5, 2],
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 中心涌现光点 */}
      <motion.circle
        cx="50"
        cy="50"
        r="8"
        fill={color}
        opacity={0.3}
        filter="url(#emergence-glow)"
        animate={{
          r: isHovered ? [8, 14, 8] : [8, 10, 8],
          opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 中心核心 */}
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill={color}
        opacity={0.9}
        filter="url(#emergence-glow)"
        animate={{
          r: isHovered ? [5, 7, 5] : [5, 6, 5],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 涌现环 */}
      <motion.circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity={0.3}
        animate={{
          r: isHovered ? [20, 35, 20] : [20, 25, 20],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * L04 - 技术的诗意 (Poetics of Technology)
 * 设计理念：流动的有机曲线 + 诗意的粒子轨迹 + 柔和光效
 */
export function PoeticsIcon({ className = "", color = "var(--neon-pink)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="poetics-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="poetics-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="poetics-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 背景光晕 */}
      <motion.ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="30"
        fill={color}
        opacity={0.04}
        animate={{
          rx: isHovered ? [35, 40, 35] : [35, 37, 35],
          ry: isHovered ? [30, 35, 30] : [30, 32, 30],
          opacity: isHovered ? [0.06, 0.1, 0.06] : [0.04, 0.06, 0.04],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 流动曲线 1 - 上方 */}
      <motion.path
        d="M 15 40 Q 35 20, 50 35 Q 65 50, 85 30"
        fill="none"
        stroke="url(#poetics-gradient-1)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#poetics-glow)"
        animate={{
          d: isHovered
            ? ["M 15 40 Q 35 20, 50 35 Q 65 50, 85 30", "M 15 35 Q 35 25, 50 40 Q 65 55, 85 35", "M 15 40 Q 35 20, 50 35 Q 65 50, 85 30"]
            : "M 15 40 Q 35 20, 50 35 Q 65 50, 85 30",
          strokeWidth: isHovered ? [2, 2.5, 2] : 2,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 流动曲线 2 - 中间 */}
      <motion.path
        d="M 10 55 Q 30 70, 50 50 Q 70 30, 90 55"
        fill="none"
        stroke="url(#poetics-gradient-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#poetics-glow)"
        animate={{
          d: isHovered
            ? ["M 10 55 Q 30 70, 50 50 Q 70 30, 90 55", "M 10 50 Q 30 65, 50 55 Q 70 45, 90 50", "M 10 55 Q 30 70, 50 50 Q 70 30, 90 55"]
            : "M 10 55 Q 30 70, 50 50 Q 70 30, 90 55",
          strokeWidth: isHovered ? [2.5, 3, 2.5] : 2.5,
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 流动曲线 3 - 下方 */}
      <motion.path
        d="M 15 75 Q 40 55, 50 65 Q 60 75, 85 60"
        fill="none"
        stroke="url(#poetics-gradient-1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#poetics-glow)"
        animate={{
          d: isHovered
            ? ["M 15 75 Q 40 55, 50 65 Q 60 75, 85 60", "M 15 70 Q 40 60, 50 70 Q 60 80, 85 65", "M 15 75 Q 40 55, 50 65 Q 60 75, 85 60"]
            : "M 15 75 Q 40 55, 50 65 Q 60 75, 85 60",
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 沿曲线流动的粒子 */}
      <motion.circle
        r="3"
        fill={color}
        opacity={0.8}
        filter="url(#poetics-glow)"
        animate={{
          cx: [15, 35, 50, 65, 85],
          cy: [40, 28, 35, 42, 30],
          opacity: [0.4, 0.8, 1, 0.8, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.circle
        r="2.5"
        fill={color}
        opacity={0.7}
        filter="url(#poetics-glow)"
        animate={{
          cx: [10, 30, 50, 70, 90],
          cy: [55, 65, 50, 35, 55],
          opacity: [0.3, 0.7, 1, 0.7, 0.3],
        }}
        transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.circle
        r="2"
        fill={color}
        opacity={0.6}
        filter="url(#poetics-glow)"
        animate={{
          cx: [15, 40, 50, 60, 85],
          cy: [75, 58, 65, 73, 60],
          opacity: [0.2, 0.6, 0.8, 0.6, 0.2],
        }}
        transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 装饰性小点 */}
      {[
        { cx: 25, cy: 30, delay: 0 },
        { cx: 75, cy: 40, delay: 0.5 },
        { cx: 30, cy: 65, delay: 1 },
        { cx: 70, cy: 70, delay: 1.5 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="1.5"
          fill={color}
          opacity={0.4}
          animate={{
            opacity: isHovered ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3],
            r: isHovered ? [1.5, 2.5, 1.5] : [1.5, 2, 1.5],
          }}
          transition={{ duration: 2, delay: dot.delay, repeat: Infinity }}
        />
      ))}

      {/* 中心交汇点 */}
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill={color}
        opacity={0.9}
        filter="url(#poetics-glow)"
        animate={{
          r: isHovered ? [4, 6, 4] : [4, 5, 4],
          opacity: isHovered ? [0.9, 1, 0.9] : [0.8, 0.9, 0.8],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  );
}

// 导出所有图标
export const LivingModuleIcons = {
  Space: SpaceIcon,
  Mind: MindIcon,
  Emergence: EmergenceIcon,
  Poetics: PoeticsIcon,
};

export default LivingModuleIcons;
