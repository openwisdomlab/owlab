"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, X, Download, RefreshCw, Grid, List } from "lucide-react";
import { VIEW_TYPE_CONFIGS, type ViewCategory, type ViewType } from "@/lib/ai/prompts/visualization";

interface GalleryImage {
  viewType: ViewType;
  imageData: string;
  generatedAt: string;
  style?: string;
}

interface VisualizationGalleryProps {
  images: GalleryImage[];
  onClose: () => void;
  onRegenerate?: (viewType: ViewType) => void;
}

const CATEGORY_LABELS: Record<ViewCategory, string> = {
  technical: "技术图纸",
  spatial: "三维空间",
  atmosphere: "氛围体验",
  analysis: "分析图",
  infographic: "信息图表",
};

export function VisualizationGallery({ images, onClose, onRegenerate }: VisualizationGalleryProps) {
  const [filterCategory, setFilterCategory] = useState<ViewCategory | "all">("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = filterCategory === "all"
    ? images
    : images.filter(img => {
        const config = VIEW_TYPE_CONFIGS.find(c => c.id === img.viewType);
        return config?.category === filterCategory;
      });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="w-[800px] max-h-[85vh] overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--background)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)] shrink-0">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-[var(--neon-cyan)]" />
            <h2 className="text-lg font-semibold">可视化画廊</h2>
            <span className="text-xs text-white/40">{images.length} 张</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-1.5 rounded hover:bg-white/10">
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 px-6 py-3 border-b border-[var(--glass-border)] shrink-0 overflow-x-auto">
          <button onClick={() => setFilterCategory("all")} className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap ${filterCategory === "all" ? "bg-[var(--neon-cyan)] text-black" : "bg-white/10 hover:bg-white/15"}`}>
            全部
          </button>
          {(Object.entries(CATEGORY_LABELS) as [ViewCategory, string][]).map(([cat, label]) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap ${filterCategory === cat ? "bg-[var(--neon-cyan)] text-black" : "bg-white/10 hover:bg-white/15"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="text-center text-white/40 py-12">暂无图片</p>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-3 gap-3" : "space-y-3"}>
              {filtered.map((img, i) => {
                const config = VIEW_TYPE_CONFIGS.find(c => c.id === img.viewType);
                return (
                  <div key={i} onClick={() => setSelectedImage(img)} className="cursor-pointer group rounded-xl overflow-hidden border border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/50 transition-colors">
                    <div className={viewMode === "grid" ? "aspect-[4/3]" : "h-32 w-full"}>
                      <img src={`data:image/jpeg;base64,${img.imageData}`} alt={config?.nameZh || img.viewType} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-xs font-medium">{config?.nameZh || img.viewType}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onRegenerate && (
                          <button onClick={(e) => { e.stopPropagation(); onRegenerate(img.viewType); }} className="p-1 rounded hover:bg-white/10">
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        )}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement("a");
                          link.href = `data:image/jpeg;base64,${img.imageData}`;
                          link.download = `${img.viewType}.jpg`;
                          link.click();
                        }} className="p-1 rounded hover:bg-white/10">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
              onClick={() => setSelectedImage(null)}
            >
              <img src={`data:image/jpeg;base64,${selectedImage.imageData}`}
                alt={selectedImage.viewType}
                className="max-w-[90%] max-h-[90%] object-contain rounded-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
