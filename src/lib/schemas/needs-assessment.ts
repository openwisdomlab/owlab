/**
 * Needs Assessment Schema — structured form data for the wizard's
 * first step where users describe their lab requirements.
 */
import { z } from "zod";
import { DisciplineSchema } from "./launcher";

export const BiosaftyLevelSchema = z.enum(["BSL-1", "BSL-2", "BSL-3"]);
export type BiosaftyLevel = z.infer<typeof BiosaftyLevelSchema>;

export const ISOCleanRoomClassSchema = z.enum(["ISO-5", "ISO-6", "ISO-7", "ISO-8"]);
export type ISOCleanRoomClass = z.infer<typeof ISOCleanRoomClassSchema>;

export const NeedsAssessmentSchema = z.object({
  // Basic info
  discipline: DisciplineSchema,
  subDisciplines: z.array(z.string()).max(3).default([]),
  projectName: z.string().min(1).default(""),

  // Space dimensions
  dimensions: z.object({
    width: z.number().min(3).max(100).default(20),
    height: z.number().min(3).max(100).default(15),
    unit: z.enum(["m", "ft"]).default("m"),
  }),

  // Capacity
  capacity: z.object({
    students: z.number().min(0).max(200).default(10),
    staff: z.number().min(0).max(50).default(3),
  }),

  // Budget
  budget: z.object({
    min: z.number().min(0).default(100000),
    max: z.number().min(0).default(500000),
    currency: z.enum(["CNY", "USD", "EUR"]).default("CNY"),
  }),

  // Special requirements (discipline-dependent)
  specialRequirements: z.object({
    biosafety: BiosaftyLevelSchema.optional(),
    cleanRoom: ISOCleanRoomClassSchema.optional(),
    vibrationIsolation: z.boolean().default(false),
    chemicalStorage: z.boolean().default(false),
    radioactiveStorage: z.boolean().default(false),
    highPowerCompute: z.boolean().default(false),
    heavyEquipment: z.boolean().default(false),
    noiseIsolation: z.boolean().default(false),
    dustControl: z.boolean().default(false),
  }),

  // Emotion goals (optional)
  emotionGoals: z.array(z.string()).default([]),

  // Additional notes
  notes: z.string().default(""),
});

export type NeedsAssessment = z.infer<typeof NeedsAssessmentSchema>;

/** Default values for the form */
export const DEFAULT_NEEDS_ASSESSMENT: NeedsAssessment = NeedsAssessmentSchema.parse({
  discipline: "digital-info",
  dimensions: {},
  capacity: {},
  budget: {},
  specialRequirements: {},
});

/** Which special requirement fields are relevant per discipline */
export const DISCIPLINE_REQUIREMENTS: Record<string, (keyof NeedsAssessment["specialRequirements"])[]> = {
  "life-health": ["biosafety", "cleanRoom", "chemicalStorage", "radioactiveStorage"],
  "deep-space-ocean": ["vibrationIsolation", "cleanRoom", "heavyEquipment"],
  "social-innovation": ["noiseIsolation"],
  "micro-nano": ["cleanRoom", "vibrationIsolation", "chemicalStorage", "dustControl"],
  "digital-info": ["highPowerCompute", "noiseIsolation"],
};

/** Chinese labels for special requirement fields */
export const SPECIAL_REQUIREMENT_LABELS: Record<string, string> = {
  biosafety: "生物安全等级",
  cleanRoom: "洁净室等级",
  vibrationIsolation: "隔振要求",
  chemicalStorage: "化学品储存",
  radioactiveStorage: "放射性储存",
  highPowerCompute: "高性能计算",
  heavyEquipment: "重型设备",
  noiseIsolation: "噪声隔离",
  dustControl: "粉尘控制",
};
