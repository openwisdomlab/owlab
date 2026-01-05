"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M03_CONFIG } from "../data/m03-space";

interface SpaceExplorerProps {
  className?: string;
}

export function SpaceExplorer({ className }: SpaceExplorerProps) {
  return <ModuleExplorer config={M03_CONFIG} className={className} />;
}
