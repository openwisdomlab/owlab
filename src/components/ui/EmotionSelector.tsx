"use client";

import { useEmotionStore, type Emotion } from "@/stores/emotion-store";
import { Palette, Leaf, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const EMOTIONS: { id: Emotion; label: string; icon: any; color: string }[] = [
    { id: "default", label: "Owl (Default)", icon: Palette, color: "var(--neon-blue)" },
    { id: "calm", label: "Forest (Calm)", icon: Leaf, color: "#10B981" },
    { id: "energetic", label: "Solar (Energetic)", icon: Zap, color: "#F97316" },
    { id: "creative", label: "Nebula (Creative)", icon: Sparkles, color: "#A855F7" },
];

export function EmotionSelector() {
    const { emotion, setEmotion } = useEmotionStore();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentEmotion = EMOTIONS.find((e) => e.id === emotion) || EMOTIONS[0];
    const Icon = currentEmotion.icon;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors flex items-center gap-2"
                title="Change Mood"
            >
                <Icon className="w-5 h-5" style={{ color: currentEmotion.color }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 glass-card p-2 z-50 flex flex-col gap-1 shadow-xl"
                    >
                        {EMOTIONS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setEmotion(item.id);
                                    setIsOpen(false);
                                }}
                                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                  ${emotion === item.id ? "bg-[var(--glass-bg)]" : "hover:bg-[var(--glass-bg)]"}
                `}
                            >
                                <item.icon className="w-4 h-4" style={{ color: item.id === "default" && emotion !== "default" ? "inherit" : item.color }} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
