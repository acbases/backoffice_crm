import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { updateRoleUser } from "../api/utilisateurApi";
import type { UtilisateursContext } from "../Utilisateur";

const ROLES = ["admin", "utilisateur"];

export default function ModifRole() {
  const { utilisateurs, loading, loadUtilisateurs } = useOutletContext<UtilisateursContext>();
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleRoleChange = async (id: number, role_crm: string) => {
    setSavingId(id);
    setError("");

    try {
      await updateRoleUser(id, role_crm);
      await loadUtilisateurs();
    } catch {
      setError("Impossible de mettre à jour le rôle.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading)
    return (
      <div className="m-4 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Chargement des utilisateurs...
      </div>
    );

  if (utilisateurs.length === 0)
    return (
      <div className="m-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        Aucun utilisateur trouvé.
      </div>
    );

  return (
    <div className="m-4 flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Modifier les rôles</h2>
      </div>

      {error ? (
        <div className="mx-5 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Matricule</th>
              <th className="px-4 py-3">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((utilisateur) => (
              <tr key={utilisateur.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {utilisateur.firstname} {utilisateur.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{utilisateur.matricule}</td>
                <td className="px-4 py-3">
                  <select
                    value={utilisateur.role_crm}
                    disabled={savingId === utilisateur.id}
                    onChange={(event) => handleRoleChange(utilisateur.id, event.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-red-500 disabled:opacity-50"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
