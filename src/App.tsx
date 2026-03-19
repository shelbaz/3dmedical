import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Scene } from "./components/canvas/Scene";
import { LayerPanel } from "./components/ui/LayerPanel";
import { DetailPanel } from "./components/ui/DetailPanel";
import { Toolbar } from "./components/ui/Toolbar";
import { SearchBar } from "./components/ui/SearchBar";
import { QuizPanel } from "./components/ui/QuizPanel";
import { ProcedurePanel } from "./components/ui/ProcedurePanel";
import { CommandPalette } from "./components/ui/CommandPalette";
import { ContextMenu } from "./components/ui/ContextMenu";
import { useAppStore } from "./store/useAppStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useIsMobile } from "./hooks/useMediaQuery";

function WelcomeHint({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-5 py-3.5 rounded-2xl max-w-md text-center"
      style={{
        background: "rgba(10,10,18,0.9)",
        border: "1px solid rgba(30,30,50,0.6)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>
        Click any structure to learn about it
      </p>
      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Toggle layers on the left to show/hide systems. Use the toolbar below for views, surgical walkthroughs, and quizzes.
      </p>
      <button
        onClick={onDismiss}
        className="mt-2 text-[10px] font-medium px-3 py-1 rounded-lg"
        style={{ color: "var(--accent)", background: "rgba(74,158,255,0.08)" }}
      >
        Got it
      </button>
    </div>
  );
}

function Viewer() {
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);
  const quizMode = useAppStore((s) => s.quizMode);
  const activeProcedure = useAppStore((s) => s.activeProcedure);
  const selectedStructure = useAppStore((s) => s.selectedStructure);
  const contextMenu = useAppStore((s) => s.contextMenu);
  const setContextMenu = useAppStore((s) => s.setContextMenu);
  const [layerDrawerOpen, setLayerDrawerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem("3dmed-welcomed"));
  const isMobile = useIsMobile();
  useKeyboardShortcuts();

  // Auto-dismiss welcome after first click
  useEffect(() => {
    if (selectedStructure && showWelcome) {
      setShowWelcome(false);
      localStorage.setItem("3dmed-welcomed", "1");
    }
  }, [selectedStructure, showWelcome]);

  const rightPanelContent =
    quizMode !== "off" ? (
      <QuizPanel />
    ) : activeProcedure ? (
      <ProcedurePanel />
    ) : detailPanelOpen ? (
      <DetailPanel />
    ) : null;

  const hasRightPanel = !!rightPanelContent;

  if (isMobile) {
    return (
      <div className="flex flex-col h-[100dvh] w-screen overflow-hidden">
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
            Female Pelvis Anatomy
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

        <div className="flex-1 relative">
          <Scene />
          <SearchBar />
          <Toolbar />
          <CommandPalette />
          {showWelcome && <WelcomeHint onDismiss={() => { setShowWelcome(false); localStorage.setItem("3dmed-welcomed", "1"); }} />}
        </div>

        {layerDrawerOpen && (
          <>
            <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setLayerDrawerOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-40 w-[280px]" style={{ background: "var(--bg-secondary)" }}>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Layers</span>
                <button onClick={() => setLayerDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ color: "var(--text-secondary)" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <LayerPanel embedded />
            </div>
          </>
        )}

        {hasRightPanel && (
          <>
            <div className="fixed inset-0 z-20 bg-black/30" onClick={() => {
              useAppStore.getState().setSelectedStructure(null);
              useAppStore.getState().setDetailPanelOpen(false);
              if (quizMode !== "off") useAppStore.getState().setQuizMode("off");
              if (activeProcedure) useAppStore.getState().setActiveProcedure(null);
            }} />
            <div className="fixed bottom-0 left-0 right-0 z-30 max-h-[70vh] rounded-t-2xl overflow-hidden"
              style={{ background: "var(--bg-secondary)", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}>
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 rounded-full" style={{ background: "var(--border)" }} />
              </div>
              <div className="overflow-y-auto max-h-[calc(70vh-20px)]">{rightPanelContent}</div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LayerPanel />
      <div className="flex-1 min-w-0 relative">
        <Scene />
        <SearchBar />
        <Toolbar />
        <CommandPalette />
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            structureName={contextMenu.name}
            system={contextMenu.system}
            onClose={() => setContextMenu(null)}
          />
        )}
        {showWelcome && !hasRightPanel && (
          <WelcomeHint onDismiss={() => { setShowWelcome(false); localStorage.setItem("3dmed-welcomed", "1"); }} />
        )}
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
