/**
 * Safety & Compliance AI Agent
 * Analyzes lab layouts for safety hazards and regulatory compliance
 */

import { generateText, streamText } from "ai";
import { getTextModel } from "../providers";
import { z } from "zod";
import type { LayoutData } from "./layout-agent";

// Safety Issue Schema
export const SafetyIssueSchema = z.object({
  id: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  category: z.enum([
    "fire_safety",
    "electrical",
    "accessibility",
    "ergonomics",
    "emergency",
    "equipment",
    "environmental",
    "general",
  ]),
  title: z.string(),
  description: z.string(),
  location: z.string().optional(),
  recommendation: z.string(),
  regulation: z.string().optional(), // OSHA, ADA, etc.
});

export const SafetyAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "moderate", "high", "critical"]),
  issues: z.array(SafetyIssueSchema),
  compliantRegulations: z.array(z.string()),
  nonCompliantRegulations: z.array(z.string()),
  summary: z.string(),
  recommendations: z.array(z.string()),
});

export type SafetyIssue = z.infer<typeof SafetyIssueSchema>;
export type SafetyAnalysis = z.infer<typeof SafetyAnalysisSchema>;

const SAFETY_SYSTEM_PROMPT = `You are an expert safety engineer and compliance specialist with deep knowledge of:
- OSHA (Occupational Safety and Health Administration) regulations
- ADA (Americans with Disabilities Act) accessibility requirements
- NFPA (National Fire Protection Association) codes
- Electrical safety standards (NFPA 70, NEC)
- Laboratory safety protocols
- Ergonomic best practices
- Emergency egress and evacuation procedures

Your role is to analyze laboratory layouts and identify:
1. Safety hazards and risks
2. Regulatory compliance gaps
3. Accessibility issues
4. Emergency preparedness concerns
5. Ergonomic problems

Always provide:
- Specific, actionable recommendations
- Relevant regulation references (OSHA, ADA, NFPA codes)
- Severity ratings (critical, high, medium, low)
- Clear explanations of why each issue matters`;

export interface SafetyAgentOptions {
  modelKey?: string;
  layout: LayoutData;
  focusAreas?: Array<"fire" | "electrical" | "accessibility" | "ergonomics" | "emergency">;
  strictMode?: boolean; // If true, applies stricter standards
}

/**
 * Analyze layout for safety and compliance issues
 */
export async function analyzeSafety(
  options: SafetyAgentOptions
): Promise<SafetyAnalysis> {
  const {
    modelKey = "claude-sonnet",
    layout,
    focusAreas = ["fire", "electrical", "accessibility", "ergonomics", "emergency"],
    strictMode = false,
  } = options;

  const model = getTextModel(modelKey);

  const prompt = `Analyze this laboratory layout for safety hazards and regulatory compliance:

**Layout Information:**
- Name: ${layout.name}
- Description: ${layout.description}
- Dimensions: ${layout.dimensions.width}×${layout.dimensions.height} ${layout.dimensions.unit}
- Total Zones: ${layout.zones.length}

**Zones:**
${layout.zones
  .map(
    (zone) =>
      `- ${zone.name} (${zone.type}): ${zone.size.width}×${zone.size.height} at (${zone.position.x}, ${zone.position.y})
  Equipment: ${zone.equipment?.length ? zone.equipment.join(", ") : "None"}
  Requirements: ${zone.requirements?.length ? zone.requirements.join(", ") : "None"}`
  )
  .join("\n")}

${layout.notes && layout.notes.length > 0 ? `**Notes:**\n${layout.notes.map((n) => `- ${n}`).join("\n")}` : ""}

**Analysis Focus Areas:** ${focusAreas.join(", ")}
**Compliance Mode:** ${strictMode ? "Strict (commercial/university standards)" : "Standard"}

Perform a comprehensive safety and compliance analysis focusing on:

1. **Fire Safety:**
   - Emergency exits and egress paths
   - Fire suppression systems
   - Flammable material storage
   - Exit signage and lighting
   - Maximum travel distance to exits (OSHA: 200ft for high-hazard, 300ft for low-hazard)

2. **Electrical Safety:**
   - Electrical panel accessibility
   - Power distribution for equipment
   - Grounding requirements
   - Circuit capacity
   - Emergency power cutoffs

3. **Accessibility (ADA Compliance):**
   - Doorway widths (minimum 32" clear width)
   - Aisle widths (minimum 36" for wheelchairs)
   - Workspace accessibility
   - Reach ranges and controls
   - Floor surfaces and slopes

4. **Ergonomics:**
   - Workstation design
   - Lighting adequacy
   - Noise levels (if equipment specified)
   - Repetitive motion concerns
   - Standing/sitting balance

5. **Emergency Preparedness:**
   - Emergency equipment locations (eyewash, shower, first aid)
   - Emergency communication systems
   - Evacuation routes
   - Assembly points
   - Emergency contact information display

6. **Equipment Safety:**
   - Proper ventilation for equipment
   - Equipment spacing and clearance
   - Hazardous equipment isolation
   - Machine guarding requirements

7. **Environmental:**
   - Ventilation and air quality
   - Temperature control
   - Humidity control
   - Chemical storage (if applicable)

**Output Format:**

Respond ONLY with valid JSON matching this structure:
{
  "overallScore": number (0-100, where 100 = perfect safety),
  "riskLevel": "low" | "moderate" | "high" | "critical",
  "issues": [
    {
      "id": "unique-id",
      "severity": "critical" | "high" | "medium" | "low",
      "category": "fire_safety" | "electrical" | "accessibility" | "ergonomics" | "emergency" | "equipment" | "environmental" | "general",
      "title": "Short issue title",
      "description": "Detailed description of the issue",
      "location": "Specific zone or area (optional)",
      "recommendation": "Specific actionable recommendation",
      "regulation": "OSHA 1910.36, ADA 4.3.3, etc. (optional)"
    }
  ],
  "compliantRegulations": ["Regulation names that are met"],
  "nonCompliantRegulations": ["Regulation names that are NOT met"],
  "summary": "Overall safety assessment summary (2-3 sentences)",
  "recommendations": ["Top 3-5 priority recommendations"]
}

**Important:**
- List issues in order of severity (critical → low)
- Reference specific regulations when applicable
- Be specific about locations and measurements
- Provide actionable recommendations`;

  const { text } = await generateText({
    model,
    system: SAFETY_SYSTEM_PROMPT,
    prompt,
    temperature: 0.2, // Low temperature for consistent safety analysis
  });

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract safety analysis JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return SafetyAnalysisSchema.parse(parsed);
}

