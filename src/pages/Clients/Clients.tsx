import { useState, type Dispatch, type SetStateAction } from "react";
import { NavLink, Outlet } from "react-router-dom";
import type { ClientItem } from "./api/clientApi";

export type ClientsContext = {
  clients: ClientItem[];
  setClients: Dispatch<SetStateAction<ClientItem[]>>;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
};

export default function Clients() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  return (
    <div id="Clients-page" className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500">
          Ajouter, naviguer et ouvrir pour chaque client.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <NavLink
          to="ajout"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
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
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-red-100 text-red-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Liste
        </NavLink>
        <NavLink
          to="qr-code"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-red-100 text-red-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          QR Code
        </NavLink>
      </div>

      <Outlet
        context={{
          clients,
          setClients,
          selectedClientId,
          setSelectedClientId,
        }}
      />
    </div>
  );
}
