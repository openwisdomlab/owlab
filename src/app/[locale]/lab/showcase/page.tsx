"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useParams } from "next/navigation";
import {
  Ruler, Users, Banknote, ArrowRight, Sparkles,
  Lightbulb, Wrench, Globe, Building2, GraduationCap, FlaskConical,
} from "lucide-react";
import { FloorPlanCanvas } from "@/features/lab-editor/FloorPlanCanvas";
import { SHOWCASE_PROTOTYPES } from "@/data/showcase-prototypes";

export default function ShowcasePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const params = useParams();
  const locale = params?.locale || "zh";
  const prototype = SHOWCASE_PROTOTYPES[activeIndex];

  const tierIcons = { small: GraduationCap, medium: FlaskConical, large: Building2 };
  const TierIcon = tierIcons[prototype.tier];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="px-6 py-8 text-center">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2">
          创新实验室标杆方案
        </motion.h1>
        <p className="text-white/50 max-w-xl mx-auto">
          从 150m² 教室改造到 1200m² 旗舰综合体——三种规格，展示好奇心驱动的创新空间设计
        </p>
      </div>

      {/* Tier Selector */}
      <div className="flex justify-center gap-3 px-6 mb-6">
        {SHOWCASE_PROTOTYPES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveIndex(i)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
              i === activeIndex
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                : "border-[var(--glass-border)] bg-[var(--glass-bg)] text-white/60 hover:bg-white/5"
            }`}
          >
            <span className="text-sm font-medium">{p.name}</span>
            <span className="text-xs opacity-60">{p.areaM2}m²</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={prototype.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="max-w-6xl mx-auto px-6 space-y-6"
        >
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <TierIcon className="w-6 h-6 text-[var(--neon-cyan)]" />
                <h2 className="text-2xl font-bold">{prototype.name}</h2>
              </div>
              <p className="text-white/50">{prototype.subtitle}</p>
            </div>
            <div className="flex gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1"><Ruler className="w-4 h-4" /> {prototype.areaM2}m²</div>
              <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {prototype.capacity.students + prototype.capacity.staff}人</div>
              <div className="flex items-center gap-1"><Banknote className="w-4 h-4" /> {(prototype.budgetCNY.min / 10000).toFixed(0)}-{(prototype.budgetCNY.max / 10000).toFixed(0)}万</div>
            </div>
          </div>

          {/* Floor Plan Preview */}
          <div className="rounded-2xl border border-[var(--glass-border)] overflow-hidden bg-[var(--glass-bg)]" style={{ height: 400 }}>
            <FloorPlanCanvas
              layout={prototype.layout}
              zoom={prototype.tier === "large" ? 0.3 : prototype.tier === "medium" ? 0.4 : 0.6}
              showGrid={true}
              selectedZone={null}
              onZoneSelect={() => {}}
              onZoneUpdate={() => {}}
              onAddZone={() => {}}
              onDeleteZone={() => {}}
            />
          </div>

          {/* 3E Framework */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Lightbulb, label: "Enlighten \u00B7 启迪", text: prototype.enlighten, color: "text-amber-400" },
              { icon: Wrench, label: "Empower \u00B7 赋能", text: prototype.empower, color: "text-cyan-400" },
              { icon: Globe, label: "Engage \u00B7 实践", text: prototype.engage, color: "text-green-400" },
            ].map(({ icon: Icon, label, text, color }) => (
              <div key={label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4">
                <div className={`flex items-center gap-2 mb-2 ${color}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <p className="text-sm text-white/70">{text}</p>
              </div>
            ))}
          </div>

          {/* Zone List + Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4">
              <h3 className="text-sm font-medium mb-3">功能分区 ({prototype.layout.zones.length})</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {prototype.layout.zones.map(z => {
                  const area = z.size.width * z.size.height;
                  return (
                    <div key={z.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: z.color }} />
                      <span className="flex-1 truncate">{z.name}</span>
                      <span className="text-white/40">{area}m²</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4">
              <h3 className="text-sm font-medium mb-3">方案亮点</h3>
              <ul className="space-y-1.5">
                {prototype.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--neon-cyan)] shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-4 py-6">
            <Link
              href={`/${locale}/lab/floor-plan?template=showcase-${activeIndex}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--neon-cyan)] text-black font-medium hover:opacity-90 transition-opacity"
            >
              以此为模板开始设计 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/lab/floor-plan`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--glass-border)] hover:bg-white/5 transition-colors"
            >
              从零开始设计
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
