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
  const { clients, setSelectedClientId, loading, loadClients } =
    useOutletContext<ClientsContext>();
  const [error, setError] = useState("");

  // Re-fetch if needed (e.g. if we want to ensure fresh data on mount)
  // useEffect(() => {
  //   loadClients();
  // }, [loadClients]);


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
    navigate(`../${id}/qr-code`);
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
    <div className="m-4 flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex gap-6 border-b border-gray-200 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Liste des clients</h2>
        </div>

      </div>
      {/* filters ui component */}
      <div className="mt-4 ml-2">
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

      {/* desktop-laptop view */}
      <div className="hidden md:flex-1 md:block md:min-h-0 md:overflow-y-auto">
        <table className="w-full text-sm ml-4 mt-2" style={{ tableLayout: "fixed" }}>
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
                      className={`rounded px-2 py-1 text-sm font-medium ${client.status_qrcode ? "bg-green-200" : "bg-red-200"
                        }`}
                    >
                      {client.status_qrcode ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => openQrCode(client.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-200 px-3 py-1.5 text-xs font-medium hover:bg-blue-300"
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
      <div className="shrink-0 flex items-center justify-between border-t border-gray-200 bg-white px-5 py-3 text-sm text-gray-500">
        <span>{filteredClients.length} résultats</span>
        <div className="flex items-center gap-1">
          <button className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40">‹</button>
          <span className="px-2">Page 1</span>
          <button className="rounded px-2 py-1 hover:bg-gray-100">›</button>
        </div>
      </div>
    </div>
  );
}
