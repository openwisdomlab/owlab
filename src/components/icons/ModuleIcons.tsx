"use client";

import { motion } from "framer-motion";

interface ModuleIconProps {
  className?: string;
  color?: string;
  size?: number;
}

// M01: 发射台 (Launch Pad) - 火箭发射台，代表好奇心的启航点
export const LaunchPadIcon = ({ className, color = "var(--neon-yellow)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 发射台基座 */}
    <path
      d="M12 56 L20 48 L44 48 L52 56 L12 56"
      fill={`${color}30`}
      stroke={color}
      strokeWidth="2"
    />
    {/* 发射塔架 */}
    <path
      d="M18 48 L18 28 M46 48 L46 28"
      stroke={color}
      strokeWidth="2"
      opacity="0.6"
    />
    <path
      d="M18 28 L22 28 M42 28 L46 28"
      stroke={color}
      strokeWidth="2"
      opacity="0.6"
    />
    {/* 火箭主体 */}
    <motion.g
      animate={{ y: [0, -1, 0] }}
      transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
    >
      {/* 火箭头部 */}
      <path
        d="M32 6 L26 18 L38 18 Z"
        fill={color}
        opacity="0.9"
      />
      {/* 火箭身体 */}
      <rect x="26" y="18" width="12" height="24" rx="1" fill={`${color}40`} stroke={color} strokeWidth="2" />
      {/* 窗户 */}
      <circle cx="32" cy="26" r="3" fill={`${color}60`} stroke={color} strokeWidth="1.5" />
      {/* 火箭翼 */}
      <path d="M26 36 L20 44 L26 42 Z" fill={color} opacity="0.8" />
      <path d="M38 36 L44 44 L38 42 Z" fill={color} opacity="0.8" />
      {/* 火箭底部 */}
      <rect x="28" y="42" width="8" height="4" fill={color} opacity="0.7" />
    </motion.g>
    {/* 火焰喷射 */}
    <motion.g
      animate={{
        scaleY: [0.8, 1.2, 0.8],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{ duration: 0.15, repeat: Infinity }}
      style={{ transformOrigin: "32px 46px" }}
    >
      <path
        d="M28 46 L32 58 L36 46"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M30 46 L32 54 L34 46"
        fill="white"
        opacity="0.6"
      />
    </motion.g>
    {/* 烟雾效果 */}
    <motion.g
      animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{ transformOrigin: "32px 56px" }}
    >
      <ellipse cx="24" cy="56" rx="8" ry="3" fill={color} opacity="0.2" />
      <ellipse cx="40" cy="56" rx="8" ry="3" fill={color} opacity="0.2" />
    </motion.g>
    {/* 发射台灯光 */}
    <motion.g
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      <circle cx="16" cy="52" r="2" fill={color} />
      <circle cx="48" cy="52" r="2" fill={color} />
    </motion.g>
  </svg>
);

// M02: 航道 (Space Route) - 星际航道网络，代表连接与合作
export const SpaceRouteIcon = ({ className, color = "var(--neon-violet)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 背景星域 */}
    <motion.g
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="8" cy="12" r="1" fill={color} />
      <circle cx="56" cy="8" r="1.5" fill={color} />
      <circle cx="52" cy="56" r="1" fill={color} />
      <circle cx="12" cy="52" r="1" fill={color} />
    </motion.g>
    {/* 主航道曲线 */}
    <motion.path
      d="M8 48 Q20 32, 32 32 Q44 32, 56 16"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="4,4"
      animate={{ strokeDashoffset: [0, -16] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    {/* 副航道 */}
    <motion.path
      d="M12 16 Q24 24, 32 32 Q40 40, 52 48"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
      strokeDasharray="3,3"
      animate={{ strokeDashoffset: [0, -12] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    />
    {/* 航道节点 - 星球 */}
    <motion.circle
      cx="8"
      cy="48"
      r="5"
      fill={`${color}40`}
      stroke={color}
      strokeWidth="2"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="56"
      cy="16"
      r="6"
      fill={`${color}50`}
      stroke={color}
      strokeWidth="2"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />
    {/* 中继站 */}
    <motion.g
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    >
      <circle cx="32" cy="32" r="8" fill={`${color}30`} stroke={color} strokeWidth="2" />
      <circle cx="32" cy="24" r="2" fill={color} />
      <circle cx="32" cy="40" r="2" fill={color} />
    </motion.g>
    {/* 航行器 */}
    <motion.g
      animate={{
        offsetDistance: ["0%", "100%"]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      style={{
        offsetPath: "path('M8 48 Q20 32, 32 32 Q44 32, 56 16')",
        offsetRotate: "auto"
      }}
    >
      <path
        d="M0 0 L6 2 L0 4 L2 2 Z"
        fill={color}
      />
    </motion.g>
    {/* 信号波纹 */}
    <motion.circle
      cx="32"
      cy="32"
      r="12"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
      animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ transformOrigin: "32px 32px" }}
    />
  </svg>
);

// M03: 空间站 (Space Station) - 模块化空间站，代表创意空间
export const SpaceStationIcon = ({ className, color = "var(--neon-cyan)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 核心舱 */}
    <motion.rect
      x="24"
      y="24"
      width="16"
      height="16"
      rx="2"
      fill={`${color}30`}
      stroke={color}
      strokeWidth="2"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* 核心舱窗户 */}
    <circle cx="32" cy="32" r="4" fill={`${color}50`} stroke={color} strokeWidth="1.5" />
    {/* 左侧实验舱 */}
    <rect x="6" y="28" width="18" height="8" rx="2" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="32" r="2" fill={color} opacity="0.6" />
    {/* 右侧居住舱 */}
    <rect x="40" y="28" width="18" height="8" rx="2" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    <circle cx="52" cy="32" r="2" fill={color} opacity="0.6" />
    {/* 上方对接口 */}
    <rect x="28" y="12" width="8" height="12" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
    <rect x="30" y="8" width="4" height="4" rx="1" fill={color} opacity="0.7" />
    {/* 下方货运舱 */}
    <rect x="28" y="40" width="8" height="12" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
    {/* 太阳能板 - 左 */}
    <motion.g
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "6px 32px" }}
    >
      <rect x="2" y="18" width="4" height="28" rx="1" fill={`${color}40`} stroke={color} strokeWidth="1" />
      <line x1="4" y1="22" x2="4" y2="42" stroke={color} strokeWidth="0.5" opacity="0.5" />
    </motion.g>
    {/* 太阳能板 - 右 */}
    <motion.g
      animate={{ rotate: [2, -2, 2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "58px 32px" }}
    >
      <rect x="58" y="18" width="4" height="28" rx="1" fill={`${color}40`} stroke={color} strokeWidth="1" />
      <line x1="60" y1="22" x2="60" y2="42" stroke={color} strokeWidth="0.5" opacity="0.5" />
    </motion.g>
    {/* 状态指示灯 */}
    <motion.g
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <circle cx="20" cy="24" r="1.5" fill={color} />
      <circle cx="44" cy="24" r="1.5" fill={color} />
      <circle cx="32" cy="44" r="1.5" fill={color} />
    </motion.g>
    {/* 通信天线 */}
    <motion.g
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 8px" }}
    >
      <circle cx="32" cy="8" r="3" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
    </motion.g>
  </svg>
);

// M04: 航线 (Flight Route) - 星际航线图，代表课程路径
export const FlightRouteIcon = ({ className, color = "var(--neon-green)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 星图背景网格 */}
    <g opacity="0.2">
      <line x1="16" y1="8" x2="16" y2="56" stroke={color} strokeWidth="0.5" />
      <line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth="0.5" />
      <line x1="48" y1="8" x2="48" y2="56" stroke={color} strokeWidth="0.5" />
      <line x1="8" y1="16" x2="56" y2="16" stroke={color} strokeWidth="0.5" />
      <line x1="8" y1="32" x2="56" y2="32" stroke={color} strokeWidth="0.5" />
      <line x1="8" y1="48" x2="56" y2="48" stroke={color} strokeWidth="0.5" />
    </g>
    {/* 主航线 */}
    <motion.path
      d="M12 52 L20 40 L36 44 L48 28 L56 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    {/* 航点标记 */}
    <motion.g
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* 起点 */}
      <circle cx="12" cy="52" r="4" fill={`${color}40`} stroke={color} strokeWidth="2" />
      <circle cx="12" cy="52" r="1.5" fill={color} />
    </motion.g>
    {/* 中间航点 */}
    <circle cx="20" cy="40" r="3" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
    <circle cx="36" cy="44" r="3" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
    <circle cx="48" cy="28" r="3" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
    {/* 终点 - 目标星球 */}
    <motion.g
      animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="56" cy="12" r="5" fill={`${color}50`} stroke={color} strokeWidth="2" />
      <path d="M54 10 L56 8 L58 10 L56 12 Z" fill={color} />
    </motion.g>
    {/* 飞行器沿航线移动 */}
    <motion.g
      animate={{
        offsetDistance: ["0%", "100%"]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
      style={{
        offsetPath: "path('M12 52 L20 40 L36 44 L48 28 L56 12')",
        offsetRotate: "auto"
      }}
    >
      <polygon points="0,0 8,3 0,6 2,3" fill={color} />
    </motion.g>
    {/* 星星装饰 */}
    <motion.g
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="8" cy="20" r="1" fill={color} />
      <circle cx="44" cy="52" r="1" fill={color} />
      <circle cx="52" cy="36" r="1" fill={color} />
    </motion.g>
  </svg>
);

// M05: 装备舱 (Equipment Bay) - 太空装备舱，代表工具资源
export const EquipmentBayIcon = ({ className, color = "var(--neon-orange)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 舱体外壳 */}
    <path
      d="M8 16 L8 48 L56 48 L56 16 L8 16"
      fill={`${color}15`}
      stroke={color}
      strokeWidth="2"
    />
    {/* 舱顶 */}
    <path
      d="M8 16 L32 6 L56 16"
      fill={`${color}25`}
      stroke={color}
      strokeWidth="2"
    />
    {/* 舱门 */}
    <motion.g
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <rect x="24" y="28" width="16" height="20" rx="2" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
      <line x1="32" y1="28" x2="32" y2="48" stroke={color} strokeWidth="1" opacity="0.5" />
    </motion.g>
    {/* 装备架 - 左侧 */}
    <rect x="12" y="22" width="8" height="22" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1" />
    {/* 工具 */}
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <rect x="14" y="26" width="4" height="8" rx="1" fill={color} opacity="0.7" />
      <circle cx="16" cy="38" r="2" fill={color} opacity="0.6" />
    </motion.g>
    {/* 装备架 - 右侧 */}
    <rect x="44" y="22" width="8" height="22" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1" />
    {/* 设备 */}
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
    >
      <rect x="46" y="24" width="4" height="6" rx="1" fill={color} opacity="0.7" />
      <rect x="46" y="34" width="4" height="4" rx="1" fill={color} opacity="0.6" />
    </motion.g>
    {/* 地板 */}
    <rect x="8" y="48" width="48" height="4" rx="1" fill={color} opacity="0.4" />
    {/* 状态灯 */}
    <motion.g
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <circle cx="14" cy="12" r="2" fill={color} />
      <circle cx="50" cy="12" r="2" fill={color} />
    </motion.g>
    {/* 通风口 */}
    <g opacity="0.5">
      <rect x="12" y="50" width="8" height="2" rx="0.5" fill={color} />
      <rect x="44" y="50" width="8" height="2" rx="0.5" fill={color} />
    </g>
    {/* 悬浮设备 */}
    <motion.circle
      cx="32"
      cy="18"
      r="3"
      fill={`${color}50`}
      stroke={color}
      strokeWidth="1"
      animate={{ y: [0, -2, 0], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

// M06: 安全舱 (Safety Cabin) - 逃生舱/安全舱，代表安全保护
export const SafetyCabinIcon = ({ className, color = "var(--neon-red)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 舱体轮廓 - 胶囊形 */}
    <motion.path
      d="M32 6 C44 6, 52 14, 52 26 L52 46 C52 54, 44 58, 32 58 C20 58, 12 54, 12 46 L12 26 C12 14, 20 6, 32 6"
      fill={`${color}20`}
      stroke={color}
      strokeWidth="2.5"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 防护层 */}
    <path
      d="M32 12 C40 12, 46 18, 46 28 L46 44 C46 50, 40 52, 32 52 C24 52, 18 50, 18 44 L18 28 C18 18, 24 12, 32 12"
      fill={`${color}15`}
      stroke={color}
      strokeWidth="1"
      opacity="0.6"
    />
    {/* 舱窗 */}
    <motion.ellipse
      cx="32"
      cy="24"
      rx="8"
      ry="6"
      fill={`${color}40`}
      stroke={color}
      strokeWidth="2"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 窗户反光 */}
    <ellipse cx="29" cy="22" rx="3" ry="2" fill="white" opacity="0.3" />
    {/* 安全标识 - 十字 */}
    <motion.g
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <rect x="30" y="34" width="4" height="12" rx="1" fill={color} />
      <rect x="26" y="38" width="12" height="4" rx="1" fill={color} />
    </motion.g>
    {/* 推进器 */}
    <rect x="20" y="52" width="6" height="4" rx="1" fill={color} opacity="0.7" />
    <rect x="38" y="52" width="6" height="4" rx="1" fill={color} opacity="0.7" />
    {/* 推进火焰 */}
    <motion.g
      animate={{ opacity: [0.4, 0.8, 0.4], scaleY: [0.8, 1.2, 0.8] }}
      transition={{ duration: 0.3, repeat: Infinity }}
      style={{ transformOrigin: "center 56px" }}
    >
      <path d="M22 56 L23 62 L25 56" fill={color} opacity="0.6" />
      <path d="M39 56 L41 62 L43 56" fill={color} opacity="0.6" />
    </motion.g>
    {/* 防护光环 */}
    <motion.ellipse
      cx="32"
      cy="32"
      rx="28"
      ry="30"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="6,4"
      opacity="0.3"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    />
    {/* 状态指示灯 */}
    <motion.circle
      cx="32"
      cy="8"
      r="2"
      fill={color}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  </svg>
);

// M07: 领航员 (Navigator) - 宇航员头盔，代表引导者
export const NavigatorIcon = ({ className, color = "var(--neon-pink)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 头盔外壳 */}
    <motion.path
      d="M32 4 C48 4, 56 16, 56 32 C56 44, 48 54, 40 56 L24 56 C16 54, 8 44, 8 32 C8 16, 16 4, 32 4"
      fill={`${color}20`}
      stroke={color}
      strokeWidth="2.5"
      animate={{ scale: [1, 1.01, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* 面罩 */}
    <motion.path
      d="M32 10 C44 10, 50 20, 50 32 C50 40, 44 46, 38 48 L26 48 C20 46, 14 40, 14 32 C14 20, 20 10, 32 10"
      fill={`${color}35`}
      stroke={color}
      strokeWidth="1.5"
      animate={{ opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 面罩反光 */}
    <ellipse cx="24" cy="24" rx="6" ry="8" fill="white" opacity="0.15" />
    {/* HUD 显示 - 导航数据 */}
    <motion.g
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* 坐标线 */}
      <line x1="20" y1="28" x2="28" y2="28" stroke={color} strokeWidth="1" />
      <line x1="36" y1="28" x2="44" y2="28" stroke={color} strokeWidth="1" />
      <line x1="32" y1="20" x2="32" y2="26" stroke={color} strokeWidth="1" />
      <line x1="32" y1="34" x2="32" y2="40" stroke={color} strokeWidth="1" />
      {/* 目标锁定 */}
      <circle cx="32" cy="30" r="6" fill="none" stroke={color} strokeWidth="1" />
    </motion.g>
    {/* 星星反射 */}
    <motion.g
      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="40" cy="20" r="1.5" fill={color} />
      <circle cx="36" cy="36" r="1" fill={color} />
      <circle cx="24" cy="34" r="1.5" fill={color} />
    </motion.g>
    {/* 通信天线 */}
    <motion.g
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "52px 20px" }}
    >
      <line x1="52" y1="20" x2="58" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="58" cy="12" r="2" fill={color} />
    </motion.g>
    {/* 颈部连接 */}
    <rect x="26" y="54" width="12" height="6" rx="2" fill={`${color}40`} stroke={color} strokeWidth="1.5" />
    {/* 氧气指示 */}
    <motion.rect
      x="10"
      y="44"
      width="8"
      height="4"
      rx="1"
      fill={color}
      opacity="0.6"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

// M08: 补给站 (Supply Station) - 太空补给站，代表运营支持
export const SupplyStationIcon = ({ className, color = "var(--neon-blue)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 主体结构 */}
    <rect x="20" y="16" width="24" height="32" rx="3" fill={`${color}20`} stroke={color} strokeWidth="2" />
    {/* 储存舱格 */}
    <rect x="24" y="20" width="16" height="8" rx="1" fill={`${color}30`} stroke={color} strokeWidth="1" />
    <rect x="24" y="32" width="16" height="8" rx="1" fill={`${color}30`} stroke={color} strokeWidth="1" />
    {/* 对接臂 - 左 */}
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "20px 32px" }}
    >
      <rect x="6" y="28" width="14" height="8" rx="2" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
      <circle cx="8" cy="32" r="3" fill={`${color}40`} stroke={color} strokeWidth="1" />
    </motion.g>
    {/* 对接臂 - 右 */}
    <motion.g
      animate={{ rotate: [3, -3, 3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "44px 32px" }}
    >
      <rect x="44" y="28" width="14" height="8" rx="2" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
      <circle cx="56" cy="32" r="3" fill={`${color}40`} stroke={color} strokeWidth="1" />
    </motion.g>
    {/* 能量传输管道 */}
    <motion.path
      d="M8 32 L20 32"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="3,2"
      animate={{ strokeDashoffset: [0, -10] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
    />
    <motion.path
      d="M44 32 L56 32"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="3,2"
      animate={{ strokeDashoffset: [-10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
    />
    {/* 顶部天线阵列 */}
    <rect x="28" y="8" width="8" height="8" rx="1" fill={`${color}35`} stroke={color} strokeWidth="1.5" />
    <line x1="32" y1="4" x2="32" y2="8" stroke={color} strokeWidth="2" />
    <motion.circle
      cx="32"
      cy="4"
      r="2"
      fill={color}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    {/* 底部推进器 */}
    <rect x="26" y="48" width="12" height="6" rx="1" fill={`${color}40`} stroke={color} strokeWidth="1" />
    {/* 推进火焰 */}
    <motion.g
      animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.8, 1.1, 0.8] }}
      transition={{ duration: 0.4, repeat: Infinity }}
      style={{ transformOrigin: "32px 54px" }}
    >
      <path d="M28 54 L32 62 L36 54" fill={color} opacity="0.5" />
    </motion.g>
    {/* 状态灯光 */}
    <motion.g
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      <circle cx="28" cy="24" r="1.5" fill={color} />
      <circle cx="36" cy="24" r="1.5" fill={color} />
      <circle cx="28" cy="36" r="1.5" fill={color} />
      <circle cx="36" cy="36" r="1.5" fill={color} />
    </motion.g>
    {/* 补给容器标识 */}
    <rect x="30" y="22" width="4" height="4" rx="0.5" fill={color} opacity="0.6" />
    <rect x="30" y="34" width="4" height="4" rx="0.5" fill={color} opacity="0.6" />
  </svg>
);

// M09: 星轨 (Star Track) - 轨道路径，代表成长轨迹
export const StarTrackIcon = ({ className, color = "var(--neon-teal)" }: ModuleIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 中心恒星 */}
    <motion.circle
      cx="32"
      cy="32"
      r="8"
      fill={`${color}50`}
      stroke={color}
      strokeWidth="2"
      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 恒星光芒 */}
    <motion.g
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    >
      <line x1="32" y1="20" x2="32" y2="24" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="32" y1="40" x2="32" y2="44" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="20" y1="32" x2="24" y2="32" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="40" y1="32" x2="44" y2="32" stroke={color} strokeWidth="2" opacity="0.5" />
    </motion.g>
    {/* 第一轨道 */}
    <motion.ellipse
      cx="32"
      cy="32"
      rx="18"
      ry="12"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="4,2"
      opacity="0.6"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    />
    {/* 第二轨道 */}
    <motion.ellipse
      cx="32"
      cy="32"
      rx="26"
      ry="18"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="3,3"
      opacity="0.4"
      animate={{ rotate: [0, -360] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    />
    {/* 轨道行星 1 */}
    <motion.g
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    >
      <circle cx="50" cy="32" r="4" fill={`${color}60`} stroke={color} strokeWidth="1.5" />
      {/* 行星环 */}
      <ellipse cx="50" cy="32" rx="6" ry="2" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
    </motion.g>
    {/* 轨道行星 2 */}
    <motion.g
      animate={{ rotate: [120, 480] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "32px 32px" }}
    >
      <circle cx="32" cy="14" r="3" fill={`${color}50`} stroke={color} strokeWidth="1" />
    </motion.g>
    {/* 成长曲线 - 螺旋上升 */}
    <motion.path
      d="M32 56 Q40 52, 44 44 Q48 36, 46 28 Q44 20, 38 14 Q34 10, 32 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.8"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
    />
    {/* 成长箭头 */}
    <motion.g
      animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <path d="M28 8 L32 2 L36 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </motion.g>
    {/* 星星点缀 */}
    <motion.g
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="10" cy="16" r="1" fill={color} />
      <circle cx="54" cy="52" r="1.5" fill={color} />
      <circle cx="12" cy="48" r="1" fill={color} />
      <circle cx="52" cy="12" r="1" fill={color} />
    </motion.g>
  </svg>
);

// 保留旧名称的别名，确保向后兼容
export const CuriosityIcon = LaunchPadIcon;
export const NetworkIcon = SpaceRouteIcon;
export const SpaceIcon = SpaceStationIcon;
export const CompassIcon = FlightRouteIcon;
export const ToolboxIcon = EquipmentBayIcon;
export const ShieldIcon = SafetyCabinIcon;
export const TorchIcon = NavigatorIcon;
export const LogbookIcon = SupplyStationIcon;
export const GrowthTreeIcon = StarTrackIcon;

// 根据模块ID获取对应的图标
export const getModuleIcon = (moduleId: string) => {
  const iconMap: Record<string, React.FC<ModuleIconProps>> = {
    M01: LaunchPadIcon,
    M02: SpaceRouteIcon,
    M03: SpaceStationIcon,
    M04: FlightRouteIcon,
    M05: EquipmentBayIcon,
    M06: SafetyCabinIcon,
    M07: NavigatorIcon,
    M08: SupplyStationIcon,
    M09: StarTrackIcon,
  };
  return iconMap[moduleId] || LaunchPadIcon;
};

export default {
  LaunchPadIcon,
  SpaceRouteIcon,
  SpaceStationIcon,
  FlightRouteIcon,
  EquipmentBayIcon,
  SafetyCabinIcon,
  NavigatorIcon,
  SupplyStationIcon,
  StarTrackIcon,
  // 旧名称别名
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
