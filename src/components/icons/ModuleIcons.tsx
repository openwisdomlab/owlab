"use client";

import { motion } from "framer-motion";

interface ModuleIconProps {
  className?: string;
  color?: string;
  size?: number;
}

// M01: 好奇星 - 灯泡 + 问号，代表好奇心和灵感
export const CuriosityIcon = ({ className, color = "var(--neon-yellow)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 灯泡外形 */}
    <motion.path
      d="M32 8 C20 8, 12 18, 12 28 C12 36, 18 42, 24 46 L24 52 L40 52 L40 46 C46 42, 52 36, 52 28 C52 18, 44 8, 32 8"
      fill={`${color}20`}
      stroke={color}
      strokeWidth="2.5"
      animate={{ filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 灯泡底座 */}
    <rect x="24" y="52" width="16" height="4" rx="1" fill={color} opacity="0.6" />
    <rect x="26" y="56" width="12" height="3" rx="1" fill={color} opacity="0.5" />
    {/* 问号 - 好奇心的象征 */}
    <motion.g
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <path
        d="M28 22 C28 18, 32 16, 36 18 C40 20, 40 26, 36 28 C34 30, 32 30, 32 34"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="40" r="2.5" fill={color} />
    </motion.g>
    {/* 光芒 */}
    <motion.g
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <line x1="32" y1="2" x2="32" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="10" x2="54" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="10" x2="10" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="28" x2="60" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="28" x2="4" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </svg>
);

// M02: 联结者 - 星球网络，代表联盟和连接
export const NetworkIcon = ({ className, color = "var(--neon-violet)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 中心星球 */}
    <motion.circle
      cx="32"
      cy="32"
      r="12"
      fill={`${color}30`}
      stroke={color}
      strokeWidth="2"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 轨道环 */}
    <ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5" />
    <ellipse cx="32" cy="32" rx="8" ry="20" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5" transform="rotate(60, 32, 32)" />
    {/* 卫星节点 */}
    <motion.g
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    >
      <circle cx="32" cy="10" r="5" fill={`${color}50`} stroke={color} strokeWidth="1.5" />
      <circle cx="52" cy="38" r="4" fill={`${color}40`} stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="38" r="4" fill={`${color}40`} stroke={color} strokeWidth="1.5" />
    </motion.g>
    {/* 连接线 */}
    <motion.g
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <line x1="32" y1="20" x2="32" y2="15" stroke={color} strokeWidth="1.5" />
      <line x1="44" y1="32" x2="48" y2="36" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="32" x2="16" y2="36" stroke={color} strokeWidth="1.5" />
    </motion.g>
    {/* 信号波 */}
    <motion.circle
      cx="32"
      cy="32"
      r="24"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
      animate={{ scale: [1, 1.17, 1], opacity: [0.3, 0.1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, type: "tween" }}
      style={{ transformOrigin: "32px 32px" }}
    />
  </svg>
);

// M03: 创意门 - 魔法门/空间门，代表创意空间
export const SpaceIcon = ({ className, color = "var(--neon-cyan)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 门框 */}
    <path
      d="M14 58 L14 14 C14 10, 18 6, 32 6 C46 6, 50 10, 50 14 L50 58"
      fill={`${color}15`}
      stroke={color}
      strokeWidth="2.5"
    />
    {/* 门内的星空 */}
    <motion.g
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <circle cx="24" cy="20" r="1.5" fill={color} />
      <circle cx="38" cy="16" r="1" fill={color} />
      <circle cx="32" cy="28" r="2" fill={color} />
      <circle cx="42" cy="36" r="1.5" fill={color} />
      <circle cx="22" cy="40" r="1" fill={color} />
      <circle cx="36" cy="48" r="1.5" fill={color} />
      <circle cx="28" cy="52" r="1" fill={color} />
    </motion.g>
    {/* 门把手 */}
    <circle cx="44" cy="34" r="3" fill={color} opacity="0.8" />
    {/* 门槛光效 */}
    <motion.rect
      x="14"
      y="56"
      width="36"
      height="4"
      rx="2"
      fill={color}
      opacity="0.6"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 魔法光芒 */}
    <motion.g
      animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <path d="M32 2 L33 5 L36 5 L34 7 L35 10 L32 8 L29 10 L30 7 L28 5 L31 5 Z" fill={color} />
    </motion.g>
  </svg>
);

// M04: 探索号 - 指南针，代表探索和航行
export const CompassIcon = ({ className, color = "var(--neon-green)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 指南针外圈 */}
    <circle cx="32" cy="32" r="26" fill={`${color}15`} stroke={color} strokeWidth="2.5" />
    {/* 方向刻度 */}
    <g opacity="0.7">
      <line x1="32" y1="8" x2="32" y2="14" stroke={color} strokeWidth="2" />
      <line x1="32" y1="50" x2="32" y2="56" stroke={color} strokeWidth="2" />
      <line x1="8" y1="32" x2="14" y2="32" stroke={color} strokeWidth="2" />
      <line x1="50" y1="32" x2="56" y2="32" stroke={color} strokeWidth="2" />
    </g>
    {/* 指南针指针 */}
    <motion.g
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", type: "tween" }}
      style={{ transformOrigin: "32px 32px" }}
    >
      {/* 北指针 */}
      <path d="M32 14 L36 32 L32 28 L28 32 Z" fill={color} />
      {/* 南指针 */}
      <path d="M32 50 L36 32 L32 36 L28 32 Z" fill={`${color}50`} />
    </motion.g>
    {/* 中心点 */}
    <circle cx="32" cy="32" r="4" fill={color} />
    {/* 方向标记 */}
    <text x="32" y="12" fontSize="6" fill={color} textAnchor="middle" fontWeight="bold">N</text>
  </svg>
);

// M05: 百宝箱 - 工具箱，代表工具和资产
export const ToolboxIcon = ({ className, color = "var(--neon-orange)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 箱子主体 */}
    <rect x="8" y="24" width="48" height="32" rx="4" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
    {/* 箱盖 */}
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, type: "tween" }}
    >
      <path
        d="M6 24 L32 10 L58 24 L6 24"
        fill={`${color}30`}
        stroke={color}
        strokeWidth="2"
      />
      <rect x="26" y="16" width="12" height="6" rx="2" fill={color} opacity="0.8" />
    </motion.g>
    {/* 工具露出来 */}
    <motion.g
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.3, type: "tween" }}
    >
      {/* 扳手 */}
      <rect x="20" y="18" width="4" height="14" rx="1" fill={color} opacity="0.9" />
      {/* 螺丝刀 */}
      <rect x="40" y="16" width="3" height="16" rx="0.5" fill={color} opacity="0.9" />
      <rect x="39" y="12" width="5" height="4" rx="1" fill={color} opacity="0.7" />
    </motion.g>
    {/* 锁扣 */}
    <rect x="28" y="36" width="8" height="6" rx="1" fill={color} opacity="0.6" />
    {/* 光泽 */}
    <motion.rect
      x="12"
      y="28"
      width="16"
      height="2"
      rx="1"
      fill="white"
      opacity="0.2"
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

// M06: 守护者 - 盾牌，代表安全和保护
export const ShieldIcon = ({ className, color = "var(--neon-red)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 盾牌主体 */}
    <motion.path
      d="M32 6 L54 14 L54 32 C54 46, 32 58, 32 58 C32 58, 10 46, 10 32 L10 14 Z"
      fill={`${color}20`}
      stroke={color}
      strokeWidth="2.5"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 内层装饰 */}
    <path
      d="M32 12 L48 18 L48 32 C48 42, 32 52, 32 52 C32 52, 16 42, 16 32 L16 18 Z"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.5"
    />
    {/* 勾选标记 - 代表安全检查通过 */}
    <motion.path
      d="M22 32 L28 40 L42 24"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
    />
    {/* 防护光环 */}
    <motion.ellipse
      cx="32"
      cy="34"
      rx="30"
      ry="28"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="4,4"
      opacity="0.3"
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

// M07: 点火者 - 火炬，代表点燃和传承
export const TorchIcon = ({ className, color = "var(--neon-pink)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 火炬柄 */}
    <rect x="28" y="34" width="8" height="26" rx="2" fill={color} opacity="0.7" />
    <rect x="26" y="32" width="12" height="6" rx="2" fill={color} opacity="0.9" />
    {/* 火焰 */}
    <motion.g
      animate={{ y: [-1, 1, -1], scale: [1, 1.05, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, type: "tween" }}
    >
      {/* 外层火焰 */}
      <path
        d="M32 4 C40 12, 46 18, 46 26 C46 34, 40 38, 32 38 C24 38, 18 34, 18 26 C18 18, 24 12, 32 4"
        fill={`${color}40`}
        stroke={color}
        strokeWidth="2"
      />
      {/* 内层火焰 */}
      <motion.path
        d="M32 10 C36 16, 40 20, 40 26 C40 32, 36 34, 32 34 C28 34, 24 32, 24 26 C24 20, 28 16, 32 10"
        fill={`${color}60`}
        animate={{ d: [
          "M32 10 C36 16, 40 20, 40 26 C40 32, 36 34, 32 34 C28 34, 24 32, 24 26 C24 20, 28 16, 32 10",
          "M32 8 C38 14, 42 18, 42 26 C42 32, 38 36, 32 36 C26 36, 22 32, 22 26 C22 18, 26 14, 32 8"
        ]}}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
      />
      {/* 核心火焰 */}
      <ellipse cx="32" cy="24" rx="6" ry="10" fill={color} opacity="0.8" />
    </motion.g>
    {/* 火星 */}
    <motion.g
      animate={{ y: [-5, -15], opacity: [0.8, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <circle cx="26" cy="8" r="1.5" fill={color} />
      <circle cx="38" cy="6" r="1" fill={color} />
    </motion.g>
  </svg>
);

// M08: 领航员 - 日志本/航海图，代表运营和记录
export const LogbookIcon = ({ className, color = "var(--neon-blue)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 书本主体 */}
    <path
      d="M10 8 L10 56 L54 56 L54 8 L10 8"
      fill={`${color}15`}
      stroke={color}
      strokeWidth="2"
    />
    {/* 书脊 */}
    <rect x="10" y="8" width="6" height="48" fill={`${color}40`} stroke={color} strokeWidth="1" />
    {/* 书页 */}
    <line x1="20" y1="16" x2="48" y2="16" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="20" y1="22" x2="48" y2="22" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="20" y1="28" x2="40" y2="28" stroke={color} strokeWidth="1.5" opacity="0.5" />
    {/* 航行路线图 */}
    <motion.path
      d="M22 36 L28 42 L36 38 L44 46 L50 40"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 航点标记 */}
    <motion.g
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <circle cx="22" cy="36" r="2" fill={color} />
      <circle cx="50" cy="40" r="3" fill={color} />
    </motion.g>
    {/* 飞机图标 */}
    <motion.g
      animate={{ x: [0, 2, 0], y: [0, -1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
    >
      <path
        d="M44 32 L48 28 L52 30 L48 32 L52 34 L48 32 L44 32"
        fill={color}
        opacity="0.8"
      />
    </motion.g>
  </svg>
);

// M09: 成长树 - 树 + 成长曲线，代表成长和发展
export const GrowthTreeIcon = ({ className, color = "var(--neon-teal)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 树干 */}
    <rect x="28" y="40" width="8" height="20" rx="2" fill={color} opacity="0.7" />
    {/* 树根 */}
    <path d="M28 58 Q24 62, 20 60" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M36 58 Q40 62, 44 60" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
    {/* 树冠 */}
    <motion.g
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <ellipse cx="32" cy="26" rx="22" ry="20" fill={`${color}25`} stroke={color} strokeWidth="2" />
      <ellipse cx="24" cy="22" rx="12" ry="10" fill={`${color}35`} />
      <ellipse cx="40" cy="24" rx="10" ry="8" fill={`${color}35`} />
      <ellipse cx="32" cy="18" rx="14" ry="12" fill={`${color}45`} />
    </motion.g>
    {/* 成长的果实/星星 */}
    <motion.g
      animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, staggerChildren: 0.3 }}
    >
      <circle cx="20" cy="20" r="3" fill={color} />
      <circle cx="40" cy="16" r="2.5" fill={color} />
      <circle cx="32" cy="12" r="3.5" fill={color} />
      <circle cx="44" cy="28" r="2" fill={color} />
    </motion.g>
    {/* 上升箭头 - 成长 */}
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <path d="M52 18 L56 10 L60 18" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="56" y1="10" x2="56" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </svg>
);

// 根据模块ID获取对应的图标
export const getModuleIcon = (moduleId: string) => {
  const iconMap: Record<string, React.FC<ModuleIconProps>> = {
    M01: CuriosityIcon,
    M02: NetworkIcon,
    M03: SpaceIcon,
    M04: CompassIcon,
    M05: ToolboxIcon,
    M06: ShieldIcon,
    M07: TorchIcon,
    M08: LogbookIcon,
    M09: GrowthTreeIcon,
  };
  return iconMap[moduleId] || CuriosityIcon;
};

export default {
  CuriosityIcon,
  NetworkIcon,
  SpaceIcon,
  CompassIcon,
  ToolboxIcon,
  ShieldIcon,
  TorchIcon,
  LogbookIcon,
  GrowthTreeIcon,
  getModuleIcon,
};
