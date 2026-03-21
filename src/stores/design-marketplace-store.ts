import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Design Marketplace Types
// ============================================

export type MarketplaceCategory =
  | "makerspace"
  | "stem-lab"
  | "art-studio"
  | "science-lab"
  | "multi-purpose"
  | "outdoor";

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  thumbnail: string;
  category: MarketplaceCategory;
  tags: string[];
  zones: number;
  size: { width: number; height: number };
  likes: number;
  forks: number;
  createdAt: string;
  layoutData: string; // JSON stringified LayoutData
}

// ============================================
// Category Metadata
// ============================================

export const CATEGORY_COLORS: Record<MarketplaceCategory, string> = {
  makerspace: "#F97316",
  "stem-lab": "#3B82F6",
  "art-studio": "#A855F7",
  "science-lab": "#22C55E",
  "multi-purpose": "#06B6D4",
  outdoor: "#10B981",
};

export const CATEGORY_LABELS_ZH: Record<MarketplaceCategory, string> = {
  makerspace: "创客空间",
  "stem-lab": "STEM 实验室",
  "art-studio": "艺术工作室",
  "science-lab": "科学实验室",
  "multi-purpose": "多功能空间",
  outdoor: "户外空间",
};

export const CATEGORY_LABELS_EN: Record<MarketplaceCategory, string> = {
  makerspace: "Makerspace",
  "stem-lab": "STEM Lab",
  "art-studio": "Art Studio",
  "science-lab": "Science Lab",
  "multi-purpose": "Multi-Purpose",
  outdoor: "Outdoor",
};

// ============================================
// Sample Templates
// ============================================

