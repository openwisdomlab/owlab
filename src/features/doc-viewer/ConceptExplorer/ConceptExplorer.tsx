"use client";

import { ConceptPyramid } from "./ConceptPyramid";

interface ConceptExplorerProps {
  className?: string;
}

export function ConceptExplorer({ className = "" }: ConceptExplorerProps) {
  return <ConceptPyramid className={className} />;
}
