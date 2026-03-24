/**
 * Copilot Agent — provides real-time suggestions during manual layout editing.
 * Runs the rules engine on the current layout and generates human-readable suggestions.
 */

import { streamText } from "ai";
import { getTextModel } from "../providers";
import { validateLayout, type ValidationResult } from "@/lib/rules/rules-engine";
import type { LayoutData, ZoneData } from "./layout-agent";
import type { RuleViolation } from "@/lib/schemas/design-rules";
import { ZONE_LABELS } from "@/lib/constants/zone-types";

export interface CopilotSuggestion {
  type: "error" | "warning" | "tip";
  message: string;
  messageZh: string;
  affectedZones: string[];
  autoFixAvailable: boolean;
  /** If autoFixAvailable, this contains the fix data */
  autoFix?: {
    zoneId: string;
    updates: Partial<ZoneData>;
  };
}

/**
 * Get instant suggestions for the current layout state.
 * Runs the rules engine and converts violations to actionable suggestions.
 * This is synchronous and fast — no AI call needed.
 */
export function getInstantSuggestions(layout: LayoutData): CopilotSuggestion[] {
  if (!layout.zones || layout.zones.length === 0) return [];
  const validation = validateLayout(layout);
  const suggestions: CopilotSuggestion[] = [];

  for (const v of validation.violations) {
    const suggestion: CopilotSuggestion = {
      type: v.severity === "error" ? "error" : v.severity === "warning" ? "warning" : "tip",
      message: v.message,
      messageZh: v.messageZh,
      affectedZones: v.affectedZones,
      autoFixAvailable: false,
    };

    // Try to generate auto-fix for spacing violations
    if (v.ruleCategory === "spacing" && v.affectedZones.length === 2) {
      const fix = tryGenerateSpacingFix(layout, v);
      if (fix) {
        suggestion.autoFixAvailable = true;
        suggestion.autoFix = fix;
      }
    }

    suggestions.push(suggestion);
  }

  return suggestions;
}

/**
 * Try to generate an auto-fix for a spacing violation.
 * Moves one zone away from the other to meet minimum distance.
 */
function tryGenerateSpacingFix(
  layout: LayoutData,
  violation: RuleViolation
): CopilotSuggestion["autoFix"] | null {
  const [zoneIdA, zoneIdB] = violation.affectedZones;
  const zoneA = layout.zones.find(z => z.id === zoneIdA);
  const zoneB = layout.zones.find(z => z.id === zoneIdB);

  if (!zoneA || !zoneB) return null;

  // Calculate center points
  const centerA = {
    x: zoneA.position.x + zoneA.size.width / 2,
    y: zoneA.position.y + zoneA.size.height / 2,
  };
  const centerB = {
    x: zoneB.position.x + zoneB.size.width / 2,
    y: zoneB.position.y + zoneB.size.height / 2,
  };

  // Direction from A to B
  const dx = centerB.x - centerA.x;
  const dy = centerB.y - centerA.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return null;

  // Move zone B 1m further in the direction away from A
  const moveAmount = 1.0;
  const nx = dx / dist;
  const ny = dy / dist;

  return {
    zoneId: zoneIdB,
    updates: {
      position: {
        x: Math.round((zoneB.position.x + nx * moveAmount) * 10) / 10,
        y: Math.round((zoneB.position.y + ny * moveAmount) * 10) / 10,
      },
    },
  };
}

/**
 * Stream AI-powered design suggestions for the current layout.
 * Uses AI to provide contextual advice beyond just rule violations.
 */
export function streamCopilotAdvice(
  layout: LayoutData,
  context?: string,
  modelKey = "claude-sonnet"
) {
  const validation = validateLayout(layout);
  const model = getTextModel(modelKey);

  const zonesSummary = layout.zones.map(z =>
    `${z.name} (${z.type}/${ZONE_LABELS[z.type as keyof typeof ZONE_LABELS] || z.type}): ${z.size.width}x${z.size.height}m at (${z.position.x},${z.position.y})`
  ).join("\n");

  let prompt = `Analyze this lab layout and provide 3-5 actionable suggestions in Chinese:

Layout: ${layout.name} (${layout.dimensions.width}x${layout.dimensions.height}m)
Zones:
${zonesSummary}

Compliance score: ${validation.score}/100
Errors: ${validation.errors.length}
Warnings: ${validation.warnings.length}`;

  if (validation.errors.length > 0) {
    prompt += "\n\nRule violations:\n" + validation.errors.map(e => `- ${e.messageZh}`).join("\n");
  }

  if (context) {
    prompt += `\n\nUser context: ${context}`;
  }

  prompt += "\n\nProvide suggestions as a numbered list. Focus on the most impactful improvements. Keep each suggestion to 1-2 sentences. Use Chinese.";

  return streamText({
    model,
    system: "You are a lab design copilot. You provide brief, actionable layout improvement suggestions in Chinese. Focus on safety, efficiency, and compliance.",
    prompt,
    temperature: 0.5,
  });
}

/**
 * Get validation result for the current layout.
 */
export function getValidation(layout: LayoutData): ValidationResult {
  return validateLayout(layout);
}
