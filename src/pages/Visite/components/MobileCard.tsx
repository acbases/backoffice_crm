import type { VisiteItem } from "../api/visiteApi";

interface MobileCardProps {
    visite: VisiteItem;
    onOpen: (id: number) => void;
    formatDate: (date: string) => string;
}

const MobileCard = ({ visite, onOpen, formatDate }: MobileCardProps) => {
    return (
        <div
            key={visite.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
            <div className="mb-3 flex items-start justify-between gap-2">
                <span className="font-medium text-gray-900">
                    {visite.client?.nom ?? "Client inconnu"}
                </span>
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${(() => {
                        const isPast = visite.date ? new Date(visite.date) < new Date() : false;
                        const isOverdue = visite.statut === 0 && isPast;

                        if (visite.statut === 1) return "bg-green-100 text-green-700";
                        if (isOverdue) return "bg-red-100 text-red-700";
                        return "bg-blue-100 text-blue-700";
                    })()}`}
                >
                    {(() => {
                        const isPast = visite.date ? new Date(visite.date) < new Date() : false;
                        const isOverdue = visite.statut === 0 && isPast;

                        if (visite.statut === 1) return "Terminée";
                        if (isOverdue) return "En retard";
                        return "A venir";
                    })()}
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
                    onClick={() => onOpen(visite.id)}
                    className="rounded-lg bg-blue-200 px-4 py-2 text-sm font-medium hover:bg-blue-300 transition-colors"
                >
                    Voir détails
                </button>
            </div>
        </div>
    );
};

export default MobileCard;