/**
 * Stream safety recommendations
 */
export async function streamSafetyRecommendations(options: SafetyAgentOptions) {
  const { modelKey = "claude-sonnet", layout, focusAreas } = options;

  const model = getTextModel(modelKey);

  return streamText({
    model,
    system: SAFETY_SYSTEM_PROMPT,
    prompt: `Provide detailed safety improvement recommendations for this lab layout:

Layout: ${layout.name}
Zones: ${layout.zones.map((z) => `${z.name} (${z.type})`).join(", ")}
${focusAreas ? `Focus Areas: ${focusAreas.join(", ")}` : ""}

Provide:
1. Top 5 priority safety improvements
2. Quick wins (easy, low-cost fixes)
3. Long-term improvements
4. Regulatory compliance gaps to address

Format as clear, numbered list with actionable steps.`,
    temperature: 0.3,
  });
}

/**
 * Check specific regulation compliance
 */
export async function checkRegulationCompliance(
  layout: LayoutData,
  regulation: "OSHA" | "ADA" | "NFPA" | "NEC",
  modelKey: string = "claude-sonnet"
): Promise<{
  compliant: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const model = getTextModel(modelKey);

  const regulationDetails = {
    OSHA: "OSHA regulations for workplace safety (29 CFR 1910)",
    ADA: "ADA accessibility standards (ADA Standards for Accessible Design)",
    NFPA: "NFPA fire safety codes (NFPA 101: Life Safety Code)",
    NEC: "National Electrical Code (NFPA 70)",
  };

  const { text } = await generateText({
    model,
    system: SAFETY_SYSTEM_PROMPT,
    prompt: `Check ${regulation} compliance for this lab layout:

Regulation: ${regulationDetails[regulation]}

Layout: ${layout.name}
Dimensions: ${layout.dimensions.width}×${layout.dimensions.height} ${layout.dimensions.unit}
Zones: ${layout.zones.length}

Zone Details:
${layout.zones
  .map(
    (z) =>
      `- ${z.name} (${z.type}): ${z.size.width}×${z.size.height} at (${z.position.x}, ${z.position.y})`
  )
  .join("\n")}

Respond with JSON:
{
  "compliant": boolean,
  "issues": ["list of specific compliance issues"],
  "recommendations": ["specific recommendations to achieve compliance"]
}`,
    temperature: 0.2,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract compliance check JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Generate safety documentation
 */
export async function generateSafetyDocumentation(
  layout: LayoutData,
  analysis: SafetyAnalysis,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: SAFETY_SYSTEM_PROMPT,
    prompt: `Generate a comprehensive safety documentation report for this lab layout:

Layout: ${layout.name}
Overall Safety Score: ${analysis.overallScore}/100
Risk Level: ${analysis.riskLevel}

Critical Issues: ${analysis.issues.filter((i) => i.severity === "critical").length}
High Issues: ${analysis.issues.filter((i) => i.severity === "high").length}

Format as a professional safety report in Markdown with:
1. Executive Summary
2. Safety Score and Risk Assessment
3. Regulatory Compliance Status
4. Critical Issues and Required Actions
5. Medium/Low Priority Issues
6. Recommended Safety Improvements
7. Compliance Checklist
8. Emergency Procedures Recommendations

Include specific regulation references and actionable next steps.`,
    temperature: 0.3,
  });

  return text;
}
