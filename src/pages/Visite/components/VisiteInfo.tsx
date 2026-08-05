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

export default function VisiteInfo({ visite }: VisiteInfoProps) {
    return (
        <div className="flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Information visite
                </h2>
            </div>

            {/* Objectif */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                    <Info size={18} className="text-blue-500" />
                    <h3 className="font-semibold">Objectif</h3>
                </div>

                <p>{visite.object || "Aucun objet renseigné"}</p>
            </div>

            {/* Informations */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-green-500" />
                    <h3 className="font-semibold">
                        Informations visite
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <p className="text-gray-500">Date</p>
                        <p>
                            {new Date(visite.date).toLocaleDateString(
                                "fr-FR"
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Type visite</p>
                        <p>{visite.type_visite.nom}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Catégorie</p>
                        <p>{visite.categorie_visite.intitule}</p>
                    </div>
                </div>
            </div>

            {/* Client */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-red-500" />
                    <h3 className="font-semibold">Client</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <p>{visite.client.nom}</p>
                    <p>{visite.client.zone}</p>
                    <p>{visite.client.quartier}</p>
                    <p>
                        {visite.client.categorie_client.intitule}
                    </p>
                </div>
            </div>

            {/* Utilisateur */}

            <div className="rounded-xl border bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                    <User size={18} className="text-purple-500" />
                    <h3 className="font-semibold">Commercial</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <p>
                        {visite.utilisateur.firstname}{" "}
                        {visite.utilisateur.name}
                    </p>
                    <p>{visite.utilisateur.email}</p>
                    <p>{visite.utilisateur.matricule}</p>
                    <p>{visite.utilisateur.role_crm}</p>
                </div>
            </div>
        </div>
    );
}
