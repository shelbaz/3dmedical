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

  // Listen for locate mode clicks
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

  function handleNext() {
    nextQuestion();
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
      className="w-[360px] flex flex-col border-l overflow-y-auto"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Quiz Mode</h2>
          <button
            onClick={endQuiz}
            className="text-xs px-2.5 py-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
            style={{ color: "var(--text-secondary)" }}
          >
            End Quiz
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-0.5 rounded-lg mb-3" style={{ background: "var(--bg-primary)" }}>
          {(["identify", "locate"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setQuizMode(m); setQuizTarget(null); }}
              className="flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors"
              style={{
                background: quizMode === m ? "var(--accent)" : "transparent",
                color: quizMode === m ? "#fff" : "var(--text-secondary)",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* System filter */}
        <select
          value={quizSystem}
          onChange={(e) => { setQuizSystem(e.target.value as AnatomicalSystem | "all"); setQuizTarget(null); }}
          className="w-full px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-primary)] border"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {SYSTEMS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Systems" : SYSTEM_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="mx-5 h-px" style={{ background: "var(--border)" }} />

      {/* Score */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: "var(--text-secondary)" }}>
            Score: <strong style={{ color: "var(--text-primary)" }}>{quizScore.correct}/{quizScore.total}</strong>
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            Streak: <strong style={{ color: quizScore.streak >= 3 ? "#f59e0b" : "var(--text-primary)" }}>{quizScore.streak}</strong>
          </span>
          {quizScore.total > 0 && (
            <span style={{ color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }}>
              {pct}%
            </span>
          )}
        </div>
        {quizScore.total > 0 && (
          <div className="w-full h-1.5 rounded-full" style={{ background: "var(--bg-primary)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }}
            />
          </div>
        )}
      </div>

      <div className="mx-5 h-px" style={{ background: "var(--border)" }} />

      {/* Question */}
      <div className="px-5 py-4 flex-1">
        {quizTarget && (
          <>
            {quizMode === "identify" ? (
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  A structure is highlighted in the 3D view. Name it:
                </p>

                {/* Hints */}
                {hintLevel >= 1 && targetEntry && (
                  <div className="mt-2 mb-2 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                    System: {SYSTEM_LABELS[targetEntry.system]}
                  </div>
                )}
                {hintLevel >= 2 && (
                  <div className="mb-2 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                    Starts with: "{quizTarget[0]}..."
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") feedback ? handleNext() : submitIdentifyAnswer(); }}
                    placeholder="Type structure name..."
                    disabled={feedback !== null}
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-[var(--bg-primary)] border outline-none focus:border-[var(--accent)]"
                    style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  {!feedback && (
                    <button
                      onClick={submitIdentifyAnswer}
                      className="px-3 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      Check
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                  Find and click this structure in the 3D view:
                </p>
                <div
                  className="px-4 py-3 rounded-xl text-center"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
                >
                  <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {quizTarget}
                  </p>
                  {targetEntry && (
                    <p className="text-xs mt-1" style={{ color: SYSTEM_COLORS[targetEntry.system] }}>
                      {SYSTEM_LABELS[targetEntry.system]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className="mt-4 px-4 py-3 rounded-xl text-center"
                style={{
                  background: feedback === "correct" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${feedback === "correct" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                <p className="text-sm font-bold" style={{ color: feedback === "correct" ? "#22c55e" : "#ef4444" }}>
                  {feedback === "correct" ? "Correct!" : "Incorrect"}
                </p>
                {feedback === "wrong" && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    Answer: <strong style={{ color: "var(--text-primary)" }}>{quizTarget}</strong>
                  </p>
                )}
                <button
                  onClick={handleNext}
                  className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Next Question
                </button>
              </div>
            )}

            {/* Actions */}
            {!feedback && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setHintLevel((h) => Math.min(h + 1, 2))}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  Hint ({2 - hintLevel} left)
                </button>
                <button
                  onClick={() => { updateQuizScore(false); setFeedback("wrong"); }}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-medium"
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
