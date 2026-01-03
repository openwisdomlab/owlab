"use client";

import { useTranslations } from "next-intl";
import { KnowledgeGraph } from "@/components/docs/KnowledgeGraph";

export default function KnowledgeMapPage() {
    const t = useTranslations("docs");

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Knowledge Graph</h1>
                <p className="text-[var(--muted-foreground)]">
                    Explore the relationships between the 9 core modules of the Open Wisdom Lab.
                </p>
            </div>

            <div className="h-[70vh] w-full">
                <KnowledgeGraph
                    interactive={true}
                    className="w-full h-full shadow-lg"
                />
            </div>
        </div>
    );
}
