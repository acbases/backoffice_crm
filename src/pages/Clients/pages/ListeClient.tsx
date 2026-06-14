import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ClientsContext } from "../Clients";
import ClientFilters from "../components/ClientFilters";
import { getClients, type ClientItem } from "../api/clientApi";

import { getAgences, type agencetItem } from "../api/agenceApi";
import { getCategorieClients, type categorieClientItem } from "../api/categorieClientApi";
import { getQuartiers } from "../api/quartierApi";
import { getZones } from "../api/zoneApi";

type QrCodeFilter = "all" | "with" | "without";

const normalizeText = (value: string | null | undefined) =>
  (value ?? "").trim().toLowerCase();

const getQuartierLabel = (quartier: ClientItem["quartier"]) =>
  typeof quartier === "object" ? quartier.intitule : quartier;

export default function ListeClient() {
  // client states
  const navigate = useNavigate();
  const { clients, setClients, setSelectedClientId } =
    useOutletContext<ClientsContext>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // loading clients 
  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getClients();
        setClients(data);
      } catch {
        setError("Unable to load clients.");
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, [setClients]);


  // filters data state
  const [agenceOptions, setAgenceOptions] = useState<agencetItem[]>([]);
  const [zoneOptions, setZoneOptions] = useState<string[]>([]);
  const [quartierOptions, setQuartierOptions] = useState<string[]>([]);
  const [categorieOptions, setCategorieOptions] = useState<categorieClientItem[]>([]);
  // loading filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [agences, zones, quartiers, categories] = await Promise.all([
          getAgences(),
          getZones(),
          getQuartiers(),
          getCategorieClients(),
        ]);

        setAgenceOptions(agences);
        setZoneOptions(zones);
        setQuartierOptions(quartiers);
        setCategorieOptions(categories);
      } catch {
        // Keep the list usable even if filter metadata fails to load.
      }
    };

    loadFilters();
  }, []);
  // filter values states
  const [qrCodeFilter, setQrCodeFilter] = useState<QrCodeFilter>("all");
  const [agenceFilter, setAgenceFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [quartierFilter, setQuartierFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [nomFilter, setNomFilter] = useState("");
  // client filter handling
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (qrCodeFilter === "with" && !client.status_qrcode) {
        return false;
      }
      if (qrCodeFilter === "without" && client.status_qrcode) {
        return false;
      }

      if (
        agenceFilter &&
        normalizeText(client.agence?.intitule) !== normalizeText(agenceFilter)
      ) {
        return false;
      }       

      if (zoneFilter && normalizeText(client.zone) !== normalizeText(zoneFilter)) {
        return false;
      }

      if (
        quartierFilter &&
        normalizeText(getQuartierLabel(client.quartier)) !== normalizeText(quartierFilter)
      ) {
        return false;
      }

      if (
        categorieFilter &&
        normalizeText(client.categorie_client?.intitule) !== normalizeText(categorieFilter)
      ) {
        return false;
      }

      if (nomFilter) {
        const regex = new RegExp(nomFilter.trim().split(/\s+/).join(".*"), "i");
        if (!regex.test(normalizeText(client.nom))) {
          return false;
        }
      }

      return true;
    });
  }, [agenceFilter, categorieFilter, clients, qrCodeFilter, quartierFilter, zoneFilter, nomFilter]);


  // qr code counts and open qr code 
  const withQrCodeCount = useMemo(
    () => clients.filter((client) => client.status_qrcode).length,
    [clients]
  );
  const withoutQrCodeCount = useMemo(
    () => clients.filter((client) => !client.status_qrcode).length,
    [clients]
  );
  const openQrCode = (id: number) => {
    setSelectedClientId(String(id));
    navigate("../qr-code");
  };


  // use to display name on the mobile 
  const getInitials = (nom: string) =>
    nom
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();


  // display handling with error
  if (loading)
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Loading clients...
      </div>
    );

  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );

  if (clients.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        No clients found.
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Liste des clients</h2>
        </div>

        {/* filters ui component */}
        <div className="mt-4">
          <ClientFilters
            qrCodeFilter={qrCodeFilter}
            setQrCodeFilter={(value) => setQrCodeFilter(value as QrCodeFilter)}
            agenceFilter={agenceFilter}
            setAgenceFilter={setAgenceFilter}
            zoneFilter={zoneFilter}
            setZoneFilter={setZoneFilter}
            quartierFilter={quartierFilter}
            setQuartierFilter={setQuartierFilter}
            categorieFilter={categorieFilter}
            setCategorieFilter={setCategorieFilter}
            nomFilter={nomFilter}
            setNomFilter={setNomFilter}
            agenceOptions={agenceOptions}
            zoneOptions={zoneOptions}
            quartierOptions={quartierOptions}
            categorieOptions={categorieOptions}
            totalCount={clients.length}
            withQrCodeCount={withQrCodeCount}
            withoutQrCodeCount={withoutQrCodeCount}
          />
        </div>
      </div>

      {/* desktop laptop view */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
              <th className="w-[20%] px-2 py-3">Nom</th>
              <th className="w-[12%] px-2 py-3">Agence</th>
              <th className="w-[12%] px-2 py-3">Zone</th>
              <th className="w-[15%] px-2 py-3">Quartier</th>
              <th className="w-[12%] px-2 py-3">Categorie</th>
              <th className="w-[13%] px-2 py-3">Cree le</th>
              <th className="w-[13%] px-2 py-3">Avec Qr code</th>
              <th className="w-[8%] px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td className="px-2 py-8 text-center text-sm text-gray-500" colSpan={8}>
                  No clients match the selected filters.
                </td>
              </tr>
            ) : null}
            {filteredClients.map((client) => {
              const quartierIntitule = getQuartierLabel(client.quartier);
              return (
                <tr key={client.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-2 py-3 font-medium text-gray-900">{client.nom}</td>
                  <td className="px-2 py-3 text-gray-500">{client.agence?.intitule ?? "—"}</td>
                  <td className="px-2 py-3 text-gray-500">{client.zone ?? "—"}</td>
                  <td className="px-2 py-3 text-gray-500">{quartierIntitule ?? "—"}</td>
                  <td className="px-2 py-3 text-gray-500">
                    {client.categorie_client?.intitule ?? "—"}
                  </td>
                  <td className="px-2 py-3 text-gray-500">
                    {client.created_at ? new Date(client.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`rounded px-2 py-1 text-sm font-medium ${
                        client.status_qrcode ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      {client.status_qrcode ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => openQrCode(client.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                      </svg>
                      QR
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* mobile view */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        {filteredClients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
            No clients match the selected filters.
          </div>
        ) : null}
        {filteredClients.map((client) => {
          const quartierIntitule = getQuartierLabel(client.quartier);
          return (
            <div key={client.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                  {getInitials(client.nom)}
                </div>
                <span className="font-medium text-gray-900">{client.nom}</span>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Zone</p>
                  <p className="text-gray-700">{client.zone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Quartier</p>
                  <p className="text-gray-700">{quartierIntitule ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Agence</p>
                  <p className="text-gray-700">{client.agence?.intitule ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Cree le</p>
                  <p className="text-gray-700">
                    {client.created_at ? new Date(client.created_at).toLocaleDateString("fr-FR") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Latitude</p>
                  <p className="text-gray-700">{client.latitude ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Longitude</p>
                  <p className="text-gray-700">{client.longitude ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Statut Qr code</p>
                  <span
                    className={`rounded px-2 py-1 text-gray-700 ${
                      client.status_qrcode ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    {client.status_qrcode ? "avec" : "sans"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => openQrCode(client.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="3" height="3" />
                  </svg>
                  Voir QR Code
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
