/**
 * OWL Brand Colors
 * Visual Identity System v1.0
 */

export const brandColors = {
  // Core Colors
  neonPink: '#D91A7A',
  blue: '#2563EB',
  dark: '#0E0E14',

  // Auxiliary Colors (use sparingly)
  neonCyan: '#00D9FF',
  violet: '#8B5CF6',
  emerald: '#10B981',
  orange: '#F97316',
  amber: '#F59E0B',
  purple: '#A855F7',
  slate: '#64748B',
  cyan: '#06B6D4',
  green: '#059669',

  // Module-specific colors
  modules: {
    M01: '#8B5CF6', // Violet - Philosophy
    M02: '#00D9FF', // Cyan - Governance
    M03: '#10B981', // Emerald - Space
    M04: '#F97316', // Orange - Programs
    M05: '#06B6D4', // Cyan - Tools
    M06: '#059669', // Green - Safety
    M07: '#F59E0B', // Amber - People
    M08: '#64748B', // Slate - Operations
    M09: '#A855F7', // Purple - Assessment
  },

  // Owl States
  states: {
    gaze: {
      primary: '#2563EB',  // Blue (insight)
      accent: '#D91A7A',   // Pink (excitement)
    },
    spark: {
      primary: '#D91A7A',  // Pink
      secondary: '#2563EB', // Blue
      collision: '#8B5CF6', // Violet (fusion)
    },
    connect: {
      spectrum: ['#D91A7A', '#8B5CF6', '#2563EB', '#00D9FF'], // Gradient
    },
    flight: {
      primary: '#D91A7A',  // Pink (action)
      trail: '#00D9FF',    // Cyan (innovation)
    },
    share: {
      spectrum: ['#D91A7A', '#8B5CF6', '#2563EB', '#00D9FF'], // Full spectrum
    },
  },
} as const;

// Type-safe color keys
export type BrandColor = keyof typeof brandColors;
export type ModuleId = keyof typeof brandColors.modules;
export type OwlState = keyof typeof brandColors.states;

/**
 * Get module color by ID
 */
export function getModuleColor(moduleId: string): string {
  const key = moduleId.toUpperCase() as ModuleId;
  return brandColors.modules[key] || brandColors.blue;
}

/**
 * Create gradient from color array
 */
export function createGradient(colors: string[], angle = 90): string {
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
}

/**
 * Add alpha channel to hex color
 */
export function withAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
