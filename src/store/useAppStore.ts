import { create } from "zustand";
import type { AnatomicalSystem, StructureInfo } from "../types/anatomy";

interface AppState {
  // System visibility
  visibleSystems: Record<AnatomicalSystem, boolean>;
  toggleSystem: (system: AnatomicalSystem) => void;
  showOnlySystem: (system: AnatomicalSystem) => void;
  showAllSystems: () => void;

  // System opacity
  systemOpacity: Record<AnatomicalSystem, number>;
  setSystemOpacity: (system: AnatomicalSystem, opacity: number) => void;

  // Structure interaction
  selectedStructure: StructureInfo | null;
  setSelectedStructure: (structure: StructureInfo | null) => void;
  hoveredStructure: string | null;
  setHoveredStructure: (meshName: string | null) => void;

  // UI state
  detailPanelOpen: boolean;
  setDetailPanelOpen: (open: boolean) => void;

  // X-Ray mode
  xRayMode: boolean;
  toggleXRayMode: () => void;

  // Clipping
  clippingEnabled: boolean;
  toggleClipping: () => void;
  clippingOrientation: "sagittal" | "coronal" | "axial";
  setClippingOrientation: (o: "sagittal" | "coronal" | "axial") => void;
  clippingPosition: number;
  setClippingPosition: (p: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Camera
  cameraPreset: string | null;
  setCameraPreset: (preset: string | null) => void;
  focusTarget: [number, number, number] | null;
  setFocusTarget: (target: [number, number, number] | null) => void;

  // Highlighting
  highlightedStructures: string[];
  setHighlightedStructures: (names: string[]) => void;
  warningStructures: string[];
  setWarningStructures: (names: string[]) => void;
  highlightColors: Record<string, string>;
  setHighlightColors: (colors: Record<string, string>) => void;

  // Quiz
  quizMode: "off" | "identify" | "locate";
  setQuizMode: (mode: "off" | "identify" | "locate") => void;
  quizTarget: string | null;
  setQuizTarget: (name: string | null) => void;
  quizScore: { correct: number; total: number; streak: number };
  updateQuizScore: (correct: boolean) => void;
  resetQuizScore: () => void;
  quizSystem: AnatomicalSystem | "all";
  setQuizSystem: (system: AnatomicalSystem | "all") => void;

  // Procedure
  activeProcedure: string | null;
  setActiveProcedure: (id: string | null) => void;
  procedureStep: number;
  setProcedureStep: (step: number) => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Context menu
  contextMenu: { x: number; y: number; name: string; system: AnatomicalSystem } | null;
  setContextMenu: (menu: { x: number; y: number; name: string; system: AnatomicalSystem } | null) => void;
}

const allSystemsVisible = (): Record<AnatomicalSystem, boolean> => ({
  skeletal: true,
  muscular: false,
  arterial: false,
  venous: false,
  nervous: false,
  lymphatic: false,
  organs: true,
  fascia: false,
  spaces: false,
});

const defaultOpacity = (): Record<AnatomicalSystem, number> => ({
  skeletal: 0.6,    // semi-transparent so organs are visible through bones
  muscular: 1,
  arterial: 1,
  venous: 1,
  nervous: 1,
  lymphatic: 1,
  organs: 1,
  fascia: 0.8,
  spaces: 0.3,
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

  systemOpacity: defaultOpacity(),
  setSystemOpacity: (system, opacity) =>
    set((state) => ({
      systemOpacity: { ...state.systemOpacity, [system]: opacity },
    })),

  selectedStructure: null,
  setSelectedStructure: (structure) =>
    set((state) => {
      // Auto-enable the structure's system so the user can see what they selected
      const visibleSystems = structure
        ? { ...state.visibleSystems, [structure.system]: true }
        : state.visibleSystems;
      return {
        selectedStructure: structure,
        detailPanelOpen: structure !== null,
        visibleSystems,
      };
    }),

  hoveredStructure: null,
  setHoveredStructure: (meshName) => set({ hoveredStructure: meshName }),

  detailPanelOpen: false,
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),

  xRayMode: false,
  toggleXRayMode: () => set((state) => ({ xRayMode: !state.xRayMode })),

  clippingEnabled: false,
  toggleClipping: () =>
    set((state) => ({ clippingEnabled: !state.clippingEnabled })),
  clippingOrientation: "coronal",
  setClippingOrientation: (o) => set({ clippingOrientation: o }),
  clippingPosition: 0,
  setClippingPosition: (p) => set({ clippingPosition: p }),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  searchOpen: false,
  setSearchOpen: (open) =>
    set({ searchOpen: open, searchQuery: open ? "" : "" }),

  cameraPreset: null,
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  focusTarget: null,
  setFocusTarget: (target) => set({ focusTarget: target }),

  highlightedStructures: [],
  setHighlightedStructures: (names) => set({ highlightedStructures: names }),
  warningStructures: [],
  setWarningStructures: (names) => set({ warningStructures: names }),
  highlightColors: {},
  setHighlightColors: (colors) => set({ highlightColors: colors }),

  quizMode: "off",
  setQuizMode: (mode) =>
    set({
      quizMode: mode,
      quizTarget: null,
      selectedStructure: null,
      detailPanelOpen: false,
      highlightedStructures: [],
      warningStructures: [],
    }),
  quizTarget: null,
  setQuizTarget: (name) => set({ quizTarget: name }),
  quizScore: { correct: 0, total: 0, streak: 0 },
  updateQuizScore: (correct) =>
    set((s) => ({
      quizScore: {
        correct: s.quizScore.correct + (correct ? 1 : 0),
        total: s.quizScore.total + 1,
        streak: correct ? s.quizScore.streak + 1 : 0,
      },
    })),
  resetQuizScore: () => set({ quizScore: { correct: 0, total: 0, streak: 0 } }),
  quizSystem: "all",
  setQuizSystem: (system) => set({ quizSystem: system }),

  activeProcedure: null,
  setActiveProcedure: (id) =>
    set({
      activeProcedure: id,
      procedureStep: 0,
      selectedStructure: null,
      detailPanelOpen: false,
    }),
  procedureStep: 0,
  setProcedureStep: (step) => set({ procedureStep: step }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) =>
    set({ commandPaletteOpen: open, searchOpen: false }),

  contextMenu: null,
  setContextMenu: (menu) => set({ contextMenu: menu }),
}));
