"use client";

import { ModuleExplorer } from "../ModuleExplorer";
import { M07_CONFIG } from "../data/m07-people";

interface PeopleExplorerProps {
  className?: string;
}

export function PeopleExplorer({ className }: PeopleExplorerProps) {
  return <ModuleExplorer config={M07_CONFIG} className={className} />;
}
