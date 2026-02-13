"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  Wand2,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useToast } from "@/components/ui/Toast";
import { ThinkingModelCard } from "@/components/genui/ThinkingModelCard";
import {
  DataTrendChart,
  type DataPoint,
  type SeriesConfig,
} from "@/components/genui/DataTrendChart";

interface AIChatPanelProps {
  layout: LayoutData;
  onLayoutUpdate: (layout: LayoutData) => void;
  onClose: () => void;
}

export function AIChatPanel({
  layout,
  onLayoutUpdate,
  onClose,
}: AIChatPanelProps) {
  const t = useTranslations("lab.chat");
  const toast = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedToolCalls = useRef(new Set<string>());

  const { messages, sendMessage, status } = useChat({
    id: "lab-chat",
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { layout },
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: t("welcome") }],
      } as UIMessage,
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect modifyLayout tool invocations and apply layout updates
  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        // Tool parts have type 'tool-{name}', toolCallId, state, and input
        const p = part as Record<string, unknown>;
        if (
          p.type === "tool-modifyLayout" &&
          p.state === "output-available" &&
          typeof p.toolCallId === "string" &&
          !processedToolCalls.current.has(p.toolCallId)
        ) {
          processedToolCalls.current.add(p.toolCallId);
          onLayoutUpdate(p.input as LayoutData);
          toast.success(
            "Layout Updated",
            "The layout has been modified based on your request."
          );
        }
      }
    }
  }, [messages, onLayoutUpdate, toast]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || isLoading) return;
      sendMessage({ text: inputText });
      setInputText("");
    },
    [inputText, isLoading, sendMessage]
  );

  const handleCopy = useCallback(
    (content: string, id: string) => {
      navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.info("Copied", "Message copied to clipboard.");
      setTimeout(() => setCopiedId(null), 2000);
    },
    [toast]
  );

  /** Extract all text content from a UIMessage's parts */
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  const quickActions = [
    { label: t("actions.optimize"), prompt: t("prompts.optimize") },
    { label: t("actions.addServer"), prompt: t("prompts.addServer") },
    { label: t("actions.addMeeting"), prompt: t("prompts.addMeeting") },
    { label: t("actions.suggest"), prompt: t("prompts.suggest") },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t("title")}</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-[var(--glass-border)]">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setInputText(action.prompt)}
              className="px-3 py-1 text-xs rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === "user"
                    ? "bg-[var(--neon-violet)]/20"
                    : "bg-[var(--neon-cyan)]/20"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-[var(--neon-violet)]" />
                ) : (
                  <Bot className="w-4 h-4 text-[var(--neon-cyan)]" />
                )}
              </div>
              <div
                className={`flex-1 ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                {/* Render message parts */}
                {message.parts.map((part, partIdx) => {
                  // Use Record for runtime type checking of tool parts
                  const p = part as Record<string, unknown>;

                  // Text parts
                  if (part.type === "text" && "text" in part) {
                    return (
                      <div
                        key={`text-${partIdx}`}
                        className={`inline-block p-3 rounded-lg max-w-[90%] ${
                          message.role === "user"
                            ? "bg-[var(--neon-violet)]/20 text-right"
                            : "bg-[var(--glass-bg)]"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {String(p.text)}
                        </p>
                      </div>
                    );
                  }

                  // GenUI: ThinkingModel tool
                  if (p.type === "tool-showThinkingModel" && p.input) {
                    const input = p.input as {
                      title: string;
                      concept: string;
                      explanation: string;
                      followUpQuestions?: string[];
                    };
                    return (
                      <div key={`tool-${partIdx}`} className="max-w-[95%]">
                        <ThinkingModelCard
                          title={input.title}
                          concept={input.concept}
                          explanation={input.explanation}
                          followUpQuestions={input.followUpQuestions}
                        />
                      </div>
                    );
                  }

                  // GenUI: DataTrend tool
                  if (p.type === "tool-showDataTrend" && p.input) {
                    const input = p.input as {
                      title: string;
                      description?: string;
                      data: DataPoint[];
                      series: SeriesConfig[];
                    };
                    return (
                      <div key={`tool-${partIdx}`} className="max-w-[95%]">
                        <DataTrendChart
                          title={input.title}
                          description={input.description}
                          data={input.data}
                          series={input.series}
                        />
                      </div>
                    );
                  }

                  // GenUI: Layout modification confirmation
                  if (p.type === "tool-modifyLayout") {
                    return (
                      <motion.div
                        key={`tool-${partIdx}`}
                        className="flex items-center gap-2 my-2 px-3 py-2 rounded-lg text-xs"
                        style={{
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          color: "#10B981",
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Layout updated on canvas</span>
                      </motion.div>
                    );
                  }

                  return null;
                })}

                {/* Timestamp + copy */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-1">
                    {getMessageText(message) && (
                      <button
                        onClick={() =>
                          handleCopy(getMessageText(message), message.id)
                        }
                        className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-[var(--neon-green)]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[var(--muted-foreground)]" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--neon-cyan)]/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[var(--neon-cyan)] animate-spin" />
            </div>
            <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
              <p className="text-sm text-[var(--muted-foreground)]">
                {t("thinking")}
              </p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[var(--glass-border)]"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("placeholder")}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-3 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
