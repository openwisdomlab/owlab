"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M09_CONFIG } from "../data/m09-assessment";

interface AssessmentExplorerProps {
  className?: string;
}

export function AssessmentExplorer({ className }: AssessmentExplorerProps) {
  return <ModuleExplorer config={M09_CONFIG} className={className} />;
}
