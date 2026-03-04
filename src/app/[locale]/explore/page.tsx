"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const KnowledgeUniverse = dynamic(
  () => import("@/features/explore-universe/KnowledgeUniverse"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading...</div>
      </div>
    ),
  }
);

export default function ExplorePage() {
  const params = useParams();
  const locale = params.locale as string;

  return <KnowledgeUniverse locale={locale} />;
}
