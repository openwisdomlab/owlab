"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Building2,
  Check,
  ThumbsUp,
  ThumbsDown,
  Filter,
} from "lucide-react";

interface Props {
  onClose: () => void;
}

interface VendorData {
  id: string;
  name: string;
  category: string;
  itemCount: number;
  totalCost: number;
  pros: string[];
  cons: string[];
  rating: number;
  leadTime: string;
}

const CATEGORIES = ["全部", "计算设备", "实验器材", "家具", "安全设备", "网络设备"];

// Placeholder vendor data
const VENDORS: VendorData[] = [
  {
    id: "v1",
    name: "华科仪器",
    category: "实验器材",
    itemCount: 24,
    totalCost: 185000,
    pros: ["售后服务好", "本地仓库发货快", "支持定制"],
    cons: ["价格偏高", "部分型号库存不足"],
    rating: 4.5,
    leadTime: "7-14天",
  },
  {
    id: "v2",
    name: "中科智联",
    category: "计算设备",
    itemCount: 18,
    totalCost: 320000,
    pros: ["价格有竞争力", "品牌授权齐全", "批量折扣"],
    cons: ["售后响应慢", "不含安装服务"],
    rating: 4.0,
    leadTime: "14-21天",
  },
  {
    id: "v3",
    name: "安科达",
    category: "安全设备",
    itemCount: 12,
    totalCost: 45000,
    pros: ["专业安全资质", "一站式安装", "培训服务"],
    cons: ["品类有限", "最低起订量要求"],
    rating: 4.8,
    leadTime: "5-10天",
  },
  {
    id: "v4",
    name: "创新家具",
    category: "家具",
    itemCount: 35,
    totalCost: 92000,
    pros: ["设计感强", "环保材料", "免费设计方案"],
    cons: ["交付周期长", "退换政策严格"],
    rating: 4.2,
    leadTime: "21-30天",
  },
  {
    id: "v5",
    name: "锐捷网络",
    category: "网络设备",
    itemCount: 15,
    totalCost: 128000,
    pros: ["品牌可靠", "全国联保", "技术支持好"],
    cons: ["定制能力弱", "需预付全款"],
    rating: 4.6,
    leadTime: "10-15天",
  },
];

export function VendorComparison({ onClose }: Props) {
  const [category, setCategory] = useState("全部");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  const filtered = category === "全部"
    ? VENDORS
    : VENDORS.filter((v) => v.category === category);

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
          <Building2 className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="text-lg font-semibold">供应商比较</h2>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 p-4 border-b border-[var(--glass-border)] overflow-x-auto">
        <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
              category === cat
                ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                : "bg-white/5 text-neutral-400 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendor cards */}
      <div className="flex-1 overflow-auto p-4 grid gap-4 auto-rows-min" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {filtered.map((vendor) => (
          <motion.div
            key={vendor.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelectedVendor(vendor.id)}
            className={`relative p-4 rounded-xl border cursor-pointer transition-colors ${
              selectedVendor === vendor.id
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/5"
                : "border-[var(--glass-border)] bg-white/5 hover:bg-white/[0.07]"
            }`}
          >
            {/* Radio indicator */}
            <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              selectedVendor === vendor.id ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]" : "border-neutral-500"
            }`}>
              {selectedVendor === vendor.id && <Check className="w-3 h-3 text-[var(--background)]" />}
            </div>

            {/* Vendor name & category */}
            <h3 className="font-semibold text-base mb-1">{vendor.name}</h3>
            <span className="text-xs text-neutral-400 px-2 py-0.5 rounded-full bg-white/5">{vendor.category}</span>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div>
                <span className="text-neutral-400">物品数</span>
                <p className="font-medium">{vendor.itemCount}</p>
              </div>
              <div>
                <span className="text-neutral-400">总价</span>
                <p className="font-medium text-[var(--neon-cyan)]">${vendor.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-neutral-400">评分</span>
                <p className="font-medium">{"*".repeat(Math.floor(vendor.rating))} {vendor.rating}</p>
              </div>
              <div>
                <span className="text-neutral-400">交期</span>
                <p className="font-medium">{vendor.leadTime}</p>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="mt-3 space-y-1.5">
              {vendor.pros.map((p) => (
                <div key={p} className="flex items-start gap-1.5 text-xs text-green-400">
                  <ThumbsUp className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
              {vendor.cons.map((c) => (
                <div key={c} className="flex items-start gap-1.5 text-xs text-red-400">
                  <ThumbsDown className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-[var(--glass-border)] text-sm">
        <span className="text-neutral-400">共 {filtered.length} 家供应商</span>
        {selectedVendor && (
          <span className="text-[var(--neon-cyan)]">
            已选择: {VENDORS.find((v) => v.id === selectedVendor)?.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}
