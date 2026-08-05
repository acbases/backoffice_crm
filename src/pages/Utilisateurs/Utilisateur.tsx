import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getUsers, type UtilisateurItem } from "./api/utilisateurApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export type ClientsContext = {
  utilisateur: UtilisateurItem[];
  setUtilisateur: Dispatch<SetStateAction<UtilisateurItem[]>>;
  selectedUtilisateurId: string;
  setSelectedUtilisateurId: (id: string) => void;
  loadUtilisateur: () => Promise<void>;
  loading: boolean;
};

export default function Utilisateurs() {
  const [clients, setClients] = useState<UtilisateurItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useCurrentUser();

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setClients(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const location = useLocation();
  return (
    <div id="Clients-page" className="flex flex-col h-screen overflow-hidden space-y-0">

      <div className="shrink-0 flex flex-wrap gap-2 p-3 mt-1.5">
        <div className="shrink-0 space-y-2 pr-4">
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        </div>
        
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
          to={`liste`}
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
              ? "bg-red-100 text-red-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Liste
        </NavLink>
        <NavLink
          to={`modifRole`}
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
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet
          context={{
            clients,
            setClients,
            selectedClientId,
            setSelectedClientId,
            loadClients,
            loading,
          }}
        />
      </div>
    </div>
  );
}