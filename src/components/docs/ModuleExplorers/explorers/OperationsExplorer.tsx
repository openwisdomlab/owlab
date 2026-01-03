"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M08_CONFIG } from "../data/m08-operations";

interface OperationsExplorerProps {
  className?: string;
}

export function OperationsExplorer({ className }: OperationsExplorerProps) {
  return <ModuleExplorer config={M08_CONFIG} className={className} />;
}
