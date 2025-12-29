"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  X,
  ChevronLeft,
  ChevronRight,
  Ruler,
  DollarSign,
  Users,
  Target,
  Building2,
  UserCog,
  Loader2,
  CheckCircle2,
  Download,
  RefreshCw,
  Lightbulb,
  Package,
  Shield,
  Calendar,
  BookOpen,
} from "lucide-react";

// Input parameter types
interface WizardParams {
  area: string;
  budget: string;
  ageGroups: string[];
  focusAreas: string[];
  siteCondition: string;
  staffCount: number;
  volunteerCount: number;
}

// Recommendation result types
interface LayoutRecommendation {
  zones: Array<{
    name: string;
    area: number;
    purpose: string;
  }>;
  totalArea: number;
}

interface EquipmentRecommendation {
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    category: string;
    priority: "essential" | "recommended" | "optional";
  }>;
  totalCost: number;
}

interface SafetyRecommendation {
  requirements: Array<{
    category: string;
    items: string[];
  }>;
}

interface PhaseRecommendation {
  phases: Array<{
    name: string;
    duration: string;
    items: string[];
    cost: number;
  }>;
}

interface Recommendation {
  layout: LayoutRecommendation;
  equipment: EquipmentRecommendation;
  safety: SafetyRecommendation;
  phases: PhaseRecommendation;
  summary: string;
}

interface RecommendationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLayout?: (layout: LayoutRecommendation) => void;
}

const AREA_OPTIONS = [
  { value: "50", label: "50㎡ 以下", description: "小型教室/社团空间" },
  { value: "100", label: "50-100㎡", description: "标准教室" },
  { value: "200", label: "100-200㎡", description: "中型实验室" },
  { value: "300", label: "200㎡ 以上", description: "大型创新中心" },
];

const BUDGET_OPTIONS = [
  { value: "50000", label: "5万以下", description: "基础配置" },
  { value: "100000", label: "5-10万", description: "标准配置" },
  { value: "200000", label: "10-20万", description: "进阶配置" },
  { value: "300000", label: "20万以上", description: "完整配置" },
];

const AGE_GROUP_OPTIONS = [
  { value: "primary", label: "小学", icon: "🎒" },
  { value: "middle", label: "初中", icon: "📚" },
  { value: "high", label: "高中", icon: "🎓" },
  { value: "mixed", label: "混龄", icon: "👥" },
];

const FOCUS_AREA_OPTIONS = [
  { value: "stem", label: "STEM", description: "科学技术工程数学" },
  { value: "art", label: "艺术创客", description: "设计、手工、创意" },
  { value: "ai", label: "AI教育", description: "人工智能、编程" },
  { value: "comprehensive", label: "综合", description: "多领域融合" },
];

const SITE_OPTIONS = [
  { value: "new", label: "新建空间", description: "全新场地建设" },
  { value: "renovation", label: "改造升级", description: "现有空间改造" },
  { value: "classroom", label: "教室改装", description: "普通教室改装" },
];

const STEPS = [
  { id: 1, title: "空间与预算", icon: Ruler },
  { id: 2, title: "目标定位", icon: Target },
  { id: 3, title: "场地条件", icon: Building2 },
  { id: 4, title: "人员配置", icon: UserCog },
];

