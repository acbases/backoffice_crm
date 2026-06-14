// components/VisiteInfo.tsx

import {
    Calendar,
    User,
    MapPin,
    Info,
} from "lucide-react";
import type { VisiteItem } from "../api/visiteApi";

interface VisiteInfoProps {
    visite: VisiteItem;
}

function VisiteInfo({ visite }: VisiteInfoProps) {
    return (
        <div className="flex flex-col overflow-y-auto p-6 space-y-6">
            <div>
                Information visite
            </div>
            {/* Objet */}
            <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Info size={18} className="text-blue-500" />
                    <h3 className="font-semibold">Objectif</h3>
                </div>

                <p className="text-gray-700">
                    {visite.object || "Aucun objet renseigné"}
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
                            {new Date(visite.date).toLocaleDateString("fr-FR")}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Type de visite</p>
                        <p className="font-medium">
                            {visite?.type_visite?.nom || "Non renseigné"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Catégorie</p>
                        <p className="font-medium">
                            {visite?.categorie_visite?.intitule ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Statut</p>
                        <p className="font-medium">
                            {visite?.statut ?? "-"}
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
                            {visite?.client?.nom ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Zone</p>
                        <p className="font-medium">
                            {visite?.client?.zone ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Quartier</p>
                        <p className="font-medium">
                            {visite?.client?.quartier ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Catégorie client</p>
                        <p className="font-medium">
                            {visite?.client?.categorie_client?.intitule ?? "-"}
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
                            {visite?.utilisateur?.firstname}{" "}
                            {visite?.utilisateur?.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Matricule</p>
                        <p className="font-medium">
                            {visite?.utilisateur?.matricule ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">
                            {visite?.utilisateur?.email ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Rôle CRM</p>
                        <p className="font-medium">
                            {visite?.utilisateur?.role_crm ?? "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisiteInfo;