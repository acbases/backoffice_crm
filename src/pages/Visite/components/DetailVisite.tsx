import { X, Calendar, User, MapPin, Tag, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { getVisiteById, type VisiteItem } from "../api/visiteApi";

interface DetailVisiteProps {
    id: string;
    onClose: () => void;
}

function DetailVisite({ id, onClose }: DetailVisiteProps) {
    const [selectedVisite, setSelectedVisite] = useState<VisiteItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisite = async () => {
            try {
                const data = await getVisiteById(id);
                setSelectedVisite(data);
            } catch (error) {
                console.error("Erreur lors du chargement de la visite :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVisite();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6">
                <p>Chargement...</p>
            </div>
        );
    }

    if (!selectedVisite) {
        return (
            <div className="p-6">
                <p>Visite introuvable</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Détails de la visite
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        ID: #{selectedVisite.id}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>


            {/* Content */}
            <div className="flex">
                {/* detail de la visite  */}
                <div className="flex flex-col overflow-y-auto p-6 space-y-6">
                    {/* Objet */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Info size={18} className="text-blue-500" />
                            <h3 className="font-semibold">Objectif</h3>
                        </div>

                        <p className="text-gray-700">
                            {selectedVisite.object || "Aucun objet renseigné"}
                        </p>
                    </div>

                    {/* Informations visite */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={18} className="text-green-500" />
                            <h3 className="font-semibold">Informations visite</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Date</p>
                                <p className="font-medium">
                                    {new Date(selectedVisite.date).toLocaleDateString(
                                        "fr-FR"
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Type de visite</p>
                                <p className="font-medium">
                                    {selectedVisite?.type_visite?.nom || "Non renseigné"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Catégorie</p>
                                <p className="font-medium">
                                    {selectedVisite?.categorie_visite?.intitule ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Statut</p>
                                <p className="font-medium">
                                    {/* a confirmer a Teddy */}
                                    {selectedVisite?.statut ?? "-"} 
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin size={18} className="text-red-500" />
                            <h3 className="font-semibold">Client</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Nom</p>
                                <p className="font-medium">
                                    {selectedVisite?.client?.nom ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Zone</p>
                                <p className="font-medium">
                                    {selectedVisite?.client?.zone ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Quartier</p>
                                <p className="font-medium">
                                    {selectedVisite?.client?.quartier ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Catégorie client</p>
                                <p className="font-medium">
                                    {selectedVisite?.client?.categorie_client?.intitule ?? "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Commercial */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User size={18} className="text-purple-500" />
                            <h3 className="font-semibold">Commercial</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Nom</p>
                                <p className="font-medium">
                                    {selectedVisite?.utilisateur?.firstname ?? ""}
                                    {" "}
                                    {selectedVisite?.utilisateur?.name ?? ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Matricule</p>
                                <p className="font-medium">
                                    {selectedVisite?.utilisateur?.matricule ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium">
                                    {selectedVisite?.utilisateur?.email ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Rôle CRM</p>
                                <p className="font-medium">
                                    {selectedVisite?.utilisateur?.role_crm ?? "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    rapport detail
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm text-sm"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

export default DetailVisite;