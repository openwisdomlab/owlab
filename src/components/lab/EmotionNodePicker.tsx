// src/components/lab/EmotionNodePicker.tsx
"use client";

import { motion } from "framer-motion";
import {
  type EmotionType,
  EMOTION_COLORS,
  EMOTION_LABELS,
} from "@/lib/schemas/emotion-design";
import {
  Sparkles,
  Eye,
  Target,
  Zap,
  Leaf,
  Users,
  Lightbulb,
  Shield,
} from "lucide-react";

interface EmotionNodePickerProps {
  selectedEmotions: EmotionType[];
  onChange: (emotions: EmotionType[]) => void;
  multiSelect?: boolean;
  showIntensity?: boolean;
}

const EMOTION_ICONS: Record<EmotionType, React.ReactNode> = {
  awe: <Sparkles className="w-5 h-5" />,
  curiosity: <Eye className="w-5 h-5" />,
  focus: <Target className="w-5 h-5" />,
  excitement: <Zap className="w-5 h-5" />,
  calm: <Leaf className="w-5 h-5" />,
  collaboration: <Users className="w-5 h-5" />,
  creativity: <Lightbulb className="w-5 h-5" />,
  safety: <Shield className="w-5 h-5" />,
};

const EMOTION_DESCRIPTIONS: Record<EmotionType, string> = {
  awe: "高挑空间、对称设计",
  curiosity: "隐藏角落、层次空间",
  focus: "均匀光线、静音环境",
  excitement: "动态光线、明亮色彩",
  calm: "自然元素、柔软材质",
  collaboration: "环形布局、透明隔断",
  creativity: "可变空间、多样刺激",
  safety: "封闭感、温暖照明",
};

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

export function EmotionNodePicker({
  selectedEmotions,
  onChange,
  multiSelect = true,
}: EmotionNodePickerProps) {
  const handleSelect = (emotion: EmotionType) => {
    if (multiSelect) {
      if (selectedEmotions.includes(emotion)) {
        onChange(selectedEmotions.filter((e) => e !== emotion));
      } else {
        onChange([...selectedEmotions, emotion]);
      }
    } else {
      onChange([emotion]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">选择目标情绪</h3>
        {multiSelect && (
          <span className="text-xs text-[var(--muted-foreground)]">
            已选择 {selectedEmotions.length} 个
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EMOTION_OPTIONS.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion);

          return (
            <motion.button
              key={emotion}
              onClick={() => handleSelect(emotion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg text-left transition-all ${
                isSelected
                  ? "ring-2 ring-white shadow-lg"
                  : "hover:bg-[var(--glass-border)]"
              }`}
              style={{
                backgroundColor: isSelected
                  ? EMOTION_COLORS[emotion]
                  : "var(--glass-bg)",
              }}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="p-1 rounded"
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(255,255,255,0.2)"
                      : EMOTION_COLORS[emotion],
                  }}
                >
                  {EMOTION_ICONS[emotion]}
                </div>
                <span className="font-medium text-sm">
                  {EMOTION_LABELS[emotion]}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] opacity-80">
                {EMOTION_DESCRIPTIONS[emotion]}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
