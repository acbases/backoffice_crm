import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createUser, importUsersFromAllproRh } from "../api/utilisateurApi";
import type { UtilisateursContext } from "../Utilisateur";

const ROLES = ["admin", "utilisateur"];

const initialForm = {
  firstname: "",
  name: "",
  matricule: "",
  email: "",
  password: "",
  poste: "",
  role_crm: ROLES[1],
  statut: true,
};

export default function Ajout() {
  const navigate = useNavigate();
  const { loadUtilisateurs } = useOutletContext<UtilisateursContext>();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImportFromAllpro = async () => {
    setImporting(true);
    setImportError("");

    try {
      await importUsersFromAllproRh();
      await loadUtilisateurs();
      navigate("../liste");
    } catch {
      setImportError("Impossible d'importer les utilisateurs depuis Allpro RH.");
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUser(form);
      await loadUtilisateurs();
      setForm(initialForm);
      navigate("../liste");
    } catch {
      setError("Impossible de créer l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 max-w-xl space-y-6">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Importer depuis Allpro RH</h2>
        <p className="text-sm text-gray-500">
          Les utilisateurs seront importés depuis Allpro RH et ajoutés à la liste des utilisateurs du CRM.
        </p>

        {importError ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{importError}</div>
        ) : null}

        <button
          type="button"
          onClick={handleImportFromAllpro}
          disabled={importing}
          className="rounded-lg bg-blue-200 px-4 py-2 text-sm font-medium hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {importing ? "En cours..." : "Importer depuis Allpro RH"}
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs font-medium uppercase text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        ou
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Créer un utilisateur manuellement</h2>

        {error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Prénom</span>
            <input
              value={form.firstname}
              onChange={(event) => handleChange("firstname", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
              type="text"
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Nom</span>
            <input
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
              type="text"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Matricule</span>
            <input
              value={form.matricule}
              onChange={(event) => handleChange("matricule", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
              type="text"
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
              type="email"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Mot de passe</span>
            <input
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Poste</span>
            <input
              value={form.poste}
              onChange={(event) => handleChange("poste", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
              type="text"
              required
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Rôle</span>
          <select
            value={form.role_crm}
            onChange={(event) => handleChange("role_crm", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            required
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-200 px-4 py-2 text-sm font-medium hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "En cours..." : "Ajouter un utilisateur"}
        </button>
      </form>
    </div>
  );
}
