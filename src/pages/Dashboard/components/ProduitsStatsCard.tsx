import { useEffect, useMemo, useState } from "react";
import { getProduitsStats, type ProduitStat, type ProduitsStatsResponse } from "../api/produitsStatsApi";
import { formatPrice, formatPercent, formatVolume, formatVolumeNumber } from "../utils/produitsFormat";
import ProduitsVolumePieChart from "./ProduitsVolumePieChart";
import OrigineBadge, { ORIGINE_ACCENT_COLOR, ORIGINE_EXTERNE_COLOR } from "./OrigineBadge";
import ProduitDetailModal, { type ProduitDetailTarget } from "./ProduitDetailModal";
import AgenceSelect from "./AgenceSelect";

const ACCENT_COLOR = ORIGINE_ACCENT_COLOR;
const EXTERNE_COLOR = ORIGINE_EXTERNE_COLOR;

function StatTile({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{formatPrice(value)}</p>
    </div>
  );
}

function PriceStat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{formatPrice(value)}</p>
    </div>
  );
}

function ProductRow({
  produit,
  rank,
  onSelect,
}: {
  produit: ProduitStat;
  rank: number;
  onSelect: (target: ProduitDetailTarget) => void;
}) {
  const select = () => onSelect({ type: produit.type, produitId: produit.produit_id, nom: produit.nom });

  return (
    <tr
      className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
      role="button"
      tabIndex={0}
      onClick={select}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      }}
    >
      <td className="px-3 py-2 text-gray-400">{rank}</td>
      <td className="px-3 py-2 font-medium text-gray-900">{produit.nom}</td>
      <td className="px-3 py-2">
        <OrigineBadge origine={produit.origine} />
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-gray-700">
        {formatVolumeNumber(produit.volume_total)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-gray-700">{formatPrice(produit.prix_achat_moyen)}</td>
      <td className="px-3 py-2 text-right tabular-nums text-gray-700">
        {formatPrice(produit.prix_vente_gros_moyen)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-gray-700">
        {formatPrice(produit.prix_vente_details_moyen)}
      </td>
    </tr>
  );
}

