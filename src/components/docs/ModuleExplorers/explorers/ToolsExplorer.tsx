"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M05_CONFIG } from "../data/m05-tools";

interface ToolsExplorerProps {
  className?: string;
}

export function ToolsExplorer({ className }: ToolsExplorerProps) {
  return <ModuleExplorer config={M05_CONFIG} className={className} />;
}
