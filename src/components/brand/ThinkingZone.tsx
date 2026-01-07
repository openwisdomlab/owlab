"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, ChevronDown, Sparkles } from "lucide-react";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { useTheme } from "@/components/ui/ThemeProvider";
import {
  useCuriosityCaptureStore,
  type CapturedQuestion,
} from "@/stores/curiosity-capture-store";

export function ThinkingZone() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { capturedQuestions, recentlyCapturedId, removeQuestion, clearAll } =
    useCuriosityCaptureStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 没有捕获的问题时，显示空状态引导
  if (capturedQuestions.length === 0) {
    return <EmptyState isDark={isDark} />;
  }

  return (
    <section className="relative py-16 px-4">
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? `linear-gradient(180deg, transparent, ${withAlpha(brandColors.neonCyan, 0.02)} 50%, transparent)`
            : `linear-gradient(180deg, transparent, ${withAlpha(brandColors.blue, 0.02)} 50%, transparent)`,
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* 标题区域 */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{
                background: isDark
                  ? `linear-gradient(135deg, ${withAlpha(brandColors.neonCyan, 0.15)}, ${withAlpha(brandColors.violet, 0.1)})`
                  : `linear-gradient(135deg, ${withAlpha(brandColors.blue, 0.1)}, ${withAlpha(brandColors.violet, 0.08)})`,
                border: `1px solid ${withAlpha(brandColors.neonCyan, 0.3)}`,
                boxShadow: `0 0 20px ${withAlpha(brandColors.neonCyan, 0.2)}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${withAlpha(brandColors.neonCyan, 0.2)}`,
                  `0 0 30px ${withAlpha(brandColors.neonCyan, 0.3)}`,
                  `0 0 20px ${withAlpha(brandColors.neonCyan, 0.2)}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye
                className="w-6 h-6"
                style={{ color: brandColors.neonCyan }}
              />
            </motion.div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{
                  background: `linear-gradient(90deg, ${brandColors.neonCyan}, ${brandColors.violet})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                好奇心捕获
              </h2>
              <p
                className="text-sm"
                style={{
                  color: isDark
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                }}
              >
                {capturedQuestions.length} 个问题等待你的思考
              </p>
            </div>
          </div>

          {capturedQuestions.length > 0 && (
            <motion.button
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.4)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              }}
              whileHover={{
                borderColor: brandColors.neonPink,
                color: brandColors.neonPink,
              }}
              onClick={() => clearAll()}
            >
              清空全部
            </motion.button>
          )}
        </motion.div>

        {/* 问题卡片列表 */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {capturedQuestions.map((captured, index) => (
              <QuestionCard
                key={captured.id}
                captured={captured}
                isDark={isDark}
                isRecent={captured.id === recentlyCapturedId}
                isExpanded={expandedId === captured.id}
                onToggleExpand={() =>
                  setExpandedId(
                    expandedId === captured.id ? null : captured.id
                  )
                }
                onRemove={() => removeQuestion(captured.id)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ============ Question Card Component ============
interface QuestionCardProps {
  captured: CapturedQuestion;
  isDark: boolean;
  isRecent: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  index: number;
}

const COLOR_MAP: Record<string, string> = {
  cyan: brandColors.neonCyan,
  pink: brandColors.neonPink,
  violet: brandColors.violet,
  emerald: brandColors.emerald,
  blue: brandColors.blue,
  orange: brandColors.orange,
};

function QuestionCard({
  captured,
  isDark,
  isRecent,
  isExpanded,
  onToggleExpand,
  onRemove,
  index,
}: QuestionCardProps) {
  const color = COLOR_MAP[captured.question.color] || brandColors.neonCyan;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        layout: { duration: 0.3 },
      }}
      className="relative group"
    >
      {/* 新捕获的高亮光效 */}
      {isRecent && (
        <motion.div
          className="absolute -inset-2 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${withAlpha(brandColors.neonCyan, 0.4)}, ${withAlpha(color, 0.2)}, transparent 70%)`,
            filter: "blur(20px)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.8, 0.4, 0.8],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 1.5, repeat: 2 }}
        />
      )}

      {/* 卡片主体 */}
      <motion.div
        className="relative rounded-xl overflow-hidden cursor-pointer"
        style={{
          background: isDark
            ? `linear-gradient(145deg, rgba(14,14,20,0.95), rgba(20,20,30,0.9))`
            : `linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))`,
          border: `1px solid ${withAlpha(color, isRecent ? 0.6 : 0.25)}`,
          boxShadow: isRecent
            ? `0 0 30px ${withAlpha(color, 0.3)}, 0 4px 20px rgba(0,0,0,0.1)`
            : `0 4px 20px rgba(0,0,0,0.08)`,
        }}
        whileHover={{
          borderColor: withAlpha(color, 0.5),
          boxShadow: `0 0 25px ${withAlpha(color, 0.2)}, 0 8px 30px rgba(0,0,0,0.12)`,
        }}
        onClick={onToggleExpand}
      >
        {/* 顶部颜色条 */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${color}, ${withAlpha(color, 0.3)})`,
          }}
        />

        <div className="p-5">
          {/* 问题头部 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* 问题文本 */}
              <p
                className="text-base font-medium leading-relaxed"
                style={{
                  color: isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)",
                }}
              >
                {captured.question.question}
              </p>

              {/* 标签 */}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: withAlpha(color, 0.15),
                    color: color,
                    border: `1px solid ${withAlpha(color, 0.3)}`,
                  }}
                >
                  深度 {captured.question.gravity}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(0,0,0,0.4)",
                  }}
                >
                  {formatTime(captured.capturedAt)}
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              <motion.button
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  color: isDark
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(0,0,0,0.4)",
                }}
                whileHover={{
                  color: brandColors.neonPink,
                  background: withAlpha(brandColors.neonPink, 0.1),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <X className="w-4 h-4" />
              </motion.button>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: isDark
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </div>

          {/* 展开的解读内容 */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 pt-4 border-t"
                  style={{
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: isDark
                        ? withAlpha(color, 0.05)
                        : withAlpha(color, 0.03),
                      border: `1px solid ${withAlpha(color, 0.1)}`,
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed whitespace-pre-line"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(0,0,0,0.7)",
                        lineHeight: 1.8,
                      }}
                    >
                      {captured.question.explanation}
                    </p>
                  </div>

                  {/* 深度思考提示 */}
                  {captured.question.deepThought?.followUpQuestions && (
                    <div className="mt-4">
                      <p
                        className="text-xs font-medium mb-2"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.5)",
                        }}
                      >
                        延伸思考：
                      </p>
                      <ul className="space-y-1">
                        {captured.question.deepThought.followUpQuestions.map(
                          (q, i) => (
                            <li
                              key={i}
                              className="text-sm flex items-start gap-2"
                              style={{
                                color: isDark
                                  ? "rgba(255,255,255,0.6)"
                                  : "rgba(0,0,0,0.6)",
                              }}
                            >
                              <span style={{ color }}>•</span>
                              {q}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ Empty State Component ============
function EmptyState({ isDark }: { isDark: boolean }) {
  return (
    <section className="relative py-16 px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? `linear-gradient(180deg, transparent, ${withAlpha(brandColors.neonCyan, 0.01)} 50%, transparent)`
            : `linear-gradient(180deg, transparent, ${withAlpha(brandColors.blue, 0.01)} 50%, transparent)`,
        }}
      />

      <motion.div
        className="relative max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${withAlpha(brandColors.neonCyan, 0.1)}, ${withAlpha(brandColors.violet, 0.08)})`
              : `linear-gradient(135deg, ${withAlpha(brandColors.blue, 0.08)}, ${withAlpha(brandColors.violet, 0.05)})`,
            border: `1px dashed ${withAlpha(brandColors.neonCyan, 0.3)}`,
          }}
          animate={{
            borderColor: [
              withAlpha(brandColors.neonCyan, 0.3),
              withAlpha(brandColors.violet, 0.3),
              withAlpha(brandColors.neonCyan, 0.3),
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles
            className="w-7 h-7"
            style={{ color: withAlpha(brandColors.neonCyan, 0.6) }}
          />
        </motion.div>

        <h3
          className="text-lg font-semibold mb-2"
          style={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
          }}
        >
          好奇心捕获
        </h3>

        <p
          className="text-sm leading-relaxed"
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          }}
        >
          将上方宇宙中的问题拖入中心的眼睛
          <br />
          捕获你感兴趣的问题，留给自己更多思考时间
        </p>
      </motion.div>
    </section>
  );
}

// ============ Utility Functions ============
function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  return `${Math.floor(diff / 86400000)} 天前`;
}
