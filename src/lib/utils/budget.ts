/**
 * Budget Calculation Utilities
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { BudgetItem, BudgetSummary } from "@/lib/schemas/equipment";

/**
 * Calculate budget items from layout
 */
export function calculateBudgetItems(layout: LayoutData): BudgetItem[] {
  const items: BudgetItem[] = [];

  layout.zones.forEach((zone) => {
    // Equipment is optional in the layout-agent schema
    if (!zone.equipment || !Array.isArray(zone.equipment)) {
      return;
    }

    zone.equipment.forEach((equip: any) => {
      // Handle both old format (string[]) and new format (ZoneEquipment[])
      if (typeof equip === "string") {
        // Skip old format for now
        return;
      }

      const unitPrice = equip.price || 0;
      const quantity = equip.quantity || 1;

      items.push({
        equipmentId: equip.equipmentId,
        equipmentName: equip.name,
        category: equip.category || "utilities",
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        zoneId: zone.id,
        zoneName: zone.name,
      });
    });
  });

  return items;
}

/**
 * Calculate budget summary from layout
 */
export function calculateBudgetSummary(
  layout: LayoutData,
  currency: "USD" | "CNY" | "EUR" = "USD"
): BudgetSummary {
  const items = calculateBudgetItems(layout);

  const totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const costByCategory: Record<string, number> = {};
  const costByZone: Record<string, number> = {};

  items.forEach((item) => {
    // Group by category
    if (!costByCategory[item.category]) {
      costByCategory[item.category] = 0;
    }
    costByCategory[item.category] += item.totalPrice;

    // Group by zone
    if (!costByZone[item.zoneName]) {
      costByZone[item.zoneName] = 0;
    }
    costByZone[item.zoneName] += item.totalPrice;
  });

  return {
    totalCost,
    currency,
    costByCategory,
    costByZone,
    itemCount: items.length,
    items,
  };
}

/**
 * Format currency value
 */
export function formatCurrency(
  amount: number,
  currency: "USD" | "CNY" | "EUR" = "USD"
): string {
  const currencySymbols = {
    USD: "$",
    CNY: "¥",
    EUR: "€",
  };

  const symbol = currencySymbols[currency];
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${symbol}${formatted}`;
}

/**
 * Export budget to CSV
 */
export function exportBudgetToCSV(summary: BudgetSummary): string {
  const headers = [
    "Equipment",
    "Category",
    "Zone",
    "Quantity",
    "Unit Price",
    "Total Price",
  ];

  const rows = summary.items.map((item) => [
    item.equipmentName,
    item.category,
    item.zoneName,
    item.quantity.toString(),
    item.unitPrice.toFixed(2),
    item.totalPrice.toFixed(2),
  ]);

  // Add summary row
  rows.push([]);
  rows.push(["Total", "", "", "", "", summary.totalCost.toFixed(2)]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
