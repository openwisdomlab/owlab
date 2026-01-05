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
  LayoutGrid,
  Shield,
  Package,
  Info,
} from "lucide-react";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { Discipline } from "@/lib/schemas/launcher";
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
  discipline?: Discipline;
}

// ============================================
// Quick Actions Configuration
// ============================================

interface QuickAction {
  id: string;
  label: string;
  icon: typeof LayoutGrid;
  message: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "optimize-layout",
    label: "优化布局",
    icon: LayoutGrid,
    message: "请帮我优化当前的实验室布局，提升空间利用率和工作流效率。",
  },
  {
    id: "check-safety",
    label: "检查安全",
    icon: Shield,
    message: "请检查当前布局的安全性，包括紧急通道、设备间距和安全隐患。",
  },
  {
    id: "suggest-equipment",
    label: "推荐设备",
    icon: Package,
    message: "根据当前的实验室布局和功能区域，请推荐适合的设备配置。",
  },
];

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
// Safety Analysis Helpers
// ============================================

/**
 * Calculate distance between two zones (center to center)
 */
function calculateZoneDistance(zone1: ZoneData, zone2: ZoneData): number {
  const center1 = {
    x: zone1.position.x + zone1.size.width / 2,
    y: zone1.position.y + zone1.size.height / 2,
  };
  const center2 = {
    x: zone2.position.x + zone2.size.width / 2,
    y: zone2.position.y + zone2.size.height / 2,
  };
  return Math.sqrt(
    Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2)
  );
}

/**
 * Check if two zones overlap or are adjacent
 */
function zonesAreAdjacent(zone1: ZoneData, zone2: ZoneData, threshold: number = 1): boolean {
  const distance = calculateZoneDistance(zone1, zone2);
  const avgSize = (Math.max(zone1.size.width, zone1.size.height) +
                   Math.max(zone2.size.width, zone2.size.height)) / 2;
  return distance < avgSize + threshold;
}

/**
 * Calculate walkway percentage - estimate based on zone coverage
 * Walkway = Total Area - Zone Area
 */
function calculateWalkwayPercentage(layout: LayoutData): number {
  const totalArea = layout.dimensions.width * layout.dimensions.height;
  const zoneArea = layout.zones.reduce(
    (acc, zone) => acc + zone.size.width * zone.size.height,
    0
  );
  return ((totalArea - zoneArea) / totalArea) * 100;
}

/**
 * Zone types that require water supply
 */
const WATER_ZONE_TYPES: ZoneData["type"][] = ["workspace", "utility"];

/**
 * Zone types with sensitive electronic equipment
 */
const ELECTRONIC_ZONE_TYPES: ZoneData["type"][] = ["compute"];

/**
 * Discipline-specific zone recommendations
 * Note: Using valid ZoneData types only
 */
const DISCIPLINE_ZONE_RECOMMENDATIONS: Record<Discipline, { required: ZoneData["type"][]; tips: string[] }> = {
  "life-health": {
    required: ["workspace", "utility"],
    tips: ["建议添加清洁消毒区以满足生物安全要求", "细胞培养室应远离PCR区域以防止交叉污染"],
  },
  "deep-space-ocean": {
    required: ["workspace", "compute"],
    tips: ["洁净室应与普通区域保持正压差", "建议设置振动隔离区用于精密测量设备"],
  },
  "social-innovation": {
    required: ["workspace", "meeting"],
    tips: ["建议增加开放式讨论区促进团队协作", "可考虑添加展示区用于项目展示"],
  },
  "micro-nano": {
    required: ["workspace", "compute"],
    tips: ["微纳实验区需要严格的温湿度控制", "建议设置独立的样品准备区"],
  },
  "digital-info": {
    required: ["compute", "workspace"],
    tips: ["建议设置独立的服务器机房区", "可增加VR/AR体验区用于可视化研究"],
  },
};

// ============================================
// Main Component
// ============================================

