import { STRUCTURE_REGISTRY } from "./structureRegistry";
import { SYSTEM_COLORS } from "../types/anatomy";

const registryNames = STRUCTURE_REGISTRY.map((s) => s.name);

/** Match a relation name (e.g. "Uterine Artery") to actual registry entries
 *  (e.g. "Uterine Artery (L)", "Uterine Artery (R)") */
function matchName(name: string): string[] {
  const lower = name.toLowerCase();
  // Exact match
  if (registryNames.find((n) => n.toLowerCase() === lower)) return [name];
  // Find all entries that start with the name
  const matches = registryNames.filter(
    (n) => n.toLowerCase().startsWith(lower) || n.toLowerCase().includes(lower)
  );
  return matches;
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

  function addRelations(items: string[] | undefined, color: string, system: string) {
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

  addRelations(details.arterialSupply, SYSTEM_COLORS.arterial, "arterial");
  addRelations(details.venousDrainage, SYSTEM_COLORS.venous, "venous");
  addRelations(details.innervation, SYSTEM_COLORS.nervous, "nervous");
  addRelations(details.lymphaticDrainage, SYSTEM_COLORS.lymphatic, "lymphatic");

  return { names, colors, systems };
}

/** Fuzzy match for quiz answers */
export function isQuizMatch(input: string, target: string): boolean {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (a === b) return true;
  // Strip parenthetical suffixes for matching
  const normalize = (s: string) =>
    s.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
  if (normalize(a) === normalize(b)) return true;
  // Check containment
  if (b.includes(a) && a.length >= 4) return true;
  return false;
}
