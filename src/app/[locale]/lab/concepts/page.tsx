"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Wand2,
  Image as ImageIcon,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface ConceptImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  createdAt: Date;
}

export default function ConceptsPage() {
  const t = useTranslations("lab.concepts");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("flux-schnell");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<ConceptImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const models = [
    { id: "flux-schnell", name: "FLUX Schnell", speed: "Fast" },
    { id: "flux-pro", name: "FLUX Pro", speed: "High Quality" },
    { id: "sdxl", name: "Stable Diffusion XL", speed: "Balanced" },
    { id: "midjourney", name: "Midjourney V6", speed: "Artistic" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          type: "concept",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

      setImages((prev) => [
        {
          id: Date.now().toString(),
          prompt,
          imageUrl: data.imageUrl,
          model: selectedModel,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (image: ConceptImage) => {
    const response = await fetch(image.imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `concept-${image.id}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presetPrompts = [
    "Futuristic AI research center with holographic displays",
    "Minimalist workspace with robotic assistants",
    "Underground data center with neon lighting",
    "Open-plan creative tech lab with natural elements",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--neon-violet)]/20 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-[var(--neon-violet)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-[var(--muted-foreground)]">{t("description")}</p>
          </div>
        </div>

        {/* Generation Panel */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("promptLabel")}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("promptPlaceholder")}
                className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none resize-none"
              />
            </div>

            {/* Preset Prompts */}
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(preset)}
                  className="px-3 py-1 text-sm rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
                >
                  {preset.slice(0, 30)}...
                </button>
              ))}
            </div>

            {/* Model Selection */}
            <div className="flex flex-wrap gap-3">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedModel === model.id
                      ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                      : "border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/50"
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {model.speed}
                  </div>
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="neon-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {t("generate")}
                </>
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>
        </div>

        {/* Generated Images */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[var(--neon-cyan)]" />
              {t("generatedImages")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm text-white/80 line-clamp-2 mb-2">
                          {image.prompt}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(image)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPrompt(image.prompt)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-[var(--glass-border)]">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {image.model} • {image.createdAt.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