export function AISidebar({
  layout,
  onLayoutUpdate,
  isOpen,
  onToggle,
  discipline,
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
  const [isDemoMode, setIsDemoMode] = useState(false);

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

    // ===========================================
    // Walkway Analysis (<15% triggers warning)
    // ===========================================
    const walkwayPercentage = calculateWalkwayPercentage(layout);
    if (layout.zones.length > 0) {
      if (walkwayPercentage < 15) {
        newSuggestions.push({
          id: "walkway-critical",
          type: "warning",
          title: "过道空间不足",
          description: `当前过道空间仅占 ${walkwayPercentage.toFixed(1)}%，低于安全标准（15%）。这可能影响紧急疏散和日常通行。建议减少区域面积或增加实验室尺寸。`,
        });
      } else if (walkwayPercentage < 20) {
        newSuggestions.push({
          id: "walkway-warning",
          type: "tip",
          title: "过道空间偏低",
          description: `当前过道空间占 ${walkwayPercentage.toFixed(1)}%。建议保持20%以上以确保舒适通行。`,
        });
      } else if (walkwayPercentage >= 20 && walkwayPercentage <= 35) {
        newSuggestions.push({
          id: "walkway-good",
          type: "success",
          title: "过道空间合理",
          description: `当前过道空间占 ${walkwayPercentage.toFixed(1)}%，通行空间充足。`,
        });
      }
    }

    // ===========================================
    // Zone Proximity Conflict Detection
    // ===========================================
    // Check for electronic zones near water zones (compute near lab/biosafety)
    const electronicZones = layout.zones.filter((z) =>
      ELECTRONIC_ZONE_TYPES.includes(z.type)
    );
    const waterZones = layout.zones.filter((z) =>
      WATER_ZONE_TYPES.includes(z.type)
    );

    for (const eZone of electronicZones) {
      for (const wZone of waterZones) {
        if (zonesAreAdjacent(eZone, wZone, 2)) {
          newSuggestions.push({
            id: `proximity-${eZone.id}-${wZone.id}`,
            type: "warning",
            title: "设备与水源冲突",
            description: `"${eZone.name}" 区域距离 "${wZone.name}" 区域过近。水源可能对敏感电子设备造成损害。建议增加间隔或设置防水措施。`,
          });
          break; // Only one warning per electronic zone
        }
      }
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
          description: "计算设备区域距离入口较近，可能会受到人流干扰和安全风险。建议将其移至更安静的位置。",
        });
      }
    }

    // ===========================================
    // Safety Zone Violations
    // ===========================================
    // Check for compute/workspace zones without nearby utility/decontamination zone
    const labWorkZones = layout.zones.filter((z) =>
      z.type === "compute" || z.type === "workspace"
    );
    const safetyZones = layout.zones.filter((z) => z.type === "utility");

    if (labWorkZones.length > 0 && safetyZones.length === 0) {
      newSuggestions.push({
        id: "no-safety-zone",
        type: "warning",
        title: "缺少安全消毒区",
        description: "您的布局包含实验区但没有清洁消毒区域。建议添加安全区以满足生物安全要求。",
      });
    }

    // Check if storage is too far from lab areas
    const storageZones = layout.zones.filter((z) => z.type === "storage");
    if (labWorkZones.length > 0 && storageZones.length > 0) {
      const allStorageFarFromLab = labWorkZones.every((lab) =>
        storageZones.every((storage) => calculateZoneDistance(lab, storage) > 8)
      );
      if (allStorageFarFromLab) {
        newSuggestions.push({
          id: "storage-far-from-lab",
          type: "tip",
          title: "储存区位置建议",
          description: "储存区域距离实验区较远，可能增加试剂取用时间。考虑将储存区移近实验区域。",
        });
      }
    }

    // ===========================================
    // Discipline-Specific Suggestions
    // ===========================================
    if (discipline && DISCIPLINE_ZONE_RECOMMENDATIONS[discipline]) {
      const disciplineConfig = DISCIPLINE_ZONE_RECOMMENDATIONS[discipline];
      const existingTypes = layout.zones.map((z) => z.type);

      // Check for missing required zone types
      const missingRequired = disciplineConfig.required.filter(
        (requiredType) => !existingTypes.includes(requiredType)
      );

      if (missingRequired.length > 0) {
        const zoneNames: Record<string, string> = {
          "lab": "实验区",
          "biosafety": "生物安全区",
          "safety": "安全消毒区",
          "cleanroom": "洁净室",
          "compute": "计算区",
          "workspace": "工作区",
          "meeting": "会议区",
        };
        const missingNames = missingRequired.map((t) => zoneNames[t] || t).join("、");
        newSuggestions.push({
          id: "discipline-missing-zones",
          type: "tip",
          title: `${discipline === "life-health" ? "生命健康" :
                   discipline === "deep-space-ocean" ? "深空深海" :
                   discipline === "social-innovation" ? "社会创新" :
                   discipline === "micro-nano" ? "微纳尺度" : "数智信息"}领域建议`,
          description: `该领域建议配置：${missingNames}。这些区域对于相关研究至关重要。`,
        });
      }

      // Add discipline-specific tips if layout has some zones
      if (layout.zones.length >= 2 && disciplineConfig.tips.length > 0) {
        // Show first applicable tip based on current layout
        const tipIndex = Math.min(layout.zones.length - 2, disciplineConfig.tips.length - 1);
        newSuggestions.push({
          id: `discipline-tip-${discipline}`,
          type: "tip",
          title: "领域专家建议",
          description: disciplineConfig.tips[tipIndex],
        });
      }
    }

    // ===========================================
    // General Layout Suggestions
    // ===========================================
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
        title: "空间利用率过高",
        description: "当前布局的空间利用率超过 85%，可能会影响通行和工作效率。考虑增加过道空间。",
      });
    } else if (utilization > 0.6 && utilization <= 0.85 && layout.zones.length >= 2) {
      // Only show this if we haven't already added the walkway success
      if (!newSuggestions.some(s => s.id === "walkway-good")) {
        newSuggestions.push({
          id: "good-utilization",
          type: "success",
          title: "空间利用率良好",
          description: "当前布局的空间利用率在合理范围内，兼顾了功能性和舒适度。",
        });
      }
    }

    setSuggestions(newSuggestions);
  }, [layout, discipline]);

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

      // Check if we're in demo mode
      if (data.demoMode) {
        setIsDemoMode(true);
      }

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

  // Handle quick action button click
  const handleQuickAction = useCallback((action: QuickAction) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: action.message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        layout,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to get response");
        return response.json();
      })
      .then((data) => {
        // Check if we're in demo mode
        if (data.demoMode) {
          setIsDemoMode(true);
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (data.layout) {
          onLayoutUpdate(data.layout);
          toast.success("布局已更新", "根据您的要求已修改布局配置。");
        }
      })
      .catch(() => {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "抱歉，处理您的请求时出现了问题。请稍后再试。",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast.error("请求失败", "无法处理您的请求，请重试。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoading, messages, layout, onLayoutUpdate, toast]);

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

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="px-4 py-3 border-b border-[var(--glass-border)] bg-amber-500/10">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <span className="font-medium">演示模式</span>
              <p className="text-amber-300/80 mt-0.5">
                AI API 未配置。您仍可手动设计布局，配置 API 密钥后可启用智能生成功能。
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* Quick Actions */}
      <div className="p-3 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">
            快速操作
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-medium hover:border-emerald-500/50 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

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
