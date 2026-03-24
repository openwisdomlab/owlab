/**
 * Project Lifecycle Schema — tracks a lab project from research through acceptance.
 */
import { z } from "zod";

export const ProjectPhaseSchema = z.enum([
  "research",      // 调研
  "design",        // 设计
  "procurement",   // 采购
  "construction",  // 施工
  "acceptance",    // 验收
]);
export type ProjectPhase = z.infer<typeof ProjectPhaseSchema>;

export const PROJECT_PHASE_LABELS: Record<ProjectPhase, string> = {
  research: "调研阶段",
  design: "设计阶段",
  procurement: "采购阶段",
  construction: "施工阶段",
  acceptance: "验收阶段",
};

export const PROJECT_PHASES: ProjectPhase[] = ["research", "design", "procurement", "construction", "acceptance"];

// Procurement item
export const ProcurementItemSchema = z.object({
  id: z.string(),
  equipmentId: z.string().optional(),
  name: z.string(),
  category: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  vendor: z.string().optional(),
  vendorUrl: z.string().optional(),
  status: z.enum(["pending", "ordered", "shipped", "received", "installed"]).default("pending"),
  zoneId: z.string().optional(),
  zoneName: z.string().optional(),
  notes: z.string().optional(),
});
export type ProcurementItem = z.infer<typeof ProcurementItemSchema>;

// Construction task
export const ConstructionTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  trade: z.enum(["electrical", "hvac", "plumbing", "furniture", "it-network", "safety", "finishing", "general"]),
  description: z.string(),
  status: z.enum(["pending", "in-progress", "completed", "blocked"]).default("pending"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  dependencies: z.array(z.string()).default([]),  // task IDs that must complete first
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  completedDate: z.string().optional(),
  zoneId: z.string().optional(),
});
export type ConstructionTask = z.infer<typeof ConstructionTaskSchema>;

export const TRADE_LABELS: Record<ConstructionTask["trade"], string> = {
  electrical: "电气工程",
  hvac: "暖通空调",
  plumbing: "给排水",
  furniture: "家具安装",
  "it-network": "IT/网络",
  safety: "安全设施",
  finishing: "装饰装修",
  general: "综合",
};

// Acceptance check item
export const AcceptanceCheckSchema = z.object({
  id: z.string(),
  category: z.enum(["safety", "compliance", "functionality", "quality", "documentation"]),
  description: z.string(),
  descriptionZh: z.string(),
  standard: z.string().optional(),
  status: z.enum(["pending", "pass", "fail", "waived"]).default("pending"),
  notes: z.string().optional(),
  inspector: z.string().optional(),
  inspectedDate: z.string().optional(),
});
export type AcceptanceCheck = z.infer<typeof AcceptanceCheckSchema>;

export const ACCEPTANCE_CATEGORY_LABELS: Record<AcceptanceCheck["category"], string> = {
  safety: "安全合规",
  compliance: "法规合规",
  functionality: "功能验证",
  quality: "质量检查",
  documentation: "文档完整性",
};

// Milestone
export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  phase: ProjectPhaseSchema,
  dueDate: z.string().optional(),
  completedDate: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed", "overdue"]).default("pending"),
});
export type Milestone = z.infer<typeof MilestoneSchema>;

// Full project state
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  currentPhase: ProjectPhaseSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  milestones: z.array(MilestoneSchema),
  procurementItems: z.array(ProcurementItemSchema),
  constructionTasks: z.array(ConstructionTaskSchema),
  acceptanceChecks: z.array(AcceptanceCheckSchema),
});
export type Project = z.infer<typeof ProjectSchema>;
