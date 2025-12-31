"use client";

import { motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";

interface KeyboardShortcutsDialogProps {
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ onClose }: KeyboardShortcutsDialogProps) {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const cmdKey = isMac ? "⌘" : "Ctrl";

  const shortcuts = [
    { category: "General", items: [
      { keys: [`${cmdKey}`, "Z"], action: "Undo" },
      { keys: [`${cmdKey}`, "Shift", "Z"], action: "Redo" },
      { keys: [`${cmdKey}`, "S"], action: "Save template" },
    ]},
    { category: "Zone Operations", items: [
      { keys: [`${cmdKey}`, "C"], action: "Copy selected zone" },
      { keys: [`${cmdKey}`, "V"], action: "Paste zone" },
      { keys: ["Delete"], action: "Delete selected zone" },
      { keys: ["Backspace"], action: "Delete selected zone" },
    ]},
    { category: "View Controls", items: [
      { keys: ["+", "/-"], action: "Zoom in/out" },
      { keys: ["G"], action: "Toggle grid" },
      { keys: ["M"], action: "Toggle measurement tools" },
      { keys: ["?"], action: "Show shortcuts" },
    ]},
    { category: "AI Design", items: [
      { keys: ["P"], action: "Parallel Universe Designer" },
      { keys: ["E"], action: "Emotion Design" },
    ]},
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[var(--neon-cyan)]" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--glass-bg)]"
                  >
                    <span className="text-sm">{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          <kbd className="px-2 py-1 text-xs font-mono rounded bg-[var(--background)] border border-[var(--glass-border)]">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-[var(--muted-foreground)]">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
          <p className="text-xs text-[var(--muted-foreground)] text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-[var(--background)] border border-[var(--glass-border)]">?</kbd> anytime to show this dialog
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
