import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { ProcedureSelector } from "./ProcedurePanel";

const CAMERA_PRESETS = [
  { id: "anterior", label: "Front", icon: "↑" },
  { id: "posterior", label: "Back", icon: "↓" },
  { id: "left", label: "Left", icon: "←" },
  { id: "right", label: "Right", icon: "→" },
  { id: "superior", label: "Top", icon: "◉" },
  { id: "inferior", label: "Bottom", icon: "◎" },
];

const CLIP_ORIENTATIONS: { id: "sagittal" | "coronal" | "axial"; label: string }[] = [
  { id: "sagittal", label: "L/R" },
  { id: "coronal", label: "A/P" },
  { id: "axial", label: "S/I" },
];

function ToolButton({
  active,
  accent,
  onClick,
  icon,
  label,
  title,
  badge,
}: {
  active?: boolean;
  accent?: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title?: string;
  badge?: string;
}) {
  const color = accent ?? "#4a9eff";
  return (
    <button
      onClick={onClick}
      title={title ?? label}
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
      style={{
        background: active ? `${color}15` : "transparent",
        border: active ? `1px solid ${color}25` : "1px solid transparent",
      }}
    >
      <span className="text-base leading-none" style={{ color: active ? color : "var(--text-secondary)" }}>
        {icon}
      </span>
      <span className="text-[9px] font-medium" style={{ color: active ? color : "var(--text-tertiary)" }}>
        {label}
      </span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
          style={{ background: accent ?? "var(--accent)" }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-8 mx-1" style={{ background: "var(--border)" }} />;
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
  const activeProcedure = useAppStore((s) => s.activeProcedure);
  const [showCameras, setShowCameras] = useState(false);

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-1 rounded-2xl max-md:bottom-2 max-md:max-w-[calc(100%-1rem)] max-md:overflow-x-auto"
      style={{
        background: "rgba(10,10,18,0.88)",
        border: "1px solid rgba(30,30,50,0.5)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Camera views */}
      <div className="relative">
        <ToolButton
          onClick={() => setShowCameras(!showCameras)}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
          label="Views"
          active={showCameras}
        />
        {showCameras && (
          <div
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 p-2 rounded-xl grid grid-cols-3 gap-1 min-w-[180px]"
            style={{ background: "rgba(14,14,22,0.96)", border: "1px solid rgba(40,40,60,0.6)", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}
          >
            {CAMERA_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setCameraPreset(p.id); setShowCameras(false); }}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              >
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{p.icon}</span>
                <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>{p.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Visualization modes */}
      <ToolButton
        active={xRayMode}
        accent="#60a5fa"
        onClick={toggleXRayMode}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        label="X-Ray"
        title="See through all layers to the selected structure"
      />

      <ToolButton
        active={clippingEnabled}
        accent="#60a5fa"
        onClick={toggleClipping}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        }
        label="Cut"
        title="Cross-section: slice through the model"
      />

      {/* Clipping controls */}
      {clippingEnabled && (
        <>
          <div className="flex items-center gap-0.5 pl-1">
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
              type="range" min={-2} max={2} step={0.01}
              value={clippingPosition}
              onChange={(e) => setClippingPosition(parseFloat(e.target.value))}
              className="w-16 mx-1"
              style={{ background: `linear-gradient(to right, var(--accent)30 0%, var(--accent) 50%, var(--bg-tertiary) 50%)` }}
            />
          </div>
        </>
      )}

      <Divider />

      {/* Learning tools — these are the star features */}
      <ToolButton
        active={quizMode !== "off"}
        accent="#22c55e"
        onClick={() => useAppStore.getState().setQuizMode(quizMode === "off" ? "identify" : "off")}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18.75h.008v.008H12v-.008z" />
          </svg>
        }
        label="Quiz"
        title="Test your anatomy knowledge"
      />

      <ProcedureButton />

      <ToolButton
        onClick={() => useAppStore.getState().setCommandPaletteOpen(true)}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        }
        label="Search"
        title="Search structures, procedures, actions (Cmd+K)"
      />
    </div>
  );
}

function ProcedureButton() {
  const [showSelector, setShowSelector] = useState(false);
  const activeProcedure = useAppStore((s) => s.activeProcedure);

  return (
    <>
      <ToolButton
        active={!!activeProcedure}
        accent="#a78bfa"
        onClick={() => setShowSelector(!showSelector)}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A1.001 1.001 0 015 11.14V5.5a1 1 0 011.5-.866l5.384 3.19a1 1 0 010 1.732l-5.384 3.19a1 1 0 01-1.5-.866z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12 7.858 4.5 12 4.5s7.5 3.358 7.5 7.5z" />
          </svg>
        }
        label="Surgical"
        title="Step-by-step surgical procedure walkthroughs"
      />
      {showSelector && <ProcedureSelector onClose={() => setShowSelector(false)} />}
    </>
  );
}
