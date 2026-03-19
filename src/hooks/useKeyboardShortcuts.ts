import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import type { AnatomicalSystem } from "../types/anatomy";

const SYSTEM_KEYS: Record<string, AnatomicalSystem> = {
  "1": "skeletal",
  "2": "muscular",
  "3": "arterial",
  "4": "venous",
  "5": "nervous",
  "6": "lymphatic",
  "7": "organs",
  "8": "fascia",
  "9": "spaces",
};

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "/") {
        e.preventDefault();
        useAppStore.getState().setSearchOpen(true);
        return;
      }

      if (e.key === "Escape") {
        const state = useAppStore.getState();
        if (state.searchOpen) {
          state.setSearchOpen(false);
        } else if (state.selectedStructure) {
          state.setSelectedStructure(null);
          state.setDetailPanelOpen(false);
        }
        state.setHighlightedStructures([]);
        return;
      }

      const system = SYSTEM_KEYS[e.key];
      if (system) {
        useAppStore.getState().toggleSystem(system);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
