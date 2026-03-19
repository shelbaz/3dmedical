export type AnatomicalSystem =
  | "skeletal"
  | "muscular"
  | "arterial"
  | "venous"
  | "nervous"
  | "lymphatic"
  | "organs"
  | "fascia"
  | "spaces";

export const SYSTEM_COLORS: Record<AnatomicalSystem, string> = {
  skeletal: "#e8dcc8",    // ivory/bone
  muscular: "#c44040",    // red-pink
  arterial: "#dc2626",    // bright red
  venous: "#3b82f6",      // blue
  nervous: "#eab308",     // yellow
  lymphatic: "#22c55e",   // green
  organs: "#f59e8b",      // salmon/flesh
  fascia: "#a78bfa",      // purple
  spaces: "#06b6d4",      // cyan (semi-transparent)
};

export const SYSTEM_LABELS: Record<AnatomicalSystem, string> = {
  skeletal: "Skeletal",
  muscular: "Muscular",
  arterial: "Arterial",
  venous: "Venous",
  nervous: "Nervous",
  lymphatic: "Lymphatic",
  organs: "Organs",
  fascia: "Fascia & Ligaments",
  spaces: "Pelvic Spaces",
};

export interface StructureInfo {
  id: string;
  name: string;
  latinName?: string;
  system: AnatomicalSystem;
  description?: string;
  clinicalSignificance?: string;
}
