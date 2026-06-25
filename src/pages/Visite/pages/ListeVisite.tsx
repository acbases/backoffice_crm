import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import type { VisitesContext } from "../Visite";
import { getVisites } from "../api/visiteApi";
import DetailVisite from "../components/DetailVisite";
import ListeVisiteMobile from "../components/ListeVisiteMobile";
import { getFilteredVisites } from "../utils/FilteredVisites";

//filters
import { type ClientItem, getClients } from "@/pages/Clients/api/clientApi";
import VisiteFilters from "../components/VisiteFilter";
import { getUsers, type UserItem } from "@/pages/Utilisateurs/api/utilisateurApi";
import { getTypeVisites, type TypeVisiteItem } from "../api/typeVisiteApi";
import { getCategorieVisites, type CategorieVisiteItem } from "../api/categorieVisiteApi";
import { getZones } from "@/pages/Clients/api/zoneApi";
import { getQuartiers } from "@/pages/Clients/api/quartierApi";
import { File, SquareArrowOutUpRight } from "lucide-react";

import { exportVisitesToExcel } from "../utils/ExportVisitesToExcel";

function ListeVisite() {
    // visites states
    const { visites, setVisites } =
        useOutletContext<VisitesContext>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // visites loading
    useEffect(() => {
        const loadVisite = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getVisites();
                setVisites(data);

            } catch {
                setError("Unable to load visites.");
            } finally {
                setLoading(false);
            }
        };
        loadVisite();
    }, [setVisites]);

    // filters data state 
    const [clientsOptions, setClientsOptions] = useState<ClientItem[]>([])
    const [userOptions, setUsersOptions] = useState<UserItem[]>([])
    const [typeVisiteOptions, setTypeVisiteOptions] = useState<TypeVisiteItem[]>([])
    const [categorieVisiteOptions, setCategorieVisiteOptions] = useState<CategorieVisiteItem[]>([])
    const [zoneOptions, setZoneOptions] = useState<string[]>([]);
    const [quartierOptions, setQuartierOptions] = useState<string[]>([]);
    type StatutOptions = ["A venir", "Terminée", "En retard"]
    const [statutOptions, setStatutOptions] = useState<StatutOptions>(["A venir", "Terminée", "En retard"])
    // loading filters 
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [clients, users, typeVisites, categorieVisites, zones, quartiers] = await Promise.all([
                    getClients(),
                    getUsers(),
                    getTypeVisites(),
                    getCategorieVisites(),
                    getZones(),
                    getQuartiers(),
                ])
                setClientsOptions(clients)
                setUsersOptions(users)
                setTypeVisiteOptions(typeVisites),
                    setCategorieVisiteOptions(categorieVisites)
                setZoneOptions(zones)
                setQuartierOptions(quartiers)
            } catch {

            }
        }
        loadFilters();
    }, [])
    // filter values states 
    const [clientsFilter, setClientFilter] = useState("")
    const [usersFilter, setUsersFilter] = useState("")
    const [planifiedFilter, setPlanifiedFilter] = useState("")
    const [typeVisiteFilter, setTypeVisiteFilter] = useState("")
    const [categorieVisiteFilter, setCategorieVisiteFilter] = useState("")
    const [zoneFilter, setZoneFilter] = useState("")
    const [quartierFilter, setQuartierFilter] = useState("")
    const [statutFilter, setStatutFilter] = useState("")

    // sorting 
    type SortKey =
        | "id"
        | "client"
        | "utilisateur"
        | "planifiee"
        | "type"
        | "categorie"
        | "zone"
        | "quartier"
        | "date"
        | "statut";

    const [sortConfig, setSortConfig] = useState<{
        key: SortKey;
        order: "asc" | "desc";
    }>({
        key: "id",
        order: "desc",
    });
    const handleSort = (key: SortKey) => {
        setSortConfig(prev =>
            prev.key === key
                ? {
                    key,
                    order: prev.order === "asc" ? "desc" : "asc",
                }
                : {
                    key,
                    order: "asc",
                }
        );
    };

    const SortableHeader = ({
        label,
        sortKey,
    }: {
        label: string;
        sortKey: SortKey;
    }) => (
        <button
            onClick={() => handleSort(sortKey)}
            className="flex items-center gap-1 hover:text-gray-900"
        >
            {label}
            <span className="text-[10px]">
                {sortConfig.key === sortKey
                    ? sortConfig.order === "asc"
                        ? "▲"
                        : "▼"
                    : ""}
            </span>
        </button>
    );

    // visite filter handling 
    const filteredVisites = useMemo(() => {
        const filtered = getFilteredVisites(visites, {
            clientsFilter,
            usersFilter,
            planifiedFilter,
            typeVisiteFilter,
            categorieVisiteFilter,
            zoneFilter,
            quartierFilter,
            statutFilter
        });

        return filtered.sort((a, b) => {
            switch (sortConfig.key) {
                case "id":
                    return sortConfig.order === "asc"
                        ? a.id - b.id
                        : b.id - a.id;

                case "client": {
                    const valueA = a.client?.nom ?? "";
                    const valueB = b.client?.nom ?? "";

                    return sortConfig.order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                case "utilisateur": {
                    const valueA =
                        `${a.utilisateur?.firstname ?? ""} ${a.utilisateur?.name ?? ""}`.trim();

                    const valueB =
                        `${b.utilisateur?.firstname ?? ""} ${b.utilisateur?.name ?? ""}`.trim();

                    return sortConfig.order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                case "planifiee":
                    return sortConfig.order === "asc"
                        ? a.type - b.type
                        : b.type - a.type;

                case "type": {
                    const valueA = a.type_visite?.nom ?? "";
                    const valueB = b.type_visite?.nom ?? "";

                    return sortConfig.order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                case "categorie": {
                    const valueA = a.categorie_visite?.intitule ?? "";
                    const valueB = b.categorie_visite?.intitule ?? "";

                    return sortConfig.order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                case "zone": {
                    const valueA = a.client?.zone ?? "";
                    const valueB = b.client?.zone ?? "";

                    return sortConfig.order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                case "quartier": {
                    const valueA = a.client?.quartier ?? "";
                    const valueB = b.client?.quartier ?? "";

                    return sortConfig.order === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                case "date": {
                    const dateA = a.date
                        ? new Date(a.date).getTime()
                        : 0;

                    const dateB = b.date
                        ? new Date(b.date).getTime()
                        : 0;

                    return sortConfig.order === "asc"
                        ? dateA - dateB
                        : dateB - dateA;
                }

                case "statut": {
                    const getStatusOrder = (visite: typeof a) => {
                        const isPast =
                            visite.date &&
                            new Date(visite.date) < new Date();

                        if (visite.statut === 1) return 2; // Terminée
                        if (visite.statut === 0 && isPast) return 0; // En retard

                        return 1; // A venir
                    };

                    const valueA = getStatusOrder(a);
                    const valueB = getStatusOrder(b);

                    return sortConfig.order === "asc"
                        ? valueA - valueB
                        : valueB - valueA;
                }

                default:
                    return 0;
            }
        });
    }, [visites, clientsFilter, usersFilter, planifiedFilter, typeVisiteFilter, categorieVisiteFilter, zoneFilter, quartierFilter, statutFilter, sortConfig])


    // handling modal 
    const openVisite = (id: number) => {
        setSelectedId(String(id));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedId(null);
    };


    // display handling with error
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
        <div className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex gap-6 border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Liste de tous les visites
                </h2>
                <button
                    onClick={() => exportVisitesToExcel(visites)}
                    className="flex gap-1 items-center justify-center text-sm px-2 transition-colors duration-100 bg-blue-200 rounded-lg hover:bg-blue-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                >
                    <File
                        className="w-[15px] h-[15px] text-gray-500 "
                    />
                    Extraction
                </button>
            </div>

            <div className="mt-4 ml-2">
                <VisiteFilters
                    clientFilter={clientsFilter}
                    setClientsFilter={setClientFilter}
                    clientsOptions={clientsOptions}
                    usersFilter={usersFilter}
                    setUsersFilter={setUsersFilter}
                    userOptions={userOptions}
                    planifiedFilter={planifiedFilter}
                    setPlanifiedFilter={setPlanifiedFilter}
                    typeVisiteFilter={typeVisiteFilter}
                    setTypeVisiteFilter={setTypeVisiteFilter}
                    typeVisiteOptions={typeVisiteOptions}
                    categorieVisiteFilter={categorieVisiteFilter}
                    setCategorieVisiteFilter={setCategorieVisiteFilter}
                    categorieVisiteOptions={categorieVisiteOptions}
                    zoneFilter={zoneFilter}
                    setZoneFilter={setZoneFilter}
                    zoneOptions={zoneOptions}
                    quartierFilter={quartierFilter}
                    setQuartierFilter={setQuartierFilter}
                    quartierOptions={quartierOptions}
                    statutFilter={statutFilter}
                    setStatutFilter={setStatutFilter}
                    statutOptions={statutOptions}
                />
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden md:flex-1 md:block md:min-h-0 md:overflow-y-auto">
                <table className="w-full text-sm ml-4 mt-2">
                    <thead className="py-4">
                        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 ">
                            <th className="px-1 py-3"></th>
                            <th><SortableHeader label="Id" sortKey="id" /></th>
                            <th><SortableHeader label="Client" sortKey="client" /></th>
                            <th><SortableHeader label="Utilisateur" sortKey="utilisateur" /></th>
                            <th><SortableHeader label="Planifiée" sortKey="planifiee" /></th>
                            <th><SortableHeader label="Type" sortKey="type" /></th>
                            <th><SortableHeader label="Catégorie" sortKey="categorie" /></th>
                            <th><SortableHeader label="Zone" sortKey="zone" /></th>
                            <th><SortableHeader label="Quartier" sortKey="quartier" /></th>
                            <th><SortableHeader label="Date" sortKey="date" /></th>
                            <th><SortableHeader label="Statut" sortKey="statut" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisites.map((visite) => (
                            <tr
                                key={visite.id}
                                className="border-b border-gray-100 last:border-0"
                            >
                                <td className="px-1 py-3">

                                    <SquareArrowOutUpRight
                                        onClick={() => openVisite(visite.id)}
                                        className="w-[15px] h-[15px] text-gray-500 transition-all duration-200 ease-in-out hover:text-blue-600 hover:scale-110 cursor-pointer"
                                    />
                                </td>
                                <td className="px-1 py-3 font-medium text-gray-900">
                                    {visite.id ?? "-"}
                                </td>
                                <td className="px-1 py-3 font-medium text-gray-900">
                                    {visite.client?.nom ?? "Client inconnu"}
                                </td>
                                <td className="px-1 py-3 font-medium text-gray-900">
                                    {visite.utilisateur
                                        ? `${visite.utilisateur.firstname ?? ""} ${visite.utilisateur.name ?? ""}`.trim() || "User inconnu"
                                        : "User inconnu"}
                                </td>

                                <td className="px-1 py-3 text-center">
                                    <span className={`px-2.5 py-1 rounded text-sm font-medium ${visite.type === 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                                        {visite.type === 0 ? "oui" : "non"}
                                    </span>
                                </td>


                                <td className="px-1 py-3 text-gray-500">
                                    {visite.type_visite?.nom ?? "—"}
                                </td>
                                <td className="px-1 py-3 text-gray-500">
                                    {visite.categorie_visite?.intitule ?? "—"}
                                </td>
                                <td className="px-1 py-3 text-gray-500">
                                    {visite.client?.zone ?? "—"}
                                </td>
                                <td className="px-1 py-3 text-gray-500">
                                    {visite.client?.quartier ?? "—"}
                                </td>
                                <td className="px-1 py-3 text-gray-500">
                                    {visite.date ? formatDate(visite.date) : "—"}
                                </td>
                                {/* <td className="px-1 py-3 text-gray-500">
                                    {visite.object ?? "—"}
                                </td> */}
                                <td className="px-1 py-3">
                                    {(() => {
                                        // 1. Determine the status conditions
                                        const isPast = visite.date ? new Date(visite.date) < new Date() : false;
                                        const isOverdue = visite.statut === 0 && isPast;

                                        // 2. Assign classes based on status
                                        let badgeClass = "bg-purple-100 text-purple-700"; // Default: A venir
                                        let statusText = "A venir";

                                        if (visite.statut === 1) {
                                            badgeClass = "bg-green-100 text-green-700";
                                            statusText = "Effectuée";
                                        } else if (isOverdue) {
                                            badgeClass = "bg-red-100 text-red-700";
                                            statusText = "En retard";
                                        }

                                        // 3. Render the badge
                                        return (
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
                                                {statusText}
                                            </span>
                                        );
                                    })()}
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile cards ── */}
            <ListeVisiteMobile
                visites={filteredVisites}
                onOpenVisite={openVisite}
                formatDate={formatDate}
            />

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && selectedId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
                                <DetailVisite id={selectedId} onClose={closeModal} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="shrink-0 flex items-center justify-between border-t border-gray-200 bg-white px-5 py-3 text-sm text-gray-500">
                <span>{filteredVisites.length} résultats</span>
                <div className="flex items-center gap-1">
                    <button className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40">‹</button>
                    <span className="px-2">Page 1</span>
                    <button className="rounded px-2 py-1 hover:bg-gray-100">›</button>
                </div>
            </div>
        </div>
    );
}
export default ListeVisite;
