import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getUsers, type UserItem } from "./api/utilisateurApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export type UtilisateursContext = {
  utilisateurs: UserItem[];
  setUtilisateurs: Dispatch<SetStateAction<UserItem[]>>;
  selectedUtilisateurId: string;
  setSelectedUtilisateurId: (id: string) => void;
  loadUtilisateurs: () => Promise<void>;
  loading: boolean;
};

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<UserItem[]>([]);
  const [selectedUtilisateurId, setSelectedUtilisateurId] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useCurrentUser();

  const loadUtilisateurs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUtilisateurs(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUtilisateurs();
  }, [loadUtilisateurs]);

  const location = useLocation();

  return (
    <div id="Utilisateurs-page" className="flex flex-col h-screen overflow-hidden space-y-0">

      <div className="shrink-0 flex flex-wrap gap-2 p-3 mt-1.5">
        <div className="shrink-0 space-y-2 pr-4">
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        </div>

        <NavLink
          to={`liste${location.search}`}
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
              ? "bg-red-100 text-red-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Liste
        </NavLink>

        {isAdmin && (
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
        )}

        {isAdmin && (
          <NavLink
            to="modifRole"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                ? "bg-red-100 text-red-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Modif Role
          </NavLink>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet
          context={{
            utilisateurs,
            setUtilisateurs,
            selectedUtilisateurId,
            setSelectedUtilisateurId,
            loadUtilisateurs,
            loading,
          }}
        />
      </div>
    </div>
  );
}
