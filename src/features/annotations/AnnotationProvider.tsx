"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAnnotationStore } from "@/stores/annotation-store";
import { AnnotationDialog } from "./AnnotationDialog";
import { AnnotationPanel } from "./AnnotationPanel";
import { useTranslations } from "next-intl";

interface AnnotationContextType {
  pageId: string;
  isSelecting: boolean;
}

const AnnotationContext = createContext<AnnotationContextType>({
  pageId: "",
  isSelecting: false,
});

export function useAnnotationContext() {
  return useContext(AnnotationContext);
}

interface AnnotationProviderProps {
  children: ReactNode;
}

export function AnnotationProvider({ children }: AnnotationProviderProps) {
  const pathname = usePathname();
  const t = useTranslations("annotations");
  const { isPanelOpen, togglePanel, getAnnotationsForPage } = useAnnotationStore();

  const [selectedText, setSelectedText] = useState("");
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false);

  // Capture text selection
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      // Small delay to allow clicking the floating button before hiding
      setTimeout(() => {
        const currentSelection = window.getSelection();
        if (!currentSelection || currentSelection.isCollapsed) {
          setShowFloatingButton(false);
          setSelectedText("");
        }
      }, 200);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) return; // Minimum selection length

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setFloatingPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowFloatingButton(true);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const handleAddAnnotation = () => {
    if (selectedText) {
      setShowDialog(true);
      setShowFloatingButton(false);
    }
  };

  const handleOpenDialogFromPanel = () => {
    // When triggered from panel with no selection, prompt user
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setShowDialog(true);
    } else {
      setSelectedText("");
      setShowDialog(true);
    }
  };

  const pageAnnotationCount = getAnnotationsForPage(pathname).length;

  return (
    <AnnotationContext.Provider
      value={{ pageId: pathname, isSelecting: showFloatingButton }}
    >
      <div className="relative flex flex-1 min-w-0">
        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Annotation Panel (side) */}
        <AnnotationPanel
          pageId={pathname}
          onAddAnnotation={handleOpenDialogFromPanel}
        />
      </div>

      {/* Floating "Add Annotation" button on text selection */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.button
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            onClick={handleAddAnnotation}
            className="
              fixed z-50 flex items-center gap-1.5
              px-3 py-1.5 rounded-full
              bg-[var(--neon-cyan)]/20 backdrop-blur-xl
              border border-[var(--neon-cyan)]/40
              text-[var(--neon-cyan)] text-xs font-medium
              hover:bg-[var(--neon-cyan)]/30
              shadow-lg shadow-[var(--neon-cyan)]/10
              transition-colors cursor-pointer
            "
            style={{
              left: `${floatingPosition.x}px`,
              top: `${floatingPosition.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            {t("add")}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toggle panel button (fixed) */}
      <motion.button
        onClick={togglePanel}
        className="
          fixed bottom-6 right-6 z-40
          flex items-center gap-2 px-4 py-2.5
          rounded-full border shadow-lg
          bg-[var(--background)]/90 backdrop-blur-xl
          border-[var(--glass-border)]
          hover:border-[var(--neon-cyan)]/50
          hover:shadow-[var(--neon-cyan)]/10
          transition-all
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-4 h-4 text-[var(--neon-cyan)]" />
        <span className="text-xs font-medium">{t("title")}</span>
        {pageAnnotationCount > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] font-semibold">
            {pageAnnotationCount}
          </span>
        )}
      </motion.button>

      {/* Annotation Dialog */}
      <AnimatePresence>
        {showDialog && (
          <AnnotationDialog
            pageId={pathname}
            selectedText={selectedText || t("noSelection")}
            onClose={() => {
              setShowDialog(false);
              setSelectedText("");
            }}
          />
        )}
      </AnimatePresence>
    </AnnotationContext.Provider>
  );
}
