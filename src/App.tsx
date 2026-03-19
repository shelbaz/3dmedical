import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Scene } from "./components/canvas/Scene";
import { LayerPanel } from "./components/ui/LayerPanel";
import { DetailPanel } from "./components/ui/DetailPanel";
import { Toolbar } from "./components/ui/Toolbar";
import { SearchBar } from "./components/ui/SearchBar";
import { QuizPanel } from "./components/ui/QuizPanel";
import { ProcedurePanel } from "./components/ui/ProcedurePanel";
import { CommandPalette } from "./components/ui/CommandPalette";
import { useAppStore } from "./store/useAppStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useIsMobile } from "./hooks/useMediaQuery";

function Viewer() {
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);
  const quizMode = useAppStore((s) => s.quizMode);
  const activeProcedure = useAppStore((s) => s.activeProcedure);
  const [layerDrawerOpen, setLayerDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  useKeyboardShortcuts();

  const hasRightPanel = quizMode !== "off" || !!activeProcedure || detailPanelOpen;
  const rightPanelContent =
    quizMode !== "off" ? (
      <QuizPanel />
    ) : activeProcedure ? (
      <ProcedurePanel />
    ) : detailPanelOpen ? (
      <DetailPanel />
    ) : null;

  if (isMobile) {
    return (
      <div className="flex flex-col h-[100dvh] w-screen overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="flex items-center gap-3 px-3 py-2 z-10 flex-shrink-0"
          style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
        >
          <button
            onClick={() => setLayerDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "var(--bg-tertiary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary)" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xs font-semibold flex-1" style={{ color: "var(--text-primary)" }}>
            3D Pelvis
          </span>
          <button
            onClick={() => useAppStore.getState().setSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "var(--bg-tertiary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary)" strokeWidth={2}>
              <path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Scene />
          <SearchBar />
          <Toolbar />
          <CommandPalette />
        </div>

        {/* Mobile layer drawer */}
        {layerDrawerOpen && (
          <>
            <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setLayerDrawerOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-40 w-[280px]" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  Systems
                </span>
                <button
                  onClick={() => setLayerDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <LayerPanel embedded />
            </div>
          </>
        )}

        {/* Mobile bottom sheet for right panel */}
        {hasRightPanel && (
          <>
            <div
              className="fixed inset-0 z-20 bg-black/30"
              onClick={() => {
                useAppStore.getState().setSelectedStructure(null);
                useAppStore.getState().setDetailPanelOpen(false);
                if (quizMode !== "off") useAppStore.getState().setQuizMode("off");
                if (activeProcedure) useAppStore.getState().setActiveProcedure(null);
              }}
            />
            <div
              className="fixed bottom-0 left-0 right-0 z-30 max-h-[70vh] rounded-t-2xl overflow-hidden"
              style={{ background: "var(--bg-secondary)", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 rounded-full" style={{ background: "var(--border)" }} />
              </div>
              <div className="overflow-y-auto max-h-[calc(70vh-20px)]">
                {rightPanelContent}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LayerPanel />
      <div className="flex-1 relative">
        <Scene />
        <SearchBar />
        <Toolbar />
        <CommandPalette />
      </div>
      {rightPanelContent}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Viewer />} />
    </Routes>
  );
}
