import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { VisitesContext } from "../Visite";
import { getVisites } from "../api/visiteApi";

function ListeVisite() {
    const { visites, setVisites, setSelectedVisiteId } =
        useOutletContext<VisitesContext>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadVisite = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getVisites();
                setVisites(data);
                if (!data.length) {
                    setSelectedVisiteId("");
                    return;
                }
                setSelectedVisiteId(String(data[0].id));
            } catch {
                setError("Unable to load visites.");
            } finally {
                setLoading(false);
            }
        };
        loadVisite();
    }, [setSelectedVisiteId]);

    if (loading)
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Loading visites...
            </div>
        );

    if (error)
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                {error}
            </div>
        );

    if (visites.length === 0)
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                No visites found.
            </div>
        );

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Liste de tous les visites
                </h2>
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                            <th className="px-5 py-3">Client</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Catégorie</th>
                            <th className="px-5 py-3">Zone / Quartier</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Objet</th>
                            <th className="px-5 py-3">Statut</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visites.map((visite) => (
                            <tr
                                key={visite.id}
                                className="border-b border-gray-100 last:border-0"
                            >
                                <td className="px-5 py-3 font-medium text-gray-900">
                                    {visite.client?.nom ?? "Client inconnu"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {visite.type_visite?.nom ?? "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {visite.categorie_visite?.intitule ?? "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {visite.client?.zone ?? "—"} –{" "}
                                    {visite.client?.quartier ?? "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {visite.date ? formatDate(visite.date) : "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {visite.object ?? "—"}
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            visite.statut === 1
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {visite.statut === 1 ? "Terminée" : "En attente"}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <button
                                        type="button"
                                        // onClick={() => openVisite(visite.id)}
                                        className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-black whitespace-nowrap"
                                    >
                                        Voir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="flex flex-col gap-3 p-4 md:hidden">
                {visites.map((visite) => (
                    <div
                        key={visite.id}
                        className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                        <div className="mb-3 flex items-start justify-between gap-2">
                            <span className="font-medium text-gray-900">
                                {visite.client?.nom ?? "Client inconnu"}
                            </span>
                            <span
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                    visite.statut === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {visite.statut === 1 ? "Terminée" : "En attente"}
                            </span>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <p className="text-xs text-gray-400">Type</p>
                                <p className="text-gray-700">
                                    {visite.type_visite?.nom ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Catégorie</p>
                                <p className="text-gray-700">
                                    {visite.categorie_visite?.intitule ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Zone</p>
                                <p className="text-gray-700">
                                    {visite.client?.zone ?? "—"} –{" "}
                                    {visite.client?.quartier ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="text-gray-700">
                                    {visite.date ? formatDate(visite.date) : "—"}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400">Objet</p>
                                <p className="text-gray-700">{visite.object ?? "—"}</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                // onClick={() => openVisite(visite.id)}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                            >
                                Voir détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListeVisite;
