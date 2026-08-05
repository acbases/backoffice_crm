import { useMemo, useState, type ReactNode } from "react";
import BarChart from "./BarChart";
import GranularityToggle from "./GranularityToggle";
import type { BucketCount, Granularity } from "../utils/aggregateVisites";

type TimeSeriesCardProps = {
  title: string;
  subtitle?: string;
  data: BucketCount[];
  granularity: Granularity;
  onGranularityChange: (granularity: Granularity) => void;
  color: string;
  extraControls?: ReactNode;
  extraStats?: ReactNode;
};

export default function TimeSeriesCard({
  title,
  subtitle,
  data,
  granularity,
  onGranularityChange,
  color,
  extraControls,
  extraStats,
}: TimeSeriesCardProps) {
  const [showTable, setShowTable] = useState(false);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extraControls}
          <GranularityToggle value={granularity} onChange={onGranularityChange} />
          <button
            type="button"
            onClick={() => setShowTable((s) => !s)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            {showTable ? "Voir le graphe" : "Voir en tableau"}
          </button>
        </div>
      </div>

      <p className="mb-3 text-3xl font-semibold text-gray-900">{total.toLocaleString("fr-FR")}</p>

      {extraStats && <div className="mb-3">{extraStats}</div>}

      {showTable ? (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">Période</th>
                <th className="px-3 py-2">Visites</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.key} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-2 text-gray-700">{d.label}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <BarChart data={data} color={color} />
      )}
    </section>
  );
}
