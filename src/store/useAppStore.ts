import { create } from "zustand";
import type { AnatomicalSystem, StructureInfo } from "../types/anatomy";

interface AppState {
  // System visibility
  visibleSystems: Record<AnatomicalSystem, boolean>;
  toggleSystem: (system: AnatomicalSystem) => void;
  showOnlySystem: (system: AnatomicalSystem) => void;
  showAllSystems: () => void;

  // Structure interaction
  selectedStructure: StructureInfo | null;
  setSelectedStructure: (structure: StructureInfo | null) => void;
  hoveredStructure: string | null;
  setHoveredStructure: (meshName: string | null) => void;

  // UI state
  detailPanelOpen: boolean;
  setDetailPanelOpen: (open: boolean) => void;
}

const allSystemsVisible = (): Record<AnatomicalSystem, boolean> => ({
  skeletal: true,
  muscular: true,
  arterial: false,
  venous: false,
  nervous: false,
  lymphatic: false,
  organs: true,
  fascia: false,
  spaces: false,
});

export const useAppStore = create<AppState>((set) => ({
  visibleSystems: allSystemsVisible(),

  toggleSystem: (system) =>
    set((state) => ({
      visibleSystems: {
        ...state.visibleSystems,
        [system]: !state.visibleSystems[system],
      },
    })),

  showOnlySystem: (system) =>
    set(() => {
      const systems = Object.keys(allSystemsVisible()) as AnatomicalSystem[];
      const visibility = {} as Record<AnatomicalSystem, boolean>;
      systems.forEach((s) => (visibility[s] = s === system));
      return { visibleSystems: visibility };
    }),

  showAllSystems: () =>
    set(() => {
      const systems = Object.keys(allSystemsVisible()) as AnatomicalSystem[];
      const visibility = {} as Record<AnatomicalSystem, boolean>;
      systems.forEach((s) => (visibility[s] = true));
      return { visibleSystems: visibility };
    }),

  selectedStructure: null,
  setSelectedStructure: (structure) =>
    set({ selectedStructure: structure, detailPanelOpen: structure !== null }),

  hoveredStructure: null,
  setHoveredStructure: (meshName) => set({ hoveredStructure: meshName }),

  detailPanelOpen: false,
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
}));
