/**
 * Centralized MDX Component Registry
 *
 * All custom components available to MDX authors are registered here.
 * MDX authors can use these directly in .mdx files without imports:
 *   <ThinkingZone />
 *   <EinsteinQuote />
 *   <ParticleField />
 *   <ModuleCards />
 *   etc.
 *
 * To add a new global MDX component:
 * 1. Create the component in src/components/ or src/features/
 * 2. Import it below
 * 3. Add it to the `mdxComponents` object with the desired MDX tag name
 */

import { ModuleCards } from "@/features/doc-viewer/ModuleCards";
import { ExtendCards } from "@/features/doc-viewer/ExtendCards";
import { BackToSection } from "@/features/doc-viewer/BackToSection";
import { TheoryLineage } from "@/features/doc-viewer/TheoryLineage";
import { FourPFramework } from "@/features/doc-viewer/FourPFramework";
import {
  FlowChart,
  EQUIPMENT_ACCESS_FLOW,
  SPACE_PLANNING_FLOW,
} from "@/features/doc-viewer/FlowChart";
import { KnowledgeGraph } from "@/features/doc-viewer/KnowledgeGraph";
import { ModuleSummary } from "@/features/doc-viewer/ModuleSummary";
import { ConceptExplorer } from "@/features/doc-viewer/ConceptExplorer";
import {
  GovernanceExplorer,
  SpaceExplorer,
  CurriculumExplorer,
  ToolsExplorer,
  SafetyExplorer,
  PeopleExplorer,
  OperationsExplorer,
  AssessmentExplorer,
} from "@/features/doc-viewer/ModuleExplorers";
import { ModulePageTitle } from "@/features/doc-viewer/ModulePageTitle";
import { ThinkingZone } from "@/components/brand/ThinkingZone";
import { EinsteinQuote } from "@/components/brand/EinsteinQuote";
import { ParticleField } from "@/components/brand/ParticleField";
import { Cite, References } from "@/features/doc-viewer/Citation";

/**
 * Create the full MDX component map for a given locale.
 * Locale is injected into components that need it (e.g. ModuleCards, ExtendCards).
 */
export function createMdxComponents(locale: string) {
  return {
    // ── Brand Components (globally available in MDX) ──────────────
    ThinkingZone: () => <ThinkingZone />,
    EinsteinQuote: (props: { locale?: string }) => (
      <EinsteinQuote locale={props.locale ?? locale} />
    ),
    ParticleField: (props: {
      count?: number;
      connectionThreshold?: number;
      maxConnections?: number;
      speed?: number;
      mouseInfluence?: boolean;
      className?: string;
    }) => <ParticleField {...props} />,

    // ── Documentation Components ──────────────────────────────────
    ModuleCards: () => <ModuleCards locale={locale} />,
    ExtendCards: (props: {
      cards: Array<{
        title: string;
        description: string;
        href: string;
        type: "extend" | "evidence" | "checklist" | "sop";
        status?: "completed" | "in_progress" | "planned" | "draft";
      }>;
    }) => <ExtendCards {...props} locale={locale} />,
    BackToSection: (props: {
      href: string;
      label?: string;
      moduleId?: string;
      moduleName?: string;
    }) => <BackToSection {...props} locale={locale} />,

    // ── Interactive Visualizations ────────────────────────────────
    TheoryLineage: (props: { className?: string; interactive?: boolean }) => (
      <TheoryLineage {...props} />
    ),
    FourPFramework: (props: {
      className?: string;
      interactive?: boolean;
      compact?: boolean;
    }) => <FourPFramework {...props} />,
    FlowChart: FlowChart,
    KnowledgeGraph: (props: {
      module?: string;
      depth?: number;
      interactive?: boolean;
      className?: string;
    }) => <KnowledgeGraph {...props} />,
    ModuleSummary: (props: {
      moduleId: string;
      tagline: string;
      philosophy: string;
      insights: string[];
      className?: string;
    }) => <ModuleSummary {...props} />,
    ConceptExplorer: (props: { className?: string }) => (
      <ConceptExplorer {...props} />
    ),

    // ── Module Explorers ──────────────────────────────────────────
    GovernanceExplorer: (props: { className?: string }) => (
      <GovernanceExplorer {...props} />
    ),
    SpaceExplorer: (props: { className?: string }) => (
      <SpaceExplorer {...props} />
    ),
    CurriculumExplorer: (props: { className?: string }) => (
      <CurriculumExplorer {...props} />
    ),
    ToolsExplorer: (props: { className?: string }) => (
      <ToolsExplorer {...props} />
    ),
    SafetyExplorer: (props: { className?: string }) => (
      <SafetyExplorer {...props} />
    ),
    PeopleExplorer: (props: { className?: string }) => (
      <PeopleExplorer {...props} />
    ),
    OperationsExplorer: (props: { className?: string }) => (
      <OperationsExplorer {...props} />
    ),
    AssessmentExplorer: (props: { className?: string }) => (
      <AssessmentExplorer {...props} />
    ),

    // ── Page Helpers ──────────────────────────────────────────────
    ModulePageTitle: (props: { moduleId: string; className?: string }) => (
      <ModulePageTitle {...props} />
    ),

    // ── Citations ─────────────────────────────────────────────────
    Cite: (props: { id?: string; ids?: string; children?: React.ReactNode }) => (
      <Cite {...props} />
    ),
    References: (props: {
      scope?: "page" | "module";
      module?: string;
      title?: string;
    }) => <References {...props} />,

    // ── Pre-built Flow Constants ──────────────────────────────────
    EQUIPMENT_ACCESS_FLOW,
    SPACE_PLANNING_FLOW,
  };
}
