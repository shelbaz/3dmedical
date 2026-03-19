import { useState, useEffect, useRef, useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";
import { STRUCTURE_REGISTRY } from "../../lib/structureRegistry";
import { PROCEDURES } from "../../data/procedures";
import { SYSTEM_COLORS, SYSTEM_LABELS } from "../../types/anatomy";

interface CommandItem {
  id: string;
  label: string;
  category: "structure" | "procedure" | "action";
  meta?: string;
  color?: string;
  action: () => void;
}

export function CommandPalette() {
  const open = useAppStore((s) => s.commandPaletteOpen);
  const setOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const setSelectedStructure = useAppStore((s) => s.setSelectedStructure);
  const setFocusTarget = useAppStore((s) => s.setFocusTarget);
  const visibleSystems = useAppStore((s) => s.visibleSystems);
  const toggleSystem = useAppStore((s) => s.toggleSystem);
  const setActiveProcedure = useAppStore((s) => s.setActiveProcedure);
  const setQuizMode = useAppStore((s) => s.setQuizMode);
  const toggleXRayMode = useAppStore((s) => s.toggleXRayMode);
  const toggleClipping = useAppStore((s) => s.toggleClipping);
  const showAllSystems = useAppStore((s) => s.showAllSystems);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems = useMemo((): CommandItem[] => {
    const items: CommandItem[] = [];

    // Actions
    items.push(
      { id: "quiz-identify", label: "Start Quiz (Identify)", category: "action", meta: "Test yourself", action: () => { setQuizMode("identify"); setOpen(false); } },
      { id: "quiz-locate", label: "Start Quiz (Locate)", category: "action", meta: "Find structures", action: () => { setQuizMode("locate"); setOpen(false); } },
      { id: "xray", label: "Toggle X-Ray Mode", category: "action", meta: "Ghost view", action: () => { toggleXRayMode(); setOpen(false); } },
      { id: "clip", label: "Toggle Clipping Plane", category: "action", meta: "Cross-section", action: () => { toggleClipping(); setOpen(false); } },
      { id: "show-all", label: "Show All Systems", category: "action", action: () => { showAllSystems(); setOpen(false); } },
      { id: "cam-ant", label: "Camera: Anterior View", category: "action", action: () => { setCameraPreset("anterior"); setOpen(false); } },
      { id: "cam-post", label: "Camera: Posterior View", category: "action", action: () => { setCameraPreset("posterior"); setOpen(false); } },
      { id: "cam-sup", label: "Camera: Superior View", category: "action", action: () => { setCameraPreset("superior"); setOpen(false); } },
    );

    // Procedures
    for (const proc of PROCEDURES) {
      items.push({
        id: `proc-${proc.id}`,
        label: proc.name,
        category: "procedure",
        meta: `${proc.category} — ${proc.steps.length} steps`,
        action: () => { setActiveProcedure(proc.id); setOpen(false); },
      });
    }

    // Structures
    for (const entry of STRUCTURE_REGISTRY) {
      items.push({
        id: `struct-${entry.name}`,
        label: entry.name,
        category: "structure",
        meta: SYSTEM_LABELS[entry.system],
        color: SYSTEM_COLORS[entry.system],
        action: () => {
          if (!visibleSystems[entry.system]) toggleSystem(entry.system);
          setSelectedStructure({ id: entry.name, name: entry.name, system: entry.system });
          setFocusTarget(entry.position);
          setOpen(false);
        },
      });
    }

    return items;
  }, [visibleSystems]);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      // Show actions + procedures first, then first 10 structures
      return [
        ...allItems.filter((i) => i.category === "action"),
        ...allItems.filter((i) => i.category === "procedure"),
        ...allItems.filter((i) => i.category === "structure").slice(0, 8),
      ];
    }
    const q = query.toLowerCase();
    return allItems
      .filter((i) => i.label.toLowerCase().includes(q) || (i.meta?.toLowerCase().includes(q)))
      .slice(0, 20);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  if (!open) return null;

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case "action": return "~";
      case "procedure": return "+";
      case "structure": return "#";
      default: return "";
    }
  };

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case "action": return "Actions";
      case "procedure": return "Procedures";
      case "structure": return "Structures";
      default: return "";
    }
  };

  // Group by category
  let lastCategory = "";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div
        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-[480px] rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(18,18,26,0.98)", border: "1px solid rgba(42,42,62,0.8)" }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search structures, procedures, actions..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
            Esc
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto border-t" style={{ borderColor: "var(--border)" }}>
          {filtered.map((item, i) => {
            const showHeader = item.category !== lastCategory;
            lastCategory = item.category;
            return (
              <div key={item.id}>
                {showHeader && (
                  <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-wide font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {categoryLabel(item.category)}
                  </div>
                )}
                <button
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors"
                  style={{
                    background: i === selectedIndex ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  {item.color ? (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  ) : (
                    <span className="w-4 text-center text-[10px] font-mono flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {categoryIcon(item.category)}
                    </span>
                  )}
                  <span className="flex-1 truncate" style={{ color: "var(--text-primary)" }}>
                    {item.label}
                  </span>
                  {item.meta && (
                    <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {item.meta}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
