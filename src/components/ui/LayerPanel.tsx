import { useAppStore } from "../../store/useAppStore";
import {
  SYSTEM_COLORS,
  SYSTEM_LABELS,
  type AnatomicalSystem,
} from "../../types/anatomy";

const SYSTEMS: AnatomicalSystem[] = [
  "skeletal",
  "muscular",
  "arterial",
  "venous",
  "nervous",
  "lymphatic",
  "organs",
  "fascia",
  "spaces",
];

export function LayerPanel() {
  const { visibleSystems, toggleSystem, showOnlySystem, showAllSystems } =
    useAppStore();
  const systemOpacity = useAppStore((s) => s.systemOpacity);
  const setSystemOpacity = useAppStore((s) => s.setSystemOpacity);

  return (
    <div
      className="w-[260px] flex flex-col border-r"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <h1 className="text-sm font-semibold tracking-wide uppercase">
          Anatomical Layers
        </h1>
        <button
          onClick={showAllSystems}
          className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
          style={{ color: "var(--accent)" }}
        >
          Show All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {SYSTEMS.map((system, i) => (
          <div key={system}>
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors group"
              onClick={() => toggleSystem(system)}
            >
              {/* Color indicator */}
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{
                  background: visibleSystems[system]
                    ? SYSTEM_COLORS[system]
                    : "var(--bg-tertiary)",
                  border: `1px solid ${SYSTEM_COLORS[system]}`,
                  opacity: visibleSystems[system] ? 1 : 0.4,
                }}
              />

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={visibleSystems[system]}
                onChange={() => toggleSystem(system)}
                className="sr-only"
              />
              <div
                className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: visibleSystems[system]
                    ? "var(--accent)"
                    : "var(--border)",
                  background: visibleSystems[system]
                    ? "var(--accent)"
                    : "transparent",
                }}
              >
                {visibleSystems[system] && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span
                className="text-sm flex-1"
                style={{
                  color: visibleSystems[system]
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {SYSTEM_LABELS[system]}
              </span>

              {/* Shortcut hint */}
              <kbd
                className="text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-60 transition-opacity"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text-secondary)",
                }}
              >
                {i + 1}
              </kbd>

              {/* Isolate button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showOnlySystem(system);
                }}
                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded hover:bg-[var(--bg-primary)]"
                style={{ color: "var(--text-secondary)" }}
                title={`Show only ${SYSTEM_LABELS[system]}`}
              >
                Solo
              </button>
            </div>

            {/* Opacity slider — visible when system is on */}
            {visibleSystems[system] && (
              <div className="flex items-center gap-2 px-3 pb-1.5 pl-12">
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={systemOpacity[system]}
                  onChange={(e) =>
                    setSystemOpacity(system, parseFloat(e.target.value))
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                  style={
                    {
                      accentColor: SYSTEM_COLORS[system],
                      background: `linear-gradient(to right, ${SYSTEM_COLORS[system]}40, ${SYSTEM_COLORS[system]})`,
                    } as React.CSSProperties
                  }
                />
                <span
                  className="text-[10px] w-7 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {Math.round(systemOpacity[system] * 100)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="p-3 border-t text-xs"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        Toggle layers to isolate anatomical systems. Press <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.06)" }}>/</kbd> to search.
      </div>
    </div>
  );
}
