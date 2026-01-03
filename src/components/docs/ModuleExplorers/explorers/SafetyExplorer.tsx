"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M06_CONFIG } from "../data/m06-safety";

interface SafetyExplorerProps {
  className?: string;
}

export function SafetyExplorer({ className }: SafetyExplorerProps) {
  return <ModuleExplorer config={M06_CONFIG} className={className} />;
}
