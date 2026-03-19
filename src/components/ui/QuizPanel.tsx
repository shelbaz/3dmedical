import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore } from "../../store/useAppStore";
import { STRUCTURE_REGISTRY } from "../../lib/structureRegistry";
import { isQuizMatch } from "../../lib/resolveRelatedStructures";
import { SYSTEM_COLORS, SYSTEM_LABELS, type AnatomicalSystem } from "../../types/anatomy";

const SYSTEMS: (AnatomicalSystem | "all")[] = [
  "all", "skeletal", "muscular", "arterial", "venous",
  "nervous", "lymphatic", "organs", "fascia", "spaces",
];

export function QuizPanel() {
  const quizMode = useAppStore((s) => s.quizMode);
  const quizTarget = useAppStore((s) => s.quizTarget);
  const quizScore = useAppStore((s) => s.quizScore);
  const quizSystem = useAppStore((s) => s.quizSystem);
  const setQuizMode = useAppStore((s) => s.setQuizMode);
  const setQuizTarget = useAppStore((s) => s.setQuizTarget);
  const updateQuizScore = useAppStore((s) => s.updateQuizScore);
  const resetQuizScore = useAppStore((s) => s.resetQuizScore);
  const setQuizSystem = useAppStore((s) => s.setQuizSystem);
  const setHighlightedStructures = useAppStore((s) => s.setHighlightedStructures);
  const setFocusTarget = useAppStore((s) => s.setFocusTarget);
  const visibleSystems = useAppStore((s) => s.visibleSystems);
  const toggleSystem = useAppStore((s) => s.toggleSystem);
  const showAllSystems = useAppStore((s) => s.showAllSystems);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextQuestion = useCallback(() => {
    const pool = STRUCTURE_REGISTRY.filter(
      (s) => quizSystem === "all" || s.system === quizSystem
    );
    const entry = pool[Math.floor(Math.random() * pool.length)];
    setQuizTarget(entry.name);
    setAnswer("");
    setFeedback(null);
    setHintLevel(0);

    if (quizMode === "identify") {
      if (!visibleSystems[entry.system]) toggleSystem(entry.system);
      setHighlightedStructures([entry.name]);
      setFocusTarget(entry.position);
    } else {
      showAllSystems();
      setHighlightedStructures([]);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [quizMode, quizSystem, visibleSystems, toggleSystem, showAllSystems, setQuizTarget, setHighlightedStructures, setFocusTarget]);

  useEffect(() => {
    if (quizMode !== "off" && !quizTarget) nextQuestion();
  }, [quizMode, quizTarget, nextQuestion]);

  const selectedStructure = useAppStore((s) => s.selectedStructure);
  useEffect(() => {
    if (quizMode === "locate" && selectedStructure && quizTarget && feedback === null) {
      const correct = selectedStructure.name === quizTarget;
      updateQuizScore(correct);
      setFeedback(correct ? "correct" : "wrong");
      if (correct) {
        setHighlightedStructures([quizTarget]);
      } else {
        const entry = STRUCTURE_REGISTRY.find((s) => s.name === quizTarget);
        if (entry) {
          if (!visibleSystems[entry.system]) toggleSystem(entry.system);
          setHighlightedStructures([quizTarget, selectedStructure.name]);
          setFocusTarget(entry.position);
        }
      }
    }
  }, [selectedStructure, quizMode, quizTarget, feedback]);

  function submitIdentifyAnswer() {
    if (!quizTarget || !answer.trim() || feedback) return;
    const correct = isQuizMatch(answer, quizTarget);
    updateQuizScore(correct);
    setFeedback(correct ? "correct" : "wrong");
  }

  function endQuiz() {
    setQuizMode("off");
    setQuizTarget(null);
    setHighlightedStructures([]);
    resetQuizScore();
  }

  const targetEntry = STRUCTURE_REGISTRY.find((s) => s.name === quizTarget);
  const pct = quizScore.total > 0 ? Math.round((quizScore.correct / quizScore.total) * 100) : 0;

  return (
    <div
      className="w-[340px] flex flex-col"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e60" }} />
            <h2 className="text-sm font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>Quiz</h2>
          </div>
          <button
            onClick={endQuiz}
            className="text-[10px] font-medium px-2.5 py-1 rounded-md transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ color: "var(--text-tertiary)" }}
          >
            End
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "var(--bg-primary)" }}>
          {(["identify", "locate"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setQuizMode(m); setQuizTarget(null); }}
              className="flex-1 py-2 rounded-lg text-[11px] font-semibold capitalize transition-all"
              style={{
                background: quizMode === m ? "var(--bg-elevated)" : "transparent",
                color: quizMode === m ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: quizMode === m ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {m === "identify" ? "Name It" : "Find It"}
            </button>
          ))}
        </div>

        {/* System filter */}
        <select
          value={quizSystem}
          onChange={(e) => { setQuizSystem(e.target.value as AnatomicalSystem | "all"); setQuizTarget(null); }}
          className="w-full px-3 py-2 rounded-xl text-[11px] font-medium border outline-none"
          style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {SYSTEMS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Systems" : SYSTEM_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Score bar */}
      <div className="mx-5 px-4 py-3 rounded-xl mb-1" style={{ background: "var(--bg-primary)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {quizScore.correct}
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              / {quizScore.total}
            </span>
          </div>
          {quizScore.streak > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px]" style={{ color: quizScore.streak >= 3 ? "#f59e0b" : "var(--text-tertiary)" }}>
                {quizScore.streak} streak
              </span>
            </div>
          )}
          {quizScore.total > 0 && (
            <span className="text-xs font-bold tabular-nums" style={{ color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }}>
              {pct}%
            </span>
          )}
        </div>
        {quizScore.total > 0 && (
          <div className="w-full h-1 rounded-full" style={{ background: "var(--bg-tertiary)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }}
            />
          </div>
        )}
      </div>

      {/* Question area */}
      <div className="px-5 py-5 flex-1">
        {quizTarget && (
          <>
            {quizMode === "identify" ? (
              <div>
                <p className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  A structure is highlighted in the 3D view. What is it?
                </p>

                {/* Hints */}
                {hintLevel >= 1 && targetEntry && (
                  <div className="mb-3 px-3 py-2.5 rounded-xl text-[11px] font-medium" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                    System: {SYSTEM_LABELS[targetEntry.system]}
                  </div>
                )}
                {hintLevel >= 2 && (
                  <div className="mb-3 px-3 py-2.5 rounded-xl text-[11px] font-medium" style={{ background: "rgba(74,158,255,0.06)", border: "1px solid rgba(74,158,255,0.1)", color: "#4a9eff" }}>
                    Starts with "{quizTarget[0]}"
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") feedback ? nextQuestion() : submitIdentifyAnswer(); }}
                  placeholder="Type your answer..."
                  disabled={feedback !== null}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors focus:border-[var(--accent)]"
                  style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />

                {!feedback && (
                  <button
                    onClick={submitIdentifyAnswer}
                    disabled={!answer.trim()}
                    className="w-full mt-3 py-2.5 rounded-xl text-[11px] font-bold transition-all disabled:opacity-30"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    Submit
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[11px] mb-4" style={{ color: "var(--text-secondary)" }}>
                  Find and click this structure:
                </p>
                <div
                  className="px-5 py-5 rounded-2xl text-center"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
                >
                  <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {quizTarget}
                  </p>
                  {targetEntry && (
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: SYSTEM_COLORS[targetEntry.system] }} />
                      <p className="text-[10px] font-medium" style={{ color: SYSTEM_COLORS[targetEntry.system] }}>
                        {SYSTEM_LABELS[targetEntry.system]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className="mt-4 px-5 py-4 rounded-2xl text-center"
                style={{
                  background: feedback === "correct" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${feedback === "correct" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                <p className="text-sm font-bold" style={{ color: feedback === "correct" ? "#22c55e" : "#ef4444" }}>
                  {feedback === "correct" ? "Correct!" : "Incorrect"}
                </p>
                {feedback === "wrong" && (
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--text-secondary)" }}>
                    Answer: <strong style={{ color: "var(--text-primary)" }}>{quizTarget}</strong>
                  </p>
                )}
                <button
                  onClick={nextQuestion}
                  className="mt-3 px-5 py-2 rounded-xl text-[11px] font-bold"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Next
                </button>
              </div>
            )}

            {/* Action buttons */}
            {!feedback && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setHintLevel((h) => Math.min(h + 1, 2))}
                  disabled={hintLevel >= 2}
                  className="flex-1 py-2.5 rounded-xl text-[10px] font-semibold transition-all disabled:opacity-30"
                  style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  Hint
                </button>
                <button
                  onClick={() => { updateQuizScore(false); setFeedback("wrong"); }}
                  className="flex-1 py-2.5 rounded-xl text-[10px] font-semibold transition-all"
                  style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  Skip
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
