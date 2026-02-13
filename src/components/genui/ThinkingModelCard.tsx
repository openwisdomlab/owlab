"use client";

import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";

export interface ThinkingModelCardProps {
  title: string;
  concept: string;
  explanation: string;
  followUpQuestions?: string[];
}

/**
 * GenUI component rendered inline in chat when AI explains a complex concept.
 * Maintains the OWL sci-fi / neon aesthetic.
 */
export function ThinkingModelCard({
  title,
  concept,
  explanation,
  followUpQuestions,
}: ThinkingModelCardProps) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden my-2"
      style={{
        background:
          "linear-gradient(145deg, rgba(14,14,20,0.95), rgba(20,20,35,0.9))",
        border: "1px solid rgba(0, 217, 255, 0.25)",
        boxShadow:
          "0 0 20px rgba(0, 217, 255, 0.08), 0 4px 20px rgba(0,0,0,0.1)",
      }}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Top accent bar */}
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(90deg, #00D9FF, #8B5CF6, #D91A7A)",
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,217,255,0.15), rgba(139,92,246,0.1))",
              border: "1px solid rgba(0,217,255,0.3)",
            }}
          >
            <Lightbulb className="w-4 h-4" style={{ color: "#00D9FF" }} />
          </div>
          <div>
            <p
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: "rgba(0,217,255,0.7)" }}
            >
              {title}
            </p>
            <h4
              className="text-sm font-bold"
              style={{
                background: "linear-gradient(90deg, #00D9FF, #8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {concept}
            </h4>
          </div>
        </div>

        {/* Explanation */}
        <div
          className="rounded-lg p-3 mb-3"
          style={{
            background: "rgba(0, 217, 255, 0.04)",
            border: "1px solid rgba(0, 217, 255, 0.1)",
          }}
        >
          <p
            className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {explanation}
          </p>
        </div>

        {/* Follow-up questions */}
        {followUpQuestions && followUpQuestions.length > 0 && (
          <div>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Explore further:
            </p>
            <ul className="space-y-1.5">
              {followUpQuestions.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-xs"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  <ChevronRight
                    className="w-3 h-3 mt-0.5 shrink-0"
                    style={{ color: "#8B5CF6" }}
                  />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
