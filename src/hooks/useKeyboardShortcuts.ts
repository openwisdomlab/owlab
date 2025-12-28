/**
 * Keyboard Shortcuts Hook
 */

import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if (isInputFocused) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (cmdOrCtrl && e.key === "z" && !e.shiftKey && handlers.onUndo) {
        e.preventDefault();
        handlers.onUndo();
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (
        ((cmdOrCtrl && e.key === "z" && e.shiftKey) ||
          (cmdOrCtrl && e.key === "y")) &&
        handlers.onRedo
      ) {
        e.preventDefault();
        handlers.onRedo();
      }

      // Copy: Cmd/Ctrl + C
      if (cmdOrCtrl && e.key === "c" && handlers.onCopy) {
        e.preventDefault();
        handlers.onCopy();
      }

      // Paste: Cmd/Ctrl + V
      if (cmdOrCtrl && e.key === "v" && handlers.onPaste) {
        e.preventDefault();
        handlers.onPaste();
      }

      // Delete: Delete or Backspace
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        handlers.onDelete
      ) {
        e.preventDefault();
        handlers.onDelete();
      }

      // Save: Cmd/Ctrl + S
      if (cmdOrCtrl && e.key === "s" && handlers.onSave) {
        e.preventDefault();
        handlers.onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
