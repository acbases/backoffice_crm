import { X } from "lucide-react";
import VisiteInfo from "./VisiteInfo";
import RapportB2BInfo from "./RapportB2BInfo"
import { useEffect, useState } from "react";
import {
    getVisiteById,
    type VisiteItem
} from "../api/visiteApi";
import {
    type RapportB2BItem,
    getRapportB2BByIdVisite,
    type VueRapportProduitItem,
    getVueRapportProduitsByIdVisite,
    type VueRapportAutreProduitItem,
    getVueRapportAutresProduitsByIdVisite,
    type VueRapportPlvItem,
    getVueRapportPlvByIdVisite,
    type RapportRetailItem,
    getRapportRetailByIdVisite
} from "../api/rapportVisiteApi";
import RapportViewAndRetailInfo from "./RapportViewAndRetailInfo";
interface DetailVisiteProps {
    id: string;
    onClose: () => void;
}

function DetailVisite({ id, onClose }: DetailVisiteProps) {
    // visite
    const [selectedVisite, setSelectedVisite] = useState<VisiteItem | null>(null);
    const [loading, setLoading] = useState(true);

    // rapport b2b
    const [rapportB2B, setRapportB2B] = useState<RapportB2BItem | null>(null);
    const [vueRapportProduits, setVueRapportProduits] = useState<VueRapportProduitItem[]>([]);
    const [vueRapportAutresProduits, setVueRapportAutresProduits] = useState<VueRapportAutreProduitItem[]>([]);
    const [vueRapportPlv, setVueRapportPlv] = useState<VueRapportPlvItem[]>([]);
    const [rapportRetail, setRapportRetail] = useState<RapportRetailItem | null>(null);

    const [loadingRapportB2B, setLoadingRapportB2B] = useState(true);
    const [loadingVueRapportProduits, setLoadingVueRapportProduits] = useState(true);
    const [loadingVueRapportAutresProduits, setLoadingVueRapportAutresProduits] = useState(true);
    const [loadingVueRapportPlv, setLoadingVueRapportPlv] = useState(true);
    const [loadingRapportRetail, setLoadingRapportRetail] = useState(true);

    useEffect(() => {
        const fetchVisite = async () => {
            try {
                const data = await getVisiteById(id);
                setSelectedVisite(data);

                const [
                    rapportB2BData,
                    rapportProduitsData,
                    rapportAutresProduitsData,
                    rapportPlvData,
                    rapportRetailData,
                ] = await Promise.all([
                    getRapportB2BByIdVisite(data.id),
                    getVueRapportProduitsByIdVisite(data.id),
                    getVueRapportAutresProduitsByIdVisite(data.id),
                    getVueRapportPlvByIdVisite(data.id),
                    getRapportRetailByIdVisite(data.id),
                ]);

                setRapportB2B(rapportB2BData);
                setVueRapportProduits(rapportProduitsData);
                setVueRapportAutresProduits(rapportAutresProduitsData);
                setVueRapportPlv(rapportPlvData);
                setRapportRetail(rapportRetailData);

            } catch (error) {
                console.error("Erreur lors du chargement de la visite :", error);
            } finally {
                setLoading(false);
                setLoadingRapportB2B(false);
                setLoadingVueRapportProduits(false);
                setLoadingVueRapportAutresProduits(false);
                setLoadingVueRapportPlv(false);
                setLoadingRapportRetail(false);
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
                {/* visite detail */}
                <VisiteInfo visite={selectedVisite} />

                {/* report detail */}
                {rapportB2B ? (
                    <RapportB2BInfo
                        rapport={rapportB2B}
                        loading={loadingRapportB2B}
                    />
                ) : (
                    <RapportViewAndRetailInfo
                        vueRapportProduits={vueRapportProduits}
                        vueRapportAutresProduits={vueRapportAutresProduits}
                        vueRapportPlv={vueRapportPlv}
                        rapportRetail={rapportRetail}
                        loadingVueRapportProduits={loadingVueRapportProduits}
                        loadingVueRapportAutresProduits={loadingVueRapportAutresProduits}
                        loadingVueRapportPlv={loadingVueRapportPlv}
                        loadingRapportRetail={loadingRapportRetail}
                    />
                )}
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