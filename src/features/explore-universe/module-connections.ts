import { brandColors } from "@/lib/brand/colors";

// L module to M module relationship mapping
// L modules are "philosophy/theory" that power M modules "practice"
export const moduleConnections = {
  L01: {
    targets: ["M03", "M06"],
    color: brandColors.neonCyan,
    colorRgb: "0, 217, 255",
    stationRole: {
      zh: "生命维持核心",
      en: "Life Support Core",
    },
    description: {
      zh: "空间设计与安全的理论基础",
      en: "Theoretical foundation for space design and safety",
    },
  },
  L02: {
    targets: ["M04", "M05"],
    color: brandColors.violet,
    colorRgb: "139, 92, 246",
    stationRole: {
      zh: "神经链路",
      en: "Neural Link",
    },
    description: {
      zh: "AI增强认知与工具创新",
      en: "AI-enhanced cognition and tool innovation",
    },
  },
  L03: {
    targets: ["M02", "M08"],
    color: brandColors.emerald,
    colorRgb: "16, 185, 129",
    stationRole: {
      zh: "通讯枢纽",
      en: "Communication Hub",
    },
    description: {
      zh: "协作治理与运营支持",
      en: "Collaborative governance and operational support",
    },
  },
  L04: {
    targets: ["M05"],
    color: brandColors.neonPink,
    colorRgb: "217, 26, 122",
    stationRole: {
      zh: "创新坞",
      en: "Innovation Dock",
    },
    description: {
      zh: "具身工具与设计美学",
      en: "Embodied tools and design aesthetics",
    },
  },
};

// 3E framework as three decks
export const deckLayers = {
  enlighten: {
    id: "enlighten",
    label: { zh: "启智甲板", en: "Enlighten Deck" },
    description: { zh: "点燃好奇，打开视野", en: "Spark curiosity, open horizons" },
    modules: ["M01", "M02", "M03"],
    color: brandColors.neonCyan,
    colorRgb: "0, 217, 255",
  },
  empower: {
    id: "empower",
    label: { zh: "赋能甲板", en: "Empower Deck" },
    description: { zh: "提供方法，赋予能力", en: "Provide methods, empower abilities" },
    modules: ["M04", "M05", "M06"],
    color: brandColors.violet,
    colorRgb: "139, 92, 246",
  },
  engage: {
    id: "engage",
    label: { zh: "连接甲板", en: "Engage Deck" },
    description: { zh: "连接现实，产生影响", en: "Connect to reality, create impact" },
    modules: ["M07", "M08", "M09"],
    color: brandColors.neonPink,
    colorRgb: "217, 26, 122",
  },
};

// Get which L modules connect to a given M module (reverse lookup)
export function getConnectedLModules(mModuleId: string): string[] {
  const connected: string[] = [];
  for (const [lId, data] of Object.entries(moduleConnections)) {
    if (data.targets.includes(mModuleId)) {
      connected.push(lId);
    }
  }
  return connected;
}

// Get deck info for a given M module
export function getDeckForModule(moduleId: string): keyof typeof deckLayers | null {
  for (const [deckId, deck] of Object.entries(deckLayers)) {
    if (deck.modules.includes(moduleId)) {
      return deckId as keyof typeof deckLayers;
    }
  }
  return null;
}

// Blueprint layout coordinates (for SVG viewBox 1200x800)
export const blueprintLayout = {
  viewBox: { width: 1200, height: 800 },

  // L modules at four corners
  lModules: {
    L01: { x: 100, y: 120 },
    L02: { x: 1100, y: 120 },
    L03: { x: 100, y: 680 },
    L04: { x: 1100, y: 680 },
  },

  // M modules in 3x3 grid (center area)
  mModules: {
    // Enlighten deck (row 1)
    M01: { x: 400, y: 200, deck: "enlighten" },
    M02: { x: 600, y: 200, deck: "enlighten" },
    M03: { x: 800, y: 200, deck: "enlighten" },
    // Empower deck (row 2)
    M04: { x: 400, y: 400, deck: "empower" },
    M05: { x: 600, y: 400, deck: "empower" },
    M06: { x: 800, y: 400, deck: "empower" },
    // Engage deck (row 3)
    M07: { x: 400, y: 600, deck: "engage" },
    M08: { x: 600, y: 600, deck: "engage" },
    M09: { x: 800, y: 600, deck: "engage" },
  },

  // Deck divider Y positions
  deckDividers: {
    enlightenEmpower: 300,
    empowerEngage: 500,
  },

  // Central grid area
  gridArea: {
    x: 300,
    y: 130,
    width: 600,
    height: 540,
  },
};

// Recommended entry paths for different user types
export const recommendedPaths = [
  {
    id: "newcomer",
    module: "M01",
    philosophy: "L01",
    pathway: ["M01", "M06", "M03"],
    label: { zh: "新手入门", en: "New Explorer" },
    description: { zh: "从发射台开始探索之旅", en: "Start your journey from Launch Pad" },
  },
  {
    id: "builder",
    module: "M03",
    philosophy: "L01",
    pathway: ["M03", "M05", "M07"],
    label: { zh: "空间建设者", en: "Space Builder" },
    description: { zh: "直接进入空间站规划", en: "Jump into Space Station planning" },
  },
  {
    id: "operator",
    module: "M08",
    philosophy: "L03",
    pathway: ["M08", "M02", "M09"],
    label: { zh: "运营管理", en: "Operations" },
    description: { zh: "聚焦日常运营与管理", en: "Focus on daily operations" },
  },
];

// Living module metadata for blueprint display
export const livingModulesMeta = {
  L01: {
    name: "spaceAsEducator",
    icon: "SpaceIcon",
  },
  L02: {
    name: "extendedMind",
    icon: "MindIcon",
  },
  L03: {
    name: "emergentWisdom",
    icon: "EmergenceIcon",
  },
  L04: {
    name: "poeticsOfTechnology",
    icon: "PoeticsIcon",
  },
};
