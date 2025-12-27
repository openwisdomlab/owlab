// Image Generation Prompt Templates

export const LAB_LAYOUT_IMAGE_PROMPT = (description: string) => `
Architectural floor plan render, top-down view of an AI research laboratory:
${description}

Style: Clean architectural blueprint with modern aesthetic, professional CAD-like rendering,
soft blue and cyan color scheme, grid overlay, measurement annotations,
high contrast, detailed equipment placement, professional lighting,
photorealistic 3D architectural visualization

Quality: Ultra high definition, 8K, professional architectural rendering
`;

export const CONCEPT_DIAGRAM_IMAGE_PROMPT = (concept: string) => `
Futuristic concept visualization of AI research space:
${concept}

Style: Cyberpunk aesthetic, neon accents in cyan and violet,
glass and steel architecture, holographic displays,
dramatic lighting with volumetric rays, depth of field,
cinematic composition, trending on artstation

Quality: Ultra detailed, 4K, concept art, digital painting
`;

export const ISOMETRIC_LAB_PROMPT = (features: string) => `
Isometric 3D illustration of an AI laboratory:
${features}

Style: Clean isometric design, soft shadows, pastel tech colors,
minimalist modern aesthetic, glass surfaces, LED accent lighting,
organized equipment layout, small human figures for scale,
vector-style 3D rendering

Quality: High detail, clean lines, professional illustration
`;

export const WORKSPACE_RENDER_PROMPT = (description: string) => `
Interior design visualization of AI workspace:
${description}

Style: Modern tech office aesthetic, natural lighting through large windows,
ergonomic furniture, multiple monitor setups, indoor plants,
concrete and wood textures, ambient lighting, clean and organized,
architectural photography style

Quality: Photorealistic, high resolution, interior design magazine quality
`;

export const NEGATIVE_PROMPTS = {
  architectural: "blurry, distorted, low quality, cartoon, anime, sketch, watermark, text, people, faces",
  concept: "blurry, low quality, distorted proportions, text overlay, watermark, amateur",
  isometric: "perspective distortion, uneven angles, blurry, low resolution, messy",
  interior: "blurry, distorted, fisheye, low quality, cluttered, dirty, old, damaged",
};
