import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createUser } from "../api/utilisateurApi";
import type { UtilisateursContext } from "../Utilisateur";

export default function Ajout() {
  const navigate = useNavigate();
  const { loadUtilisateurs } = useOutletContext<UtilisateursContext>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");

    try {
      await createUser();
      await loadUtilisateurs();
      navigate("../liste");
    } catch {
      setError("Impossible de créer l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Ajouter un utilisateur</h2>
      <p className="text-sm text-gray-500">
        L'utilisateur sera importé depuis Allpro et ajouté à la liste des utilisateurs du CRM.
      </p>

      {error ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      ) : null}

      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="rounded-lg bg-green-200 px-4 py-2 text-sm font-medium hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "En cours..." : "Ajouter un utilisateur"}
      </button>
    </div>
  );
}
