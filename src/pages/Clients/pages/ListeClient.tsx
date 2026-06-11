import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ClientsContext } from "../Clients";
import { getClients } from "../api/clientApi";

export default function ListeClient() {
    const navigate = useNavigate();
    const { clients, setClients, setSelectedClientId } =
        useOutletContext<ClientsContext>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadClients = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getClients();
                setClients(data);
                if (!data.length) {
                    setSelectedClientId("");
                    return;
                }
                setSelectedClientId(String(data[0].id));
            } catch {
                setError("Unable to load clients.");
            } finally {
                setLoading(false);
            }
        };
        loadClients();
    }, [setClients, setSelectedClientId]);

    const openQrCode = (id: number) => {
        setSelectedClientId(String(id));
        navigate("../qr-code");
    };

    const getInitials = (nom: string) =>
        nom
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

    if (loading)
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Loading clients...
            </div>
        );

    if (error)
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                {error}
            </div>
        );

    if (clients.length === 0)
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                No clients found.
            </div>
        );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">Liste des clients</h2>
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
                            <th className="w-[28%] px-5 py-3">Nom</th>
                            <th className="w-[14%] px-5 py-3">Zone</th>
                            <th className="w-[20%] px-5 py-3">Quartier</th>
                            <th className="w-[16%] px-5 py-3">Latitude</th>
                            <th className="w-[16%] px-5 py-3">Longitude</th>
                            <th className="w-[6%] px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr
                                key={client.id}
                                className="border-b border-gray-100 last:border-0"
                            >
                                <td className="px-5 py-3 font-medium text-gray-900">
                                    {client.nom}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {client.zone ?? "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {client.quartier ?? "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {client.latitude ?? "—"}
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {client.longitude ?? "—"}
                                </td>
                                <td className="px-5 py-3">
                                    <button
                                        type="button"
                                        onClick={() => openQrCode(client.id)}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                                        </svg>
                                        QR
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="flex flex-col gap-3 p-4 md:hidden">
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                {getInitials(client.nom)}
                            </div>
                            <span className="font-medium text-gray-900">{client.nom}</span>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <p className="text-xs text-gray-400">Zone</p>
                                <p className="text-gray-700">{client.zone ?? "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Quartier</p>
                                <p className="text-gray-700">{client.quartier ?? "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Latitude</p>
                                <p className="text-gray-700">{client.latitude ?? "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Longitude</p>
                                <p className="text-gray-700">{client.longitude ?? "—"}</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => openQrCode(client.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                                </svg>
                                Voir QR Code
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}