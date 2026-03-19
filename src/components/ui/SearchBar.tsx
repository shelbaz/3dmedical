import { useEffect, useRef, useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";
import { STRUCTURE_REGISTRY } from "../../lib/structureRegistry";
import { SYSTEM_COLORS } from "../../types/anatomy";

export function SearchBar() {
  const searchOpen = useAppStore((s) => s.searchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setSelectedStructure = useAppStore((s) => s.setSelectedStructure);
  const setFocusTarget = useAppStore((s) => s.setFocusTarget);
  const visibleSystems = useAppStore((s) => s.visibleSystems);
  const toggleSystem = useAppStore((s) => s.toggleSystem);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return STRUCTURE_REGISTRY.filter((s) =>
      s.name.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [searchQuery]);

  function selectResult(entry: (typeof STRUCTURE_REGISTRY)[number]) {
    // Ensure system is visible
    if (!visibleSystems[entry.system]) {
      toggleSystem(entry.system);
    }
    // Select and fly to
    setSelectedStructure({
      id: entry.name,
      name: entry.name,
      system: entry.system,
    });
    setFocusTarget(entry.position);
    setSearchOpen(false);
  }

  if (!searchOpen) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[360px] max-md:w-[calc(100%-2rem)]">
      <div
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: "rgba(18,18,26,0.95)",
          border: "1px solid rgba(42,42,62,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchOpen(false);
              if (e.key === "Enter" && results.length > 0) {
                selectResult(results[0]);
              }
            }}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-secondary)",
            }}
          >
            Esc
          </kbd>
        </div>

        {results.length > 0 && (
          <div
            className="border-t max-h-[300px] overflow-y-auto"
            style={{ borderColor: "var(--border)" }}
          >
            {results.map((entry) => (
              <button
                key={entry.name}
                onClick={() => selectResult(entry)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: SYSTEM_COLORS[entry.system] }}
                />
                <span style={{ color: "var(--text-primary)" }}>
                  {entry.name}
                </span>
                <span
                  className="ml-auto text-[10px] uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {entry.system}
                </span>
              </button>
            ))}
          </div>
        )}

        {searchQuery && results.length === 0 && (
          <div
            className="px-3 py-3 text-sm border-t"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border)",
            }}
          >
            No structures found
          </div>
        )}
      </div>
    </div>
  );
}
