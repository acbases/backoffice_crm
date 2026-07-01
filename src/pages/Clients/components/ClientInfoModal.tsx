import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getClientById,
  updateClient,
} from "../api/clientApi";

import { getAgences, type agencetItem } from "../api/agenceApi";
import {
  getCategorieClients,
  type categorieClientItem,
} from "../api/categorieClientApi";

import { getZones } from "../api/zoneApi";
import { getQuartiers } from "../api/quartierApi";
import MapPicker from "./MapPicker";

const initialForm = {
  nom: "",
  latitude: "",
  longitude: "",
  zone: "",
  quartier: "",
  idagence: "",
  idcategorie: "",
};
type UpdateClientProps = {
  id: number;
  onSuccess?: () => void;
};
export default function ClientInfoModal({
  id,
  onSuccess,
}: UpdateClientProps) {
  // const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [agences, setAgences] = useState<agencetItem[]>([]);
  const [categories, setCategories] = useState<categorieClientItem[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [quartiers, setQuartiers] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          client,
          agencesData,
          categoriesData,
          zonesData,
          quartiersData,
        ] = await Promise.all([
          getClientById(Number(id)),
          getAgences(),
          getCategorieClients(),
          getZones(),
          getQuartiers(),
        ]);

        setAgences(agencesData);
        setCategories(categoriesData);
        setZones(zonesData);
        setQuartiers(quartiersData);

        setForm({
          nom: client.nom,
          latitude: client.latitude.toString(),
          longitude: client.longitude.toString(),
          zone: client.zone,
          quartier:
            typeof client.quartier === "string"
              ? client.quartier
              : client.quartier.intitule,
          idagence: client.idagence.toString(),
          idcategorie: client.idcategorie.toString(),
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load client.");
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await updateClient(Number(id), {
        nom: form.nom,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        zone: form.zone,
        quartier: form.quartier,
        idagence: Number(form.idagence),
        idcategorie: Number(form.idcategorie),
      });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Unable to update client.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="m-4">Chargement...</div>;
  }
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
      }));
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 mx-auto flex gap-4 w-[90%] rounded-xl 
      border border-gray-100 
      bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Modifier un client
        </h2>

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}


        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Nom</span>
          <input
            value={form.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Latitude</span>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Longitude</span>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Zone</span>
            <input
              value={form.zone}
              onChange={(e) => handleChange("zone", e.target.value)}
              list="zone-list"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
              onChange={(e) => handleChange("quartier", e.target.value)}
              list="quartier-list"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
              onChange={(e) => handleChange("idagence", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
            <span className="text-sm font-medium text-gray-700">
              Catégorie
            </span>
            <select
              value={form.idcategorie}
              onChange={(e) => handleChange("idcategorie", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
          className="rounded-lg bg-blue-200 mt-3 px-4 py-2 hover:bg-blue-300"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="rounded bg-gray-200 px-3 py-2 ml-2 hover:bg-gray-300"
        >
          Use my location
        </button>
      </div>

        <MapPicker
          lat={Number(form.latitude) || 0}
          lng={Number(form.longitude) || 0}
          onChange={(lat, lng) => {
            setForm((prev) => ({
              ...prev,
              latitude: lat.toString(),
              longitude: lng.toString(),
            }));
          }}
        />

    </form>
  );
}