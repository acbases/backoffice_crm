import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../api/clientApi";
import { getAgences, type agencetItem } from "../api/agenceApi";
import {
  getCategorieClients,
  type categorieClientItem,
} from "../api/categorieClientApi";
import { getZones } from "../api/zoneApi";
import { getQuartiers } from "../api/quartierApi";

const initialForm = {
  nom: "",
  latitude: "",
  longitude: "",
  zone: "",
  quartier: "",
  idagence: "",
  idcategorie: "",
};

export default function AjoutClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agences, setAgences] = useState<agencetItem[]>([]);
  const [categories, setCategories] = useState<categorieClientItem[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [quartiers, setQuartiers] = useState<string[]>([]);

  useEffect(() => {
    const loadCategorieAgenceData = async () => {
      try {
        const [agencesData, categoriesData, zonesData, quartiersData] =
          await Promise.all([
            getAgences(),
            getCategorieClients(),
            getZones(),
            getQuartiers(),
          ]);

        setAgences(agencesData);
        setCategories(categoriesData);
        setZones(zonesData);
        setQuartiers(quartiersData);
      } catch (error) {
        console.error("Erreur chargement listes :", error);
      }
    };

    loadCategorieAgenceData();
  }, []);
  const handleChange = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createClient({
        nom: form.nom,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        zone: form.zone,
        quartier: form.quartier,
        idagence: Number(form.idagence),
        idcategorie: Number(form.idcategorie),
      });

      setForm(initialForm);
      // navigate("../liste");
      window.location.href = "/crm_admin/client/liste";
    } catch {
      setError("Unable to save the client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-4 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Ajouter un client</h2>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-700">Nom</span>
        <input
          value={form.nom}
          onChange={(event) => handleChange("nom", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
          type="text"
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Latitude</span>
          <input
            value={form.latitude}
            onChange={(event) => handleChange("latitude", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            type="number"
            step="any"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Longitude</span>
          <input
            value={form.longitude}
            onChange={(event) => handleChange("longitude", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            type="number"
            step="any"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Zone</span>
          <input
            value={form.zone}
            onChange={(event) => handleChange("zone", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            type="text"
            list="zone-list"
            required
          />
          <datalist id="zone-list">
            {zones.map((zone) => (
              <option key={zone} value={zone} />
            ))}
          </datalist>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Quartier</span>
          <input
            value={form.quartier}
            onChange={(event) => handleChange("quartier", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            type="text"
            list="quartier-list"
            required
          />
          <datalist id="quartier-list">
            {quartiers.map((quartier) => (
              <option key={quartier} value={quartier} />
            ))}
          </datalist>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Agence</span>
          <select
            value={form.idagence}
            onChange={(event) => handleChange("idagence", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            required
          >
            <option value="">Sélectionner une agence</option>

            {agences.map((agence) => (
              <option key={agence.id} value={agence.id}>
                {agence.intitule}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Categorie</span>
          <select
            value={form.idcategorie}
            onChange={(event) => handleChange("idcategorie", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>

            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.intitule}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-green-200 px-4 py-2 text-sm font-medium hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "En cours..." : "Enregistrer client"}
      </button>
    </form>
  );
}
