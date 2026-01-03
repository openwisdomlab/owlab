"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { QuestionOption } from "./concepts";

interface QuestionPromptProps {
  options: QuestionOption[];
  onSelect: (optionId: string) => void;
  onClose: () => void;
}

export function QuestionPrompt({
  options,
  onSelect,
  onClose,
}: QuestionPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md mx-4 bg-[#0a0a0f] border border-white/20 rounded-2xl p-6 shadow-2xl"
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>

        {/* 问题 */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            你更相信哪种学习方式？
          </h3>
          <p className="text-sm text-white/50">
            选择一个开始你的探索之旅
          </p>
        </div>

        {/* 选项 */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => onSelect(option.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 text-left group"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="text-white/80 group-hover:text-white transition-colors">
                {option.text}
              </span>
              <span className="ml-auto text-white/30 group-hover:text-cyan-400 transition-colors">
                →
              </span>
            </motion.button>
          ))}
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-white/30 mt-6">
          每种方式都能开启不同的理念发现
        </p>
      </motion.div>
    </motion.div>
  );
}
