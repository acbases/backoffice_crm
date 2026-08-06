import { useState } from "react";
import type { BucketCount } from "../utils/aggregateVisites";

type BarChartProps = {
  data: BucketCount[];
  color?: string;
  height?: number;
};

const GRID_COLOR = "#e1e0d9";
const AXIS_COLOR = "#c3c2b7";
const MUTED_TEXT = "#898781";

function niceMax(value: number): number {
  if (value <= 0) return 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  let niceResidual = 10;
  if (residual <= 1) niceResidual = 1;
  else if (residual <= 2) niceResidual = 2;
  else if (residual <= 5) niceResidual = 5;
  return niceResidual * magnitude;
}

function roundedTopBarPath(x: number, yTop: number, width: number, barHeight: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, width / 2, barHeight));
  const yBase = yTop + barHeight;

  return `M${x},${yTop + r}
    Q${x},${yTop} ${x + r},${yTop}
    L${x + width - r},${yTop}
    Q${x + width},${yTop} ${x + width},${yTop + r}
    L${x + width},${yBase}
    L${x},${yBase}
    Z`;
}

export default function BarChart({ data, color = "#2a78d6", height = 280 }: BarChartProps) {
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(null);

  const width = Math.max(480, data.length * 26);
  const bottomAxisSpace = 26;
  const topSpace = 16;
  const chartHeight = height - bottomAxisSpace - topSpace;
  const baselineY = topSpace + chartHeight;

  const maxValue = niceMax(Math.max(...data.map((d) => d.value), 0));
  const midValue = Math.round(maxValue / 2);

  const slotWidth = width / Math.max(data.length, 1);
  const barWidth = Math.max(3, Math.min(12, slotWidth * 0.35));
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));
  const lastIndex = data.length - 1;

  return (
    <div className="relative">
      <p className="mb-1 text-xs font-medium text-gray-500">Nombre de visites</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Graphique du nombre de visites par période"
      >
        {[0, 0.5, 1].map((fraction) => {
          const y = baselineY - fraction * chartHeight;
          const label = fraction === 0 ? 0 : fraction === 1 ? maxValue : midValue;
          return (
            <g key={fraction}>
              <line x1={0} x2={width} y1={y} y2={y} stroke={GRID_COLOR} strokeWidth={1} />
              <text x={0} y={y - 4} fontSize={10} fill={MUTED_TEXT}>
                {label}
              </text>
            </g>
          );
        })}

        <line x1={0} x2={width} y1={baselineY} y2={baselineY} stroke={AXIS_COLOR} strokeWidth={1} />

        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
          const x = i * slotWidth + (slotWidth - barWidth) / 2;
          const yTop = baselineY - barHeight;
          const isHovered = hovered?.index === i;
          const showLabel =
            i === lastIndex || (i % labelEvery === 0 && lastIndex - i >= labelEvery);

          return (
            <g key={d.key}>
              <rect
                x={i * slotWidth}
                y={topSpace}
                width={slotWidth}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={(e) => setHovered({ index: i, x: e.clientX, y: e.clientY })}
                onMouseMove={(e) => setHovered({ index: i, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              />
              {d.value > 0 && (
                <path
                  d={roundedTopBarPath(x, yTop, barWidth, barHeight, 4)}
                  fill={color}
                  opacity={isHovered ? 0.85 : 1}
                  pointerEvents="none"
                />
              )}
              {showLabel && (
                <text
                  x={i * slotWidth + slotWidth / 2}
                  y={height - 8}
                  fontSize={10}
                  fill={MUTED_TEXT}
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}

        {(() => {
          const points = data.map((d, i) => ({
            x: i * slotWidth + slotWidth / 2,
            y: baselineY - (maxValue > 0 ? (d.value / maxValue) * chartHeight : 0),
          }));
          const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

          return (
            <g pointerEvents="none">
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle key={data[i].key} cx={p.x} cy={p.y} r={4} fill={color} stroke="#fcfcfb" strokeWidth={2} />
              ))}
            </g>
          );
        })()}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <p className="font-semibold text-gray-900">{data[hovered.index].label}</p>
          <p className="text-gray-500">
            {data[hovered.index].value} visite{data[hovered.index].value > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
