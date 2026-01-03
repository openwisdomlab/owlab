"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M04_CONFIG } from "../data/m04-curriculum";

interface CurriculumExplorerProps {
  className?: string;
}

export function CurriculumExplorer({ className }: CurriculumExplorerProps) {
  return <ModuleExplorer config={M04_CONFIG} className={className} />;
}
