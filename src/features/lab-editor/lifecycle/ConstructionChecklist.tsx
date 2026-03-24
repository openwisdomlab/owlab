"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  HardHat,
  ChevronRight,
  Circle,
  Loader2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { ConstructionTask } from "@/lib/schemas/project-lifecycle";
import { TRADE_LABELS } from "@/lib/schemas/project-lifecycle";
import { ZONE_LABELS, type ZoneType } from "@/lib/constants/zone-types";
import { useProjectStore } from "@/stores/project-store";

interface Props {
  layout: LayoutData;
  onClose: () => void;
}

type Trade = ConstructionTask["trade"];
type TaskStatus = ConstructionTask["status"];

const STATUS_ICON: Record<TaskStatus, React.ReactNode> = {
  pending: <Circle className="w-4 h-4 text-neutral-500" />,
  "in-progress": <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  blocked: <AlertTriangle className="w-4 h-4 text-red-400" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-400 bg-red-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  low: "text-neutral-400 bg-neutral-400/10",
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: "pending",
  blocked: "pending",
};

// Map zone types to typical construction tasks
const ZONE_TASK_MAP: Record<string, Array<{ title: string; trade: Trade; priority: "high" | "medium" | "low" }>> = {
  compute: [
    { title: "安装配电系统", trade: "electrical", priority: "high" },
    { title: "布设网络线缆", trade: "it-network", priority: "high" },
    { title: "安装服务器机架", trade: "furniture", priority: "medium" },
    { title: "配置精密空调", trade: "hvac", priority: "high" },
    { title: "安装UPS电源", trade: "electrical", priority: "high" },
  ],
  workspace: [
    { title: "安装照明系统", trade: "electrical", priority: "medium" },
    { title: "布设网络接入点", trade: "it-network", priority: "medium" },
    { title: "安装办公家具", trade: "furniture", priority: "low" },
    { title: "墙面装饰装修", trade: "finishing", priority: "low" },
  ],
  lab: [
    { title: "安装实验台", trade: "furniture", priority: "high" },
    { title: "配置通风橱", trade: "hvac", priority: "high" },
    { title: "铺设给排水管道", trade: "plumbing", priority: "high" },
    { title: "安装紧急淋浴器", trade: "safety", priority: "high" },
    { title: "安装防爆电气", trade: "electrical", priority: "high" },
  ],
  biosafety: [
    { title: "安装生物安全柜", trade: "safety", priority: "high" },
    { title: "配置负压系统", trade: "hvac", priority: "high" },
    { title: "安装高压灭菌器管道", trade: "plumbing", priority: "high" },
    { title: "安装气密门", trade: "finishing", priority: "high" },
  ],
  meeting: [
    { title: "安装会议系统", trade: "it-network", priority: "medium" },
    { title: "安装照明与窗帘", trade: "electrical", priority: "low" },
    { title: "安装会议桌椅", trade: "furniture", priority: "low" },
  ],
  storage: [
    { title: "安装货架系统", trade: "furniture", priority: "medium" },
    { title: "配置温湿度控制", trade: "hvac", priority: "medium" },
    { title: "安装门禁系统", trade: "safety", priority: "medium" },
  ],
  makerspace: [
    { title: "安装电力分配系统", trade: "electrical", priority: "high" },
    { title: "配置除尘排风", trade: "hvac", priority: "high" },
    { title: "安装工作台与工具柜", trade: "furniture", priority: "medium" },
    { title: "铺设防静电地板", trade: "finishing", priority: "medium" },
  ],
  entrance: [
    { title: "安装门禁系统", trade: "safety", priority: "high" },
    { title: "安装指示标牌", trade: "finishing", priority: "low" },
  ],
};

const DEFAULT_TASKS: Array<{ title: string; trade: Trade; priority: "high" | "medium" | "low" }> = [
  { title: "基础电气布线", trade: "electrical", priority: "medium" },
  { title: "安装空调系统", trade: "hvac", priority: "medium" },
  { title: "地面装修", trade: "finishing", priority: "low" },
];

