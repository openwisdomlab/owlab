#!/usr/bin/env node

/**
 * Generate OWL Brand Visual Assets using Gemini API
 */

const API_URL = 'http://localhost:3000/api/ai/gemini-image';

const visualPrompts = {
  'owl-gaze': {
    description: 'Curious Owl - Gaze State',
    prompt: `Create a futuristic, playful illustration of a curious owl in "Gaze" state for OWL (Open Wisdom Lab).

Visual elements:
- Wide-open owl eyes with expanding pupils
- Sonar-like detection ripples emanating from the eyes
- Geometric hexagonal framework around the eye
- Energy particles flowing outward like curiosity beams
- Abstract, minimalist interpretation (not realistic owl)

Color scheme:
- Neon Blue (#2563EB) dominant
- Pink (#D91A7A) sparks and accents
- Dark background (#0E0E14)

Style:
- Geometric lattice framework + organic particle flow
- Not cold tech but warm, playful exploration
- Minimalist futuristic
- Curious, inviting, friendly feeling
- OWL brand aesthetic

Aspect ratio: 16:9`,
    aspectRatio: '16:9',
    imageSize: '2K'
  },

  'owl-spark': {
    description: 'Creative Owl - Spark State',
    prompt: `Create a futuristic, playful illustration of an owl in "Spark" state - the moment of creative insight for OWL (Open Wisdom Lab).

Visual elements:
- Owl eyes with star-burst particles exploding around them
- Geometric fragments flying outward
- Particles colliding in mid-air creating connection sparks
- Chaotic but beautiful composition
- Abstract, minimalist interpretation

Color scheme:
- Neon Pink (#D91A7A) and Blue (#2563EB) particles colliding
- Violet (#8B5CF6) flashes at collision points
- Dark background (#0E0E14)

Style:
- Explosive, dynamic energy
- Geometric + organic chaos
- Playful innovation, not serious tech
- "Aha!" moment feeling
- OWL brand aesthetic

Aspect ratio: 16:9`,
    aspectRatio: '16:9',
    imageSize: '2K'
  },

  'living-module-l01': {
    description: 'Living Module L01 - Space Shaping',
    prompt: `Create a futuristic illustration for "L01 Space Shaping - Neuroarchitecture" concept for OWL (Open Wisdom Lab).

Concept: How space shapes our thinking

Visual elements:
- Architectural wireframe structures (geometric lattice)
- Neural network particle flows along the architecture
- Particles forming "thought pathways" through the space
- Human silhouette interacting with the space
- Isometric or 3D perspective

Color scheme:
- Neon Blue (#2563EB) for rational space structure
- Cyan (#00D9FF) for innovation and activity
- Pink (#D91A7A) accents for human interaction
- Dark background (#0E0E14)

Style:
- Geometric architecture + organic thought flow
- Futuristic lab aesthetic
- Playful but sophisticated
- Shows relationship between space and mind
- OWL brand aesthetic

Aspect ratio: 16:9`,
    aspectRatio: '16:9',
    imageSize: '2K'
  },

  'm01-philosophy': {
    description: 'M01 Philosophy Module - Curiosity Foundation',
    prompt: `Create a futuristic illustration for "M01 Philosophy - Why Curiosity Matters" module for OWL (Open Wisdom Lab).

Concept: The foundation of curiosity and learning

Visual elements:
- Pyramid or layered structure showing levels of thinking
- Particles rising from bottom to top (emergence)
- Geometric framework with flowing energy inside
- Question marks transformed into geometric symbols
- Abstract representation of "asking questions"

Color scheme:
- Violet (#8B5CF6) as primary color (fusion of reason and creativity)
- Blue (#2563EB) for knowledge structure
- Pink (#D91A7A) for curiosity sparks
- Dark background (#0E0E14)

Style:
- Geometric pyramid/hierarchy + emergent particles
- Futuristic but warm and inviting
- Playful exploration, not rigid academia
- Foundation and depth feeling
- OWL brand aesthetic

Aspect ratio: 16:9`,
    aspectRatio: '16:9',
    imageSize: '2K'
  }
};

async function generateImage(key, config) {
  console.log(`\n🎨 Generating: ${config.description}`);
  console.log(`📝 Prompt length: ${config.prompt.length} chars`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptType: 'custom',
        prompt: config.prompt,
        aspectRatio: config.aspectRatio,
        imageSize: config.imageSize,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    }

    const data = await response.json();

    if (data.success) {
      console.log(`✅ Generated successfully`);
      console.log(`📊 Model: ${data.model}`);
      if (data.text) {
        console.log(`💬 Response: ${data.text}`);
      }

      // Note: imageData is base64, we're not saving it here
      // In real implementation, save to public/brand/generated/
      console.log(`📦 Image data received (${data.imageData.length} bytes)`);

      return {
        key,
        success: true,
        data
      };
    } else {
      throw new Error('Generation returned success: false');
    }
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return {
      key,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 OWL Brand Visual Generation');
  console.log('================================\n');

  const results = [];

  // Generate images sequentially to avoid overwhelming the API
  for (const [key, config] of Object.entries(visualPrompts)) {
    const result = await generateImage(key, config);
    results.push(result);

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log('\n\n📊 Generation Summary');
  console.log('====================');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log('\nFailed generations:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.key}: ${r.error}`);
    });
  }
}

main().catch(console.error);
