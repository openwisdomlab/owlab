# AI 辅助实验室设计器 v2 - Phase 1 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构启动体验，实现智能对话入口 + 常驻 AI 侧边栏 + 精简工具栏

**Architecture:**
- 新增 SmartLauncher 组件作为启动界面，替代直接进入空白画布
- 新增 AISidebar 组件作为常驻助手，整合现有 AIChatPanel 功能并增加实时建议
- 重构 page.tsx 状态管理，引入启动流程状态机

**Tech Stack:** Next.js 14, React 18, Framer Motion, Tailwind CSS, Vercel AI SDK

---

## Task 1: 创建智能启动组件 SmartLauncher

**Files:**
- Create: `src/components/lab/SmartLauncher.tsx`
- Create: `src/lib/schemas/launcher.ts`

**Step 1: 创建启动器类型定义**

```typescript
// src/lib/schemas/launcher.ts
import { z } from "zod";

export const LaunchModeSchema = z.enum([
  "chat",      // 自然语言输入
  "quick",     // 快速选择学科
  "template",  // 从模板开始
  "blank"      // 空白开始
]);

export type LaunchMode = z.infer<typeof LaunchModeSchema>;

export const DisciplineSchema = z.enum([
  "life-health",      // 生命健康
  "deep-space-ocean", // 深空海地
  "social-innovation",// 社会创新
  "micro-nano",       // 微纳界面
  "digital-info"      // 数字信息
]);

export type Discipline = z.infer<typeof DisciplineSchema>;

export const SubDisciplineMap: Record<Discipline, string[]> = {
  "life-health": ["合成生物", "脑科学", "健康科技", "生物医学"],
  "deep-space-ocean": ["航天技术", "海洋科学", "极端环境", "地球深部"],
  "social-innovation": ["教育创新", "可持续发展", "社区设计", "政策实验"],
  "micro-nano": ["纳米材料", "量子科技", "新能源", "精密制造"],
  "digital-info": ["人工智能", "数据科学", "人机交互", "元宇宙"]
};

export interface LauncherState {
  mode: LaunchMode | null;
  prompt: string;
  discipline: Discipline | null;
  subDisciplines: string[];
  spaceSize: "small" | "medium" | "large" | null;
  budget: number | null;
}
```

**Step 2: 创建 SmartLauncher 组件**

