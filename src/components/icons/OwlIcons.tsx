"use client";

import { motion } from "framer-motion";

interface OwlIconProps {
  className?: string;
  color?: string;
  size?: number;
}

// 基础猫头鹰形状
const BaseOwl = ({ className, color, children, badge }: OwlIconProps & { children?: React.ReactNode; badge?: React.ReactNode }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 身体轮廓 */}
    <ellipse cx="32" cy="38" rx="20" ry="22" fill={`${color}20`} stroke={color} strokeWidth="2" />

    {/* 头部 */}
    <circle cx="32" cy="20" r="16" fill={`${color}15`} stroke={color} strokeWidth="2" />

    {/* 耳羽 */}
    <path d="M18 10 L22 18 L16 16 Z" fill={color} opacity="0.8" />
    <path d="M46 10 L42 18 L48 16 Z" fill={color} opacity="0.8" />

    {/* 眼睛底座 */}
    <circle cx="24" cy="20" r="8" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
    <circle cx="40" cy="20" r="8" fill={`${color}30`} stroke={color} strokeWidth="1.5" />

    {/* 眼珠 */}
    <circle cx="24" cy="20" r="4" fill={color} />
    <circle cx="40" cy="20" r="4" fill={color} />

    {/* 眼睛高光 */}
    <circle cx="26" cy="18" r="1.5" fill="white" opacity="0.8" />
    <circle cx="42" cy="18" r="1.5" fill="white" opacity="0.8" />

    {/* 喙 */}
    <path d="M32 26 L29 32 L32 30 L35 32 Z" fill={color} opacity="0.9" />

    {/* 自定义元素 */}
    {children}

    {/* 徽章 */}
    {badge}
  </svg>
);

