"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, ChevronDown, Trash2 } from "lucide-react";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import {
  useCuriosityCaptureStore,
  MAX_CAPTURED_QUESTIONS,
  type CapturedQuestion,
} from "@/stores/curiosity-capture-store";

interface CuriosityPopoverProps {
  isDark: boolean;
  isMobile: boolean;
}

export function CuriosityPopover({ isDark, isMobile }: CuriosityPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLButtonElement>(null);

  const { capturedQuestions, recentlyCapturedId, removeQuestion, clearAll } =
    useCuriosityCaptureStore();

  const count = capturedQuestions.length;

  // 滚动检测 - 向下滚动时收起卡片
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.3; // 滚动超过30%视口高度时收起
      setIsScrolledDown(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始检查
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 新问题捕获时自动打开（使用 setTimeout 避免同步 setState）
  useEffect(() => {
    if (recentlyCapturedId && count > 0) {
      const timer = setTimeout(() => setIsOpen(true), 0);
      return () => clearTimeout(timer);
    }
  }, [recentlyCapturedId, count]);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return new Date(timestamp).toLocaleDateString();
  };

  // 深度标签
  const getGravityLabel = (gravity: number) => {
    switch (gravity) {
      case 4: return "终极问题";
      case 3: return "世纪难题";
      case 2: return "前沿探索";
      default: return "好奇种子";
    }
  };

  return (
    <>
      {/* 主眼睛按钮 - 在顶部居中位置 */}
      <div ref={popoverRef} className="relative inline-flex pointer-events-auto">
        <motion.button
          ref={eyeRef}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-20 h-20 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="好奇心捕获"
        >
          {/* 背景光晕 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${brandColors.blue}40, transparent)`,
              filter: "blur(20px)",
            }}
          />

          {/* 眼睛图标 */}
          <Eye
            className="w-20 h-20 relative z-10"
            style={{ color: brandColors.neonCyan }}
          />

          {/* 脉动环 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: brandColors.neonPink }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* 徽章计数 */}
          <AnimatePresence>
            {count > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 z-20 flex items-center justify-center"
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: 11,
                  background: brandColors.neonPink,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "0 6px",
                  boxShadow: `0 2px 8px ${withAlpha(brandColors.neonPink, 0.5)}`,
                }}
              >
                <motion.span
                  key={count}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  {count}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 眼睛打开时的注意力引导动效 - 延伸线段引导视线到卡片 */}
        <AnimatePresence>
          {isOpen && !isMobile && !isScrolledDown && (
            <GuideLine eyeRef={eyeRef} />
          )}
        </AnimatePresence>
      </div>

      {/* 滚动后收起的迷你图标 - 靠近左下角N图标位置 */}
      <AnimatePresence>
        {isScrolledDown && !isMobile && (
          <motion.button
            className="fixed z-50 pointer-events-auto"
            style={{
              left: 56,
              bottom: 20,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="好奇心捕获"
          >
            <div
              className="relative w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: isDark
                  ? `linear-gradient(135deg, ${withAlpha(brandColors.neonCyan, 0.2)}, ${withAlpha(brandColors.violet, 0.15)})`
                  : `linear-gradient(135deg, ${withAlpha(brandColors.blue, 0.15)}, ${withAlpha(brandColors.violet, 0.1)})`,
                border: `1px solid ${isDark ? withAlpha(brandColors.neonCyan, 0.3) : withAlpha(brandColors.blue, 0.2)}`,
                backdropFilter: "blur(8px)",
                boxShadow: isDark
                  ? `0 4px 12px ${withAlpha(brandColors.neonCyan, 0.2)}`
                  : "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Eye
                className="w-5 h-5"
                style={{ color: isDark ? brandColors.neonCyan : brandColors.blue }}
              />
              {/* 迷你徽章 */}
              {count > 0 && (
                <div
                  className="absolute -top-1 -right-1 flex items-center justify-center"
                  style={{
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    background: brandColors.neonPink,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    boxShadow: `0 2px 6px ${withAlpha(brandColors.neonPink, 0.5)}`,
                  }}
                >
                  {count}
                </div>
              )}
            </div>
            {/* 脉冲提示 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${brandColors.neonCyan}`,
              }}
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Popover 面板 - 左下方固定位置 */}
      <AnimatePresence>
        {isOpen && (
          /* 桌面端固定在左下方，移动端固定在底部 */
          <div
            className="fixed"
            style={
              isMobile
                ? {
                    left: 16,
                    right: 16,
                    bottom: 80,
                    zIndex: 100,
                  }
                : {
                    left: 40,
                    bottom: 120,
                    zIndex: 100,
                  }
            }
          >
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                width: isMobile ? "auto" : 320,
                maxHeight: isMobile ? "60vh" : 400,
                borderRadius: 16,
                background: isDark
                  ? "rgba(14, 14, 20, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                backdropFilter: "blur(16px)",
                boxShadow: isDark
                  ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${withAlpha(brandColors.neonCyan, 0.15)}`
                  : "0 20px 50px rgba(0,0,0,0.15)",
                overflow: "hidden",
              }}
            >
            {/* 上边缘装饰条 - 连接线的延续 */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${brandColors.neonCyan}, ${brandColors.violet}, ${brandColors.neonPink})`,
                boxShadow: `0 0 10px ${brandColors.neonCyan}50`,
              }}
            />

            {/* 头部 */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${withAlpha(brandColors.neonCyan, 0.2)}, ${withAlpha(brandColors.violet, 0.15)})`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 8px ${withAlpha(brandColors.neonCyan, 0.3)}`,
                      `0 0 16px ${withAlpha(brandColors.neonCyan, 0.5)}`,
                      `0 0 8px ${withAlpha(brandColors.neonCyan, 0.3)}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Eye
                    className="w-4 h-4"
                    style={{ color: brandColors.neonCyan }}
                  />
                </motion.div>
                <span
                  className="font-semibold"
                  style={{ color: isDark ? "#fff" : "#1a1a2e" }}
                >
                  好奇心捕获
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: isDark
                      ? withAlpha(brandColors.neonCyan, 0.15)
                      : withAlpha(brandColors.blue, 0.1),
                    color: isDark ? brandColors.neonCyan : brandColors.blue,
                  }}
                >
                  {count}/{MAX_CAPTURED_QUESTIONS}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {count > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => clearAll()}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                    }}
                    title="清空全部"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                  }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* 内容区 */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: isMobile ? "calc(60vh - 60px)" : 340 }}
            >
              {count === 0 ? (
                /* 空状态 */
                <div className="p-6 text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: isDark
                        ? withAlpha(brandColors.neonCyan, 0.1)
                        : withAlpha(brandColors.blue, 0.08),
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Eye
                      className="w-8 h-8"
                      style={{
                        color: isDark ? brandColors.neonCyan : brandColors.blue,
                        opacity: 0.6,
                      }}
                    />
                  </motion.div>
                  <p
                    className="text-sm mb-2"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                    }}
                  >
                    还没有收集任何问题
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
                    }}
                  >
                    将问题拖入眼睛图标来捕获
                  </p>
                </div>
              ) : (
                /* 问题列表 */
                <div className="p-2">
                  {capturedQuestions.map((item, index) => (
                    <QuestionCard
                      key={item.id}
                      item={item}
                      isDark={isDark}
                      isExpanded={expandedId === item.id}
                      isRecent={item.id === recentlyCapturedId}
                      onToggle={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                      onRemove={() => removeQuestion(item.id)}
                      formatTime={formatTime}
                      getGravityLabel={getGravityLabel}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// 问题卡片组件
interface QuestionCardProps {
  item: CapturedQuestion;
  isDark: boolean;
  isExpanded: boolean;
  isRecent: boolean;
  onToggle: () => void;
  onRemove: () => void;
  formatTime: (t: number) => string;
  getGravityLabel: (g: number) => string;
  index: number;
}

function QuestionCard({
  item,
  isDark,
  isExpanded,
  isRecent,
  onToggle,
  onRemove,
  formatTime,
  getGravityLabel,
  index,
}: QuestionCardProps) {
  const { question } = item;

  const colorMap: Record<string, string> = {
    cyan: brandColors.neonCyan,
    pink: brandColors.neonPink,
    violet: brandColors.violet,
    emerald: brandColors.emerald,
    blue: brandColors.blue,
    orange: brandColors.orange,
  };

  const color = colorMap[question.color] || brandColors.neonCyan;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-2 rounded-xl overflow-hidden"
      style={{
        background: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.02)",
        border: `1px solid ${
          isRecent
            ? withAlpha(color, 0.5)
            : isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.06)"
        }`,
        boxShadow: isRecent
          ? `0 0 20px ${withAlpha(color, 0.2)}`
          : "none",
      }}
    >
      {/* 卡片头部 */}
      <div
        className="p-3 cursor-pointer transition-colors"
        onClick={onToggle}
        style={{
          background: isDark
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.01)",
        }}
      >
        <div className="flex items-start gap-2">
          {/* 颜色指示器 */}
          <motion.div
            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: color }}
            animate={isRecent ? {
              scale: [1, 1.3, 1],
              boxShadow: [
                `0 0 4px ${color}`,
                `0 0 12px ${color}`,
                `0 0 4px ${color}`,
              ],
            } : {}}
            transition={{ duration: 1.5, repeat: isRecent ? 2 : 0 }}
          />
          {/* 问题文本 */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium leading-snug"
              style={{ color: isDark ? "#fff" : "#1a1a2e" }}
            >
              {question.question}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: withAlpha(color, isDark ? 0.15 : 0.1),
                  color: color,
                }}
              >
                {getGravityLabel(question.gravity)}
              </span>
              <span
                className="text-xs"
                style={{
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                }}
              >
                {formatTime(item.capturedAt)}
              </span>
            </div>
          </div>
          {/* 操作按钮 */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: isDark ? "#fff" : "#1a1a2e" }}
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="p-1"
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
              }}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-3 pb-3 pt-1 border-t"
              style={{
                borderColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              {/* 解读 */}
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                }}
              >
                {question.explanation}
              </p>

              {/* 延伸问题 */}
              {question.deepThought?.followUpQuestions &&
                question.deepThought.followUpQuestions.length > 0 && (
                  <div className="mt-3">
                    <p
                      className="text-xs font-medium mb-1.5"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(0,0,0,0.5)",
                      }}
                    >
                      延伸思考
                    </p>
                    <ul className="space-y-1">
                      {question.deepThought.followUpQuestions.map((q, i) => (
                        <li
                          key={i}
                          className="text-xs pl-3 relative"
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.6)"
                              : "rgba(0,0,0,0.5)",
                          }}
                        >
                          <span
                            className="absolute left-0 top-1.5 w-1 h-1 rounded-full"
                            style={{ background: withAlpha(color, 0.5) }}
                          />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 引导线组件 - 从眼睛延伸到卡片的折线动画
interface GuideLineProps {
  eyeRef: React.RefObject<HTMLButtonElement | null>;
}

function GuideLine({ eyeRef }: GuideLineProps) {
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    const calculatePath = () => {
      if (!eyeRef.current) return;

      const eyeRect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeBottomY = eyeRect.top + eyeRect.height;

      // 卡片位置: left: 40, bottom: 120 (相对于视口)
      const cardTopX = 200; // 卡片顶部中心位置
      const cardTopY = window.innerHeight - 340; // 卡片顶部位置

      // 计算折线路径点 - 使用温和的折线引导
      // 从眼睛底部 → 向下延伸 → 向左折 → 向下到卡片
      const startY = eyeBottomY + 10;
      const midY1 = startY + 60; // 第一个转折点高度
      const midX = Math.max(cardTopX + 60, eyeCenterX * 0.5); // 中间过渡点
      const midY2 = cardTopY - 40; // 第二个转折点高度

      const points = [
        { x: eyeCenterX, y: startY },
        { x: eyeCenterX, y: midY1 },
        { x: midX, y: midY1 },
        { x: midX, y: midY2 },
        { x: cardTopX, y: midY2 },
        { x: cardTopX, y: cardTopY },
      ];

      setPathPoints(points);

      // 构建折线路径
      const pathD = points.reduce((acc, point, i) => {
        return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
      }, "");

      setPath(pathD);
    };

    calculatePath();
    window.addEventListener("resize", calculatePath);
    return () => window.removeEventListener("resize", calculatePath);
  }, [eyeRef]);

  if (!path || pathPoints.length === 0) return null;

  const endPoint = pathPoints[pathPoints.length - 1];

  return (
    <>
      {/* 从眼睛延伸到卡片的折线引导 */}
      <motion.svg
        className="fixed pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <defs>
          <linearGradient id="guideLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={brandColors.neonCyan} />
            <stop offset="50%" stopColor={brandColors.violet} />
            <stop offset="100%" stopColor={brandColors.neonPink} />
          </linearGradient>
          <filter id="guideGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* 虚线效果 */}
          <pattern id="dashPattern" patternUnits="userSpaceOnUse" width="12" height="1">
            <line x1="0" y1="0" x2="8" y2="0" stroke="url(#guideLineGradient)" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* 主折线路径 - 虚线风格更温和 */}
        <motion.path
          d={path}
          stroke="url(#guideLineGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 4"
          filter="url(#guideGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          exit={{ pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: { duration: 0.8, ease: "easeOut" },
            opacity: { duration: 0.3 }
          }}
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />

        {/* 折点装饰 - 小圆点标记转折 */}
        {pathPoints.slice(1, -1).map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={brandColors.violet}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              delay: 0.2 + i * 0.1,
              duration: 0.3,
              ease: "easeOut"
            }}
          />
        ))}

        {/* 沿路径移动的光点效果 */}
        <motion.circle
          r="4"
          fill={brandColors.neonCyan}
          filter="url(#guideGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={path}
            begin="0.8s"
          />
        </motion.circle>

        {/* 路径末端的脉冲点 */}
        <motion.circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="5"
          fill={brandColors.neonPink}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.1, 1],
            opacity: [0, 1, 0.8],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.4,
            ease: "easeOut"
          }}
          filter="url(#guideGlow)"
        />

        {/* 末端温和波纹 - 减少数量和强度 */}
        {[0, 1].map((i) => (
          <motion.circle
            key={i}
            cx={endPoint.x}
            cy={endPoint.y}
            r="8"
            fill="none"
            stroke={brandColors.neonPink}
            strokeWidth="1"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [1, 2],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.8 + i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}

        {/* 起点装饰 - 小箭头指向下方 */}
        <motion.path
          d={`M ${pathPoints[0].x - 4} ${pathPoints[0].y - 8} L ${pathPoints[0].x} ${pathPoints[0].y} L ${pathPoints[0].x + 4} ${pathPoints[0].y - 8}`}
          stroke={brandColors.neonCyan}
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />
      </motion.svg>
    </>
  );
}
