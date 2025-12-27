"use client";

import { useState, useRef, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t("welcome"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If the AI returned a new layout, update it
      if (data.layout) {
        onLayoutUpdate(data.layout);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("error"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              onClick={() => setInput(action.prompt)}
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
                <div
                  className={`inline-block p-3 rounded-lg max-w-[90%] ${
                    message.role === "user"
                      ? "bg-[var(--neon-violet)]/20 text-right"
                      : "bg-[var(--glass-bg)]"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("placeholder")}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
