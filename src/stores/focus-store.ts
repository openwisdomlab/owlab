import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FocusState {
    isFocusMode: boolean;
    setFocusMode: (value: boolean) => void;
    toggleFocusMode: () => void;
}

export const useFocusStore = create<FocusState>()(
    persist(
        (set) => ({
            isFocusMode: false,
            setFocusMode: (value) => set({ isFocusMode: value }),
            toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
        }),
        {
            name: "owl-focus-mode",
        }
    )
);
