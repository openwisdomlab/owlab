"use client";

import { useEffect } from "react";
import { useEmotionStore } from "@/stores/emotion-store";

export function EmotionProvider({ children }: { children: React.ReactNode }) {
    const { emotion } = useEmotionStore();

    useEffect(() => {
        // Apply emotion to html element
        document.documentElement.setAttribute("data-emotion", emotion);
    }, [emotion]);

    return <>{children}</>;
}
