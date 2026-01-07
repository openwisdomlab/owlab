"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  color?: string;
  isHovered?: boolean;
}

// ============================================
// L01 - 空间的塑造 (Space as Educator) 原则图标
// ============================================

/**
 * 以学生为中心 - 放射状圆环
 */
export function StudentCenteredIcon({ className = "", color = "var(--neon-cyan)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 中心圆 - 学生 */}
      <motion.circle
        cx="50"
        cy="50"
        r="10"
        fill={color}
        opacity={0.6}
        animate={{
          r: isHovered ? [10, 12, 10] : 10,
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* 环绕轨道 */}
      {[22, 32, 42].map((r, i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray={`${4 + i * 2} ${4 + i * 2}`}
          opacity={0.3 - i * 0.08}
          animate={{
            strokeDashoffset: isHovered ? [0, 20] : 0,
          }}
          transition={{ duration: 3 - i * 0.5, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* 环绕点 */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 32;
        const cy = 50 + Math.sin(rad) * 32;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill={color}
            opacity={0.5}
            animate={{
              opacity: isHovered ? [0.5, 0.9, 0.5] : 0.5,
            }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        );
      })}
    </svg>
  );
}

/**
 * 鼓励大胆探索 - 上升火箭轨迹
 */
export function ExploreIcon({ className = "", color = "var(--neon-green)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 上升路径 */}
      <motion.path
        d="M 20 85 Q 35 60, 50 50 Q 65 40, 75 20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity={0.4}
        animate={{
          strokeDashoffset: isHovered ? [0, -20] : 0,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* 上升的节点 */}
      {[
        { cx: 25, cy: 78, r: 3, delay: 0 },
        { cx: 40, cy: 58, r: 3.5, delay: 0.2 },
        { cx: 55, cy: 45, r: 4, delay: 0.4 },
        { cx: 70, cy: 28, r: 4.5, delay: 0.6 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          fill={color}
          opacity={0.4 + i * 0.15}
          animate={{
            cy: isHovered ? [node.cy, node.cy - 5, node.cy] : node.cy,
            opacity: isHovered ? [0.4 + i * 0.15, 0.8, 0.4 + i * 0.15] : 0.4 + i * 0.15,
          }}
          transition={{ duration: 1.2, delay: node.delay, repeat: Infinity }}
        />
      ))}

      {/* 顶端星星 */}
      <motion.path
        d="M 75 20 L 77 16 L 81 18 L 78 14 L 82 12 L 77 12 L 75 8 L 73 12 L 68 12 L 72 14 L 69 18 L 73 16 Z"
        fill={color}
        opacity={0.8}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? [0.8, 1, 0.8] : 0.8,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 科技感与未来感 - 六边形网格
 */
export function FuturisticIcon({ className = "", color = "var(--neon-violet)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 中心六边形 */}
      <motion.path
        d="M 50 25 L 68 35 L 68 55 L 50 65 L 32 55 L 32 35 Z"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth="1.5"
        animate={{
          opacity: isHovered ? [0.15, 0.3, 0.15] : 0.15,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 外层六边形 */}
      <motion.path
        d="M 50 12 L 78 28 L 78 62 L 50 78 L 22 62 L 22 28 Z"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="6,4"
        opacity={0.3}
        animate={{
          strokeDashoffset: isHovered ? [0, 20] : 0,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* 连接线 */}
      {[
        { x1: 50, y1: 25, x2: 50, y2: 12 },
        { x1: 68, y1: 35, x2: 78, y2: 28 },
        { x1: 68, y1: 55, x2: 78, y2: 62 },
        { x1: 50, y1: 65, x2: 50, y2: 78 },
        { x1: 32, y1: 55, x2: 22, y2: 62 },
        { x1: 32, y1: 35, x2: 22, y2: 28 },
      ].map((line, i) => (
        <motion.line
          key={i}
          {...line}
          stroke={color}
          strokeWidth="1"
          opacity={0.4}
          animate={{
            opacity: isHovered ? [0.4, 0.7, 0.4] : 0.4,
          }}
          transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
        />
      ))}

      {/* 中心点 */}
      <motion.circle
        cx="50"
        cy="45"
        r="4"
        fill={color}
        opacity={0.8}
        animate={{
          r: isHovered ? [4, 5, 4] : 4,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 灵活流动的空间 - 波浪曲线
 */
export function FlowingSpaceIcon({ className = "", color = "var(--neon-pink)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 流动波浪 */}
      {[
        { y: 30, opacity: 0.5, delay: 0 },
        { y: 50, opacity: 0.6, delay: 0.3 },
        { y: 70, opacity: 0.5, delay: 0.6 },
      ].map((wave, i) => (
        <motion.path
          key={i}
          d={`M 10 ${wave.y} Q 30 ${wave.y - 15}, 50 ${wave.y} T 90 ${wave.y}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={wave.opacity}
          animate={{
            d: isHovered
              ? [
                  `M 10 ${wave.y} Q 30 ${wave.y - 15}, 50 ${wave.y} T 90 ${wave.y}`,
                  `M 10 ${wave.y} Q 30 ${wave.y + 10}, 50 ${wave.y} T 90 ${wave.y}`,
                  `M 10 ${wave.y} Q 30 ${wave.y - 15}, 50 ${wave.y} T 90 ${wave.y}`,
                ]
              : `M 10 ${wave.y} Q 30 ${wave.y - 15}, 50 ${wave.y} T 90 ${wave.y}`,
          }}
          transition={{ duration: 2, delay: wave.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* 流动粒子 */}
      <motion.circle
        r="3"
        fill={color}
        opacity={0.7}
        animate={{
          cx: [15, 50, 85],
          cy: [30, 38, 30],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ============================================
// L02 - 思维的延伸 (Extended Mind) 原则图标
// ============================================

/**
 * 工具即思维 - 大脑与工具连接
 */
export function ToolMindIcon({ className = "", color = "var(--neon-violet)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 大脑轮廓 */}
      <motion.ellipse
        cx="35"
        cy="45"
        rx="18"
        ry="20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.5}
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 工具符号 */}
      <motion.g
        animate={{
          x: isHovered ? [0, 2, 0] : 0,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <rect x="60" y="35" width="22" height="8" rx="2" fill={color} opacity="0.4" />
        <rect x="65" y="43" width="5" height="18" rx="1" fill={color} opacity="0.4" />
      </motion.g>

      {/* 连接脉冲 */}
      <motion.line
        x1="53"
        y1="45"
        x2="60"
        y2="42"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="3,3"
        opacity={0.6}
        animate={{
          strokeDashoffset: isHovered ? [0, -12] : 0,
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* 神经连接点 */}
      <motion.circle
        cx="35"
        cy="45"
        r="4"
        fill={color}
        opacity={0.8}
        animate={{
          r: isHovered ? [4, 5, 4] : 4,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 预测-验证循环 - 循环箭头
 */
export function PredictLoopIcon({ className = "", color = "var(--neon-cyan)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 上半弧 */}
      <motion.path
        d="M 70 35 A 22 22 0 1 0 30 35"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity={0.6}
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 下半弧 */}
      <motion.path
        d="M 30 55 A 22 22 0 1 0 70 55"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity={0.6}
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
      />

      {/* 箭头 */}
      <motion.polygon
        points="28,35 34,30 34,40"
        fill={color}
        opacity={0.7}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.polygon
        points="72,55 66,60 66,50"
        fill={color}
        opacity={0.7}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
      />

      {/* 中心交叉点 */}
      <circle cx="50" cy="45" r="3" fill={color} opacity="0.5" />
    </svg>
  );
}

/**
 * 身体锚定思维 - 手与大脑连接
 */
export function EmbodiedIcon({ className = "", color = "var(--neon-pink)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 手形轮廓简化 */}
      <motion.path
        d="M 30 70 L 30 50 Q 30 40, 40 40 L 45 40 L 45 35 Q 45 28, 50 28 L 55 28 Q 60 28, 60 35 L 60 40 L 65 40 Q 70 40, 70 50 L 70 65 Q 70 75, 50 75 Q 30 75, 30 70"
        fill={color}
        opacity={0.25}
        animate={{
          opacity: isHovered ? [0.25, 0.4, 0.25] : 0.25,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 大脑连接 */}
      <motion.circle
        cx="50"
        cy="18"
        r="10"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity={0.5}
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 连接线 */}
      <motion.line
        x1="50"
        y1="28"
        x2="50"
        y2="35"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="2,2"
        opacity={0.6}
        animate={{
          strokeDashoffset: isHovered ? [0, -8] : 0,
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* 信号点 */}
      <motion.circle
        cx="50"
        cy="18"
        r="3"
        fill={color}
        opacity={0.9}
        animate={{
          r: isHovered ? [3, 4, 3] : 3,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 人机协作智能 - 人与AI节点连接
 */
export function HumanAIIcon({ className = "", color = "var(--neon-green)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 人形节点 */}
      <motion.circle
        cx="30"
        cy="45"
        r="14"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.5}
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* AI矩形节点 */}
      <motion.rect
        x="54"
        y="31"
        width="28"
        height="28"
        rx="4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.5}
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
      />

      {/* 连接桥 */}
      <motion.line
        x1="44"
        y1="45"
        x2="54"
        y2="45"
        stroke={color}
        strokeWidth="3"
        opacity={0.7}
        animate={{
          strokeWidth: isHovered ? [3, 4, 3] : 3,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* 协作光点 */}
      <motion.circle
        cx="49"
        cy="45"
        r="3"
        fill={color}
        opacity={0.9}
        animate={{
          r: isHovered ? [3, 4, 3] : 3,
          opacity: isHovered ? [0.9, 1, 0.9] : 0.9,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* 网络延伸点 */}
      {[
        { cx: 25, cy: 25 },
        { cx: 75, cy: 25 },
        { cx: 25, cy: 70 },
        { cx: 75, cy: 70 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="2.5"
          fill={color}
          opacity={0.4}
          animate={{
            opacity: isHovered ? [0.4, 0.7, 0.4] : 0.4,
          }}
          transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

// ============================================
// L03 - 涌现的智慧 (Emergent Wisdom) 原则图标
// ============================================

/**
 * 对话即智能 - 交叠的对话气泡
 */
export function DialogueIcon({ className = "", color = "var(--neon-green)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 气泡1 */}
      <motion.path
        d="M 20 35 Q 20 22, 35 22 L 52 22 Q 65 22, 65 35 L 65 48 Q 65 60, 52 60 L 38 60 L 30 68 L 30 60 Q 20 60, 20 48 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity={0.5}
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 气泡2 */}
      <motion.path
        d="M 35 45 Q 35 32, 50 32 L 67 32 Q 80 32, 80 45 L 80 58 Q 80 70, 67 70 L 53 70 L 45 78 L 45 70 Q 35 70, 35 58 Z"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth="1.5"
        animate={{
          opacity: isHovered ? [0.15, 0.3, 0.15] : 0.15,
        }}
        transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
      />

      {/* 交汇智慧光点 */}
      <motion.circle
        cx="52"
        cy="48"
        r="6"
        fill={color}
        opacity={0.5}
        animate={{
          r: isHovered ? [6, 8, 6] : 6,
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 边缘参与路径 - 同心圆向心路径
 */
export function PeripheryIcon({ className = "", color = "var(--neon-cyan)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 同心圆 */}
      {[38, 28, 18, 8].map((r, i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={1 + i * 0.3}
          opacity={0.2 + i * 0.15}
          animate={{
            opacity: isHovered ? [0.2 + i * 0.15, 0.4 + i * 0.15, 0.2 + i * 0.15] : 0.2 + i * 0.15,
          }}
          transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
        />
      ))}

      {/* 向心箭头 */}
      <motion.path
        d="M 88 50 L 62 50"
        stroke={color}
        strokeWidth="2"
        opacity={0.6}
        animate={{
          opacity: isHovered ? [0.6, 1, 0.6] : 0.6,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.polygon
        points="62,50 68,46 68,54"
        fill={color}
        opacity={0.6}
        animate={{
          x: isHovered ? [0, -3, 0] : 0,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* 核心点 */}
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill={color}
        opacity={0.9}
        animate={{
          r: isHovered ? [5, 7, 5] : 5,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 知识自组织 - 网络节点图
 */
export function SelfOrganizeIcon({ className = "", color = "var(--neon-violet)", isHovered = false }: IconProps) {
  const nodes = [
    { cx: 50, cy: 25 },
    { cx: 28, cy: 45 },
    { cx: 72, cy: 45 },
    { cx: 35, cy: 72 },
    { cx: 65, cy: 72 },
  ];

  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 连接线 */}
      <g opacity={0.4}>
        <line x1="50" y1="25" x2="28" y2="45" stroke={color} strokeWidth="1.5" />
        <line x1="50" y1="25" x2="72" y2="45" stroke={color} strokeWidth="1.5" />
        <line x1="28" y1="45" x2="35" y2="72" stroke={color} strokeWidth="1.5" />
        <line x1="72" y1="45" x2="65" y2="72" stroke={color} strokeWidth="1.5" />
        <line x1="35" y1="72" x2="65" y2="72" stroke={color} strokeWidth="1.5" />
        <line x1="28" y1="45" x2="72" y2="45" stroke={color} strokeWidth="1.5" />
      </g>

      {/* 节点 */}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="6"
          fill={color}
          opacity={0.6}
          animate={{
            r: isHovered ? [6, 8, 6] : 6,
            opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6,
          }}
          transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

/**
 * AI辅助协作 - 中心AI辐射连接
 */
export function AICollabIcon({ className = "", color = "var(--neon-pink)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* AI中心 */}
      <motion.rect
        x="38"
        y="38"
        width="24"
        height="24"
        rx="4"
        fill={color}
        opacity={0.5}
        animate={{
          opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 辐射连接 */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 32;
        const cy = 50 + Math.sin(rad) * 32;
        return (
          <g key={i}>
            <motion.line
              x1="50"
              y1="50"
              x2={cx}
              y2={cy}
              stroke={color}
              strokeWidth="1.5"
              opacity={0.5}
              animate={{
                opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
              }}
              transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity }}
            />
            <motion.circle
              cx={cx}
              cy={cy}
              r="7"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity={0.4}
              animate={{
                opacity: isHovered ? [0.4, 0.7, 0.4] : 0.4,
              }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
            />
          </g>
        );
      })}

      {/* 脉冲信号 */}
      {isHovered && (
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          fill="none"
          stroke={color}
          strokeWidth="1"
          initial={{ r: 15, opacity: 0.6 }}
          animate={{ r: 40, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

// ============================================
// L04 - 技术的诗意 (Poetics of Technology) 原则图标
// ============================================

/**
 * 挑战即成长 - 阶梯上升
 */
export function ChallengeGrowthIcon({ className = "", color = "var(--neon-pink)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 阶梯 */}
      <motion.path
        d="M 15 85 L 15 70 L 30 70 L 30 55 L 45 55 L 45 40 L 60 40 L 60 25 L 75 25 L 75 15 L 85 15"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        opacity={0.6}
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 阶梯填充 */}
      {[
        { x: 15, y: 70, w: 15, h: 15, opacity: 0.15 },
        { x: 30, y: 55, w: 15, h: 15, opacity: 0.2 },
        { x: 45, y: 40, w: 15, h: 15, opacity: 0.25 },
        { x: 60, y: 25, w: 15, h: 15, opacity: 0.3 },
      ].map((step, i) => (
        <motion.rect
          key={i}
          x={step.x}
          y={step.y}
          width={step.w}
          height={step.h}
          fill={color}
          opacity={step.opacity}
          animate={{
            opacity: isHovered ? [step.opacity, step.opacity + 0.15, step.opacity] : step.opacity,
          }}
          transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
        />
      ))}

      {/* 顶端旗帜 */}
      <motion.path
        d="M 85 15 L 85 5 L 95 10 L 85 15"
        fill={color}
        opacity={0.8}
        animate={{
          scale: isHovered ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 失败即反馈 - X变对勾
 */
export function FailureLearnIcon({ className = "", color = "var(--neon-green)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* X (淡化) */}
      <g opacity={0.3}>
        <motion.line
          x1="22"
          y1="30"
          x2="42"
          y2="50"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            opacity: isHovered ? [0.3, 0.15, 0.3] : 0.3,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.line
          x1="42"
          y1="30"
          x2="22"
          y2="50"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            opacity: isHovered ? [0.3, 0.15, 0.3] : 0.3,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </g>

      {/* 箭头 */}
      <motion.path
        d="M 48 40 L 58 40"
        stroke={color}
        strokeWidth="2"
        opacity={0.5}
        animate={{
          x: isHovered ? [0, 3, 0] : 0,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <polygon points="58,40 54,36 54,44" fill={color} opacity="0.5" />

      {/* 对勾 */}
      <motion.path
        d="M 62 40 L 70 50 L 88 28"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
        animate={{
          opacity: isHovered ? [0.8, 1, 0.8] : 0.8,
          strokeWidth: isHovered ? [3.5, 4.5, 3.5] : 3.5,
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* 灵感光点 */}
      <motion.circle
        cx="75"
        cy="38"
        r="3"
        fill={color}
        opacity={0.6}
        animate={{
          r: isHovered ? [3, 4, 3] : 3,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

/**
 * 战略性生成 - 发散分支
 */
export function StrategicGenIcon({ className = "", color = "var(--neon-cyan)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 中心点 */}
      <motion.circle
        cx="50"
        cy="50"
        r="7"
        fill={color}
        opacity={0.7}
        animate={{
          r: isHovered ? [7, 9, 7] : 7,
          opacity: isHovered ? [0.7, 0.95, 0.7] : 0.7,
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* 发散分支 */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 35;
        const y = 50 + Math.sin(rad) * 35;
        return (
          <g key={i}>
            <motion.line
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth="1.5"
              opacity={0.4}
              animate={{
                opacity: isHovered ? [0.4, 0.7, 0.4] : 0.4,
              }}
              transition={{ duration: 1.2, delay: i * 0.08, repeat: Infinity }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="4"
              fill={color}
              opacity={0.5}
              animate={{
                r: isHovered ? [4, 5.5, 4] : 4,
              }}
              transition={{ duration: 1, delay: i * 0.08, repeat: Infinity }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * 元认知循环 - 螺旋循环
 */
export function MetaCogIcon({ className = "", color = "var(--neon-violet)", isHovered = false }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* 螺旋路径 */}
      <motion.path
        d="M 50 18 Q 75 22, 80 45 Q 85 70, 58 78 Q 32 86, 20 60 Q 8 35, 35 25 Q 55 18, 60 35"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity={0.6}
        strokeLinecap="round"
        animate={{
          opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 箭头 */}
      <motion.path
        d="M 60 35 L 56 30 M 60 35 L 65 32"
        stroke={color}
        strokeWidth="2"
        opacity={0.7}
        strokeLinecap="round"
        animate={{
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* 沿路节点 */}
      {[
        { cx: 50, cy: 18 },
        { cx: 80, cy: 45 },
        { cx: 58, cy: 78 },
        { cx: 20, cy: 60 },
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
          }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}

      {/* 中心意识点 */}
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill={color}
        opacity={0.8}
        animate={{
          r: isHovered ? [5, 6.5, 5] : 5,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
}

// 导出所有图标
export const PrincipleIcons = {
  // L01
  StudentCentered: StudentCenteredIcon,
  Explore: ExploreIcon,
  Futuristic: FuturisticIcon,
  FlowingSpace: FlowingSpaceIcon,
  // L02
  ToolMind: ToolMindIcon,
  PredictLoop: PredictLoopIcon,
  Embodied: EmbodiedIcon,
  HumanAI: HumanAIIcon,
  // L03
  Dialogue: DialogueIcon,
  Periphery: PeripheryIcon,
  SelfOrganize: SelfOrganizeIcon,
  AICollab: AICollabIcon,
  // L04
  ChallengeGrowth: ChallengeGrowthIcon,
  FailureLearn: FailureLearnIcon,
  StrategicGen: StrategicGenIcon,
  MetaCog: MetaCogIcon,
};

export default PrincipleIcons;
