export type StatusKey = "effectuee" | "enRetard" | "aVenir";

export const STATUS_META: Record<StatusKey, { label: string; color: string }> = {
  effectuee: { label: "Effectuée", color: "#0ca30c" },
  enRetard: { label: "En retard", color: "#d03b3b" },
  aVenir: { label: "À venir", color: "#9ca3af" },
};

export const STATUS_ORDER: StatusKey[] = ["effectuee", "enRetard", "aVenir"];
