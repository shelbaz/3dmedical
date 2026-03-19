import { STRUCTURE_REGISTRY } from "./structureRegistry";
import { SYSTEM_COLORS } from "../types/anatomy";
import { meshRegistry } from "../components/canvas/utils";

/** Get all known structure names from both the static registry AND the live mesh registry */
function getAllNames(): string[] {
  const names = new Set<string>();
  for (const s of STRUCTURE_REGISTRY) names.add(s.name);
  for (const name of meshRegistry.keys()) names.add(name);
  return Array.from(names);
}

/** Match a relation name (e.g. "Uterine Artery") to actual rendered structures */
function matchName(name: string): string[] {
  const allNames = getAllNames();
  const lower = name.toLowerCase();

  // Exact match
  const exact = allNames.find((n) => n.toLowerCase() === lower);
  if (exact) return [exact];

  // Find all entries that contain the search term
  const matches = allNames.filter(
    (n) => n.toLowerCase().includes(lower) || lower.includes(n.toLowerCase())
  );
  if (matches.length > 0) return matches;

  // Partial word match — try matching key words
  const words = lower.split(/\s+/).filter((w) => w.length > 3);
  if (words.length > 0) {
    const wordMatches = allNames.filter((n) => {
      const nl = n.toLowerCase();
      return words.some((w) => nl.includes(w));
    });
    if (wordMatches.length > 0 && wordMatches.length < 10) return wordMatches;
  }

  return [];
}

export interface ResolvedRelations {
  names: string[];
  colors: Record<string, string>;
  systems: Set<string>;
}

export function resolveRelatedStructures(details: {
  arterialSupply?: string[];
  venousDrainage?: string[];
  innervation?: string[];
  lymphaticDrainage?: string[];
}): ResolvedRelations {
  const names: string[] = [];
  const colors: Record<string, string> = {};
  const systems = new Set<string>();

  function addRelations(items: string[] | undefined, color: string) {
    if (!items) return;
    for (const item of items) {
      const matches = matchName(item);
      for (const m of matches) {
        if (!names.includes(m)) {
          names.push(m);
          colors[m] = color;
          const entry = STRUCTURE_REGISTRY.find((s) => s.name === m);
          if (entry) systems.add(entry.system);
        }
      }
    }
  }

  addRelations(details.arterialSupply, SYSTEM_COLORS.arterial);
  addRelations(details.venousDrainage, SYSTEM_COLORS.venous);
  addRelations(details.innervation, SYSTEM_COLORS.nervous);
  addRelations(details.lymphaticDrainage, SYSTEM_COLORS.lymphatic);

  return { names, colors, systems };
}

/** Fuzzy match for quiz answers */
export function isQuizMatch(input: string, target: string): boolean {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (a === b) return true;
  const normalize = (s: string) =>
    s.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
  if (normalize(a) === normalize(b)) return true;
  if (b.includes(a) && a.length >= 4) return true;
  return false;
}
