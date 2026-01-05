// src/components/lab/EmotionTimelineEditor.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  type EmotionNode,
  type EmotionScript,
  type EmotionType,
  EMOTION_COLORS,
  EMOTION_LABELS,
} from "@/lib/schemas/emotion-design";

interface EmotionTimelineEditorProps {
  script: EmotionScript;
  onChange: (script: EmotionScript) => void;
  maxDuration?: number;
}

const EMOTION_OPTIONS: EmotionType[] = [
  "awe",
  "curiosity",
  "focus",
  "excitement",
  "calm",
  "collaboration",
  "creativity",
  "safety",
];

export function EmotionTimelineEditor({
  script,
  onChange,
  maxDuration = 120,
}: EmotionTimelineEditorProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const addNode = useCallback(() => {
    const lastNode = script.nodes[script.nodes.length - 1];
    const newTimestamp = lastNode ? Math.min(lastNode.timestamp + 10, maxDuration) : 0;

    const newNode: EmotionNode = {
      id: uuidv4(),
      emotion: "curiosity",
      intensity: 0.7,
      timestamp: newTimestamp,
    };

    onChange({
      ...script,
      nodes: [...script.nodes, newNode].sort((a, b) => a.timestamp - b.timestamp),
    });
  }, [script, onChange, maxDuration]);

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<EmotionNode>) => {
      onChange({
        ...script,
        nodes: script.nodes
          .map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
          .sort((a, b) => a.timestamp - b.timestamp),
      });
    },
    [script, onChange]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      onChange({
        ...script,
        nodes: script.nodes.filter((n) => n.id !== nodeId),
      });
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [script, onChange, selectedNodeId]
  );

  const selectedNode = script.nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">情绪时间轴</h3>
        <button
          onClick={addNode}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
        >
          <Plus className="w-3 h-3" />
          添加节点
        </button>
      </div>

      {/* Timeline Visual */}
      <div className="relative h-24 bg-[var(--glass-bg)] rounded-lg overflow-hidden">
        {/* Time markers */}
        <div className="absolute inset-x-0 bottom-0 h-6 flex items-center justify-between px-2 text-xs text-[var(--muted-foreground)] border-t border-[var(--glass-border)]">
          <span>0分钟</span>
          <span>{Math.round(maxDuration / 2)}分钟</span>
          <span>{maxDuration}分钟</span>
        </div>

        {/* Nodes */}
        <div className="absolute inset-x-0 top-0 bottom-6">
          {script.nodes.map((node) => {
            const left = (node.timestamp / maxDuration) * 100;
            const height = node.intensity * 100;

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-0 -translate-x-1/2 cursor-pointer"
                style={{ left: `${left}%` }}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div
                  className={`w-4 rounded-t-full transition-all ${
                    selectedNodeId === node.id ? "ring-2 ring-white" : ""
                  }`}
                  style={{
                    height: `${height}%`,
                    minHeight: "20px",
                    backgroundColor: EMOTION_COLORS[node.emotion],
                  }}
                />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-[var(--muted-foreground)]">
                  {node.timestamp}m
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Node Editor */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: EMOTION_COLORS[selectedNode.emotion] }}
              />
              编辑节点
            </h4>
            <button
              onClick={() => removeNode(selectedNode.id)}
              className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
              aria-label="删除节点"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Emotion Selection */}
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
              情绪类型
            </label>
            <div className="grid grid-cols-4 gap-2">
              {EMOTION_OPTIONS.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => updateNode(selectedNode.id, { emotion })}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    selectedNode.emotion === emotion
                      ? "ring-2 ring-white"
                      : "hover:opacity-80"
                  }`}
                  style={{ backgroundColor: EMOTION_COLORS[emotion] }}
                >
                  {EMOTION_LABELS[emotion]}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
              强度: {(selectedNode.intensity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedNode.intensity}
              onChange={(e) =>
                updateNode(selectedNode.id, { intensity: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Timestamp Input */}
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
              时间点 (分钟)
            </label>
            <input
              type="number"
              min="0"
              max={maxDuration}
              value={selectedNode.timestamp}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  timestamp: Math.min(Math.max(0, parseInt(e.target.value) || 0), maxDuration),
                })
              }
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
              描述 (可选)
            </label>
            <input
              type="text"
              value={selectedNode.description || ""}
              onChange={(e) =>
                updateNode(selectedNode.id, { description: e.target.value || undefined })
              }
              placeholder="描述这个情绪节点..."
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
            />
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {script.nodes.length === 0 && (
        <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
          点击"添加节点"开始创建情绪时间轴
        </div>
      )}
    </div>
  );
}
