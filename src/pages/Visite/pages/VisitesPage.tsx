import { useState } from "react";
import AjoutVisite from "./AjoutVisite";
import CalendarVisites from "../components/CalendarVisites";

export default function VisitesPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="grid h-full min-h-0 gap-6 p-4 xl:grid-cols-[450px_1fr]">
            <div className="min-h-0 overflow-y-auto">
                <AjoutVisite onCreated={() => setRefreshKey((k) => k + 1)} />
            </div>
            <div className="min-h-0 overflow-y-auto">
                <CalendarVisites refreshKey={refreshKey} />
            </div>
        </div>
    );
}