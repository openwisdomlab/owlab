"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const FloorPlanEditor = dynamic(
  () => import("@/features/lab-editor").then((mod) => ({ default: mod.FloorPlanEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading editor...</div>
      </div>
    ),
  }
);

function FloorPlanPageInner() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");

  return <FloorPlanEditor initialTemplate={templateParam || undefined} />;
}

/**
 * Floor Plan Editor Page
 *
 * This page serves as a thin wrapper around the FloorPlanEditor feature component.
 * All UI logic is delegated to the feature component to maintain separation of concerns.
 */
export default function FloorPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[var(--muted-foreground)]">Loading...</div>
    </div>}>
      <FloorPlanPageInner />
    </Suspense>
  );
}
