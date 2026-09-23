import { useEffect, useState } from "react";
import {
  getProduitDetail,
  type PrixReleveExtreme,
  type ProduitDetailResponse,
  type ProduitStatType,
} from "../api/produitsStatsApi";
import { formatPrice, formatPercent, formatVolume } from "../utils/produitsFormat";
import OrigineBadge from "./OrigineBadge";
import Meter from "./Meter";

export type ProduitDetailTarget = {
  type: ProduitStatType;
  produitId: number | null;
  nom: string;
};

type ProduitDetailModalProps = {
  target: ProduitDetailTarget;
  annee?: number;
  mois?: number;
  agenceId?: number;
  onClose: () => void;
};

function PriceExtremeTag({ entry }: { entry: PrixReleveExtreme | null }) {
  if (!entry) return <span className="text-sm text-gray-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
      {formatPrice(entry.valeur)} — {entry.client}
    </span>
  );
}

function VolumeExtremeTag({ entry }: { entry: PrixReleveExtreme | null }) {
  if (!entry) return <span className="text-sm text-gray-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
      {formatVolume(entry.valeur)} — {entry.client}
    </span>
  );
}

export default function ProduitDetailModal({ target, annee, mois, agenceId, onClose }: ProduitDetailModalProps) {
  const [detail, setDetail] = useState<ProduitDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProduitDetail({
          type: target.type,
          produit_id: target.type === "catalogue" ? target.produitId ?? undefined : undefined,
          nom: target.type === "autre" ? target.nom : undefined,
          annee,
          mois,
          agence_id: agenceId,
        });
        if (!ignore) setDetail(data);
      } catch (err) {
        console.error("Erreur chargement détail produit :", err);
        if (!ignore) setError("Impossible de charger le détail de ce produit.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [target.type, target.produitId, target.nom, annee, mois, agenceId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl mx-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg text-red-500 hover:bg-red-100"
        >
          ✕
        </button>

        {loading ? (
          <p className="text-sm text-gray-500">Chargement du détail...</p>
        ) : error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</p>
        ) : detail ? (
          <>
            <div className="mb-1 flex items-center gap-2 pr-8">
              <h2 className="text-lg font-semibold text-gray-900">{detail.nom}</h2>
              <OrigineBadge origine={detail.origine} />
            </div>
            <p className="mb-5 text-xs text-gray-500">
              {detail.nb_occurrences} relevé{detail.nb_occurrences > 1 ? "s" : ""} sur la période
            </p>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">Prix d'achat moyen</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(detail.prix_moyen.prix_achat)}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">Prix de vente gros moyen</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(detail.prix_moyen.prix_vente_gros)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">Prix de vente détails moyen</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(detail.prix_moyen.prix_vente_details)}
                </p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">Volume moyen</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatVolume(detail.volume_moyen)}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">Présence chez les clients</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {detail.presence.nb_clients} / {detail.presence.nb_clients_visites} clients
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1">
                    <Meter percent={detail.presence.taux_presence} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {formatPercent(detail.presence.taux_presence)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Prix relevés (min / max)</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                      <th className="px-3 py-2">Prix</th>
                      <th className="px-3 py-2">Maximum</th>
                      <th className="px-3 py-2">Minimum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-2 text-gray-700">Achat</td>
                      <td className="px-3 py-2">
                        <PriceExtremeTag entry={detail.prix_max.prix_achat} />
                      </td>
                      <td className="px-3 py-2">
                        <PriceExtremeTag entry={detail.prix_min.prix_achat} />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-2 text-gray-700">Gros</td>
                      <td className="px-3 py-2">
                        <PriceExtremeTag entry={detail.prix_max.prix_vente_gros} />
                      </td>
                      <td className="px-3 py-2">
                        <PriceExtremeTag entry={detail.prix_min.prix_vente_gros} />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-700">Détail</td>
                      <td className="px-3 py-2">
                        <PriceExtremeTag entry={detail.prix_max.prix_vente_details} />
                      </td>
                      <td className="px-3 py-2">
                        <PriceExtremeTag entry={detail.prix_min.prix_vente_details} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Volume relevé (min / max)</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="mb-1 text-xs text-gray-500">Maximum</p>
                  <VolumeExtremeTag entry={detail.volume_max} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-500">Minimum</p>
                  <VolumeExtremeTag entry={detail.volume_min} />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