export default function ProduitsStatsCard() {
  const [periode, setPeriode] = useState("");
  const [limit, setLimit] = useState(10);
  const [agenceId, setAgenceId] = useState("");
  const [stats, setStats] = useState<ProduitsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduit, setSelectedProduit] = useState<ProduitDetailTarget | null>(null);

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
        const data = await getProduitsStats({ annee, mois, limit, agence_id: agenceIdNumber });
        if (!ignore) setStats(data);
      } catch (err) {
        console.error("Erreur chargement stats produits :", err);
        if (!ignore) setError("Impossible de charger les statistiques produits.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [annee, mois, limit, agenceIdNumber]);

  const partMarche = stats?.part_marche ?? null;
  const volumeNosProduits = partMarche?.nos_produits.volume ?? 0;
  const volumeExterne = partMarche?.produits_externes.volume ?? 0;
  const hasPartMarcheData = volumeNosProduits + volumeExterne > 0;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Statistiques produits</h2>
          <p className="text-sm text-gray-500">
            Prix moyens, meilleur produit et part de marché relevés pendant les visites
          </p>
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
          <select
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement des statistiques produits...</p>
      ) : error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</p>
      ) : stats ? (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile label="Prix d'achat moyen" value={stats.prix_moyen_par_type.prix_achat} />
            <StatTile label="Prix de vente gros moyen" value={stats.prix_moyen_par_type.prix_vente_gros} />
            <StatTile label="Prix de vente détails moyen" value={stats.prix_moyen_par_type.prix_vente_details} />
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Meilleur produit</h3>
            {stats.meilleur_produit ? (
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50"
                role="button"
                tabIndex={0}
                onClick={() =>
                  setSelectedProduit({
                    type: stats.meilleur_produit!.type,
                    produitId: stats.meilleur_produit!.produit_id,
                    nom: stats.meilleur_produit!.nom,
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedProduit({
                      type: stats.meilleur_produit!.type,
                      produitId: stats.meilleur_produit!.produit_id,
                      nom: stats.meilleur_produit!.nom,
                    });
                  }
                }}
              >
                <div>
                  <p className="flex items-center gap-2 text-base font-semibold text-gray-900">
                    {stats.meilleur_produit.nom}
                    <OrigineBadge origine={stats.meilleur_produit.origine} />
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatVolume(stats.meilleur_produit.volume_total)} vendus en moyenne ·{" "}
                    {stats.meilleur_produit.nb_occurrences} relevé
                    {stats.meilleur_produit.nb_occurrences > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-5 text-sm">
                  <PriceStat label="Achat" value={stats.meilleur_produit.prix_achat_moyen} />
                  <PriceStat label="Gros" value={stats.meilleur_produit.prix_vente_gros_moyen} />
                  <PriceStat label="Détail" value={stats.meilleur_produit.prix_vente_details_moyen} />
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aucune donnée sur cette période.
              </p>
            )}
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Tous les produits</h3>
            {stats.produits.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aucune donnée sur cette période.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Produit</th>
                      <th className="px-3 py-2">Origine</th>
                      <th className="px-3 py-2 text-right">Volume (t/semaine)</th>
                      <th className="px-3 py-2 text-right">Prix achat moy.</th>
                      <th className="px-3 py-2 text-right">Prix gros moy.</th>
                      <th className="px-3 py-2 text-right">Prix détail moy.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.produits.map((produit, index) => (
                      <ProductRow
                        key={`${produit.produit_id ?? produit.nom}-${index}`}
                        produit={produit}
                        rank={index + 1}
                        onSelect={setSelectedProduit}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Répartition du volume par produit</h3>
            <ProduitsVolumePieChart produits={stats.produits} onSelect={setSelectedProduit} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Part de marché</h3>
            {hasPartMarcheData ? (
              <>
                <div
                  className="flex h-6 w-full overflow-hidden rounded-full bg-gray-100"
                  role="img"
                  aria-label={`${formatPercent(partMarche?.nos_produits.pourcentage ?? null)} nos produits, ${formatPercent(
                    partMarche?.produits_externes.pourcentage ?? null
                  )} produits externes`}
                >
                  {volumeNosProduits > 0 && (
                    <div
                      style={{
                        width: `${(volumeNosProduits / (volumeNosProduits + volumeExterne)) * 100}%`,
                        backgroundColor: ACCENT_COLOR,
                      }}
                    />
                  )}
                  {volumeNosProduits > 0 && volumeExterne > 0 && <div className="w-[2px] shrink-0 bg-white" />}
                  {volumeExterne > 0 && (
                    <div
                      style={{
                        width: `${(volumeExterne / (volumeNosProduits + volumeExterne)) * 100}%`,
                        backgroundColor: EXTERNE_COLOR,
                      }}
                    />
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACCENT_COLOR }} />
                    <span className="text-gray-600">Nos produits</span>
                    <span className="font-semibold text-gray-900">
                      {formatPercent(partMarche?.nos_produits.pourcentage ?? null)} ({formatVolume(volumeNosProduits)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EXTERNE_COLOR }} />
                    <span className="text-gray-600">Produits externes</span>
                    <span className="font-semibold text-gray-900">
                      {formatPercent(partMarche?.produits_externes.pourcentage ?? null)} ({formatVolume(volumeExterne)})
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aucune donnée sur cette période.
              </p>
            )}
          </div>
        </>
      ) : null}

      {selectedProduit && (
        <ProduitDetailModal
          target={selectedProduit}
          annee={annee}
          mois={mois}
          agenceId={agenceIdNumber}
          onClose={() => setSelectedProduit(null)}
        />
      )}
    </section>
  );
}
