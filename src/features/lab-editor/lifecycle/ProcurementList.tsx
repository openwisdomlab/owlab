"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Plus,
  Package,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import { ZONE_LABELS, type ZoneType } from "@/lib/constants/zone-types";
import { useProjectStore } from "@/stores/project-store";
import type { ProcurementItem } from "@/lib/schemas/project-lifecycle";

interface Props {
  layout: LayoutData;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "待处理", color: "text-neutral-400 bg-neutral-400/10" },
  ordered: { label: "已下单", color: "text-blue-400 bg-blue-400/10" },
  shipped: { label: "运输中", color: "text-yellow-400 bg-yellow-400/10" },
  received: { label: "已到货", color: "text-green-400 bg-green-400/10" },
  installed: { label: "已安装", color: "text-cyan-400 bg-cyan-400/10" },
};

export function ProcurementList({ layout, onClose }: Props) {
  const store = useProjectStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unitPrice: 0 });

  // Extract equipment from layout zones
  const items = useMemo(() => {
    const result: Array<{ name: string; zone: string; zoneId: string }> = [];
    for (const zone of layout.zones) {
      const label = ZONE_LABELS[zone.type as ZoneType] ?? zone.name;
      for (const eq of zone.equipment ?? []) {
        result.push({ name: eq, zone: label, zoneId: zone.id });
      }
    }
    return result;
  }, [layout]);

  const procItems = store.project?.procurementItems ?? [];

  const summary = useMemo(() => {
    const total = procItems.length || items.length;
    const cost = procItems.reduce((s, i) => s + i.totalPrice, 0);
    const ordered = procItems.filter((i) => i.status !== "pending").length;
    return { total, cost, ordered };
  }, [procItems, items]);

  const handleExportCSV = () => {
    const rows = [["名称", "区域", "数量", "单价", "总价", "状态", "供应商"]];
    for (const item of procItems.length > 0 ? procItems : items.map((i) => ({ ...i, quantity: 1, unitPrice: 0, totalPrice: 0, status: "pending", vendor: "" }))) {
      const pi = item as ProcurementItem & { zone?: string };
      rows.push([pi.name, pi.zoneName ?? pi.zone ?? "", String(pi.quantity), String(pi.unitPrice), String(pi.totalPrice), pi.status, pi.vendor ?? ""]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "procurement-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    store.addProcurementItem({
      name: newItem.name,
      category: "general",
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: newItem.quantity * newItem.unitPrice,
    });
    setNewItem({ name: "", quantity: 1, unitPrice: 0 });
    setShowAdd(false);
  };

  const handleStatusChange = (id: string, status: ProcurementItem["status"]) => {
    store.updateProcurementItem(id, { status });
  };

  const displayItems = procItems.length > 0
    ? procItems
    : items.map((i, idx) => ({
        id: `auto-${idx}`,
        name: i.name,
        category: "general",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        status: "pending" as const,
        vendor: undefined,
        zoneName: i.zone,
      }));

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
          <ShoppingCart className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="text-lg font-semibold">采购清单</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors">
            <Plus className="w-4 h-4" /> 添加物品
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" /> 导出CSV
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2 p-3">
              <input value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} placeholder="物品名称" className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-[var(--glass-border)] focus:outline-none focus:border-[var(--neon-cyan)]" />
              <input type="number" value={newItem.quantity} onChange={(e) => setNewItem((p) => ({ ...p, quantity: +e.target.value }))} className="w-16 px-2 py-1.5 text-sm rounded-lg bg-white/5 border border-[var(--glass-border)] focus:outline-none" />
              <input type="number" value={newItem.unitPrice} onChange={(e) => setNewItem((p) => ({ ...p, unitPrice: +e.target.value }))} placeholder="单价" className="w-24 px-2 py-1.5 text-sm rounded-lg bg-white/5 border border-[var(--glass-border)] focus:outline-none" />
              <button onClick={handleAddItem} className="px-3 py-1.5 text-sm rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity">添加</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="flex-1 overflow-auto p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400 border-b border-[var(--glass-border)]">
              <th className="pb-2 pl-2">名称</th>
              <th className="pb-2">区域</th>
              <th className="pb-2 text-right">数量</th>
              <th className="pb-2 text-right">单价</th>
              <th className="pb-2 text-right">总价</th>
              <th className="pb-2 text-center">状态</th>
              <th className="pb-2">供应商</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item) => (
              <tr key={item.id} className="border-b border-[var(--glass-border)]/50 hover:bg-white/5 transition-colors">
                <td className="py-2 pl-2 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-neutral-500" />
                  {item.name}
                </td>
                <td className="py-2 text-neutral-400">{item.zoneName ?? "-"}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{item.unitPrice > 0 ? `$${item.unitPrice.toLocaleString()}` : "-"}</td>
                <td className="py-2 text-right">{item.totalPrice > 0 ? `$${item.totalPrice.toLocaleString()}` : "-"}</td>
                <td className="py-2 text-center">
                  <div className="relative inline-block">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ProcurementItem["status"])}
                      className={`appearance-none px-2 py-0.5 text-xs rounded-full cursor-pointer ${STATUS_CONFIG[item.status]?.color ?? ""} bg-transparent border-0 focus:outline-none pr-5`}
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </td>
                <td className="py-2 text-neutral-400">{item.vendor ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between p-4 border-t border-[var(--glass-border)] text-sm">
        <span className="text-neutral-400">共 {summary.total} 项</span>
        <span className="text-neutral-400">已下单 {summary.ordered}/{summary.total}</span>
        <span className="font-medium text-[var(--neon-cyan)]">总计 ${summary.cost.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
