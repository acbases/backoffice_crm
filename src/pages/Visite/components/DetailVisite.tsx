import { X, Calendar, User, MapPin, Tag, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { getRapportB2BByIdVisite, type RapportB2BItem } from "../api/rapportVisiteApi";
import { getVisiteById, type VisiteItem } from "../api/visiteApi";

interface DetailVisiteProps {
    id: string;
    onClose: () => void;
}

function DetailVisite({ id, onClose }: DetailVisiteProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Détails de la visite</h2>
                    <p className="text-sm text-gray-500 mt-1">ID: #{id}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>
           

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