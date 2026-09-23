import { useEffect, useMemo, useState } from "react";
import { getPlvStats, type PlvClassementItem, type PlvStatsResponse } from "../api/plvStatsApi";
import AgenceSelect from "./AgenceSelect";

const ACCENT_COLOR = "#2a78d6";
const ACCENT_TRACK_COLOR = "#cde2fb";

function formatPercent(value: number | null): string {
  return value == null ? "—" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}%`;
}

function Meter({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: ACCENT_TRACK_COLOR }}
      role="img"
      aria-label={`${formatPercent(percent)} de présence`}
    >
      <div className="h-full rounded-full" style={{ width: `${clamped}%`, backgroundColor: ACCENT_COLOR }} />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value.toLocaleString("fr-FR")}</p>
    </div>
  );
}

function ClassementRow({ plv, rank }: { plv: PlvClassementItem; rank: number }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-3 py-2 text-gray-400">{rank}</td>
      <td className="px-3 py-2 font-medium text-gray-900">{plv.nom}</td>
      <td className="px-3 py-2 text-right tabular-nums text-gray-700">{plv.nb_visites.toLocaleString("fr-FR")}</td>
      <td className="px-3 py-2 text-right tabular-nums text-gray-700">{plv.nb_recensements.toLocaleString("fr-FR")}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-16">
            <Meter percent={plv.taux_presence} />
          </div>
          <span className="tabular-nums text-gray-700">{formatPercent(plv.taux_presence)}</span>
        </div>
      </td>
    </tr>
  );
}

export default function PlvStatsCard() {
  const [periode, setPeriode] = useState("");
  const [agenceId, setAgenceId] = useState("");
  const [stats, setStats] = useState<PlvStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { annee, mois } = useMemo(() => {
    if (!periode) return { annee: undefined, mois: undefined };
    const [y, m] = periode.split("-").map(Number);
    return { annee: y, mois: m };
  }, [periode]);

  const agenceIdNumber = agenceId ? Number(agenceId) : undefined;

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlvStats({ annee, mois, agence_id: agenceIdNumber });
        if (!ignore) setStats(data);
      } catch (err) {
        console.error("Erreur chargement stats PLV :", err);
        if (!ignore) setError("Impossible de charger les statistiques PLV.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [annee, mois, agenceIdNumber]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Statistiques PLV</h2>
          <p className="text-sm text-gray-500">Présence des PLV recensée pendant les visites terrain</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AgenceSelect value={agenceId} onChange={setAgenceId} />
          <input
            type="month"
            value={periode}
            onChange={(event) => setPeriode(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
          />
          {periode && (
            <button
              type="button"
              onClick={() => setPeriode("")}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Toutes les périodes
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement des statistiques PLV...</p>
      ) : error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</p>
      ) : stats ? (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile label="Visites avec rapport" value={stats.total_visites_avec_rapport} />
            <StatTile label="Visites avec PLV" value={stats.total_visites_avec_plv} />
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">Taux de présence global</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{formatPercent(stats.taux_presence_global)}</p>
              <div className="mt-2">
                <Meter percent={stats.taux_presence_global} />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">PLV la plus présente</h3>
            {stats.plv_le_plus_present ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-base font-semibold text-gray-900">{stats.plv_le_plus_present.nom}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {stats.plv_le_plus_present.nb_visites.toLocaleString("fr-FR")} visites ·{" "}
                    {stats.plv_le_plus_present.nb_recensements.toLocaleString("fr-FR")} recensement
                    {stats.plv_le_plus_present.nb_recensements > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <Meter percent={stats.plv_le_plus_present.taux_presence} />
                  </div>
                  <span className="font-semibold text-gray-900">{formatPercent(stats.plv_le_plus_present.taux_presence)}</span>
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aucune donnée sur cette période.
              </p>
            )}
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Classement des PLV</h3>
            {stats.classement_plv.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aucune donnée sur cette période.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">PLV</th>
                      <th className="px-3 py-2 text-right">Visites</th>
                      <th className="px-3 py-2 text-right">Recensements</th>
                      <th className="px-3 py-2">Taux de présence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.classement_plv.map((plv, index) => (
                      <ClassementRow key={plv.plv_id} plv={plv} rank={index + 1} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Autre PLV (champ libre)</h3>
            {stats.autre_plv.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aucune donnée sur cette période.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stats.autre_plv.map((item) => (
                  <span
                    key={item.valeur}
                    title={item.variantes.length > 1 ? item.variantes.join(", ") : undefined}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
                  >
                    {item.valeur}
                    <span className="text-gray-400">×{item.nb_occurrences.toLocaleString("fr-FR")}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