```tsx
// src/components/lab/SmartLauncher.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bird,
  MessageSquare,
  Zap,
  FileText,
  PenTool,
  ArrowRight,
  Dna,
  Rocket,
  Globe,
  Atom,
  Cpu,
} from "lucide-react";
import { Discipline, SubDisciplineMap, LauncherState } from "@/lib/schemas/launcher";

const disciplineConfig: Record<Discipline, { icon: typeof Dna; color: string; label: string }> = {
  "life-health": { icon: Dna, color: "emerald", label: "生命健康" },
  "deep-space-ocean": { icon: Rocket, color: "blue", label: "深空海地" },
  "social-innovation": { icon: Globe, color: "amber", label: "社会创新" },
  "micro-nano": { icon: Atom, color: "violet", label: "微纳界面" },
  "digital-info": { icon: Cpu, color: "cyan", label: "数字信息" },
};

interface SmartLauncherProps {
  onStart: (state: LauncherState) => void;
  onSkip: () => void;
}

export function SmartLauncher({ onStart, onSkip }: SmartLauncherProps) {
  const [state, setState] = useState<LauncherState>({
    mode: null,
    prompt: "",
    discipline: null,
    subDisciplines: [],
    spaceSize: null,
    budget: null,
  });

  const handlePromptSubmit = () => {
    if (state.prompt.trim()) {
      onStart({ ...state, mode: "chat" });
    }
  };

  const handleDisciplineSelect = (discipline: Discipline) => {
    setState(prev => ({ ...prev, discipline, mode: "quick" }));
  };

  const handleSubDisciplineToggle = (sub: string) => {
    setState(prev => {
      const exists = prev.subDisciplines.includes(sub);
      const updated = exists
        ? prev.subDisciplines.filter(s => s !== sub)
        : prev.subDisciplines.length < 2
          ? [...prev.subDisciplines, sub]
          : prev.subDisciplines;
      return { ...prev, subDisciplines: updated };
    });
  };

  const handleQuickStart = () => {
    if (state.discipline && state.subDisciplines.length > 0) {
      onStart(state);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <Bird className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">OWL 空间设计助手</span>
          </motion.div>
          <h1 className="text-3xl font-bold mb-3">你好！我来帮你设计实验室空间</h1>
          <p className="text-[var(--muted-foreground)]">
            告诉我你的需求，或者选择快速开始
          </p>
        </div>

        {/* Main Input */}
        <div className="glass-card p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handlePromptSubmit()}
              placeholder="例如：80平米的合成生物实验室，预算50万，需要PCR区和细胞培养区..."
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePromptSubmit}
              disabled={!state.prompt.trim()}
              className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              开始设计
            </motion.button>
          </div>
        </div>

        {/* Quick Start Options */}
        <div className="mb-6">
          <p className="text-sm text-[var(--muted-foreground)] mb-4 text-center">或者选择学科方向快速开始</p>
          <div className="grid grid-cols-5 gap-3">
            {(Object.entries(disciplineConfig) as [Discipline, typeof disciplineConfig[Discipline]][]).map(
              ([key, config]) => {
                const Icon = config.icon;
                const isSelected = state.discipline === key;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDisciplineSelect(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${config.color}-500 bg-${config.color}-500/10`
                        : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 text-${config.color}-400`} />
                    <span className="text-sm font-medium">{config.label}</span>
                  </motion.button>
                );
              }
            )}
          </div>
        </div>

        {/* Sub-discipline Selection */}
        <AnimatePresence>
          {state.discipline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 mb-6"
            >
              <p className="text-sm text-[var(--muted-foreground)] mb-3">
                选择 1-2 个专业方向
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SubDisciplineMap[state.discipline].map((sub) => {
                  const isSelected = state.subDisciplines.includes(sub);
                  return (
                    <motion.button
                      key={sub}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubDisciplineToggle(sub)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-emerald-500 text-white"
                          : "bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-emerald-500/50"
                      }`}
                    >
                      {sub}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleQuickStart}
                disabled={state.subDisciplines.length === 0}
                className="w-full py-3 rounded-lg bg-emerald-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                生成设计方案
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other Options */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={() => onStart({ ...state, mode: "template" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <FileText className="w-4 h-4" />
            从模板开始
          </button>
          <span className="text-[var(--glass-border)]">|</span>
          <button
            onClick={onSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <PenTool className="w-4 h-4" />
            空白画布
          </button>
        </div>
      </motion.div>
    </div>
  );
}
```

**Step 3: 验证组件可以导入**

Run: `pnpm build 2>&1 | head -50`
Expected: 无 SmartLauncher 相关错误

**Step 4: 提交**

```bash
git add src/components/lab/SmartLauncher.tsx src/lib/schemas/launcher.ts
git commit -m "feat(lab): add SmartLauncher component for intelligent startup"
```

---

## Task 2: 创建常驻 AI 侧边栏组件

**Files:**
- Create: `src/components/lab/AISidebar.tsx`

**Step 1: 创建 AISidebar 组件**

```tsx
// src/components/lab/AISidebar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bird,
  Send,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { LayoutData } from "@/lib/schemas/layout-agent";

interface AISuggestion {
  id: string;
  type: "warning" | "tip" | "success";
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
  dismissed?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AISidebarProps {
  layout: LayoutData;
  onLayoutUpdate: (layout: LayoutData) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AISidebar({ layout, onLayoutUpdate, isOpen, onToggle }: AISidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是你的设计助手。有任何问题随时问我，我也会在你设计时给出建议。",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 模拟实时建议（后续接入真实 AI）
  useEffect(() => {
    const analyzeSuggestions: AISuggestion[] = [];

    // 检查区域数量
    if (layout.zones.length === 0) {
      analyzeSuggestions.push({
        id: "no-zones",
        type: "tip",
        title: "开始添加区域",
        description: "点击画布或使用工具栏添加你的第一个功能区域",
      });
    }

    // 检查是否有通用区域
    const hasGeneral = layout.zones.some(z => z.type === "workspace");
    if (layout.zones.length > 0 && !hasGeneral) {
      analyzeSuggestions.push({
        id: "no-general",
        type: "tip",
        title: "考虑添加通用工作区",
        description: "通用工作区可以满足多学科临时需求",
      });
    }

    // 检查区域是否太密集
    const totalArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);
    const layoutArea = layout.dimensions.width * layout.dimensions.height;
    if (totalArea > layoutArea * 0.8) {
      analyzeSuggestions.push({
        id: "too-dense",
        type: "warning",
        title: "空间可能过于拥挤",
        description: "建议保留 20% 以上的通道和缓冲空间",
      });
    }

    setSuggestions(analyzeSuggestions);
  }, [layout]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          layout,
          history: messages.slice(-10),
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "抱歉，我暂时无法回答这个问题。",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // 如果 AI 返回了布局更新
      if (data.layout) {
        onLayoutUpdate(data.layout);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，发生了错误。请稍后重试。",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const getSuggestionIcon = (type: AISuggestion["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "tip":
        return <Lightbulb className="w-4 h-4 text-cyan-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onToggle}
        className="fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:border-emerald-500/50 transition-colors z-40"
      >
        <Bird className="w-6 h-6 text-emerald-400" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 glass-card border-l border-[var(--glass-border)] z-40 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bird className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">AI 助手</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-b border-[var(--glass-border)]">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full p-3 flex items-center justify-between text-sm hover:bg-[var(--glass-bg)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              实时建议 ({suggestions.length})
            </span>
            {showSuggestions ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {getSuggestionIcon(suggestion.type)}
                          <div>
                            <p className="text-sm font-medium">{suggestion.title}</p>
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => dismissSuggestion(suggestion.id)}
                          className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {suggestion.action && (
                        <button
                          onClick={suggestion.action.handler}
                          className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          {suggestion.action.label} →
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-emerald-500/20 text-emerald-100"
                  : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--glass-border)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="有问题随时问我..."
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-emerald-500 focus:outline-none text-sm transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

**Step 2: 验证组件可以导入**

Run: `pnpm build 2>&1 | head -50`
Expected: 无 AISidebar 相关错误

**Step 3: 提交**

```bash
git add src/components/lab/AISidebar.tsx
git commit -m "feat(lab): add AISidebar component for always-on AI assistant"
```

---

## Task 3: 创建精简工具栏组件

**Files:**
- Create: `src/components/lab/SimplifiedToolbar.tsx`

**Step 1: 创建精简工具栏**

```tsx
// src/components/lab/SimplifiedToolbar.tsx
"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  MoreHorizontal,
  Save,
  Download,
  Eye,
  Bird,
} from "lucide-react";
import { useState } from "react";

interface SimplifiedToolbarProps {
  zoom: number;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddZone: () => void;
  onSave: () => void;
  onExport: () => void;
  onPreview3D: () => void;
  onToggleAI: () => void;
  onMoreOptions: () => void;
}

export function SimplifiedToolbar({
  zoom,
  showGrid,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onUndo,
  onRedo,
  onAddZone,
  onSave,
  onExport,
  onPreview3D,
  onToggleAI,
  onMoreOptions,
}: SimplifiedToolbarProps) {
  const [showMore, setShowMore] = useState(false);

  const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    disabled,
    active,
    highlight,
  }: {
    icon: typeof Plus;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    highlight?: boolean;
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors relative group ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : active
            ? "bg-emerald-500/20 text-emerald-400"
            : highlight
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "hover:bg-[var(--glass-bg)]"
      }`}
      title={label}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </motion.button>
  );

  const Divider = () => (
    <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />
  );

  return (
    <div className="glass-card px-4 py-2 flex items-center gap-1">
      {/* 主要操作 */}
      <ToolButton
        icon={Plus}
        label="添加区域"
        onClick={onAddZone}
        highlight
      />

      <Divider />

      {/* 撤销重做 */}
      <ToolButton
        icon={Undo2}
        label="撤销 (⌘Z)"
        onClick={onUndo}
        disabled={!canUndo}
      />
      <ToolButton
        icon={Redo2}
        label="重做 (⌘⇧Z)"
        onClick={onRedo}
        disabled={!canRedo}
      />

      <Divider />

      {/* 视图控制 */}
      <ToolButton
        icon={ZoomOut}
        label="缩小"
        onClick={onZoomOut}
        disabled={zoom <= 0.5}
      />
      <span className="text-xs text-[var(--muted-foreground)] min-w-[3rem] text-center">
        {Math.round(zoom * 100)}%
      </span>
      <ToolButton
        icon={ZoomIn}
        label="放大"
        onClick={onZoomIn}
        disabled={zoom >= 2}
      />
      <ToolButton
        icon={Grid3X3}
        label="网格"
        onClick={onToggleGrid}
        active={showGrid}
      />

      <Divider />

      {/* 预览和导出 */}
      <ToolButton
        icon={Eye}
        label="3D 预览"
        onClick={onPreview3D}
      />
      <ToolButton
        icon={Save}
        label="保存模板"
        onClick={onSave}
      />
      <ToolButton
        icon={Download}
        label="导出"
        onClick={onExport}
      />

      <Divider />

      {/* AI 助手 */}
      <ToolButton
        icon={Bird}
        label="AI 助手"
        onClick={onToggleAI}
      />

      {/* 更多选项 */}
      <ToolButton
        icon={MoreHorizontal}
        label="更多工具"
        onClick={onMoreOptions}
      />
    </div>
  );
}
```

**Step 2: 验证组件可以导入**

Run: `pnpm build 2>&1 | head -50`
Expected: 无 SimplifiedToolbar 相关错误

**Step 3: 提交**

```bash
git add src/components/lab/SimplifiedToolbar.tsx
git commit -m "feat(lab): add SimplifiedToolbar for streamlined operations"
```

---

## Task 4: 重构 floor-plan 页面集成新组件

**Files:**
- Modify: `src/app/[locale]/lab/floor-plan/page.tsx`

**Step 1: 添加启动状态和导入新组件**

在 page.tsx 顶部添加导入和状态：

```tsx
// 在现有 imports 后添加
import { SmartLauncher } from "@/components/lab/SmartLauncher";
import { AISidebar } from "@/components/lab/AISidebar";
import { SimplifiedToolbar } from "@/components/lab/SimplifiedToolbar";
import { LauncherState } from "@/lib/schemas/launcher";

// 在组件内添加启动状态
const [showLauncher, setShowLauncher] = useState(true);
const [showAISidebar, setShowAISidebar] = useState(true);
const [launcherState, setLauncherState] = useState<LauncherState | null>(null);
```

**Step 2: 添加启动处理函数**

```tsx
// 在其他 handler 函数附近添加
const handleLauncherStart = useCallback(async (state: LauncherState) => {
  setLauncherState(state);
  setShowLauncher(false);

  // 如果是自然语言输入，调用 AI 生成布局
  if (state.mode === "chat" && state.prompt) {
    setShowAISidebar(true);

    // 调用 AI 生成布局
    try {
      const response = await fetch("/api/ai/generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: state.prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.layout) {
          setLayout(data.layout);
        }
      }
    } catch (error) {
      console.error("Failed to generate layout from prompt:", error);
    }
  }

  // 如果是快速选择，基于学科生成基础布局
  if (state.mode === "quick" && state.discipline) {
    const newLayout = getLayoutFromDiscipline(state.discipline);
    setLayout(newLayout);
    setShowAISidebar(true);
  }

  // 如果是模板模式，打开模板库
  if (state.mode === "template") {
    setShowTemplates(true);
  }
}, [setLayout]);

const handleLauncherSkip = useCallback(() => {
  setShowLauncher(false);
}, []);
```

**Step 3: 修改 return 语句，添加条件渲染**

```tsx
return (
  <div className="h-screen flex flex-col overflow-hidden">
    <AnimatePresence mode="wait">
      {showLauncher ? (
        <SmartLauncher
          key="launcher"
          onStart={handleLauncherStart}
          onSkip={handleLauncherSkip}
        />
      ) : (
        <motion.div
          key="editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col"
        >
          {/* 工具栏 - 使用新的精简版 */}
          <div className="p-4 border-b border-[var(--glass-border)]">
            <SimplifiedToolbar
              zoom={zoom}
              showGrid={showGrid}
              canUndo={canUndo}
              canRedo={canRedo}
              onZoomIn={() => setZoom(Math.min(zoom + 0.1, 2))}
              onZoomOut={() => setZoom(Math.max(zoom - 0.1, 0.5))}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onUndo={undo}
              onRedo={redo}
              onAddZone={handleAddZone}
              onSave={() => setShowSaveTemplate(true)}
              onExport={() => setShowExport(true)}
              onPreview3D={() => setShow3DPreview(true)}
              onToggleAI={() => setShowAISidebar(!showAISidebar)}
              onMoreOptions={() => setShowShortcuts(true)}
            />
          </div>

          {/* 主要内容区 */}
          <div className="flex-1 relative overflow-hidden">
            {/* 画布 */}
            <FloorPlanCanvas
              layout={layout}
              selectedZone={selectedZone}
              zoom={zoom}
              showGrid={showGrid}
              gridSnap={gridSnap}
              colorScheme={colorScheme}
              onZoneSelect={setSelectedZone}
              onZoneUpdate={handleZoneUpdate}
              onLayoutUpdate={updateLayout}
            />

            {/* AI 侧边栏 */}
            <AISidebar
              layout={layout}
              onLayoutUpdate={updateLayout}
              isOpen={showAISidebar}
              onToggle={() => setShowAISidebar(!showAISidebar)}
            />
          </div>

          {/* 保留现有的模态框和面板 */}
          {/* ... existing modals ... */}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
```

**Step 4: 验证构建**

Run: `pnpm build 2>&1 | grep -E "(error|Error)" | head -20`
Expected: 无新增错误

**Step 5: 提交**

```bash
git add src/app/[locale]/lab/floor-plan/page.tsx
git commit -m "feat(lab): integrate SmartLauncher and AISidebar into floor-plan page"
```

---

## Task 5: 添加国际化翻译

**Files:**
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

**Step 1: 添加中文翻译**

在 `messages/zh.json` 的 `lab` 对象中添加：

```json
"launcher": {
  "title": "你好！我来帮你设计实验室空间",
  "subtitle": "告诉我你的需求，或者选择快速开始",
  "placeholder": "例如：80平米的合成生物实验室，预算50万...",
  "startDesign": "开始设计",
  "quickStart": "或者选择学科方向快速开始",
  "selectSub": "选择 1-2 个专业方向",
  "generate": "生成设计方案",
  "fromTemplate": "从模板开始",
  "blankCanvas": "空白画布",
  "disciplines": {
    "life-health": "生命健康",
    "deep-space-ocean": "深空海地",
    "social-innovation": "社会创新",
    "micro-nano": "微纳界面",
    "digital-info": "数字信息"
  }
},
"aiSidebar": {
  "title": "AI 助手",
  "suggestions": "实时建议",
  "placeholder": "有问题随时问我...",
  "welcome": "你好！我是你的设计助手。有任何问题随时问我，我也会在你设计时给出建议。"
},
"toolbar": {
  "addZone": "添加区域",
  "undo": "撤销",
  "redo": "重做",
  "zoomIn": "放大",
  "zoomOut": "缩小",
  "grid": "网格",
  "preview3D": "3D 预览",
  "save": "保存模板",
  "export": "导出",
  "aiAssistant": "AI 助手",
  "more": "更多工具"
}
```

**Step 2: 添加英文翻译**

在 `messages/en.json` 的 `lab` 对象中添加：

```json
"launcher": {
  "title": "Hello! Let me help you design your lab space",
  "subtitle": "Tell me your requirements, or choose a quick start option",
  "placeholder": "e.g., 80 sqm synthetic biology lab, budget 500k...",
  "startDesign": "Start Design",
  "quickStart": "Or select a discipline to quick start",
  "selectSub": "Select 1-2 sub-disciplines",
  "generate": "Generate Design",
  "fromTemplate": "Start from Template",
  "blankCanvas": "Blank Canvas",
  "disciplines": {
    "life-health": "Life & Health",
    "deep-space-ocean": "Space & Ocean",
    "social-innovation": "Social Innovation",
    "micro-nano": "Micro & Nano",
    "digital-info": "Digital & Info"
  }
},
"aiSidebar": {
  "title": "AI Assistant",
  "suggestions": "Real-time Suggestions",
  "placeholder": "Ask me anything...",
  "welcome": "Hello! I'm your design assistant. Feel free to ask any questions, and I'll provide suggestions as you design."
},
"toolbar": {
  "addZone": "Add Zone",
  "undo": "Undo",
  "redo": "Redo",
  "zoomIn": "Zoom In",
  "zoomOut": "Zoom Out",
  "grid": "Grid",
  "preview3D": "3D Preview",
  "save": "Save Template",
  "export": "Export",
  "aiAssistant": "AI Assistant",
  "more": "More Tools"
}
```

**Step 3: 验证翻译**

Run: `pnpm build 2>&1 | grep -i "missing" | head -10`
Expected: 无新增 missing message 错误

**Step 4: 提交**

```bash
git add messages/zh.json messages/en.json
git commit -m "feat(i18n): add translations for SmartLauncher and AISidebar"
```

---

## Task 6: 最终验证和整体提交

**Step 1: 完整构建验证**

Run: `pnpm build`
Expected: 构建成功

**Step 2: 创建汇总提交（如果前面有遗漏）**

```bash
git status
# 如有未提交的更改，添加并提交
```

**Step 3: 更新设计文档状态**

在 `docs/plans/2025-01-02-ai-lab-designer-v2.md` 中添加实施进度：

```markdown
## 实施进度

### Phase 1: 智能入口重构 ✅ 进行中

- [x] SmartLauncher 组件
- [x] AISidebar 组件
- [x] SimplifiedToolbar 组件
- [x] 页面集成
- [x] 国际化翻译
- [ ] AI 对话代理优化
- [ ] 学科模板数据
```

---

## 预期成果

完成 Task 1-6 后，用户将体验到：

1. **智能启动界面** - 进入 floor-plan 页面时，首先看到对话入口和学科选择
2. **常驻 AI 助手** - 右侧侧边栏始终显示 AI 助手和实时建议
3. **精简工具栏** - 顶部工具栏只保留核心操作，更多功能收入菜单
4. **流畅过渡** - 从启动到设计的动画过渡

---

## 后续任务（Phase 1 下一步）

- AI 对话代理优化：接入真实 AI 理解用户需求
- 学科模板数据：创建五大学域的基础模板
- 实时建议引擎：基于布局分析提供更智能的建议
