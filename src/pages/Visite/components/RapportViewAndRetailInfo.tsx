import {
    Package,
    Boxes,
    Tag,
    ClipboardList,
} from "lucide-react";

import {
    type VueRapportProduitItem,
    type VueRapportAutreProduitItem,
    type VueRapportPlvItem,
    type RapportRetailItem,
} from "../api/rapportVisiteApi";

interface RapportViewAndRetailInfoProps {
    vueRapportProduits: VueRapportProduitItem[];
    vueRapportAutresProduits: VueRapportAutreProduitItem[];
    vueRapportPlv: VueRapportPlvItem[];
    rapportRetail: RapportRetailItem | null;

    loadingVueRapportProduits?: boolean;
    loadingVueRapportAutresProduits?: boolean;
    loadingVueRapportPlv?: boolean;
    loadingRapportRetail?: boolean;
}

function RapportViewAndRetailInfo({
    vueRapportProduits,
    vueRapportAutresProduits,
    vueRapportPlv,
    rapportRetail,
    loadingVueRapportProduits,
    loadingVueRapportAutresProduits,
    loadingVueRapportPlv,
    loadingRapportRetail,
}: RapportViewAndRetailInfoProps) {
    const loading =
        loadingVueRapportProduits ||
        loadingVueRapportAutresProduits ||
        loadingVueRapportPlv ||
        loadingRapportRetail;

    if (loading) {
        return (
            <div className="p-6">
                <p>Chargement des rapports retail...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>Rapport Retail</div>

            <div className="grid grid-cols-2 gap-4">

                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ClipboardList
                            size={18}
                            className="text-blue-500"
                        />
                        <h3 className="font-semibold">
                            Compte-rendu Retail
                        </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div>
                            <p className="text-gray-500">
                                Description
                            </p>
                            <p>{rapportRetail?.description || "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">
                                Autre PLV
                            </p>
                            <p>{rapportRetail?.autre_plv || "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Produit */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Package
                            size={18}
                            className="text-green-500"
                        />
                        <h3 className="font-semibold">
                            Produit
                        </h3>
                    </div>

                    {vueRapportProduits.length > 0 ? (
                        <div className="space-y-4">
                            {vueRapportProduits.map((produit, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-4 text-sm border-b pb-4"
                                >
                                    <Info label="Intitulé" value={produit.intitule} />
                                    <Info label="Description" value={produit.description} />
                                    <Info label="Prix achat" value={produit.prix_achat} />
                                    <Info label="Prix vente gros" value={produit.prix_vente_gros} />
                                    <Info
                                        label="Prix vente détail"
                                        value={produit.prix_vente_details}
                                    />
                                    <Info
                                        label="Coût transport"
                                        value={produit.cout_transport}
                                    />
                                    <Info label="Marge" value={produit.marge} />
                                    <Info label="Volume" value={produit.volume} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucun produit.</p>
                    )}
                </div>

                {/* Autre Produit */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Boxes
                            size={18}
                            className="text-orange-500"
                        />
                        <h3 className="font-semibold">
                            Autre Produit
                        </h3>
                    </div>

                    {vueRapportAutresProduits.length > 0 ? (
                        <div className="space-y-4">
                            {vueRapportAutresProduits.map((produit, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-4 text-sm border-b pb-4"
                                >
                                    <Info label="Nom" value={produit.nom} />
                                    <Info label="Prix achat" value={produit.prix_achat} />
                                    <Info
                                        label="Prix vente gros"
                                        value={produit.prix_vente_gros}
                                    />
                                    <Info
                                        label="Prix vente détail"
                                        value={produit.prix_vente_details}
                                    />
                                    <Info
                                        label="Coût transport"
                                        value={produit.cout_transport}
                                    />
                                    <Info label="Marge" value={produit.marge} />
                                    <Info label="Volume" value={produit.volume} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucun autre produit.</p>
                    )}
                </div>

                {/* PLV */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag
                            size={18}
                            className="text-purple-500"
                        />
                        <h3 className="font-semibold">
                            PLV
                        </h3>
                    </div>

                    {vueRapportPlv.length > 0 ? (
                        <div className="space-y-2 text-sm">
                            {vueRapportPlv.map((plv, index) => (
                                <Info
                                    key={index}
                                    label={`PLV ${index + 1}`}
                                    value={plv.plv_nom}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucun PLV.</p>
                    )}
                </div>
            </div>
            {/* Rapport Retail */}
        </div>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

export default RapportViewAndRetailInfo;