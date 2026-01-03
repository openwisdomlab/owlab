import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Emotion = "default" | "calm" | "energetic" | "creative";

interface EmotionState {
    emotion: Emotion;
    setEmotion: (emotion: Emotion) => void;
}

export const useEmotionStore = create<EmotionState>()(
    persist(
        (set) => ({
            emotion: "default",
            setEmotion: (emotion) => set({ emotion }),
        }),
        {
            name: "owl-emotion-storage",
        }
    )
);
