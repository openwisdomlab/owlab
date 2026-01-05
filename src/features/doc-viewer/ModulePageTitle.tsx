"use client";

import { useTranslations } from "next-intl";
import { getOwlIcon } from "@/components/icons/OwlIcons";

// 模块颜色映射
const moduleColors: Record<string, string> = {
  M01: "var(--neon-yellow)",
  M02: "var(--neon-violet)",
  M03: "var(--neon-cyan)",
  M04: "var(--neon-green)",
  M05: "var(--neon-orange)",
  M06: "var(--neon-red)",
  M07: "var(--neon-pink)",
  M08: "var(--neon-blue)",
  M09: "var(--neon-teal)",
};

interface ModulePageTitleProps {
  moduleId: string;
  className?: string;
}

export function ModulePageTitle({ moduleId, className }: ModulePageTitleProps) {
  const t = useTranslations("docs.knowledgeBase");
  const color = moduleColors[moduleId] || "var(--neon-cyan)";
  const OwlIcon = getOwlIcon(moduleId);

  // 获取翻译内容
  let owlTitle = "";
  let subtitle = "";
  let label = "";

  try {
    owlTitle = t(`modules.${moduleId}.title`);
    subtitle = t(`modules.${moduleId}.subtitle`);
    label = t(`modules.${moduleId}.label`);
  } catch {
    return null;
  }

  return (
    <div className={`mb-8 ${className || ""}`}>
      {/* 猫头鹰图标和类型（小字注释） */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
        >
          <OwlIcon className="w-14 h-14" color={color} />
        </div>
        <div>
          {/* 模块ID */}
          <span
            className="text-xs font-mono font-bold block"
            style={{ color }}
          >
            {moduleId}
          </span>
          {/* 猫头鹰类型 - 小字注释 */}
          <span className="text-sm text-[var(--muted-foreground)]">
            {owlTitle}
          </span>
        </div>
      </div>

      {/* 主标题 - 副标题（如：启航之路） */}
      <h1
        className="text-3xl md:text-4xl font-bold mb-2"
        style={{ color }}
      >
        {subtitle}
      </h1>

      {/* 功能描述标签 */}
      <p className="text-base text-[var(--muted-foreground)]">
        {label}
      </p>
    </div>
  );
}
