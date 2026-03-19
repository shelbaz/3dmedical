import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS, SYSTEM_LABELS } from "../../types/anatomy";
import { STRUCTURE_REGISTRY } from "../../lib/structureRegistry";

// Maps MRI mesh system names for structures not in the procedural registry
const GLTF_SYSTEMS: Record<string, string> = {};

/** Fixed-position hover label at top of canvas */
export function HoverLabel() {
  const hoveredStructure = useAppStore((s) => s.hoveredStructure);

  if (!hoveredStructure) return null;

  // Try registry first, fall back to checking the mesh map key patterns
  const entry = STRUCTURE_REGISTRY.find((s) => s.name === hoveredStructure);
  const system = entry?.system;
  const color = system ? SYSTEM_COLORS[system] : "#8888a0";
  const label = system ? SYSTEM_LABELS[system] : "";

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg pointer-events-none"
      style={{
        background: "rgba(8,8,14,0.85)",
        border: "1px solid rgba(30,30,50,0.5)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
        {hoveredStructure}
      </span>
      {label && (
        <span className="text-[9px] uppercase tracking-wide" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}
