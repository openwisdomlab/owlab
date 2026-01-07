"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
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
  const [isMobile, setIsMobile] = useState(false);

  const { capturedQuestions, recentlyCapturedId, removeQuestion, clearAll } =
    useCuriosityCaptureStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 有新问题捕获时，移动端自动打开 sheet
  useEffect(() => {
    if (isMobile && recentlyCapturedId) {
      setIsSheetOpen(true);
    }
  }, [isMobile, recentlyCapturedId]);

  // 移动端：渲染浮动按钮 + Bottom Sheet
  if (isMobile) {
    return (
      <>
        {/* 浮动按钮 */}
        <FloatingButton
          isDark={isDark}
          count={capturedQuestions.length}
          hasRecent={!!recentlyCapturedId}
          onClick={() => setIsSheetOpen(true)}
        />

        {/* Bottom Sheet */}
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          isDark={isDark}
        >
          <SheetContent
            isDark={isDark}
            capturedQuestions={capturedQuestions}
            recentlyCapturedId={recentlyCapturedId}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            removeQuestion={removeQuestion}
            clearAll={clearAll}
          />
        </BottomSheet>
      </>
    );
  }

  // 桌面端：显示固定区域
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

// ============ Floating Button Component (Mobile) ============
interface FloatingButtonProps {
  isDark: boolean;
  count: number;
  hasRecent: boolean;
  onClick: () => void;
}

function FloatingButton({ isDark, count, hasRecent, onClick }: FloatingButtonProps) {
  if (count === 0) return null;

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg"
      style={{
        width: 56,
        height: 56,
        background: isDark
          ? `linear-gradient(135deg, ${withAlpha(brandColors.neonCyan, 0.9)}, ${withAlpha(brandColors.violet, 0.8)})`
          : `linear-gradient(135deg, ${brandColors.neonCyan}, ${brandColors.violet})`,
        boxShadow: `0 4px 20px ${withAlpha(brandColors.neonCyan, 0.4)}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Eye className="w-6 h-6 text-white" />

      {/* 数量徽章 */}
      <motion.span
        className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
        style={{
          background: brandColors.neonPink,
          color: "white",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        {count}
      </motion.span>

      {/* 新捕获脉动 */}
      {hasRecent && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${brandColors.neonCyan}`,
          }}
          animate={{
            scale: [1, 1.4, 1.4],
            opacity: [0.8, 0, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: 3,
            ease: "easeOut",
          }}
        />
      )}
    </motion.button>
  );
}

// ============ Bottom Sheet Component ============
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  children: React.ReactNode;
}

function BottomSheet({ isOpen, onClose, isDark, children }: BottomSheetProps) {
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet 主体 */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-3xl overflow-hidden"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(14,14,20,0.98), rgba(10,10,16,0.99))"
                : "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,250,252,0.98))",
              boxShadow: `0 -10px 40px rgba(0,0,0,0.3), 0 0 60px ${withAlpha(brandColors.neonCyan, 0.1)}`,
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
          >
            {/* 拖动手柄 */}
            <div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div
                className="w-10 h-1 rounded-full"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.15)",
                }}
              />
            </div>

            {/* 内容区域 */}
            <div className="overflow-y-auto max-h-[calc(85vh-40px)] pb-safe">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============ Sheet Content Component ============
interface SheetContentProps {
  isDark: boolean;
  capturedQuestions: CapturedQuestion[];
  recentlyCapturedId: string | null;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  removeQuestion: (id: string) => void;
  clearAll: () => void;
}

function SheetContent({
  isDark,
  capturedQuestions,
  recentlyCapturedId,
  expandedId,
  setExpandedId,
  removeQuestion,
  clearAll,
}: SheetContentProps) {
  if (capturedQuestions.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <Sparkles
          className="w-10 h-10 mx-auto mb-4"
          style={{ color: withAlpha(brandColors.neonCyan, 0.5) }}
        />
        <p
          className="text-sm"
          style={{
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          }}
        >
          还没有捕获任何问题
          <br />
          将问题拖入中心眼睛来捕获
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      {/* 标题区域 */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Eye
            className="w-5 h-5"
            style={{ color: brandColors.neonCyan }}
          />
          <h3
            className="font-bold"
            style={{
              background: `linear-gradient(90deg, ${brandColors.neonCyan}, ${brandColors.violet})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            好奇心捕获
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: withAlpha(brandColors.neonCyan, 0.15),
              color: brandColors.neonCyan,
            }}
          >
            {capturedQuestions.length}
          </span>
        </div>

        <motion.button
          className="text-xs px-2 py-1 rounded-lg"
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
        >
          清空
        </motion.button>
      </div>

      {/* 问题列表 */}
      <div className="space-y-3">
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
            compact
          />
        ))}
      </div>
    </div>
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
  compact?: boolean;
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
  compact = false,
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
        whileHover={compact ? undefined : {
          borderColor: withAlpha(color, 0.5),
          boxShadow: `0 0 25px ${withAlpha(color, 0.2)}, 0 8px 30px rgba(0,0,0,0.12)`,
        }}
        whileTap={compact ? { scale: 0.98 } : undefined}
        onClick={onToggleExpand}
      >
        {/* 顶部颜色条 */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${color}, ${withAlpha(color, 0.3)})`,
          }}
        />

        <div className={compact ? "p-4" : "p-5"}>
          {/* 问题头部 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* 问题文本 */}
              <p
                className={`font-medium leading-relaxed ${compact ? "text-sm" : "text-base"}`}
                style={{
                  color: isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)",
                }}
              >
                {captured.question.question}
              </p>

              {/* 标签 */}
              <div className="flex items-center gap-2 mt-2">
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
            <div className="flex items-center gap-1">
              <motion.button
                className={`p-1.5 rounded-lg transition-opacity ${compact ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{
                  color: isDark
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(0,0,0,0.4)",
                }}
                whileHover={{
                  color: brandColors.neonPink,
                  background: withAlpha(brandColors.neonPink, 0.1),
                }}
                whileTap={{ scale: 0.9 }}
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
                  className="mt-3 pt-3 border-t"
                  style={{
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    className="rounded-lg p-3"
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
                        lineHeight: 1.7,
                      }}
                    >
                      {captured.question.explanation}
                    </p>
                  </div>

                  {/* 深度思考提示 */}
                  {captured.question.deepThought?.followUpQuestions && (
                    <div className="mt-3">
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

// ============ Empty State Component (Desktop) ============
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
