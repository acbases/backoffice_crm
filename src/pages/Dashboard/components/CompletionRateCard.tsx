import { Fragment, type ReactNode } from "react";

type CompletionRateCardProps = {
  done: number;
  total: number;
  enRetard: number;
  extraControls?: ReactNode;
};

const DONE_COLOR = "#0ca30c";
const NOT_DONE_COLOR = "#4a3aa7";
const UPCOMING_COLOR = "#9ca3af";
const LATE_COLOR = "#d03b3b";

export default function CompletionRateCard({ done, total, enRetard, extraControls }: CompletionRateCardProps) {
  const notDone = Math.max(total - done, 0);
  const aVenir = Math.max(notDone - enRetard, 0);
  const donePercent = total > 0 ? (done / total) * 100 : 0;
  const notDonePercent = total > 0 ? (notDone / total) * 100 : 0;
  const enRetardPercent = total > 0 ? (enRetard / total) * 100 : 0;
  const aVenirPercent = total > 0 ? (aVenir / total) * 100 : 0;

  const segments = [
    { value: donePercent, color: DONE_COLOR },
    { value: enRetardPercent, color: LATE_COLOR },
    { value: aVenirPercent, color: UPCOMING_COLOR },
  ].filter((segment) => segment.value > 0);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Taux de visites effectuées</h2>
          <p className="text-sm text-gray-500">
            Visites effectuées par rapport au total des visites créées
          </p>
        </div>

        {extraControls}
      </div>

      <p className="mb-3 text-3xl font-semibold text-gray-900">
        {total.toLocaleString("fr-FR")}{" "}
        <span className="text-base font-normal text-gray-500">visites créées</span>
      </p>

      <div
        className="flex h-8 w-full overflow-hidden rounded-full bg-gray-100"
        role="img"
        aria-label={`${donePercent.toFixed(0)}% effectuées, ${enRetardPercent.toFixed(0)}% en retard, ${aVenirPercent.toFixed(0)}% à venir`}
      >
        {segments.map((segment, index) => (
          <Fragment key={segment.color}>
            {index > 0 && <div className="w-[2px] shrink-0 bg-white" />}
            <div style={{ width: `${segment.value}%`, backgroundColor: segment.color }} />
          </Fragment>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DONE_COLOR }} />
          <span className="text-gray-600">Effectuées</span>
          <span className="font-semibold text-gray-900">
            {done.toLocaleString("fr-FR")} ({donePercent.toFixed(0)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NOT_DONE_COLOR }} />
          <span className="text-gray-600">Non effectuées</span>
          <span className="font-semibold text-gray-900">
            {notDone.toLocaleString("fr-FR")} ({notDonePercent.toFixed(0)}%)
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-6 pl-1 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LATE_COLOR }} />
          dont en retard :{" "}
          <span className="font-medium text-gray-700">
            {enRetard.toLocaleString("fr-FR")} ({enRetardPercent.toFixed(0)}%)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: UPCOMING_COLOR }} />
          dont à venir :{" "}
          <span className="font-medium text-gray-700">
            {aVenir.toLocaleString("fr-FR")} ({aVenirPercent.toFixed(0)}%)
          </span>
        </div>
      </div>
    </section>
  );
}
