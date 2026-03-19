import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS, SYSTEM_LABELS, type AnatomicalSystem } from "../../types/anatomy";
import { STRUCTURE_REGISTRY } from "../../lib/structureRegistry";

interface ContextMenuProps {
  x: number;
  y: number;
  structureName: string;
  system: AnatomicalSystem;
  onClose: () => void;
}

function MenuItem({
  label,
  shortcut,
  icon,
  danger,
  onClick,
}: {
  label: string;
  shortcut?: string;
  icon?: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[11px] font-medium transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.06)]"
      style={{ color: danger ? "#ef4444" : "var(--text-primary)" }}
    >
      {icon && <span className="w-4 text-center text-xs opacity-60">{icon}</span>}
      <span className="flex-1">{label}</span>
      {shortcut && (
        <span className="text-[9px] opacity-40">{shortcut}</span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="my-1 mx-2 h-px" style={{ background: "var(--border)" }} />;
}

export function ContextMenu({ x, y, structureName, system, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const toggleSystem = useAppStore((s) => s.toggleSystem);
  const showOnlySystem = useAppStore((s) => s.showOnlySystem);
  const showAllSystems = useAppStore((s) => s.showAllSystems);
  const setSystemOpacity = useAppStore((s) => s.setSystemOpacity);
  const setSelectedStructure = useAppStore((s) => s.setSelectedStructure);
  const setFocusTarget = useAppStore((s) => s.setFocusTarget);
  const setHighlightedStructures = useAppStore((s) => s.setHighlightedStructures);
  const toggleXRayMode = useAppStore((s) => s.toggleXRayMode);
  const visibleSystems = useAppStore((s) => s.visibleSystems);

  // Close on click outside or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // Position: keep menu in viewport
  const menuWidth = 220;
  const menuHeight = 360;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  const systemColor = SYSTEM_COLORS[system];
  const systemLabel = SYSTEM_LABELS[system];

  // Find the structure in the registry for its position
  const registryEntry = STRUCTURE_REGISTRY.find((s) => s.name === structureName);

  return (
    <div
      ref={ref}
      className="fixed z-50 py-1.5 px-1 rounded-xl min-w-[200px]"
      style={{
        left: adjustedX,
        top: adjustedY,
        background: "rgba(14,14,22,0.96)",
        border: "1px solid rgba(40,40,60,0.6)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
      }}
    >
      {/* Structure header */}
      <div className="px-3 py-2 mb-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: systemColor }} />
          <span className="text-[9px] uppercase tracking-wide font-semibold" style={{ color: systemColor }}>
            {systemLabel}
          </span>
        </div>
        <p className="text-[12px] font-bold" style={{ color: "var(--text-primary)" }}>
          {structureName}
        </p>
      </div>

      <Divider />

      {/* Structure actions */}
      <MenuItem
        icon="🔍"
        label="View Details"
        onClick={() => {
          setSelectedStructure({ id: structureName, name: structureName, system });
          if (registryEntry) setFocusTarget(registryEntry.position);
          onClose();
        }}
      />
      <MenuItem
        icon="📍"
        label="Focus Camera Here"
        onClick={() => {
          if (registryEntry) setFocusTarget(registryEntry.position);
          onClose();
        }}
      />
      <MenuItem
        icon="✨"
        label="Highlight This Structure"
        onClick={() => {
          setHighlightedStructures([structureName]);
          onClose();
        }}
      />

      <Divider />

      {/* System actions */}
      <MenuItem
        icon="👁"
        label={`Solo ${systemLabel}`}
        shortcut="Solo"
        onClick={() => {
          showOnlySystem(system);
          onClose();
        }}
      />
      <MenuItem
        icon="🔽"
        label={`${systemLabel} to 50% Opacity`}
        onClick={() => {
          setSystemOpacity(system, 0.5);
          onClose();
        }}
      />
      {visibleSystems[system] ? (
        <MenuItem
          icon="⊘"
          label={`Hide ${systemLabel}`}
          onClick={() => {
            toggleSystem(system);
            onClose();
          }}
        />
      ) : (
        <MenuItem
          icon="⊕"
          label={`Show ${systemLabel}`}
          onClick={() => {
            toggleSystem(system);
            onClose();
          }}
        />
      )}
      <MenuItem
        icon="◉"
        label="Show All Layers"
        onClick={() => {
          showAllSystems();
          onClose();
        }}
      />

      <Divider />

      {/* View modes */}
      <MenuItem
        icon="🦴"
        label="X-Ray Mode"
        onClick={() => {
          toggleXRayMode();
          setSelectedStructure({ id: structureName, name: structureName, system });
          onClose();
        }}
      />
    </div>
  );
}
