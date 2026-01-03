"use client";

import { motion } from "framer-motion";
import { X, Award } from "lucide-react";
import { THEORISTS } from "./concepts";

interface TheoryLineagePopupProps {
  onClose: () => void;
}

export function TheoryLineagePopup({ onClose }: TheoryLineagePopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg mx-4 bg-[#0a0a0f] border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* 头部 */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                理论根基
              </h3>
              <p className="text-sm text-white/50">
                一个多世纪的教育创新探索
              </p>
            </div>
          </div>
        </div>

        {/* 时间线 */}
        <div className="p-5 max-h-[400px] overflow-y-auto">
          <div className="relative">
            {/* 时间线轴 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-amber-500/50" />

            {/* 时间线节点 */}
            <div className="space-y-6">
              {THEORISTS.map((theorist, index) => (
                <motion.div
                  key={theorist.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 pl-12"
                >
                  {/* 节点圆点 */}
                  <div
                    className="absolute left-4 w-5 h-5 rounded-full bg-[#0a0a0f] border-2 flex items-center justify-center"
                    style={{
                      borderColor: [
                        '#8b5cf6',
                        '#6366f1',
                        '#14b8a6',
                        '#10b981',
                        '#f59e0b',
                      ][index],
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: [
                          '#8b5cf6',
                          '#6366f1',
                          '#14b8a6',
                          '#10b981',
                          '#f59e0b',
                        ][index],
                      }}
                    />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">
                        {theorist.nameZh}
                      </span>
                      <span className="text-sm text-white/40">
                        {theorist.name}
                      </span>
                    </div>
                    <div className="text-xs text-white/30 mb-2">
                      {theorist.years}
                    </div>
                    <p className="text-sm text-white/60">
                      {theorist.contribution}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-center text-xs text-white/40">
            从杜威的&ldquo;做中学&rdquo;到雷斯尼克的&ldquo;终身幼儿园&rdquo;，OWL 站在巨人的肩膀上
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
