import { useEffect, useState, useCallback, useMemo } from "react";
import { getVisites, type VisitesItem } from "../api/visiteApi";
import { getVisiteByIdUser } from "../api/visiteApi";

import { useCurrentUser } from "@/hooks/useCurrentUser";

type CalendarVisitesProps = {
    refreshKey?: number; // incrémenté par le parent pour forcer un refetch
};

function toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}


export default function CalendarVisites({ refreshKey }: CalendarVisitesProps) {
    const [visites, setVisites] = useState<VisitesItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const { user, isAdmin } = useCurrentUser();
    const [hoveredVisite, setHoveredVisite] = useState<{
        visite: VisitesItem;
        x: number;
        y: number;
    } | null>(null);
    const [selectedDayVisites, setSelectedDayVisites] = useState<{
        date: string;
        visites: VisitesItem[];
    } | null>(null);

    const loadVisites = useCallback(async () => {
        if (!user) return; // attend que l'utilisateur soit chargé pour connaître son id/rôle

        setLoading(true);
        setError("");
        try {
            const data = isAdmin
                    ? await getVisites()
                    : await getVisiteByIdUser(user.id);

            setVisites(data);

            console.log("Visites chargées :", data);
        } catch (err) {
            if (!isAdmin) {
                // L'utilisateur n'a simplement aucune visite : pas une erreur.
                setVisites([]);
            } else {
                console.error("Erreur chargement visites :", err);
                setError("Impossible de charger les visites.");
            }
        } finally {
            setLoading(false);
        }
    }, [user, isAdmin]);

    useEffect(() => {
        loadVisites();
    }, [loadVisites, refreshKey]);

    // ⬇️ Tout ce bloc ne se recalcule QUE si `currentMonth` change
    const { cells, todayKey } = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startWeekday = (firstDayOfMonth.getDay() + 6) % 7;
        const daysInMonth = lastDayOfMonth.getDate();

        const cells: { date: Date | null; key: string }[] = [];
        for (let i = 0; i < startWeekday; i++) {
            cells.push({ date: null, key: `empty-${i}` });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            cells.push({ date, key: toDateKey(date) });
        }

        return { cells, todayKey: toDateKey(new Date()) };
    }, [currentMonth]);

    // ⬇️ Ne se recalcule QUE si `visites` change (pas à chaque hover)
    const visitesByDay = useMemo(() => {
        const map = new Map<string, VisitesItem[]>();
        visites.forEach((visite) => {
            if (!visite.date) return;
            const key = visite.date.slice(0, 10);
            const list = map.get(key) ?? [];
            list.push(visite);
            map.set(key, list);
        });
        return map;
    }, [visites]);

    const monthLabel = currentMonth.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const goToPreviousMonth = () =>
        setCurrentMonth((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
    const goToNextMonth = () =>
        setCurrentMonth((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const getVisiteColor = (visite: VisitesItem) => {
        // Visite faite → vert
        if (visite.statut === 1) {
            return "bg-green-100 border-green-300 text-green-700";
        }

        // Visite non faite : comparer la date à aujourd'hui
        const visiteDateKey = visite.date?.slice(0, 10);

        if (visiteDateKey && visiteDateKey < todayKey) {
            // Date passée et toujours pas faite → en retard, rouge
            return "bg-red-100 border-red-300 text-red-700";
        }

        // Date future (ou aujourd'hui) et pas encore faite → orange
        return "bg-orange-100 border-orange-300 text-orange-700";
    };

    const TOOLTIP_WIDTH = 320;  // correspond à w-80
    const TOOLTIP_HEIGHT = 220; // estimation, ajuste si besoin

    function getTooltipPosition(clientX: number, clientY: number) {
        const margin = 12;
        const offset = 15;

        // Horizontal : à droite du curseur par défaut, bascule à gauche si ça dépasse
        let x = clientX + offset;
        if (x + TOOLTIP_WIDTH > window.innerWidth - margin) {
            x = clientX - TOOLTIP_WIDTH - offset;
        }
        x = Math.max(margin, x);

        // Vertical : en dessous du curseur par défaut, bascule au-dessus si ça dépasse
        let y = clientY + offset;
        if (y + TOOLTIP_HEIGHT > window.innerHeight - margin) {
            y = clientY - TOOLTIP_HEIGHT - offset;
        }
        y = Math.max(margin, y);

        return { x, y };
    }
  
    return (
        <div className="m-4 max-w-5xl rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {monthLabel}
                </h2>
                <div className="flex gap-2">
                    <button type="button" onClick={goToPreviousMonth}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                        ←
                    </button>
                    <button type="button" onClick={goToToday}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                        Aujourd'hui
                    </button>
                    <button type="button" onClick={goToNextMonth}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                        →
                    </button>
                </div>
            </div>

            {error ? (
                <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-7 gap-px rounded-lg border border-gray-200 bg-gray-200 text-xs font-medium text-gray-500 overflow-visible">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((label) => (
                    <div key={label} className="bg-gradient-to-r
                        from-blue-600
                        to-blue-500
                        px-2
                        py-3
                        text-center
                        font-semibold
                        text-white"
                    >
                        {label}
                    </div>
                ))}

                {cells.map((cell) => {
                    if (!cell.date) {
                        return <div key={cell.key} className="min-h-[90px] bg-white" />;
                    }
                    const dayKey = toDateKey(cell.date);
                    const dayVisites = visitesByDay.get(dayKey) ?? [];
                    const isToday = dayKey === todayKey;

                    return (
                        <div
                            key={cell.key}
                            className={`
                                relative
                                overflow-visible
                                min-h-[140px]
                                p-2
                                transition-all
                                duration-200

                                ${
                                    cell.date.getDay() === 0 ||
                                    cell.date.getDay() === 6
                                        ? "bg-gray-50"
                                        : "bg-white"
                                }

                                ${
                                    isToday
                                        ? "ring-2 ring-inset ring-red-500 bg-red-50"
                                        : ""
                                }

                                hover:bg-gray-50
                            `}
                        >
                            {/* Numéro du jour */}
                            <div className="
                                flex
                                justify-end
                                mb-2
                                text-xs
                                font-semibold
                                text-gray-400
                            ">
                                {cell.date.getDate()}
                            </div>


                            {/* Liste des visites */}
                            <div
                                className="
                                    space-y-1.5
                                    max-h-[260px]
                                    
                                    pr-1

                                    scrollbar-thin
                                    scrollbar-thumb-gray-300
                                    scrollbar-track-gray-100
                                "
                            >

                                {dayVisites.slice(0, 3).map((visite) => (
                                    <div
                                        key={visite.id}

                                        onMouseEnter={(e) =>
                                            setHoveredVisite({
                                                visite,
                                                // x: e.clientX + 15,
                                                // y: e.clientY + 15,
                                                ...getTooltipPosition(e.clientX, e.clientY),
                                            })
                                        }

                                        onMouseMove={(e) =>
                                            setHoveredVisite({
                                                visite,
                                                ...getTooltipPosition(e.clientX, e.clientY),
                                            })
                                        }

                                        onMouseLeave={() =>
                                            setHoveredVisite(null)
                                        }


                                        className={`
                                            group
                                            cursor-pointer

                                            rounded-xl
                                            border

                                            px-3
                                            py-2

                                            text-[11px]
                                            font-semibold

                                            shadow-sm

                                            transition-all
                                            duration-200

                                            hover:-translate-y-1
                                            hover:scale-[1.03]
                                            hover:shadow-lg

                                            ${getVisiteColor(visite)}
                                        `}
                                    >

                                        <div className="flex items-center gap-1 truncate">
                                            {/* <span>📍</span> */}

                                            <span className="truncate">
                                                {visite.client.nom}
                                            </span>
                                        </div>


                                        {/* <div className="
                                            mt-1
                                            text-[10px]
                                            opacity-70
                                        ">
                                            {visite.type_visite?.nom ?? "Visite"}
                                        </div> */}

                                    </div>
                                ))}

                                {dayVisites.length > 3 && (
                                    <button
                                        onClick={() =>
                                            setSelectedDayVisites({
                                                date: dayKey,
                                                visites: dayVisites,
                                            })
                                        }
                                        className="
                                            mt-2
                                            w-full

                                            rounded-lg

                                            bg-gray-200
                                            hover:bg-gray-300

                                            px-2
                                            py-1

                                            text-[11px]
                                            font-bold
                                            text-gray-700

                                            shadow-sm

                                            transition-all
                                            duration-200

                                            hover:scale-105
                                            hover:shadow-lg
                                        "
                                    >
                                        +{dayVisites.length - 3} visites
                                    </button>
                                )}


                                {dayVisites.length === 0 && (
                                    <div className="
                                        text-center
                                        text-[10px]
                                        text-gray-300
                                        mt-5
                                    ">
                                        Aucune visite
                                    </div>
                                )}

                            </div>

                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div className="mt-3 text-sm text-gray-400">
                    Chargement des visites...
                </div>
            ) : null}
            {selectedDayVisites && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[9998]

                        flex
                        items-center
                        justify-center

                        bg-black/30
                        backdrop-blur-sm
                    "
                    onClick={() => setSelectedDayVisites(null)}
                >

                    <div
                        className="
                            w-[420px]
                            max-h-[80vh]

                            overflow-hidden

                            rounded-2xl
                            bg-white

                            shadow-2xl
                        "
                        onClick={(e)=>e.stopPropagation()}
                    >

                        <div
                            className="
                                flex
                                justify-between
                                items-center

                                bg-red-600

                                px-5
                                py-4

                                text-white
                            "
                        >
                            <div>
                                <h3 className="font-bold text-lg">
                                    📅 Visites du {selectedDayVisites.date}
                                </h3>

                                <p className="text-sm">
                                    {selectedDayVisites.visites.length} visites
                                </p>
                            </div>


                            <button
                                onClick={() => setSelectedDayVisites(null)}
                                className="
                                    rounded-full
                                    bg-white/20
                                    px-3
                                    py-1
                                "
                            >
                                ✕
                            </button>

                        </div>


                        <div
                            className="
                                max-h-[60vh]
                                overflow-y-auto

                                space-y-3

                                p-5
                            "
                        >

                            {selectedDayVisites.visites.map((visite)=>(
                                <div
                                    key={visite.id}
                                    className={`
                                        rounded-xl
                                        border
                                        p-4
                                        shadow-sm

                                        ${getVisiteColor(visite)}
                                    `}
                                >

                                    <div className="font-bold">
                                        📍 {visite.client.nom}
                                    </div>

                                    <div className="mt-2 text-xs">
                                        <p>
                                            <b>Catégorie visite:</b>{" "}
                                            {visite.categorie_visite?.intitule}
                                        </p>

                                        <p>
                                            <b>Type visite:</b>{" "}
                                            {visite.type_visite?.nom}
                                        </p>

                                        <p>
                                            <b>Objectif :</b>{" "}
                                            {visite.object || "-"}
                                        </p>

                                        <p>
                                            <b>Commercial :</b>{" "}
                                            {visite.utilisateur?.firstname}{" "}
                                            {visite.utilisateur?.name}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>
            )}
            {hoveredVisite && (
                <div
                    className="fixed z-[9999] w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
                    style={{
                        left: hoveredVisite.x,
                        top: hoveredVisite.y,
                    }}
                >
                    <h3 className="mb-3 border-b pb-2 text-base font-bold text-red-600">
                        📍 {hoveredVisite.visite.client.nom}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-700">
                        <div>
                            <span className="font-semibold">Objectif :</span><br />
                            {hoveredVisite.visite.object || "-"}
                        </div>

                        <div>
                            <span className="font-semibold">Date :</span><br />
                            {hoveredVisite.visite.date}
                        </div>

                        <div>
                            <span className="font-semibold">Commercial :</span><br />
                            {hoveredVisite.visite.utilisateur?.firstname}{" "}
                            {hoveredVisite.visite.utilisateur?.name}
                        </div>

                        <div>
                            <span className="font-semibold">Catégorie visite :</span><br />
                            {hoveredVisite.visite.categorie_visite?.intitule}
                        </div>

                        <div>
                            <span className="font-semibold">Type visite :</span><br />
                            {hoveredVisite.visite.type_visite?.nom}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}