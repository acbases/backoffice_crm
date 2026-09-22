import { useMemo, useState } from "react";
import type { ProduitStat } from "../api/produitsStatsApi";
import { formatPercent, formatVolume } from "../utils/produitsFormat";
import type { ProduitDetailTarget } from "./ProduitDetailModal";

// Palette catégorielle fixe (ordre validé du design system) : jamais cyclée au-delà de 8,
// le reliquat au-delà de 8 produits est plié dans "Autres" (gris de-emphasis).
const SLICE_COLORS = [
  "#2a78d6", // bleu
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // jaune
  "#e87ba4", // magenta
  "#008300", // vert
  "#4a3aa7", // violet
  "#e34948", // rouge
];
const AUTRES_COLOR = "#9ca3af";
const SURFACE_COLOR = "#ffffff";
const MAX_NAMED_SLICES = SLICE_COLORS.length;

type Slice = {
  key: string;
  label: string;
  volume: number;
  color: string;
  target: ProduitDetailTarget | null;
};

// Luminance perceptuelle simple pour choisir un texte clair ou sombre selon le fond.
function textColorOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 140 ? "#0b0b0b" : "#ffffff";
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${largeArc} 1 ${end.x},${end.y} Z`;
}

type ProduitsVolumePieChartProps = {
  produits: ProduitStat[];
  onSelect?: (target: ProduitDetailTarget) => void;
};

export default function ProduitsVolumePieChart({ produits, onSelect }: ProduitsVolumePieChartProps) {
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(null);

  const slices = useMemo<Slice[]>(() => {
    const sorted = [...produits].sort((a, b) => b.volume_total - a.volume_total);
    const named = sorted.slice(0, MAX_NAMED_SLICES);
    const rest = sorted.slice(MAX_NAMED_SLICES);
    const restVolume = rest.reduce((sum, p) => sum + p.volume_total, 0);

    const items: Slice[] = named.map((p, i) => ({
      key: `${p.produit_id ?? p.nom}-${i}`,
      label: p.nom,
      volume: p.volume_total,
      color: SLICE_COLORS[i],
      target: { type: p.type, produitId: p.produit_id, nom: p.nom },
    }));

    if (rest.length > 0) {
      items.push({ key: "autres", label: "Autres", volume: restVolume, color: AUTRES_COLOR, target: null });
    }

    return items;
  }, [produits]);

  const total = slices.reduce((sum, s) => sum + s.volume, 0);

  if (slices.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
        Aucune donnée sur cette période.
      </p>
    );
  }

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  let cumulativeAngle = 0;
  const arcs = slices.map((slice) => {
    const fraction = total > 0 ? slice.volume / total : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + fraction * Math.PI * 2;
    cumulativeAngle = endAngle;
    const midAngle = (startAngle + endAngle) / 2;
    const percent = fraction * 100;
    return { slice, startAngle, endAngle, midAngle, percent };
  });

  const visibleArcs = arcs.filter((arc) => arc.percent > 0);

  const selectSlice = (slice: Slice) => {
    if (slice.target && onSelect) onSelect(slice.target);
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={`Répartition du volume par produit : ${arcs
            .map(({ slice, percent }) => `${slice.label} ${formatPercent(percent)}`)
            .join(", ")}`}
        >
          {visibleArcs.length === 0 ? null : visibleArcs.length === 1 ? (
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={visibleArcs[0].slice.color}
              style={{ cursor: visibleArcs[0].slice.target ? "pointer" : "default" }}
              onClick={() => selectSlice(visibleArcs[0].slice)}
            />
          ) : (
            arcs.map(({ slice, startAngle, endAngle, midAngle, percent }, index) => {
              if (percent <= 0) return null;
              const isHovered = hovered?.index === index;
              const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);

              return (
                <g key={slice.key}>
                  <path
                    d={describeArc(cx, cy, r, startAngle, endAngle)}
                    fill={slice.color}
                    stroke={SURFACE_COLOR}
                    strokeWidth={2}
                    opacity={isHovered ? 0.85 : 1}
                    onMouseEnter={(e) => setHovered({ index, x: e.clientX, y: e.clientY })}
                    onMouseMove={(e) => setHovered({ index, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => selectSlice(slice)}
                    style={{ cursor: slice.target ? "pointer" : "default" }}
                  />
                  {percent >= 8 && (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fontSize={11}
                      fontWeight={600}
                      fill={textColorOn(slice.color)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                    >
                      {formatPercent(percent)}
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>

        {hovered && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{ left: hovered.x + 12, top: hovered.y + 12 }}
          >
            <p className="mb-1 font-semibold text-gray-900">{arcs[hovered.index].slice.label}</p>
            <p className="text-gray-600">{formatVolume(arcs[hovered.index].slice.volume)}</p>
            <p className="text-gray-600">{formatPercent(arcs[hovered.index].percent)}</p>
          </div>
        )}
      </div>

      <div className="flex min-w-[180px] flex-1 flex-col gap-2 text-sm">
        {arcs.map(({ slice, percent }) => (
          <div
            key={slice.key}
            role={slice.target ? "button" : undefined}
            tabIndex={slice.target ? 0 : undefined}
            onClick={() => selectSlice(slice)}
            onKeyDown={(event) => {
              if (slice.target && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                selectSlice(slice);
              }
            }}
            className={`flex items-center gap-2 rounded ${slice.target ? "cursor-pointer hover:bg-gray-50" : ""}`}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="flex-1 truncate text-gray-600">{slice.label}</span>
            <span className="font-semibold text-gray-900">{formatPercent(percent)}</span>
            <span className="text-xs text-gray-500">({formatVolume(slice.volume)})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
