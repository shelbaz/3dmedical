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

function Viewer() {
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);
  const quizMode = useAppStore((s) => s.quizMode);
  const activeProcedure = useAppStore((s) => s.activeProcedure);
  useKeyboardShortcuts();

  // Right panel: quiz > procedure > detail
  const rightPanel =
    quizMode !== "off" ? (
      <QuizPanel />
    ) : activeProcedure ? (
      <ProcedurePanel />
    ) : detailPanelOpen ? (
      <DetailPanel />
    ) : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LayerPanel />
      <div className="flex-1 relative">
        <Scene />
        <SearchBar />
        <Toolbar />
        <CommandPalette />
        <div className="absolute top-4 left-4 text-xs text-[var(--text-secondary)]">
          Click + drag to rotate | Scroll to zoom |{" "}
          <kbd className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>/</kbd> search |{" "}
          <kbd className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>Cmd+K</kbd> commands
        </div>
      </div>
      {rightPanel}
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
