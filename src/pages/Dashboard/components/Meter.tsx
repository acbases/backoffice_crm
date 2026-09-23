import { formatPercent } from "../utils/produitsFormat";

export const METER_ACCENT_COLOR = "#2a78d6";
export const METER_TRACK_COLOR = "#cde2fb";

export default function Meter({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: METER_TRACK_COLOR }}
      role="img"
      aria-label={`${formatPercent(percent)} de présence`}
    >
      <div className="h-full rounded-full" style={{ width: `${clamped}%`, backgroundColor: METER_ACCENT_COLOR }} />
    </div>
  );
}
