import { useState } from "react";
import AjoutVisite from "./AjoutVisite";
import CalendarVisites from "../components/CalendarVisites";

export default function VisitesPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className=" grid 
            gap-6 
            p-4
            xl:grid-cols-[450px_1fr] items-start">
            <AjoutVisite onCreated={() => setRefreshKey((k) => k + 1)} />
            <CalendarVisites refreshKey={refreshKey} />
        </div>
    );
}