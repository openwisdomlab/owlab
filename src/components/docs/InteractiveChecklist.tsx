"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Download,
  Share2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
  priority?: "high" | "medium" | "low";
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

interface InteractiveChecklistProps {
  id: string; // Unique ID for localStorage persistence
  title: string;
  sections: ChecklistSection[];
  onProgressChange?: (completed: number, total: number) => void;
  className?: string;
}

export function InteractiveChecklist({
  id,
  title,
  sections,
  onProgressChange,
  className = "",
}: InteractiveChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showShareToast, setShowShareToast] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`checklist-${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCheckedItems(new Set(parsed));
      } catch (e) {
        console.error("Failed to parse saved checklist:", e);
      }
    }
  }, [id]);

  // Save to localStorage when checked items change
  useEffect(() => {
    localStorage.setItem(`checklist-${id}`, JSON.stringify([...checkedItems]));
  }, [id, checkedItems]);

  // Calculate progress
  const { totalItems, completedItems, progress } = useMemo(() => {
    const total = sections.reduce((sum, s) => sum + s.items.length, 0);
    const completed = checkedItems.size;
    return {
      totalItems: total,
      completedItems: completed,
      progress: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [sections, checkedItems]);

  // Notify parent of progress changes
  useEffect(() => {
    onProgressChange?.(completedItems, totalItems);
  }, [completedItems, totalItems, onProgressChange]);

  const toggleItem = useCallback((itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleSection = useCallback((sectionTitle: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionTitle)) {
        next.delete(sectionTitle);
      } else {
        next.add(sectionTitle);
      }
      return next;
    });
  }, []);

  const resetChecklist = useCallback(() => {
    setCheckedItems(new Set());
    localStorage.removeItem(`checklist-${id}`);
  }, [id]);

  const exportToPDF = useCallback(() => {
    // Create a printable HTML content
    const content = sections
      .map(
        (section) => `
      <h3>${section.title}</h3>
      <ul>
        ${section.items
          .map(
            (item) => `
          <li style="margin: 8px 0;">
            ${checkedItems.has(item.id) ? "☑" : "☐"} ${item.text}
          </li>
        `
          )
          .join("")}
      </ul>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
          h3 { color: #555; margin-top: 24px; }
          ul { list-style: none; padding-left: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #eee; }
          .progress { background: #eee; height: 8px; border-radius: 4px; margin: 20px 0; }
          .progress-bar { background: #22d3ee; height: 100%; border-radius: 4px; }
          .summary { color: #666; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="summary">完成进度: ${completedItems}/${totalItems} (${progress.toFixed(0)}%)</div>
        <div class="progress"><div class="progress-bar" style="width: ${progress}%"></div></div>
        ${content}
        <p style="margin-top: 40px; color: #999; font-size: 12px;">
          生成时间: ${new Date().toLocaleString("zh-CN")}
        </p>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-")}-checklist.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [title, sections, checkedItems, completedItems, totalItems, progress]);

  const shareProgress = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("checklist", id);
    url.searchParams.set("progress", [...checkedItems].join(","));

    try {
      await navigator.clipboard.writeText(url.toString());
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (e) {
      console.error("Failed to copy to clipboard:", e);
    }
  }, [id, checkedItems]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-[var(--muted-foreground)]";
    }
  };

  return (
    <div
      className={`bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[var(--neon-cyan)]" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={exportToPDF}
              className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              title="导出"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={shareProgress}
              className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              title="分享进度"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={resetChecklist}
              className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-red-400"
              title="重置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>完成进度</span>
            <span>
              {completedItems}/{totalItems} ({progress.toFixed(0)}%)
            </span>
          </div>
          <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-[var(--glass-border)]">
        {sections.map((section) => {
          const sectionCompleted = section.items.filter((item) =>
            checkedItems.has(item.id)
          ).length;
          const isCollapsed = collapsedSections.has(section.title);

          return (
            <div key={section.title}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-3 hover:bg-[var(--glass-bg)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{section.title}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {sectionCompleted}/{section.items.length}
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>

              {/* Section Items */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-1">
                      {section.items.map((item) => {
                        const isChecked = checkedItems.has(item.id);

                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-all ${
                              isChecked
                                ? "bg-[var(--neon-green)]/10"
                                : "hover:bg-[var(--glass-bg)]"
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-[var(--neon-green)] flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-sm ${
                                  isChecked
                                    ? "line-through text-[var(--muted-foreground)]"
                                    : ""
                                }`}
                              >
                                {item.text}
                              </span>
                              {item.priority && (
                                <span
                                  className={`ml-2 text-xs ${getPriorityColor(
                                    item.priority
                                  )}`}
                                >
                                  {item.priority === "high"
                                    ? "高优先级"
                                    : item.priority === "medium"
                                    ? "中优先级"
                                    : "低优先级"}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 bg-[var(--neon-green)]/10 border-t border-[var(--neon-green)]/20"
          >
            <div className="flex items-center gap-2 text-[var(--neon-green)]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">所有项目已完成！</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--neon-cyan)] text-[var(--background)] rounded-lg text-sm font-medium shadow-lg"
          >
            链接已复制到剪贴板
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-built checklist data for common use cases
export const SAFETY_CHECKLIST: ChecklistSection[] = [
  {
    title: "消防安全",
    items: [
      { id: "fire-1", text: "消防设备到位且有效期内", priority: "high" },
      { id: "fire-2", text: "灭火器位置标识清晰", priority: "high" },
      { id: "fire-3", text: "应急疏散路线标识完整", priority: "high" },
      { id: "fire-4", text: "消防通道保持畅通", priority: "high" },
    ],
  },
  {
    title: "电气安全",
    items: [
      { id: "elec-1", text: "电气设备接地良好", priority: "high" },
      { id: "elec-2", text: "插座无过载使用", priority: "medium" },
      { id: "elec-3", text: "电线无老化破损", priority: "high" },
      { id: "elec-4", text: "配电箱标识清晰", priority: "medium" },
    ],
  },
  {
    title: "设备安全",
    items: [
      { id: "equip-1", text: "设备操作规程上墙", priority: "medium" },
      { id: "equip-2", text: "危险设备有防护装置", priority: "high" },
      { id: "equip-3", text: "急停按钮功能正常", priority: "high" },
      { id: "equip-4", text: "通风排烟系统正常", priority: "medium" },
    ],
  },
  {
    title: "个人防护",
    items: [
      { id: "ppe-1", text: "护目镜配备充足", priority: "medium" },
      { id: "ppe-2", text: "防护手套可用", priority: "medium" },
      { id: "ppe-3", text: "急救箱物资齐全", priority: "high" },
      { id: "ppe-4", text: "洗眼器功能正常", priority: "medium" },
    ],
  },
];

export const SPACE_SETUP_CHECKLIST: ChecklistSection[] = [
  {
    title: "基础设施",
    items: [
      { id: "infra-1", text: "电力容量满足需求", priority: "high" },
      { id: "infra-2", text: "网络覆盖完整", priority: "medium" },
      { id: "infra-3", text: "照明亮度适宜", priority: "medium" },
      { id: "infra-4", text: "通风系统安装完成", priority: "high" },
    ],
  },
  {
    title: "功能分区",
    items: [
      { id: "zone-1", text: "工作区划分合理", priority: "medium" },
      { id: "zone-2", text: "存储区规划完成", priority: "medium" },
      { id: "zone-3", text: "展示区设置到位", priority: "low" },
      { id: "zone-4", text: "休息讨论区配置", priority: "low" },
    ],
  },
  {
    title: "设备配置",
    items: [
      { id: "dev-1", text: "核心设备采购到位", priority: "high" },
      { id: "dev-2", text: "工作台数量充足", priority: "medium" },
      { id: "dev-3", text: "工具墙安装完成", priority: "medium" },
      { id: "dev-4", text: "耗材初始库存准备", priority: "medium" },
    ],
  },
];
