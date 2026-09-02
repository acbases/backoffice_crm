import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { File, Trash2  } from "lucide-react";
import type { UtilisateursContext } from "../Utilisateur";
import { exportUtilisateursToExcel } from "../utils/exportUtilisateursToExcel";
import { DeleteUser } from "../api/utilisateurApi";

const normalizeText = (value: string | null | undefined) =>
  (value ?? "").trim().toLowerCase();

export default function Liste() {
  const { utilisateurs, loading, loadUtilisateurs  } = useOutletContext<UtilisateursContext>();
  const [nomFilter, setNomFilter] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await exportUtilisateursToExcel(filteredUtilisateurs);
    } catch (err) {
      console.error("Erreur lors de l'extraction Excel :", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await DeleteUser(id);

      // Actualiser la liste
      await loadUtilisateurs ();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  const filteredUtilisateurs = useMemo(() => {
    if (!nomFilter) return utilisateurs;
    const needle = normalizeText(nomFilter);
    return utilisateurs.filter((utilisateur) =>
      normalizeText(`${utilisateur.firstname} ${utilisateur.name}`).includes(needle) ||
      normalizeText(utilisateur.matricule).includes(needle) ||
      normalizeText(utilisateur.email).includes(needle)
    );
  }, [utilisateurs, nomFilter]);

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
      <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Liste des utilisateurs</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={nomFilter}
            onChange={(event) => setNomFilter(event.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 sm:w-64"
            type="text"
          />
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-green-200 px-3 py-1.5 text-xs font-medium hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <File className="h-3.5 w-3.5" />
            {exporting ? "Extraction en cours..." : "Extraction Excel"}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[15%]" />
            <col className="w-[35%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Matricule</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUtilisateurs.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-gray-500" colSpan={5}>
                  Aucun utilisateur ne correspond à la recherche.
                </td>
              </tr>
            ) : null}
            {filteredUtilisateurs.map((utilisateur) => (
              <tr key={utilisateur.id} className="border-b border-gray-100 last:border-0">
                <td className="truncate px-4 py-3 font-medium text-gray-900">
                  {utilisateur.firstname} {utilisateur.name}
                </td>
                <td className="truncate px-4 py-3 text-gray-500">{utilisateur.matricule}</td>
                <td className="truncate px-4 py-3 text-gray-500" title={utilisateur.email}>
                  {utilisateur.email}
                </td>
                <td className="truncate px-4 py-3 text-gray-500">{utilisateur.role_crm}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-sm font-medium ${utilisateur.statut ? "bg-green-200" : "bg-red-200"
                      }`}
                  >
                    {utilisateur.statut ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="flex items-center justify-end gap-2 px-4 py-3">
                  <button
                    onClick={() => handleDelete(utilisateur.id)}
                    className="p-2 text-red-600 rounded-md hover:bg-red-100 transition"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 flex items-center justify-between border-t border-gray-200 bg-white px-5 py-3 text-sm text-gray-500">
        <span>{filteredUtilisateurs.length} résultats</span>
      </div>
    </div>
  );
}
