import { useState, type Dispatch, type SetStateAction } from "react";
import { NavLink, Outlet } from "react-router-dom";
import type { VisiteItem } from "./api/visiteApi";


export type VisitesContext = {
  visites: VisiteItem[];
  setVisites: Dispatch<SetStateAction<VisiteItem[]>>;
  selectedVisiteId: string;
  setSelectedVisiteId: (id: string) => void;
};

export default function Visite() {
  const [visites, setVisites] = useState<VisiteItem[]>([]);
  const [selectedVisiteId, setSelectedVisiteId] = useState("");
  return (
    <div id="Visites-page" className="flex flex-col h-screen overflow-hidden space-y-0">
      {/* page title */}
      <div className="shrink-0 space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Visites</h1>
      </div>

      {/* tabs */}
      <div className="shrink-0 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <NavLink
          to="ajout"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
              ? "bg-red-100 text-red-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Ajout
        </NavLink>
        <NavLink
          to="liste"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
              ? "bg-red-100 text-red-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Liste
        </NavLink>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet
          context={{
            visites,
            setVisites,
            selectedVisiteId,
            setSelectedVisiteId,
          }}
        />
      </div>
    </div>
  );
}