// M01: 好奇猫头鹰 - 带灯泡
export const CuriousOwl = ({ className, color = "var(--neon-yellow)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 头顶灯泡 */}
    <g transform="translate(26, -2)">
      <path
        d="M6 0 C2 0, 0 3, 0 6 C0 9, 2 11, 4 12 L4 15 L8 15 L8 12 C10 11, 12 9, 12 6 C12 3, 10 0, 6 0"
        fill={color}
        opacity="0.9"
      />
      <motion.circle
        cx="6"
        cy="6"
        r="3"
        fill="white"
        opacity="0.6"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </g>
    {/* 好奇的眼神 - 眼睛向上看 */}
    <circle cx="24" cy="18" r="4" fill={color} />
    <circle cx="40" cy="18" r="4" fill={color} />
  </BaseOwl>
);

// M02: 织网猫头鹰 - 带网络连接
export const NetworkOwl = ({ className, color = "var(--neon-violet)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 网络节点装饰 */}
    <g opacity="0.7">
      <circle cx="10" cy="45" r="3" fill={color} />
      <circle cx="54" cy="45" r="3" fill={color} />
      <circle cx="32" cy="55" r="3" fill={color} />
      <line x1="10" y1="45" x2="32" y2="38" stroke={color} strokeWidth="1" strokeDasharray="2,2" />
      <line x1="54" y1="45" x2="32" y2="38" stroke={color} strokeWidth="1" strokeDasharray="2,2" />
      <line x1="32" y1="55" x2="32" y2="45" stroke={color} strokeWidth="1" strokeDasharray="2,2" />
    </g>
    {/* 翅膀展开姿态 */}
    <path d="M12 38 Q5 35, 4 45 Q6 42, 12 42 Z" fill={color} opacity="0.6" />
    <path d="M52 38 Q59 35, 60 45 Q58 42, 52 42 Z" fill={color} opacity="0.6" />
  </BaseOwl>
);

// M03: 创意猫头鹰 - 带魔法星星
export const CreativeOwl = ({ className, color = "var(--neon-cyan)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 魔法星星 */}
    <motion.g
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "50px 10px" }}
    >
      <path
        d="M50 4 L51.5 8 L56 8 L52.5 11 L54 15 L50 12.5 L46 15 L47.5 11 L44 8 L48.5 8 Z"
        fill={color}
        opacity="0.9"
      />
    </motion.g>
    <motion.g
      animate={{ scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <path
        d="M8 15 L9 17 L11 17 L9.5 18.5 L10 21 L8 19.5 L6 21 L6.5 18.5 L5 17 L7 17 Z"
        fill={color}
        opacity="0.7"
      />
    </motion.g>
  </BaseOwl>
);

// M04: 探索猫头鹰 - 带望远镜/指南针
export const ExplorerOwl = ({ className, color = "var(--neon-green)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 指南针装饰 */}
    <g transform="translate(44, 35)">
      <circle cx="8" cy="8" r="8" fill={`${color}40`} stroke={color} strokeWidth="1.5" />
      <path d="M8 2 L10 8 L8 14 L6 8 Z" fill={color} opacity="0.8" />
      <circle cx="8" cy="8" r="2" fill={color} />
    </g>
    {/* 探索的眼神 - 眼睛向远方看 */}
    <circle cx="26" cy="20" r="4" fill={color} />
    <circle cx="42" cy="20" r="4" fill={color} />
  </BaseOwl>
);

// M05: 万能猫头鹰 - 带工具
export const ToolOwl = ({ className, color = "var(--neon-orange)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 扳手装饰 */}
    <g transform="translate(45, 2) rotate(30)">
      <rect x="0" y="5" width="4" height="12" rx="1" fill={color} opacity="0.9" />
      <circle cx="2" cy="4" r="4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="2" cy="18" r="3" fill="none" stroke={color} strokeWidth="2" />
    </g>
    {/* 工具带 */}
    <rect x="20" y="50" width="24" height="4" rx="2" fill={color} opacity="0.5" />
  </BaseOwl>
);

// M06: 认真猫头鹰 - 带盾牌
export const GuardianOwl = ({ className, color = "var(--neon-red)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 盾牌 */}
    <g transform="translate(22, 42)">
      <path
        d="M10 0 L20 3 L20 12 C20 18, 10 22, 10 22 C10 22, 0 18, 0 12 L0 3 Z"
        fill={`${color}40`}
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M10 6 L10 16 M6 10 L14 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </g>
    {/* 严肃的眉毛 */}
    <line x1="18" y1="12" x2="28" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="46" y1="12" x2="36" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </BaseOwl>
);

// M07: 爱心猫头鹰 - 带爱心
export const LovingOwl = ({ className, color = "var(--neon-pink)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 爱心 */}
    <motion.g
      transform="translate(26, -2)"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <path
        d="M6 4 C3 0, -2 2, 0 6 L6 12 L12 6 C14 2, 9 0, 6 4"
        fill={color}
        opacity="0.9"
      />
    </motion.g>
    {/* 温暖的翅膀环抱姿态 */}
    <path d="M8 35 Q2 38, 4 50 Q8 45, 14 42 Q10 40, 8 35" fill={color} opacity="0.5" />
    <path d="M56 35 Q62 38, 60 50 Q56 45, 50 42 Q54 40, 56 35" fill={color} opacity="0.5" />
  </BaseOwl>
);

// M08: 展翅猫头鹰 - 展开翅膀
export const SoaringOwl = ({ className, color = "var(--neon-blue)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 展开的大翅膀 */}
    <motion.path
      d="M12 30 Q-5 25, -2 40 Q0 50, 8 55 Q4 45, 8 40 Q6 35, 12 30"
      fill={color}
      opacity="0.6"
      animate={{ d: [
        "M12 30 Q-5 25, -2 40 Q0 50, 8 55 Q4 45, 8 40 Q6 35, 12 30",
        "M12 30 Q-8 20, -5 35 Q-2 48, 8 55 Q2 42, 6 38 Q4 33, 12 30"
      ]}}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.path
      d="M52 30 Q69 25, 66 40 Q64 50, 56 55 Q60 45, 56 40 Q58 35, 52 30"
      fill={color}
      opacity="0.6"
      animate={{ d: [
        "M52 30 Q69 25, 66 40 Q64 50, 56 55 Q60 45, 56 40 Q58 35, 52 30",
        "M52 30 Q72 20, 69 35 Q66 48, 56 55 Q62 42, 58 38 Q60 33, 52 30"
      ]}}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    />
    {/* 飞行轨迹线 */}
    <motion.path
      d="M20 58 Q32 62, 44 58"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="3,3"
      fill="none"
      opacity="0.4"
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </BaseOwl>
);

// M09: 换羽猫头鹰 - 带成长曲线
export const GrowthOwl = ({ className, color = "var(--neon-teal)" }: OwlIconProps) => (
  <BaseOwl className={className} color={color}>
    {/* 成长曲线图 */}
    <g transform="translate(38, 40)">
      <rect x="0" y="0" width="20" height="16" rx="2" fill={`${color}30`} stroke={color} strokeWidth="1" />
      <motion.path
        d="M3 13 L7 10 L11 12 L15 6 L18 8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx="18" cy="8" r="2" fill={color} />
    </g>
    {/* 飘落的羽毛 */}
    <motion.g
      animate={{ y: [0, 5, 0], x: [0, 2, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <path
        d="M8 50 Q6 55, 10 58 Q8 55, 10 52 Q8 52, 8 50"
        fill={color}
        opacity="0.5"
      />
    </motion.g>
  </BaseOwl>
);

// 根据模块ID获取对应的猫头鹰图标
export const getOwlIcon = (moduleId: string) => {
  const owlMap: Record<string, React.FC<OwlIconProps>> = {
    M01: CuriousOwl,
    M02: NetworkOwl,
    M03: CreativeOwl,
    M04: ExplorerOwl,
    M05: ToolOwl,
    M06: GuardianOwl,
    M07: LovingOwl,
    M08: SoaringOwl,
    M09: GrowthOwl,
  };
  return owlMap[moduleId] || CuriousOwl;
};

export default {
  CuriousOwl,
  NetworkOwl,
  CreativeOwl,
  ExplorerOwl,
  ToolOwl,
  GuardianOwl,
  LovingOwl,
  SoaringOwl,
  GrowthOwl,
  getOwlIcon,
};
