import type { ReactNode } from "react";

type CompletionRateCardProps = {
  done: number;
  total: number;
  enRetard: number;
  extraControls?: ReactNode;
};

const DONE_COLOR = "#0ca30c";
const NOT_DONE_COLOR = "#9ca3af";
const LATE_COLOR = "#d03b3b";

export default function CompletionRateCard({ done, total, enRetard, extraControls }: CompletionRateCardProps) {
  const notDone = Math.max(total - done, 0);
  const donePercent = total > 0 ? (done / total) * 100 : 0;
  const notDonePercent = total > 0 ? (notDone / total) * 100 : 0;

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
        aria-label={`${donePercent.toFixed(0)}% des visites effectuées, ${notDonePercent.toFixed(0)}% non effectuées`}
      >
        {donePercent > 0 && (
          <div style={{ width: `${donePercent}%`, backgroundColor: DONE_COLOR }} />
        )}
        {donePercent > 0 && notDonePercent > 0 && <div className="w-[2px] shrink-0 bg-white" />}
        {notDonePercent > 0 && (
          <div style={{ width: `${notDonePercent}%`, backgroundColor: NOT_DONE_COLOR }} />
        )}
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
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LATE_COLOR }} />
          <span className="text-gray-600">En retard</span>
          <span className="font-semibold text-gray-900">
            {enRetard.toLocaleString("fr-FR")}
          </span>
        </div>
      </div>
    </section>
  );
}
