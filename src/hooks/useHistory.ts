/**
 * useHistory Hook - Provides undo/redo functionality for any state
 */

import { useState, useCallback } from "react";

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

const MAX_HISTORY_SIZE = 50;

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      const resolvedState =
        typeof newState === "function"
          ? (newState as (prev: T) => T)(history[currentIndex])
          : newState;

      // Remove any future history when making a new change
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(resolvedState);

      // Limit history size to prevent memory issues
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
      } else {
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
      }
    },
    [history, currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const clear = useCallback(() => {
    setHistory([history[currentIndex]]);
    setCurrentIndex(0);
  }, [history, currentIndex]);

  return {
    state: history[currentIndex],
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clear,
  };
}
