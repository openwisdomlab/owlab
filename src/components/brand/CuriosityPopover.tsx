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
  const popoverRef = useRef<HTMLDivElement>(null);

  const { capturedQuestions, recentlyCapturedId, removeQuestion, clearAll } =
    useCuriosityCaptureStore();

  const count = capturedQuestions.length;

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
    <div ref={popoverRef} className="relative inline-flex pointer-events-auto">
      {/* 眼睛按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-20 h-20 flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="好奇心宝箱"
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

      {/* Popover 面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2"
            style={{
              top: "100%",
              width: isMobile ? "calc(100vw - 32px)" : 340,
              maxWidth: 340,
              maxHeight: isMobile ? "60vh" : 420,
              zIndex: 100,
              borderRadius: 16,
              background: isDark
                ? "rgba(14, 14, 20, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              backdropFilter: "blur(16px)",
              boxShadow: isDark
                ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${withAlpha(brandColors.neonCyan, 0.1)}`
                : "0 20px 50px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* 头部 */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center gap-2">
                <Eye
                  className="w-5 h-5"
                  style={{ color: brandColors.neonCyan }}
                />
                <span
                  className="font-semibold"
                  style={{ color: isDark ? "#fff" : "#1a1a2e" }}
                >
                  好奇心宝箱
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
              style={{ maxHeight: isMobile ? "calc(60vh - 60px)" : 360 }}
            >
              {count === 0 ? (
                /* 空状态 */
                <div className="p-6 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: isDark
                        ? withAlpha(brandColors.neonCyan, 0.1)
                        : withAlpha(brandColors.blue, 0.08),
                    }}
                  >
                    <Eye
                      className="w-8 h-8"
                      style={{
                        color: isDark ? brandColors.neonCyan : brandColors.blue,
                        opacity: 0.6,
                      }}
                    />
                  </div>
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
                    试试拖动问题到这里
                  </p>
                </div>
              ) : (
                /* 问题列表 */
                <div className="p-2">
                  {capturedQuestions.map((item) => (
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
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
          <div
            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: color }}
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
