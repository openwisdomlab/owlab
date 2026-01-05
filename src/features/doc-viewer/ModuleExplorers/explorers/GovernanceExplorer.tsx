"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M02_CONFIG } from "../data/m02-governance";

interface GovernanceExplorerProps {
  className?: string;
}

export function GovernanceExplorer({ className }: GovernanceExplorerProps) {
  return <ModuleExplorer config={M02_CONFIG} className={className} />;
}