const SAMPLE_TEMPLATES: DesignTemplate[] = [
  {
    id: uuidv4(),
    name: "Starter Makerspace",
    description:
      "A compact makerspace for 15-20 students with 3D printing, electronics, and woodworking zones. Perfect for schools starting their maker journey.",
    author: "OWL Team",
    thumbnail: "",
    category: "makerspace",
    tags: ["3d-printing", "electronics", "woodworking", "beginner"],
    zones: 5,
    size: { width: 12, height: 10 },
    likes: 42,
    forks: 18,
    createdAt: "2025-11-15T08:00:00Z",
    layoutData: JSON.stringify({
      name: "Starter Makerspace",
      description: "Compact makerspace with essential maker zones",
      dimensions: { width: 12, height: 10, unit: "m" },
      zones: [
        { id: "z1", name: "3D Printing Station", type: "workspace", position: { x: 0, y: 0 }, size: { width: 4, height: 4 }, color: "#F97316", equipment: ["3D Printer x2", "Filament Storage"] },
        { id: "z2", name: "Electronics Bench", type: "workspace", position: { x: 5, y: 0 }, size: { width: 4, height: 3 }, color: "#3B82F6", equipment: ["Soldering Station x4", "Oscilloscope"] },
        { id: "z3", name: "Woodworking Area", type: "workspace", position: { x: 0, y: 5 }, size: { width: 5, height: 5 }, color: "#8B5CF6", equipment: ["Workbench x2", "Band Saw", "Drill Press"] },
        { id: "z4", name: "Tool Storage", type: "storage", position: { x: 10, y: 0 }, size: { width: 2, height: 5 }, color: "#6B7280" },
        { id: "z5", name: "Entrance & Display", type: "entrance", position: { x: 6, y: 5 }, size: { width: 6, height: 5 }, color: "#10B981" },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "Advanced STEM Lab",
    description:
      "Full-featured STEM laboratory supporting robotics, biotech, and computational science. Designed for 30+ students with dedicated compute cluster.",
    author: "Dr. Chen",
    thumbnail: "",
    category: "stem-lab",
    tags: ["robotics", "biotech", "computing", "advanced"],
    zones: 6,
    size: { width: 20, height: 15 },
    likes: 87,
    forks: 34,
    createdAt: "2025-10-20T10:00:00Z",
    layoutData: JSON.stringify({
      name: "Advanced STEM Lab",
      description: "Full-featured STEM laboratory for robotics, biotech, and CS",
      dimensions: { width: 20, height: 15, unit: "m" },
      zones: [
        { id: "z1", name: "Robotics Arena", type: "workspace", position: { x: 0, y: 0 }, size: { width: 8, height: 7 }, color: "#3B82F6", equipment: ["Robot Kit x10", "Competition Arena"] },
        { id: "z2", name: "Biotech Station", type: "workspace", position: { x: 9, y: 0 }, size: { width: 6, height: 5 }, color: "#22C55E", equipment: ["Microscope x6", "Centrifuge", "PCR Machine"] },
        { id: "z3", name: "Compute Cluster", type: "compute", position: { x: 16, y: 0 }, size: { width: 4, height: 5 }, color: "#06B6D4", equipment: ["Server Rack", "Workstation x8"] },
        { id: "z4", name: "Collaboration Zone", type: "meeting", position: { x: 0, y: 8 }, size: { width: 6, height: 7 }, color: "#F59E0B" },
        { id: "z5", name: "Equipment Storage", type: "storage", position: { x: 7, y: 8 }, size: { width: 4, height: 7 }, color: "#6B7280" },
        { id: "z6", name: "Presentation Area", type: "meeting", position: { x: 12, y: 6 }, size: { width: 8, height: 9 }, color: "#A855F7" },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "Digital Art Studio",
    description:
      "Creative studio blending digital and traditional art. Includes VR stations, digital drawing tablets, and a gallery exhibition space.",
    author: "Maria K.",
    thumbnail: "",
    category: "art-studio",
    tags: ["digital-art", "vr", "gallery", "creative"],
    zones: 5,
    size: { width: 15, height: 12 },
    likes: 63,
    forks: 21,
    createdAt: "2025-12-01T14:00:00Z",
    layoutData: JSON.stringify({
      name: "Digital Art Studio",
      description: "Creative studio with digital and traditional art zones",
      dimensions: { width: 15, height: 12, unit: "m" },
      zones: [
        { id: "z1", name: "Digital Drawing Lab", type: "workspace", position: { x: 0, y: 0 }, size: { width: 6, height: 5 }, color: "#A855F7", equipment: ["Drawing Tablet x8", "iMac x8"] },
        { id: "z2", name: "VR Creation Pod", type: "workspace", position: { x: 7, y: 0 }, size: { width: 4, height: 5 }, color: "#EC4899", equipment: ["VR Headset x4", "Motion Capture"] },
        { id: "z3", name: "Traditional Art Corner", type: "workspace", position: { x: 12, y: 0 }, size: { width: 3, height: 5 }, color: "#F97316", equipment: ["Easel x6", "Supply Cabinet"] },
        { id: "z4", name: "Gallery Space", type: "meeting", position: { x: 0, y: 6 }, size: { width: 10, height: 6 }, color: "#1E293B" },
        { id: "z5", name: "Critique Lounge", type: "meeting", position: { x: 11, y: 6 }, size: { width: 4, height: 6 }, color: "#06B6D4" },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "Chemistry & Physics Lab",
    description:
      "Safety-first science lab with fume hoods, experiment benches, and a dedicated demonstration area. Supports hands-on inquiry-based learning.",
    author: "Prof. Li",
    thumbnail: "",
    category: "science-lab",
    tags: ["chemistry", "physics", "safety", "inquiry"],
    zones: 6,
    size: { width: 18, height: 12 },
    likes: 55,
    forks: 27,
    createdAt: "2025-09-10T09:00:00Z",
    layoutData: JSON.stringify({
      name: "Chemistry & Physics Lab",
      description: "Safety-first science lab for inquiry-based learning",
      dimensions: { width: 18, height: 12, unit: "m" },
      zones: [
        { id: "z1", name: "Experiment Benches", type: "workspace", position: { x: 0, y: 0 }, size: { width: 10, height: 6 }, color: "#22C55E", equipment: ["Lab Bench x6", "Gas Outlet x12", "Sink x6"] },
        { id: "z2", name: "Fume Hood Area", type: "utility", position: { x: 11, y: 0 }, size: { width: 4, height: 4 }, color: "#EF4444", equipment: ["Fume Hood x3", "Eye Wash Station"] },
        { id: "z3", name: "Demo Stage", type: "meeting", position: { x: 0, y: 7 }, size: { width: 8, height: 5 }, color: "#3B82F6" },
        { id: "z4", name: "Safety Station", type: "utility", position: { x: 16, y: 0 }, size: { width: 2, height: 4 }, color: "#F59E0B", equipment: ["Fire Extinguisher", "First Aid Kit", "Safety Shower"] },
        { id: "z5", name: "Chemical Storage", type: "storage", position: { x: 11, y: 5 }, size: { width: 4, height: 3 }, color: "#6B7280", equipment: ["Chemical Cabinet x4", "Spill Kit"] },
        { id: "z6", name: "Data Analysis Nook", type: "compute", position: { x: 9, y: 7 }, size: { width: 5, height: 5 }, color: "#06B6D4", equipment: ["Laptop x8", "Projector"] },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "Flexible Learning Hub",
    description:
      "Modular multi-purpose space with moveable partitions, configurable furniture, and zones that transform from lecture hall to workshop in minutes.",
    author: "Design Team A",
    thumbnail: "",
    category: "multi-purpose",
    tags: ["flexible", "modular", "configurable", "inclusive"],
    zones: 4,
    size: { width: 16, height: 12 },
    likes: 71,
    forks: 29,
    createdAt: "2025-08-25T12:00:00Z",
    layoutData: JSON.stringify({
      name: "Flexible Learning Hub",
      description: "Modular space with configurable zones",
      dimensions: { width: 16, height: 12, unit: "m" },
      zones: [
        { id: "z1", name: "Main Hall (Configurable)", type: "workspace", position: { x: 0, y: 0 }, size: { width: 10, height: 8 }, color: "#06B6D4", equipment: ["Modular Desk x20", "Mobile Whiteboard x6"] },
        { id: "z2", name: "Breakout Pods", type: "meeting", position: { x: 11, y: 0 }, size: { width: 5, height: 5 }, color: "#A855F7", equipment: ["Bean Bag x8", "Standing Desk x4"] },
        { id: "z3", name: "Tech Corner", type: "compute", position: { x: 11, y: 6 }, size: { width: 5, height: 6 }, color: "#3B82F6", equipment: ["All-in-One PC x6", "3D Printer"] },
        { id: "z4", name: "Storage & Entry", type: "storage", position: { x: 0, y: 9 }, size: { width: 10, height: 3 }, color: "#6B7280" },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "Nature Discovery Garden",
    description:
      "Outdoor learning environment with weather stations, planting zones, observation areas, and a covered workshop pavilion. Connects STEM with ecology.",
    author: "Green Ed Lab",
    thumbnail: "",
    category: "outdoor",
    tags: ["ecology", "garden", "weather", "nature"],
    zones: 5,
    size: { width: 25, height: 20 },
    likes: 39,
    forks: 12,
    createdAt: "2026-01-05T07:00:00Z",
    layoutData: JSON.stringify({
      name: "Nature Discovery Garden",
      description: "Outdoor learning environment connecting STEM with ecology",
      dimensions: { width: 25, height: 20, unit: "m" },
      zones: [
        { id: "z1", name: "Planting Beds", type: "workspace", position: { x: 0, y: 0 }, size: { width: 10, height: 8 }, color: "#22C55E", equipment: ["Raised Bed x8", "Irrigation System", "Tool Shed"] },
        { id: "z2", name: "Weather Station", type: "utility", position: { x: 12, y: 0 }, size: { width: 4, height: 4 }, color: "#06B6D4", equipment: ["Weather Station Kit", "Data Logger"] },
        { id: "z3", name: "Observation Deck", type: "meeting", position: { x: 18, y: 0 }, size: { width: 7, height: 8 }, color: "#F59E0B", equipment: ["Binoculars x6", "Field Guide Set"] },
        { id: "z4", name: "Covered Workshop", type: "workspace", position: { x: 0, y: 10 }, size: { width: 12, height: 10 }, color: "#8B5CF6", equipment: ["Workbench x4", "Microscope x4", "Solar Panel Demo"] },
        { id: "z5", name: "Amphitheater", type: "meeting", position: { x: 14, y: 10 }, size: { width: 11, height: 10 }, color: "#10B981" },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "AI & Robotics Academy",
    description:
      "Dedicated space for AI education with GPU workstations, robot assembly bays, and a testing arena. Features streaming capability for remote learning.",
    author: "TechEd Foundation",
    thumbnail: "",
    category: "stem-lab",
    tags: ["ai", "robotics", "gpu", "remote-learning"],
    zones: 5,
    size: { width: 18, height: 14 },
    likes: 93,
    forks: 41,
    createdAt: "2026-02-14T11:00:00Z",
    layoutData: JSON.stringify({
      name: "AI & Robotics Academy",
      description: "Dedicated AI education space with GPU workstations and robot bays",
      dimensions: { width: 18, height: 14, unit: "m" },
      zones: [
        { id: "z1", name: "GPU Workstation Lab", type: "compute", position: { x: 0, y: 0 }, size: { width: 8, height: 6 }, color: "#3B82F6", equipment: ["GPU Workstation x12", "Monitor x12", "UPS"] },
        { id: "z2", name: "Robot Assembly Bay", type: "workspace", position: { x: 9, y: 0 }, size: { width: 9, height: 6 }, color: "#F97316", equipment: ["Assembly Bench x6", "Parts Storage", "3D Printer x2"] },
        { id: "z3", name: "Testing Arena", type: "workspace", position: { x: 0, y: 7 }, size: { width: 10, height: 7 }, color: "#22C55E", equipment: ["Competition Field", "Safety Barrier", "Scoring System"] },
        { id: "z4", name: "Streaming Studio", type: "meeting", position: { x: 11, y: 7 }, size: { width: 4, height: 7 }, color: "#A855F7", equipment: ["Camera x3", "Green Screen", "Mic Kit"] },
        { id: "z5", name: "Lounge & Library", type: "meeting", position: { x: 16, y: 7 }, size: { width: 2, height: 7 }, color: "#06B6D4" },
      ],
    }),
  },
  {
    id: uuidv4(),
    name: "Community Repair Cafe",
    description:
      "Community-oriented repair and upcycling workshop. Encourages sustainability through hands-on fixing, with tool libraries and mentoring stations.",
    author: "Repair Network",
    thumbnail: "",
    category: "makerspace",
    tags: ["repair", "sustainability", "community", "upcycling"],
    zones: 5,
    size: { width: 14, height: 10 },
    likes: 48,
    forks: 15,
    createdAt: "2025-12-20T16:00:00Z",
    layoutData: JSON.stringify({
      name: "Community Repair Cafe",
      description: "Community repair and upcycling workshop",
      dimensions: { width: 14, height: 10, unit: "m" },
      zones: [
        { id: "z1", name: "Electronics Repair", type: "workspace", position: { x: 0, y: 0 }, size: { width: 5, height: 5 }, color: "#3B82F6", equipment: ["Soldering Station x4", "Multimeter x4", "Hot Air Gun x2"] },
        { id: "z2", name: "Textile & Sewing", type: "workspace", position: { x: 6, y: 0 }, size: { width: 4, height: 5 }, color: "#EC4899", equipment: ["Sewing Machine x3", "Serger", "Fabric Storage"] },
        { id: "z3", name: "Mechanical Repair", type: "workspace", position: { x: 11, y: 0 }, size: { width: 3, height: 5 }, color: "#F97316", equipment: ["Tool Wall", "Bike Stand x2", "Workbench x2"] },
        { id: "z4", name: "Tool Library", type: "storage", position: { x: 0, y: 6 }, size: { width: 5, height: 4 }, color: "#6B7280", equipment: ["Tool Cabinet x6", "Lending System"] },
        { id: "z5", name: "Cafe & Welcome", type: "entrance", position: { x: 6, y: 6 }, size: { width: 8, height: 4 }, color: "#10B981", equipment: ["Coffee Machine", "Info Desk", "Display Board"] },
      ],
    }),
  },
];

// ============================================
// Store Interface
// ============================================

export type SortOption = "newest" | "popular" | "most-forked";

interface DesignMarketplaceState {
  templates: DesignTemplate[];
  likedIds: string[];

  // Actions
  addTemplate: (
    template: Omit<DesignTemplate, "id" | "likes" | "forks" | "createdAt">
  ) => string;
  removeTemplate: (id: string) => void;
  likeTemplate: (id: string) => void;
  unlikeTemplate: (id: string) => void;
  forkTemplate: (id: string) => DesignTemplate | undefined;
  getByCategory: (category: MarketplaceCategory) => DesignTemplate[];
  getTemplate: (id: string) => DesignTemplate | undefined;
}

// ============================================
// Store Implementation
// ============================================

export const useDesignMarketplaceStore = create<DesignMarketplaceState>()(
  persist(
    (set, get) => ({
      templates: SAMPLE_TEMPLATES,
      likedIds: [],

      addTemplate: (templateData) => {
        const id = uuidv4();
        const template: DesignTemplate = {
          ...templateData,
          id,
          likes: 0,
          forks: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          templates: [template, ...state.templates],
        }));
        return id;
      },

      removeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          likedIds: state.likedIds.filter((lid) => lid !== id),
        }));
      },

      likeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, likes: t.likes + 1 } : t
          ),
          likedIds: [...state.likedIds, id],
        }));
      },

      unlikeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, likes: Math.max(0, t.likes - 1) } : t
          ),
          likedIds: state.likedIds.filter((lid) => lid !== id),
        }));
      },

      forkTemplate: (id) => {
        const original = get().templates.find((t) => t.id === id);
        if (!original) return undefined;

        const forkedId = uuidv4();
        const forked: DesignTemplate = {
          ...original,
          id: forkedId,
          name: `${original.name} (Fork)`,
          author: "You",
          likes: 0,
          forks: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          templates: [forked, ...state.templates],
          // Increment fork count on original
        }));

        // Increment fork count on original
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, forks: t.forks + 1 } : t
          ),
        }));

        return forked;
      },

      getByCategory: (category) => {
        return get().templates.filter((t) => t.category === category);
      },

      getTemplate: (id) => {
        return get().templates.find((t) => t.id === id);
      },
    }),
    {
      name: "owl-design-marketplace",
      partialize: (state) => ({
        templates: state.templates,
        likedIds: state.likedIds,
      }),
    }
  )
);
