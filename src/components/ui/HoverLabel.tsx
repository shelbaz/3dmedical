import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS, SYSTEM_LABELS } from "../../types/anatomy";
import { STRUCTURE_REGISTRY } from "../../lib/structureRegistry";

/** Fixed-position hover label — shows at bottom-left of canvas, not on the 3D model */
export function HoverLabel() {
  const hoveredStructure = useAppStore((s) => s.hoveredStructure);

  if (!hoveredStructure) return null;

  // Find system from registry or GLTF mesh map
  const entry = STRUCTURE_REGISTRY.find((s) => s.name === hoveredStructure);
  const system = entry?.system;
  const color = system ? SYSTEM_COLORS[system] : "var(--text-secondary)";
  const label = system ? SYSTEM_LABELS[system] : "";

  return (
    <div
      className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg pointer-events-none"
      style={{
        background: "rgba(8,8,14,0.85)",
        border: "1px solid rgba(30,30,50,0.5)",
        backdropFilter: "blur(12px)",
      }}
    >
      {system && (
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      )}
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
