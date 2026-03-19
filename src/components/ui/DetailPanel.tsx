import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS, SYSTEM_LABELS } from "../../types/anatomy";

export function DetailPanel() {
  const { selectedStructure, setSelectedStructure, setDetailPanelOpen } =
    useAppStore();

  if (!selectedStructure) return null;

  const color = SYSTEM_COLORS[selectedStructure.system];

  return (
    <div
      className="w-[360px] flex flex-col border-l overflow-y-auto"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-start justify-between gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
            />
            <span
              className="text-xs uppercase tracking-wider font-medium"
              style={{ color }}
            >
              {SYSTEM_LABELS[selectedStructure.system]}
            </span>
          </div>
          <h2 className="text-lg font-semibold leading-tight">
            {selectedStructure.name}
          </h2>
          {selectedStructure.latinName && (
            <p
              className="text-sm italic mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {selectedStructure.latinName}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setSelectedStructure(null);
            setDetailPanelOpen(false);
          }}
          className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors flex-shrink-0"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Description */}
      {selectedStructure.description && (
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3
            className="text-xs uppercase tracking-wider font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Description
          </h3>
          <p className="text-sm leading-relaxed">
            {selectedStructure.description}
          </p>
        </div>
      )}

      {/* Clinical Significance */}
      {selectedStructure.clinicalSignificance && (
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3
            className="text-xs uppercase tracking-wider font-medium mb-2"
            style={{ color: "#f59e0b" }}
          >
            Clinical Significance
          </h3>
          <p className="text-sm leading-relaxed">
            {selectedStructure.clinicalSignificance}
          </p>
        </div>
      )}

      {/* Placeholder sections for future data */}
      <div className="p-4" style={{ color: "var(--text-secondary)" }}>
        <p className="text-xs italic">
          Additional details (borders, vascular supply, innervation, lymphatic
          drainage) will be loaded from the database once anatomical data is
          seeded.
        </p>
      </div>
    </div>
  );
}
