"use client";

import { FloorPlanEditor } from "@/features/lab-editor";

/**
 * Floor Plan Editor Page
 *
 * This page serves as a thin wrapper around the FloorPlanEditor feature component.
 * All UI logic is delegated to the feature component to maintain separation of concerns.
 */
export default function FloorPlanPage() {
  return <FloorPlanEditor />;
}
