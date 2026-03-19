import { useAppStore } from "../../store/useAppStore";

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

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-2 rounded-xl"
      style={{
        background: "rgba(18,18,26,0.9)",
        border: "1px solid rgba(42,42,62,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Camera presets */}
      {CAMERA_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => setCameraPreset(preset.id)}
          title={preset.title}
          className="w-8 h-8 rounded-lg text-xs font-bold transition-colors hover:bg-[rgba(255,255,255,0.1)]"
          style={{ color: "var(--text-secondary)" }}
        >
          {preset.label}
        </button>
      ))}

      <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />

      {/* X-Ray toggle */}
      <button
        onClick={toggleXRayMode}
        title="X-Ray Mode"
        className="px-2.5 h-8 rounded-lg text-xs font-medium transition-colors"
        style={{
          background: xRayMode ? "rgba(59,130,246,0.25)" : "transparent",
          color: xRayMode ? "#60a5fa" : "var(--text-secondary)",
          border: xRayMode ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
        }}
      >
        X-Ray
      </button>

      {/* Clipping toggle */}
      <button
        onClick={toggleClipping}
        title="Cross-Section"
        className="px-2.5 h-8 rounded-lg text-xs font-medium transition-colors"
        style={{
          background: clippingEnabled ? "rgba(59,130,246,0.25)" : "transparent",
          color: clippingEnabled ? "#60a5fa" : "var(--text-secondary)",
          border: clippingEnabled ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
        }}
      >
        Clip
      </button>

      {/* Clipping controls (shown when clipping is enabled) */}
      {clippingEnabled && (
        <>
          <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />
          {CLIP_ORIENTATIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setClippingOrientation(o.id)}
              className="px-2 h-7 rounded text-[10px] font-medium transition-colors"
              style={{
                background:
                  clippingOrientation === o.id
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                color:
                  clippingOrientation === o.id
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
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
            className="w-20 h-1 mx-1 accent-blue-500"
            title={`Position: ${clippingPosition.toFixed(2)}`}
          />
        </>
      )}

      <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />

      {/* Reset view */}
      <button
        onClick={() => setCameraPreset("anterior")}
        title="Reset View"
        className="px-2.5 h-8 rounded-lg text-xs font-medium transition-colors hover:bg-[rgba(255,255,255,0.1)]"
        style={{ color: "var(--text-secondary)" }}
      >
        Reset
      </button>
    </div>
  );
}
