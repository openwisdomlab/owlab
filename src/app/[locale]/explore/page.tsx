"use client";

import { useParams } from "next/navigation";
import KnowledgeUniverse from "@/features/explore-universe/KnowledgeUniverse";

export default function ExplorePage() {
  const params = useParams();
  const locale = params.locale as string;

  return <KnowledgeUniverse locale={locale} />;
}
