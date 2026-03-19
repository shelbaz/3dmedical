import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { PROCEDURES } from "../../data/procedures";
import { SYSTEM_COLORS } from "../../types/anatomy";
import type { AnatomicalSystem } from "../../types/anatomy";

export function ProcedurePanel() {
  const activeProcedure = useAppStore((s) => s.activeProcedure);
  const procedureStep = useAppStore((s) => s.procedureStep);
  const setActiveProcedure = useAppStore((s) => s.setActiveProcedure);
  const setProcedureStep = useAppStore((s) => s.setProcedureStep);
  const setHighlightedStructures = useAppStore((s) => s.setHighlightedStructures);
  const setWarningStructures = useAppStore((s) => s.setWarningStructures);
  const setFocusTarget = useAppStore((s) => s.setFocusTarget);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const visibleSystems = useAppStore((s) => s.visibleSystems);
  const toggleSystem = useAppStore((s) => s.toggleSystem);

  const procedure = PROCEDURES.find((p) => p.id === activeProcedure);

  // Apply step state to 3D view
  useEffect(() => {
    if (!procedure) return;
    const step = procedure.steps[procedureStep];
    if (!step) return;

    setHighlightedStructures(step.structures);
    setWarningStructures(step.atRisk);

    // Ensure required systems are visible
    for (const sys of step.systems) {
      if (!visibleSystems[sys]) toggleSystem(sys);
    }

    // Camera
    if (step.camera) {
      setFocusTarget(step.camera.target);
    }
  }, [procedure, procedureStep]);

  function endProcedure() {
    setActiveProcedure(null);
    setHighlightedStructures([]);
    setWarningStructures([]);
  }

  if (!procedure) return null;

  const step = procedure.steps[procedureStep];
  const totalSteps = procedure.steps.length;

  return (
    <div
      className="w-[380px] flex-shrink-0 flex flex-col border-l overflow-y-auto max-md:w-full max-md:border-l-0"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div
              className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide mb-2"
              style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}
            >
              {procedure.category}
            </div>
            <h2 className="text-lg font-bold leading-snug">{procedure.name}</h2>
          </div>
          <button
            onClick={endProcedure}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 flex gap-1">
            {procedure.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setProcedureStep(i)}
                className="flex-1 h-1.5 rounded-full transition-colors cursor-pointer"
                style={{
                  background: i === procedureStep
                    ? "var(--accent)"
                    : i < procedureStep
                    ? "rgba(99,102,241,0.4)"
                    : "var(--bg-primary)",
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
            {procedureStep + 1}/{totalSteps}
          </span>
        </div>
      </div>

      <div className="mx-5 h-px" style={{ background: "var(--border)" }} />

      {/* Step content */}
      {step && (
        <div className="px-5 py-4 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {procedureStep + 1}
            </span>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {step.title}
            </h3>
          </div>

          <p
            className="text-[13px] leading-[1.7] mb-4"
            style={{ color: "var(--text-primary)", opacity: 0.9 }}
          >
            {step.description}
          </p>

          {/* Highlighted structures */}
          {step.structures.length > 0 && (
            <div className="mb-3">
              <h4 className="text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Key Structures
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {step.structures.map((name) => (
                  <span
                    key={name}
                    className="px-2 py-1 rounded text-[11px] font-medium"
                    style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* At-risk structures */}
          {step.atRisk.length > 0 && (
            <div
              className="rounded-xl px-3.5 py-3 mb-3"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <h4 className="text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ color: "#ef4444" }}>
                At Risk
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {step.atRisk.map((name) => (
                  <span
                    key={name}
                    className="px-2 py-1 rounded text-[11px] font-medium"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div
        className="px-5 py-3 flex gap-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => setProcedureStep(Math.max(0, procedureStep - 1))}
          disabled={procedureStep === 0}
          className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30"
          style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (procedureStep < totalSteps - 1) {
              setProcedureStep(procedureStep + 1);
            } else {
              endProcedure();
            }
          }}
          className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {procedureStep < totalSteps - 1 ? "Next Step" : "Finish"}
        </button>
      </div>
    </div>
  );
}

/** Procedure selector overlay */
export function ProcedureSelector({ onClose }: { onClose: () => void }) {
  const setActiveProcedure = useAppStore((s) => s.setActiveProcedure);

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-[360px] rounded-xl overflow-hidden shadow-2xl"
      style={{ background: "rgba(14,14,22,0.96)", border: "1px solid rgba(40,40,60,0.6)", backdropFilter: "blur(20px)", boxShadow: "0 12px 48px rgba(0,0,0,0.6)" }}
    >
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold">Surgical Procedures</h3>
        <button onClick={onClose} className="text-xs" style={{ color: "var(--text-secondary)" }}>Close</button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {PROCEDURES.map((proc) => (
          <button
            key={proc.id}
            onClick={() => { setActiveProcedure(proc.id); onClose(); }}
            className="w-full px-4 py-3 text-left hover:bg-[rgba(255,255,255,0.04)] transition-colors border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase"
                style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}>
                {proc.shortName}
              </span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{proc.category}</span>
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: "var(--text-primary)" }}>{proc.name}</p>
            <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{proc.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
