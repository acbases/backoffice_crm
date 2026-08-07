import { useState } from "react";
import type { StatusBucketCount } from "../utils/aggregateVisites";
import { STATUS_META, STATUS_ORDER, type StatusKey } from "../utils/visiteStatus";

type MultiSeriesBarChartProps = {
  data: StatusBucketCount[];
  visibleStatuses: StatusKey[];
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

export default function MultiSeriesBarChart({ data, visibleStatuses, height = 280 }: MultiSeriesBarChartProps) {
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(null);

  const series = STATUS_ORDER.filter((key) => visibleStatuses.includes(key));

  const width = Math.max(480, data.length * 26);
  const bottomAxisSpace = 26;
  const topSpace = 16;
  const chartHeight = height - bottomAxisSpace - topSpace;
  const baselineY = topSpace + chartHeight;

  const maxValue = niceMax(
    Math.max(...data.flatMap((d) => series.map((key) => d[key])), 0)
  );
  const midValue = Math.round(maxValue / 2);

  const slotWidth = width / Math.max(data.length, 1);
  const groupWidth = slotWidth * 0.7;
  const barGap = 2;
  const barWidth = Math.max(3, Math.min(16, (groupWidth - barGap * (series.length - 1)) / Math.max(series.length, 1)));
  const groupStart = (slotWidth - (barWidth * series.length + barGap * (series.length - 1))) / 2;

  const labelEvery = Math.max(1, Math.ceil(data.length / 8));
  const lastIndex = data.length - 1;

  const barX = (i: number, s: number) => i * slotWidth + groupStart + s * (barWidth + barGap);
  const barCenterX = (i: number, s: number) => barX(i, s) + barWidth / 2;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Graphique du nombre de visites par période et par statut"
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
          const showLabel = i === lastIndex || (i % labelEvery === 0 && lastIndex - i >= labelEvery);
          const isHovered = hovered?.index === i;

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

              {series.map((key, s) => {
                const value = d[key];
                const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
                const x = barX(i, s);
                const yTop = baselineY - barHeight;

                if (value <= 0) return null;

                return (
                  <path
                    key={key}
                    d={roundedTopBarPath(x, yTop, barWidth, barHeight, 3)}
                    fill={STATUS_META[key].color}
                    opacity={isHovered ? 0.85 : 1}
                    pointerEvents="none"
                  />
                );
              })}

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

        {series.map((key, s) => {
          const points = data.map((d, i) => {
            const value = d[key];
            const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
            return {
              x: barCenterX(i, s),
              y: baselineY - barHeight,
            };
          });
          const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

          return (
            <g key={key} pointerEvents="none">
              <path
                d={linePath}
                fill="none"
                stroke={STATUS_META[key].color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle
                  key={data[i].key}
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill={STATUS_META[key].color}
                  stroke="#fcfcfb"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <p className="mb-1 font-semibold text-gray-900">{data[hovered.index].label}</p>
          {series.map((key) => (
            <p key={key} className="flex items-center gap-1.5 text-gray-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_META[key].color }} />
              {STATUS_META[key].label} : {data[hovered.index][key]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