export function generateTasksFromLayout(layout: LayoutData): Omit<ConstructionTask, "id" | "status">[] {
  const tasks: Omit<ConstructionTask, "id" | "status">[] = [];
  for (const zone of layout.zones) {
    const mapping = ZONE_TASK_MAP[zone.type] ?? DEFAULT_TASKS;
    for (const t of mapping) {
      tasks.push({
        title: `${t.title} - ${ZONE_LABELS[zone.type as ZoneType] ?? zone.name}`,
        trade: t.trade,
        description: `${zone.name} 区域 ${t.title}`,
        priority: t.priority,
        dependencies: [],
        zoneId: zone.id,
      });
    }
  }
  return tasks;
}

export function ConstructionChecklist({ layout, onClose }: Props) {
  const store = useProjectStore();
  const [expanded, setExpanded] = useState<Set<Trade>>(new Set(["electrical"]));

  const tasks = store.project?.constructionTasks ?? [];

  const grouped = useMemo(() => {
    const map = new Map<Trade, ConstructionTask[]>();
    for (const t of tasks) {
      const list = map.get(t.trade) ?? [];
      list.push(t);
      map.set(t.trade, list);
    }
    return map;
  }, [tasks]);

  const progress = store.getConstructionProgress();

  const toggleTrade = (trade: Trade) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(trade) ? next.delete(trade) : next.add(trade);
      return next;
    });
  };

  const cycleStatus = (id: string, current: TaskStatus) => {
    store.updateConstructionTask(id, { status: NEXT_STATUS[current] });
  };

  const handleGenerate = () => {
    const newTasks = generateTasksFromLayout(layout);
    for (const task of newTasks) {
      store.addConstructionTask(task);
    }
  };

  const getTradeProgress = (tradeTasks: ConstructionTask[]) => {
    const total = tradeTasks.length;
    const done = tradeTasks.filter((t) => t.status === "completed").length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const trades = Object.keys(TRADE_LABELS) as Trade[];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <HardHat className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="text-lg font-semibold">施工清单</h2>
        </div>
        <div className="flex items-center gap-2">
          {tasks.length === 0 && (
            <button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors">
              <Sparkles className="w-4 h-4" /> 生成施工清单
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overall progress */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-neutral-400">总体进度</span>
          <span className="font-medium">{progress.percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--neon-cyan)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex gap-4 text-xs text-neutral-400 mt-1">
          <span>共 {progress.total} 项</span>
          <span>已完成 {progress.completed}</span>
          {progress.blocked > 0 && <span className="text-red-400">阻塞 {progress.blocked}</span>}
        </div>
      </div>

      {/* Trade groups */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {trades.map((trade) => {
          const tradeTasks = grouped.get(trade) ?? [];
          if (tradeTasks.length === 0 && tasks.length > 0) return null;
          const isOpen = expanded.has(trade);
          const pct = getTradeProgress(tradeTasks);

          return (
            <div key={trade} className="mb-1">
              <button
                onClick={() => toggleTrade(trade)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                <span className="font-medium text-sm">{TRADE_LABELS[trade]}</span>
                <span className="text-xs text-neutral-400 ml-auto">{tradeTasks.length} 项</span>
                {tradeTasks.length > 0 && (
                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--neon-cyan)]" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </button>
              <AnimatePresence>
                {isOpen && tradeTasks.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {tradeTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 px-3 py-1.5 ml-6 text-sm hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                        onClick={() => cycleStatus(task.id, task.status)}
                      >
                        {STATUS_ICON[task.status]}
                        <span className={task.status === "completed" ? "line-through text-neutral-500" : ""}>{task.title}</span>
                        <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>{task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <HardHat className="w-8 h-8 mb-2" />
            <p className="text-sm">点击 &quot;生成施工清单&quot; 自动创建任务</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
