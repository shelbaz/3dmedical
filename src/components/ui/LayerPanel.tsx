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
      className="w-[220px] flex flex-col"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <span
          className="text-[10px] font-semibold tracking-[0.12em] uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Systems
        </span>
        <button
          onClick={showAllSystems}
          className="text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{ color: "var(--accent)" }}
        >
          Show All
        </button>
      </div>

      {/* System list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {SYSTEMS.map((system, i) => {
          const active = visibleSystems[system];
          const color = SYSTEM_COLORS[system];

          return (
            <div key={system} className="mb-0.5">
              <button
                onClick={() => toggleSystem(system)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group"
                style={{
                  background: active ? `${color}08` : "transparent",
                }}
              >
                {/* Toggle dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{
                      background: active ? color : "transparent",
                      border: `1.5px solid ${active ? color : "var(--text-tertiary)"}`,
                      boxShadow: active ? `0 0 8px ${color}40` : "none",
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  className="text-[13px] font-medium flex-1 text-left transition-colors"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {SYSTEM_LABELS[system]}
                </span>

                {/* Shortcut + Solo on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="text-[9px] font-mono px-1 rounded"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); showOnlySystem(system); }}
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded hover:bg-[var(--bg-elevated)] cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    solo
                  </span>
                </div>
              </button>

              {/* Opacity slider */}
              {active && (
                <div className="flex items-center gap-2.5 pl-8 pr-3 pb-2 pt-0.5">
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
                    className="flex-1"
                    style={{
                      background: `linear-gradient(to right, ${color}30 0%, ${color} ${systemOpacity[system] * 100}%, var(--bg-tertiary) ${systemOpacity[system] * 100}%)`,
                    }}
                  />
                  <span
                    className="text-[10px] tabular-nums w-7 text-right"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {Math.round(systemOpacity[system] * 100)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3">
        <div
          className="text-[10px] leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          <kbd className="px-1 py-px rounded text-[9px]" style={{ background: "var(--bg-tertiary)" }}>/</kbd> search
          {" "}&middot;{" "}
          <kbd className="px-1 py-px rounded text-[9px]" style={{ background: "var(--bg-tertiary)" }}>Cmd K</kbd> commands
        </div>
      </div>
    </div>
  );
}
