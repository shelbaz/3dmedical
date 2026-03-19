import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { ProcedureSelector } from "./ProcedurePanel";

const CAMERA_PRESETS = [
  { id: "anterior", label: "A", title: "Anterior" },
  { id: "posterior", label: "P", title: "Posterior" },
  { id: "left", label: "L", title: "Left Lateral" },
  { id: "right", label: "R", title: "Right Lateral" },
  { id: "superior", label: "S", title: "Superior" },
  { id: "inferior", label: "I", title: "Inferior" },
];

const CLIP_ORIENTATIONS: {
  id: "sagittal" | "coronal" | "axial";
  label: string;
}[] = [
  { id: "sagittal", label: "Sag" },
  { id: "coronal", label: "Cor" },
  { id: "axial", label: "Axl" },
];

function ToolbarButton({
  active,
  accent,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  accent?: string;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  const color = accent ?? "#4a9eff";
  return (
    <button
      onClick={onClick}
      title={title}
      className="px-3 h-8 rounded-lg text-[11px] font-semibold tracking-wide transition-all"
      style={{
        background: active ? `${color}18` : "transparent",
        color: active ? color : "var(--text-secondary)",
        border: active ? `1px solid ${color}30` : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 mx-0.5" style={{ background: "var(--border)" }} />;
}

export function Toolbar() {
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const xRayMode = useAppStore((s) => s.xRayMode);
  const toggleXRayMode = useAppStore((s) => s.toggleXRayMode);
  const clippingEnabled = useAppStore((s) => s.clippingEnabled);
  const toggleClipping = useAppStore((s) => s.toggleClipping);
  const clippingOrientation = useAppStore((s) => s.clippingOrientation);
  const setClippingOrientation = useAppStore((s) => s.setClippingOrientation);
  const clippingPosition = useAppStore((s) => s.clippingPosition);
  const setClippingPosition = useAppStore((s) => s.setClippingPosition);
  const quizMode = useAppStore((s) => s.quizMode);

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl max-md:bottom-3 max-md:px-1.5 max-md:gap-0 max-md:max-w-[calc(100%-1rem)] max-md:overflow-x-auto"
      style={{
        background: "rgba(10,10,18,0.85)",
        border: "1px solid rgba(30,30,50,0.6)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Camera presets */}
      <div className="flex items-center gap-0.5 px-1">
        {CAMERA_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setCameraPreset(preset.id)}
            title={preset.title}
            className="w-7 h-7 rounded-md text-[11px] font-bold transition-all hover:bg-[rgba(255,255,255,0.08)] active:scale-90"
            style={{ color: "var(--text-secondary)" }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <Divider />

      {/* Modes */}
      <div className="flex items-center gap-0.5 px-0.5">
        <ToolbarButton active={xRayMode} onClick={toggleXRayMode} title="X-Ray Mode">
          X-Ray
        </ToolbarButton>
        <ToolbarButton active={clippingEnabled} onClick={toggleClipping} title="Cross-Section">
          Clip
        </ToolbarButton>
      </div>

      {/* Clipping controls */}
      {clippingEnabled && (
        <>
          <Divider />
          <div className="flex items-center gap-0.5 px-0.5">
            {CLIP_ORIENTATIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setClippingOrientation(o.id)}
                className="px-2 h-6 rounded-md text-[10px] font-semibold transition-all"
                style={{
                  background: clippingOrientation === o.id ? "rgba(255,255,255,0.1)" : "transparent",
                  color: clippingOrientation === o.id ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              >
                {o.label}
              </button>
            ))}
            <input
              type="range"
              min={-2}
              max={2}
              step={0.01}
              value={clippingPosition}
              onChange={(e) => setClippingPosition(parseFloat(e.target.value))}
              className="w-16 mx-1"
              style={{ background: `linear-gradient(to right, var(--accent)30 0%, var(--accent) 50%, var(--bg-tertiary) 50%)` }}
              title={`Position: ${clippingPosition.toFixed(2)}`}
            />
          </div>
        </>
      )}

      <Divider />

      {/* Study tools */}
      <div className="flex items-center gap-0.5 px-0.5">
        <ToolbarButton
          active={quizMode !== "off"}
          accent="#22c55e"
          onClick={() => useAppStore.getState().setQuizMode(quizMode === "off" ? "identify" : "off")}
          title="Quiz Mode"
        >
          Quiz
        </ToolbarButton>
        <ProcedureButton />
      </div>

      <Divider />

      <button
        onClick={() => setCameraPreset("anterior")}
        title="Reset View"
        className="px-2.5 h-7 rounded-md text-[10px] font-medium transition-all hover:bg-[rgba(255,255,255,0.06)]"
        style={{ color: "var(--text-tertiary)" }}
      >
        Reset
      </button>
    </div>
  );
}

function ProcedureButton() {
  const [showSelector, setShowSelector] = useState(false);
  const activeProcedure = useAppStore((s) => s.activeProcedure);

  return (
    <>
      <ToolbarButton
        active={!!activeProcedure}
        accent="#a78bfa"
        onClick={() => setShowSelector(!showSelector)}
        title="Surgical Procedures"
      >
        Procedures
      </ToolbarButton>
      {showSelector && <ProcedureSelector onClose={() => setShowSelector(false)} />}
    </>
  );
}
