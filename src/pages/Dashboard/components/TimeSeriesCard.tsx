import { useMemo, useState, type ReactNode } from "react";
import MultiSeriesBarChart from "./MultiSeriesBarChart";
import GranularityToggle from "./GranularityToggle";
import StatusToggle, { type StatusFilter } from "./StatusToggle";
import type { Granularity, StatusBucketCount } from "../utils/aggregateVisites";
import { STATUS_META, STATUS_ORDER, type StatusKey } from "../utils/visiteStatus";

type TimeSeriesCardProps = {
  title: string;
  subtitle?: string;
  data: StatusBucketCount[];
  granularity: Granularity;
  onGranularityChange: (granularity: Granularity) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  extraControls?: ReactNode;
};

export default function TimeSeriesCard({
  title,
  subtitle,
  data,
  granularity,
  onGranularityChange,
  statusFilter,
  onStatusFilterChange,
  extraControls,
}: TimeSeriesCardProps) {
  const [showTable, setShowTable] = useState(false);

  const series = statusFilter === "all" ? STATUS_ORDER : [statusFilter];

  const total = useMemo(
    () => data.reduce((sum, d) => sum + series.reduce((s, key) => s + d[key], 0), 0),
    [data, series]
  );

  const totalsByStatus = useMemo(() => {
    return STATUS_ORDER.reduce((acc, key) => {
      acc[key] = data.reduce((sum, d) => sum + d[key], 0);
      return acc;
    }, {} as Record<StatusKey, number>);
  }, [data]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extraControls}
          <StatusToggle value={statusFilter} onChange={onStatusFilterChange} />
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

      <p className="mb-2 text-3xl font-semibold text-gray-900">{total.toLocaleString("fr-FR")}</p>

      <div className="mb-3 flex flex-wrap gap-4 text-sm">
        {STATUS_ORDER.map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_META[key].color }} />
            <span className="text-gray-600">{STATUS_META[key].label}</span>
            <span className="font-semibold text-gray-900">
              {totalsByStatus[key].toLocaleString("fr-FR")}
            </span>
          </div>
        ))}
      </div>

      {showTable ? (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">Période</th>
                {series.map((key) => (
                  <th key={key} className="px-3 py-2">
                    {STATUS_META[key].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.key} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-2 text-gray-700">{d.label}</td>
                  {series.map((key) => (
                    <td key={key} className="px-3 py-2 font-medium text-gray-900">
                      {d[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <MultiSeriesBarChart data={data} visibleStatuses={series} />
      )}
    </section>
  );
}
