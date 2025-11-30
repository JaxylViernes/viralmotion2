import { useState, useCallback, useRef } from "react";
import { type Layer } from "../../remotion_compositions/DynamicLayerComposition";
import { MAX_HISTORY_SIZE } from "../constants";

export const useHistoryState = (initialLayers: Layer[]) => {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [history, setHistory] = useState<Layer[][]>([initialLayers]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoAction = useRef(false);

  const pushState = useCallback((newLayers: Layer[]) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      setLayers(newLayers);
      return;
    }

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newLayers);
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
      }
      return newHistory;
    });
    setHistoryIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= MAX_HISTORY_SIZE ? MAX_HISTORY_SIZE - 1 : newIndex;
    });
    setLayers(newLayers);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex]);
    }
  }, [historyIndex, history]);

  const resetHistory = useCallback((newLayers: Layer[]) => {
    setLayers(newLayers);
    setHistory([newLayers]);
    setHistoryIndex(0);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    layers,
    pushState,
    undo,
    redo,
    resetHistory,
    canUndo,
    canRedo,
  };
};