export function RecommendationWizard({
  isOpen,
  onClose,
  onApplyLayout,
}: RecommendationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [params, setParams] = useState<WizardParams>({
    area: "",
    budget: "",
    ageGroups: [],
    focusAreas: [],
    siteCondition: "",
    staffCount: 1,
    volunteerCount: 0,
  });

  const updateParam = useCallback(<K extends keyof WizardParams>(
    key: K,
    value: WizardParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayParam = useCallback((key: "ageGroups" | "focusAreas", value: string) => {
    setParams((prev) => {
      const arr = prev[key];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return params.area && params.budget;
      case 2:
        return params.ageGroups.length > 0 && params.focusAreas.length > 0;
      case 3:
        return params.siteCondition;
      case 4:
        return params.staffCount > 0;
      default:
        return true;
    }
  }, [currentStep, params]);

  const generateRecommendation = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Simulate API calls - in production, these would be real API calls
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock recommendation based on params
      const areaNum = parseInt(params.area) || 100;
      const budgetNum = parseInt(params.budget) || 100000;

      const mockRecommendation: Recommendation = {
        layout: {
          zones: [
            { name: "数字制造区", area: areaNum * 0.3, purpose: "3D打印、激光切割" },
            { name: "电子工作区", area: areaNum * 0.25, purpose: "电子焊接、编程" },
            { name: "协作讨论区", area: areaNum * 0.2, purpose: "项目讨论、展示" },
            { name: "材料存储区", area: areaNum * 0.15, purpose: "耗材、工具存放" },
            { name: "安全通道", area: areaNum * 0.1, purpose: "人员流动、紧急疏散" },
          ],
          totalArea: areaNum,
        },
        equipment: {
          items: [
            { name: "3D打印机", quantity: Math.max(1, Math.floor(areaNum / 50)), unitPrice: 3000, category: "tools", priority: "essential" },
            { name: "激光切割机", quantity: 1, unitPrice: 15000, category: "tools", priority: params.focusAreas.includes("art") ? "essential" : "recommended" },
            { name: "工作台", quantity: Math.max(4, Math.floor(areaNum / 15)), unitPrice: 1500, category: "furniture", priority: "essential" },
            { name: "Arduino套件", quantity: Math.max(10, Math.floor(areaNum / 5)), unitPrice: 200, category: "electronics", priority: params.focusAreas.includes("stem") ? "essential" : "recommended" },
            { name: "笔记本电脑", quantity: Math.max(5, Math.floor(areaNum / 10)), unitPrice: 5000, category: "compute", priority: "essential" },
            { name: "安全防护套装", quantity: Math.max(10, Math.floor(areaNum / 5)), unitPrice: 150, category: "safety", priority: "essential" },
          ],
          totalCost: budgetNum * 0.85,
        },
        safety: {
          requirements: [
            { category: "消防安全", items: ["灭火器配置", "烟雾报警器", "疏散指示标识", "消防通道保持畅通"] },
            { category: "电气安全", items: ["漏电保护器", "接地系统", "防静电措施"] },
            { category: "设备安全", items: ["设备操作规程", "紧急停止按钮", "防护装置"] },
            { category: "个人防护", items: ["护目镜", "防护手套", "急救箱", "洗眼器"] },
          ],
        },
        phases: {
          phases: [
            {
              name: "第一期：基础设施",
              duration: "1-2个月",
              items: ["场地装修", "电力改造", "基础家具", "安全设施"],
              cost: budgetNum * 0.4,
            },
            {
              name: "第二期：核心设备",
              duration: "1个月",
              items: ["3D打印机", "电脑设备", "基础工具"],
              cost: budgetNum * 0.35,
            },
            {
              name: "第三期：完善配置",
              duration: "持续",
              items: ["激光切割机", "高级套件", "耗材储备"],
              cost: budgetNum * 0.25,
            },
          ],
        },
        summary: `根据您的需求，我们推荐建设一个 ${areaNum}㎡ 的${
          params.focusAreas.includes("comprehensive") ? "综合型" :
          params.focusAreas.includes("stem") ? "STEM导向" :
          params.focusAreas.includes("ai") ? "AI教育导向" : "艺术创客导向"
        }创客空间。预算 ${(budgetNum / 10000).toFixed(0)} 万元可实现${
          budgetNum >= 200000 ? "完整配置" : budgetNum >= 100000 ? "标准配置" : "基础配置"
        }，建议分三期实施以确保质量和可持续发展。`,
      };

      setRecommendation(mockRecommendation);
    } catch (error) {
      console.error("Failed to generate recommendation:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [params]);

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      generateRecommendation();
    }
  }, [currentStep, generateRecommendation]);

  const handleBack = useCallback(() => {
    if (recommendation) {
      setRecommendation(null);
    } else if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep, recommendation]);

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setRecommendation(null);
    setParams({
      area: "",
      budget: "",
      ageGroups: [],
      focusAreas: [],
      siteCondition: "",
      staffCount: 1,
      volunteerCount: 0,
    });
  }, []);

  const formatCurrency = (value: number) => {
    return `¥${(value / 10000).toFixed(1)}万`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--background)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[var(--neon-purple)]" />
            <h2 className="font-semibold">智能规划向导</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        {!recommendation && !isGenerating && (
          <div className="flex items-center justify-center gap-2 p-4 border-b border-[var(--glass-border)]">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                      isActive
                        ? "bg-[var(--neon-purple)]/20 text-[var(--neon-purple)]"
                        : isCompleted
                        ? "bg-[var(--neon-green)]/20 text-[var(--neon-green)]"
                        : "bg-[var(--glass-bg)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium hidden sm:inline">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 mx-1 text-[var(--muted-foreground)]" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Loader2 className="w-12 h-12 animate-spin text-[var(--neon-purple)] mb-4" />
                <p className="text-lg font-medium">正在生成推荐方案...</p>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  分析空间布局、设备配置、安全需求...
                </p>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="p-4 rounded-lg bg-[var(--neon-purple)]/10 border border-[var(--neon-purple)]/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-[var(--neon-purple)] flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{recommendation.summary}</p>
                  </div>
                </div>

                {/* Layout */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[var(--neon-cyan)]" />
                    空间布局建议
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendation.layout.zones.map((zone) => (
                      <div
                        key={zone.name}
                        className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                      >
                        <div className="font-medium text-sm">{zone.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {zone.area.toFixed(0)}㎡ · {zone.purpose}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-[var(--neon-cyan)]" />
                    设备清单
                    <span className="text-sm font-normal text-[var(--muted-foreground)]">
                      （总计 {formatCurrency(recommendation.equipment.totalCost)}）
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {recommendation.equipment.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--glass-bg)]"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded ${
                              item.priority === "essential"
                                ? "bg-red-500/20 text-red-400"
                                : item.priority === "recommended"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {item.priority === "essential" ? "必备" : item.priority === "recommended" ? "推荐" : "可选"}
                          </span>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-sm text-[var(--muted-foreground)]">
                          {item.quantity}台 × ¥{item.unitPrice}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--neon-cyan)]" />
                    安全配置要求
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recommendation.safety.requirements.map((req) => (
                      <div
                        key={req.category}
                        className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                      >
                        <div className="font-medium text-sm mb-2">{req.category}</div>
                        <ul className="space-y-1">
                          {req.items.map((item) => (
                            <li key={item} className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                              <span className="text-[var(--neon-green)]">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phases */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--neon-cyan)]" />
                    分期采购建议
                  </h3>
                  <div className="space-y-2">
                    {recommendation.phases.phases.map((phase, index) => (
                      <div
                        key={phase.name}
                        className="p-3 rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="font-medium text-sm">{phase.name}</span>
                          </div>
                          <div className="text-sm text-[var(--neon-cyan)]">
                            {formatCurrency(phase.cost)}
                          </div>
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)] mb-1">
                          预计周期：{phase.duration}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {phase.items.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-0.5 text-xs rounded bg-[var(--glass-bg)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <Ruler className="w-4 h-4" />
                        空间面积
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AREA_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateParam("area", option.value)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              params.area === option.value
                                ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10"
                                : "border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50"
                            }`}
                          >
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <DollarSign className="w-4 h-4" />
                        预算范围
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BUDGET_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateParam("budget", option.value)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              params.budget === option.value
                                ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10"
                                : "border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50"
                            }`}
                          >
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        目标年龄段（可多选）
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {AGE_GROUP_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayParam("ageGroups", option.value)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              params.ageGroups.includes(option.value)
                                ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10"
                                : "border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50"
                            }`}
                          >
                            <div className="text-2xl mb-1">{option.icon}</div>
                            <div className="text-sm font-medium">{option.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <Target className="w-4 h-4" />
                        侧重方向（可多选）
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {FOCUS_AREA_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => toggleArrayParam("focusAreas", option.value)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              params.focusAreas.includes(option.value)
                                ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10"
                                : "border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50"
                            }`}
                          >
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="w-4 h-4" />
                      场地条件
                    </label>
                    <div className="space-y-2">
                      {SITE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateParam("siteCondition", option.value)}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${
                            params.siteCondition === option.value
                              ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10"
                              : "border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50"
                          }`}
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-[var(--muted-foreground)]">
                            {option.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <UserCog className="w-4 h-4" />
                        专职导师数量
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={params.staffCount}
                          onChange={(e) => updateParam("staffCount", parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-12 text-center font-medium">
                          {params.staffCount} 人
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        志愿者/兼职数量
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={params.volunteerCount}
                          onChange={(e) => updateParam("volunteerCount", parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-12 text-center font-medium">
                          {params.volunteerCount} 人
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                      <h4 className="font-medium text-sm mb-2">配置摘要</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-[var(--muted-foreground)]">面积：</span>
                          {AREA_OPTIONS.find((o) => o.value === params.area)?.label}
                        </div>
                        <div>
                          <span className="text-[var(--muted-foreground)]">预算：</span>
                          {BUDGET_OPTIONS.find((o) => o.value === params.budget)?.label}
                        </div>
                        <div>
                          <span className="text-[var(--muted-foreground)]">年龄段：</span>
                          {params.ageGroups.map((g) => AGE_GROUP_OPTIONS.find((o) => o.value === g)?.label).join("、")}
                        </div>
                        <div>
                          <span className="text-[var(--muted-foreground)]">方向：</span>
                          {params.focusAreas.map((f) => FOCUS_AREA_OPTIONS.find((o) => o.value === f)?.label).join("、")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--glass-border)]">
          {recommendation ? (
            <>
              <button
                onClick={resetWizard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重新规划
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Export functionality
                    alert("导出功能开发中...");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  导出报告
                </button>
                <button
                  onClick={() => {
                    onApplyLayout?.(recommendation.layout);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-purple)] text-white hover:opacity-80 transition-opacity"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  应用布局
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                上一步
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-purple)] text-white hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 4 ? (
                  <>
                    生成方案
                    <Wand2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    下一步
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
