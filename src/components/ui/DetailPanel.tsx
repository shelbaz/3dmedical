import { useAppStore } from "../../store/useAppStore";
import { SYSTEM_COLORS, SYSTEM_LABELS } from "../../types/anatomy";
import { trpc } from "../../lib/trpc";
import { resolveRelatedStructures } from "../../lib/resolveRelatedStructures";
import type { AnatomicalSystem } from "../../types/anatomy";

const DIRECTION_ORDER = [
  "anterior",
  "posterior",
  "medial",
  "lateral",
  "superior",
  "inferior",
];

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon?: string;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-sm">{icon}</span>}
        <h3
          className="text-[11px] uppercase tracking-[0.08em] font-semibold"
          style={{ color: color ?? "var(--text-secondary)" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-5 h-px"
      style={{ background: "var(--border)" }}
    />
  );
}

function RelationList({
  items,
  color,
}: {
  items: string[];
  color: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0"
            style={{ background: color }}
          />
          <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DetailPanel() {
  const { selectedStructure, setSelectedStructure, setDetailPanelOpen } =
    useAppStore();
  const highlightedStructures = useAppStore((s) => s.highlightedStructures);
  const setHighlightedStructures = useAppStore(
    (s) => s.setHighlightedStructures
  );
  const setHighlightColors = useAppStore((s) => s.setHighlightColors);
  const highlightColors = useAppStore((s) => s.highlightColors
  );

  const { data: details, isLoading } = trpc.getStructureDetails.useQuery(
    { name: selectedStructure?.name ?? "" },
    { enabled: !!selectedStructure }
  );

  if (!selectedStructure) return null;

  const systemColor = SYSTEM_COLORS[selectedStructure.system];
  const description = details?.description ?? selectedStructure.description;
  const clinicalSignificance =
    details?.clinicalSignificance ?? selectedStructure.clinicalSignificance;
  const latinName = details?.latinName ?? selectedStructure.latinName;

  const hasBorders = details?.borders && details.borders.length > 0;
  const hasArterial =
    details?.arterialSupply && details.arterialSupply.length > 0;
  const hasVenous =
    details?.venousDrainage && details.venousDrainage.length > 0;
  const hasInnervation =
    details?.innervation && details.innervation.length > 0;
  const hasLymphatic =
    details?.lymphaticDrainage && details.lymphaticDrainage.length > 0;

  const sortedBorders = details?.borders
    ? [...details.borders].sort(
        (a, b) =>
          DIRECTION_ORDER.indexOf(a.direction) -
          DIRECTION_ORDER.indexOf(b.direction)
      )
    : [];

  const borderStructureNames = sortedBorders
    .map((b) => b.borderStructureName)
    .filter((n): n is string => !!n);

  const isHighlighting = highlightedStructures.length > 0;

  function handleHighlightBorders() {
    if (isHighlighting) {
      setHighlightedStructures([]);
    } else {
      setHighlightedStructures(borderStructureNames);
    }
  }

  return (
    <div
      className="w-[380px] flex-shrink-0 flex flex-col border-l overflow-y-auto max-md:w-full max-md:border-l-0"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* System badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2.5"
              style={{
                background: `${systemColor}18`,
                border: `1px solid ${systemColor}30`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: systemColor }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.06em] font-semibold"
                style={{ color: systemColor }}
              >
                {SYSTEM_LABELS[selectedStructure.system]}
              </span>
            </div>

            <h2
              className="text-xl font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              {selectedStructure.name}
            </h2>
            {latinName && (
              <p
                className="text-[13px] italic mt-1"
                style={{ color: "var(--text-secondary)", opacity: 0.7 }}
              >
                {latinName}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedStructure(null);
              setDetailPanelOpen(false);
              setHighlightedStructures([]);
            }}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors flex-shrink-0 mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <Divider />

      {isLoading && (
        <div
          className="px-5 py-6 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Loading details...
        </div>
      )}

      {/* Description */}
      {description && (
        <>
          <Section title="Description" icon="&lrm;">
            <p
              className="text-[13px] leading-[1.7]"
              style={{ color: "var(--text-primary)", opacity: 0.9 }}
            >
              {description}
            </p>
          </Section>
          <Divider />
        </>
      )}

      {/* Clinical Significance */}
      {clinicalSignificance && (
        <>
          <Section title="Clinical Significance" color="#f59e0b">
            <div
              className="rounded-lg px-3.5 py-3"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.12)",
              }}
            >
              <p
                className="text-[13px] leading-[1.7]"
                style={{ color: "var(--text-primary)", opacity: 0.9 }}
              >
                {clinicalSignificance}
              </p>
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* Borders */}
      {hasBorders && (
        <>
          <Section title="Borders" color={SYSTEM_COLORS.spaces}>
            <div className="space-y-3">
              {sortedBorders.map((border) => (
                <div
                  key={border.direction}
                  className="rounded-lg px-3.5 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {border.direction}
                  </span>
                  <p
                    className="text-[13px] leading-[1.6] mt-1"
                    style={{ color: "var(--text-primary)", opacity: 0.85 }}
                  >
                    {border.description}
                    {border.borderStructureName && (
                      <span
                        className="ml-1 text-[11px] font-medium px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {border.borderStructureName}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {borderStructureNames.length > 0 && (
              <button
                onClick={handleHighlightBorders}
                className="mt-4 w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isHighlighting
                    ? "rgba(6,182,212,0.15)"
                    : "rgba(6,182,212,0.08)",
                  color: "#06b6d4",
                  border: `1px solid ${
                    isHighlighting
                      ? "rgba(6,182,212,0.35)"
                      : "rgba(6,182,212,0.15)"
                  }`,
                }}
              >
                {isHighlighting
                  ? "Clear Highlights"
                  : `Highlight Borders (${borderStructureNames.length})`}
              </button>
            )}
          </Section>
          <Divider />
        </>
      )}

      {/* Vascular + Nerve supply in a clean grid */}
      {(hasArterial || hasVenous || hasInnervation || hasLymphatic) && (
        <div className="px-5 py-4 space-y-4">
          {hasArterial && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: SYSTEM_COLORS.arterial }}
                />
                <h4
                  className="text-[11px] uppercase tracking-[0.08em] font-semibold"
                  style={{ color: SYSTEM_COLORS.arterial }}
                >
                  Arterial Supply
                </h4>
              </div>
              <RelationList
                items={details!.arterialSupply}
                color={SYSTEM_COLORS.arterial}
              />
            </div>
          )}

          {hasVenous && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: SYSTEM_COLORS.venous }}
                />
                <h4
                  className="text-[11px] uppercase tracking-[0.08em] font-semibold"
                  style={{ color: SYSTEM_COLORS.venous }}
                >
                  Venous Drainage
                </h4>
              </div>
              <RelationList
                items={details!.venousDrainage}
                color={SYSTEM_COLORS.venous}
              />
            </div>
          )}

          {hasInnervation && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: SYSTEM_COLORS.nervous }}
                />
                <h4
                  className="text-[11px] uppercase tracking-[0.08em] font-semibold"
                  style={{ color: SYSTEM_COLORS.nervous }}
                >
                  Innervation
                </h4>
              </div>
              <RelationList
                items={details!.innervation}
                color={SYSTEM_COLORS.nervous}
              />
            </div>
          )}

          {hasLymphatic && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: SYSTEM_COLORS.lymphatic }}
                />
                <h4
                  className="text-[11px] uppercase tracking-[0.08em] font-semibold"
                  style={{ color: SYSTEM_COLORS.lymphatic }}
                >
                  Lymphatic Drainage
                </h4>
              </div>
              <RelationList
                items={details!.lymphaticDrainage}
                color={SYSTEM_COLORS.lymphatic}
              />
            </div>
          )}
        </div>
      )}

      {/* Show Related Structures button */}
      {(hasArterial || hasVenous || hasInnervation || hasLymphatic) && (
        <div className="px-5 py-3">
          <button
            onClick={() => {
              const isActive = Object.keys(highlightColors).length > 0;
              if (isActive) {
                setHighlightedStructures([]);
                setHighlightColors({});
              } else {
                const resolved = resolveRelatedStructures({
                  arterialSupply: details?.arterialSupply,
                  venousDrainage: details?.venousDrainage,
                  innervation: details?.innervation,
                  lymphaticDrainage: details?.lymphaticDrainage,
                });
                setHighlightedStructures(resolved.names);
                setHighlightColors(resolved.colors);
                // Ensure systems are visible
                const toggleSystem = useAppStore.getState().toggleSystem;
                const visible = useAppStore.getState().visibleSystems;
                for (const sys of resolved.systems) {
                  if (!visible[sys as AnatomicalSystem]) toggleSystem(sys as AnatomicalSystem);
                }
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: Object.keys(highlightColors).length > 0
                ? "rgba(99,102,241,0.15)"
                : "rgba(99,102,241,0.08)",
              color: "#818cf8",
              border: `1px solid ${
                Object.keys(highlightColors).length > 0
                  ? "rgba(99,102,241,0.35)"
                  : "rgba(99,102,241,0.15)"
              }`,
            }}
          >
            {Object.keys(highlightColors).length > 0
              ? "Clear Related Highlights"
              : "Show Related Structures"}
          </button>
        </div>
      )}

      {/* No enriched data */}
      {!isLoading &&
        !hasBorders &&
        !hasArterial &&
        !hasVenous &&
        !hasInnervation &&
        !hasLymphatic &&
        !clinicalSignificance && (
          <div
            className="px-5 py-6 text-xs italic"
            style={{ color: "var(--text-secondary)" }}
          >
            Detailed relationship data will be available once real anatomical
            models are loaded.
          </div>
        )}
    </div>
  );
}
