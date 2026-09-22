import type { ProduitStatOrigine } from "../api/produitsStatsApi";

export const ORIGINE_ACCENT_COLOR = "#2a78d6";
export const ORIGINE_EXTERNE_COLOR = "#9ca3af";

export default function OrigineBadge({ origine }: { origine: ProduitStatOrigine }) {
  const isNosProduits = origine === "nos_produits";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: isNosProduits ? "#e8f0fb" : "#f3f4f6",
        color: isNosProduits ? ORIGINE_ACCENT_COLOR : "#4b5563",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: isNosProduits ? ORIGINE_ACCENT_COLOR : ORIGINE_EXTERNE_COLOR }}
      />
      {isNosProduits ? "Nos produits" : "Externe"}
    </span>
  );
}
