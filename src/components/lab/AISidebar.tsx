"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Bird,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import { useToast } from "@/components/ui/Toast";

// ============================================
// Types
// ============================================

interface AISuggestion {
  id: string;
  type: "warning" | "tip" | "success";
  title: string;
  description: string;
  action?: () => void;
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

// ============================================
// Animation Variants
// ============================================

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const suggestionVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 20 },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ============================================
// Helper Components
// ============================================

function LoadingDots() {
  return (
    <div className="flex gap-1 items-center p-3 rounded-lg bg-emerald-500/10">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function SuggestionIcon({ type }: { type: AISuggestion["type"] }) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case "tip":
      return <Lightbulb className="w-4 h-4 text-emerald-400" />;
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
  }
}

function getSuggestionStyles(type: AISuggestion["type"]) {
  switch (type) {
    case "warning":
      return "border-amber-500/30 bg-amber-500/10";
    case "tip":
      return "border-emerald-500/30 bg-emerald-500/10";
    case "success":
      return "border-green-500/30 bg-green-500/10";
  }
}

// ============================================
// Main Component
// ============================================

export function AISidebar({
  layout,
  onLayoutUpdate,
  isOpen,
  onToggle,
}: AISidebarProps) {
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "您好！我是您的 AI 实验室设计助手。我可以帮助您优化布局、回答设计问题，或者根据您的需求调整实验室配置。有什么我可以帮助您的吗？",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Analyze layout and generate suggestions
  useEffect(() => {
    const newSuggestions: AISuggestion[] = [];

    // Check for zones
    if (layout.zones.length === 0) {
      newSuggestions.push({
        id: "no-zones",
        type: "tip",
        title: "添加功能区域",
        description: "您的布局中还没有任何功能区域。尝试添加计算区、工作区或会议区来开始设计。",
      });
    }

    // Check for compute zones near entrance
    const entranceZone = layout.zones.find((z) => z.type === "entrance");
    const computeZones = layout.zones.filter((z) => z.type === "compute");

    if (entranceZone && computeZones.length > 0) {
      const tooCloseToEntrance = computeZones.some((compute) => {
        const dx = Math.abs(compute.position.x - entranceZone.position.x);
        const dy = Math.abs(compute.position.y - entranceZone.position.y);
        return dx < 3 && dy < 3;
      });

      if (tooCloseToEntrance) {
        newSuggestions.push({
          id: "compute-entrance",
          type: "warning",
          title: "计算区位置建议",
          description: "计算设备区域距离入口较近，可能会受到人流干扰。建议将其移至更安静的位置。",
        });
      }
    }

    // Check for meeting zones
    const meetingZones = layout.zones.filter((z) => z.type === "meeting");
    if (meetingZones.length === 0 && layout.zones.length >= 3) {
      newSuggestions.push({
        id: "no-meeting",
        type: "tip",
        title: "考虑添加会议区",
        description: "您的布局中没有会议区域。添加一个会议空间可以促进团队协作和讨论。",
      });
    }

    // Check layout dimensions
    const totalArea = layout.dimensions.width * layout.dimensions.height;
    const zoneArea = layout.zones.reduce(
      (acc, zone) => acc + zone.size.width * zone.size.height,
      0
    );
    const utilization = zoneArea / totalArea;

    if (utilization > 0.85) {
      newSuggestions.push({
        id: "high-density",
        type: "warning",
        title: "空间利用率较高",
        description: "当前布局的空间利用率超过 85%，可能会影响通行和工作效率。考虑增加过道空间。",
      });
    } else if (utilization > 0.6 && utilization <= 0.85) {
      newSuggestions.push({
        id: "good-utilization",
        type: "success",
        title: "空间利用率良好",
        description: "当前布局的空间利用率在合理范围内，兼顾了功能性和舒适度。",
      });
    }

    setSuggestions(newSuggestions);
  }, [layout]);

  // Handle sending messages
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          layout,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If the AI returned a new layout, update it
      if (data.layout) {
        onLayoutUpdate(data.layout);
        toast.success("布局已更新", "根据您的要求已修改布局配置。");
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，处理您的请求时出现了问题。请稍后再试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("请求失败", "无法处理您的请求，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dismissing a suggestion
  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  // Collapsed state - floating button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:shadow-emerald-500/50 transition-shadow"
        aria-label="打开 AI 助手"
      >
        <Bird className="w-6 h-6" />
        {suggestions.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-medium">
            {suggestions.length}
          </span>
        )}
      </motion.button>
    );
  }

  // Expanded state - full sidebar
  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed right-0 top-0 z-50 h-full w-80 glass-card border-l border-[var(--glass-border)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Bird className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI 助手</h3>
            <p className="text-xs text-[var(--muted-foreground)]">实验室设计顾问</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="关闭侧边栏"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="border-b border-[var(--glass-border)]">
          <button
            onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
            className="w-full flex items-center justify-between p-3 hover:bg-[var(--glass-bg)]/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">实时建议</span>
              <span className="text-xs text-[var(--muted-foreground)]">
                ({suggestions.length})
              </span>
            </div>
            {suggestionsExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {suggestionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 space-y-2 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        variants={suggestionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`p-3 rounded-lg border ${getSuggestionStyles(suggestion.type)}`}
                      >
                        <div className="flex items-start gap-2">
                          <SuggestionIcon type={suggestion.type} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium">{suggestion.title}</h4>
                              <button
                                onClick={() => dismissSuggestion(suggestion.id)}
                                className="p-0.5 rounded hover:bg-[var(--glass-bg)] transition-colors shrink-0"
                                aria-label="关闭建议"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">
                              {suggestion.description}
                            </p>
                            {suggestion.action && (
                              <button
                                onClick={suggestion.action}
                                className="mt-2 text-xs text-emerald-400 hover:underline"
                              >
                                应用建议
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === "user"
                    ? "bg-[var(--neon-violet)]/20"
                    : "bg-emerald-500/20"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-[var(--neon-violet)]" />
                ) : (
                  <Bot className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block p-3 rounded-lg max-w-[90%] ${
                    message.role === "user"
                      ? "bg-[var(--neon-violet)]/20 text-right"
                      : "bg-emerald-500/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <LoadingDots />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--glass-border)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-emerald-500 focus:outline-none disabled:opacity-50 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-lg bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
            aria-label="发送消息"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
