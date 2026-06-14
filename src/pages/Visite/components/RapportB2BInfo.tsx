// components/RapportB2BInfo.tsx

import {
    ClipboardList,
    User,
    Phone,
    Building2,
    Calendar,
    Image as ImageIcon,
} from "lucide-react";

import type { RapportB2BItem } from "../api/rapportVisiteApi";

interface RapportB2BInfoProps {
    rapport: RapportB2BItem | null;
    loading?: boolean;
}

function RapportB2BInfo({
    rapport,
    loading,
}: RapportB2BInfoProps) {
    if (loading) {
        return (
            <div className="p-6">
                <p>Chargement du rapport...</p>
            </div>
        );
    }

    if (!rapport) {
        return 
    }

    return (
        <div className="p-6 space-y-6">
            <div >Rapport B2B</div>
            <div className="flex gap-6">
                <div className="flex flex-col overflow-y-auto gap-4">
                    {/* Description */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <ClipboardList
                                size={18}
                                className="text-blue-500"
                            />
                            <h3 className="font-semibold">
                                Compte-rendu
                            </h3>
                        </div>

                        <p className="text-gray-700 whitespace-pre-wrap">
                            {rapport.description || "-"}
                        </p>
                    </div>

                    {/* Action à faire */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Building2
                                size={18}
                                className="text-orange-500"
                            />
                            <h3 className="font-semibold">
                                Action à faire
                            </h3>
                        </div>

                        <p className="text-gray-700">
                            {rapport.action_a_faire || "-"}
                        </p>
                    </div>

                    {/* Prochaine visite */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar
                                size={18}
                                className="text-green-500"
                            />
                            <h3 className="font-semibold">
                                Prochaine visite
                            </h3>
                        </div>

                        <p className="text-gray-700">
                            {rapport.prochaine_visite
                                ? new Date(
                                    rapport.prochaine_visite
                                ).toLocaleDateString("fr-FR")
                                : "-"}
                        </p>
                    </div>

                    {/* Correspondant */}
                    <div className="bg-white border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User
                                size={18}
                                className="text-purple-500"
                            />
                            <h3 className="font-semibold">
                                Correspondant
                            </h3>
                        </div>

                        {rapport.correspondant ? (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">
                                        Nom
                                    </p>
                                    <p className="font-medium">
                                        {rapport.correspondant.nom}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Poste
                                    </p>
                                    <p className="font-medium">
                                        {rapport.correspondant.poste}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">
                                        Contact
                                    </p>
                                    <p className="font-medium">
                                        {rapport.correspondant.contact}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Aucun correspondant
                            </p>
                        )}
                    </div>

                </div>
                {/* Photo */}
                {rapport.sary && (
                    <div className="bg-white border rounded-xl overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon
                                size={18}
                                className="text-pink-500"
                            />
                            <h3 className="font-semibold">
                                Pièce jointe
                            </h3>
                        </div>

                        <img
                            src={rapport.sary}
                            alt="Rapport"
                            className="rounded-lg border max-h-96 object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default RapportB2BInfo;