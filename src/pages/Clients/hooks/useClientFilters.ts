import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ClientItem } from "../api/clientApi";
import { getAgences, type agencetItem } from "../api/agenceApi";
import { getCategorieClients, type categorieClientItem } from "../api/categorieClientApi";
import { getQuartiers } from "../api/quartierApi";
import { getZones } from "../api/zoneApi";

export type QrCodeFilter = "all" | "with" | "without";

const normalizeText = (value: string | null | undefined) =>
  (value ?? "").trim().toLowerCase();

const getQuartierLabel = (quartier: ClientItem["quartier"]) =>
  typeof quartier === "object" ? quartier.intitule : quartier;

export function useClientFilters(clients: ClientItem[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  // filter option lists (agences, zones, quartiers, categories)
  const [agenceOptions, setAgenceOptions] = useState<agencetItem[]>([]);
  const [zoneOptions, setZoneOptions] = useState<string[]>([]);
  const [quartierOptions, setQuartierOptions] = useState<string[]>([]);
  const [categorieOptions, setCategorieOptions] = useState<categorieClientItem[]>([]);

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

  const qrCodeFilter = (searchParams.get("qrcode") as QrCodeFilter) ?? "all";
  const agenceFilter = searchParams.get("agence") ?? "";
  const zoneFilter = searchParams.get("zone") ?? "";
  const quartierFilter = searchParams.get("quartier") ?? "";
  const categorieFilter = searchParams.get("categorie") ?? "";
  const nomFilter = searchParams.get("nom") ?? "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (qrCodeFilter === "with" && !client.status_qrcode) return false;
      if (qrCodeFilter === "without" && client.status_qrcode) return false;

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
        if (!regex.test(normalizeText(client.nom))) return false;
      }

      return true;
    });
  }, [agenceFilter, categorieFilter, clients, qrCodeFilter, quartierFilter, zoneFilter, nomFilter]);

  const withQrCodeCount = useMemo(
    () => clients.filter((client) => client.status_qrcode).length,
    [clients]
  );
  const withoutQrCodeCount = useMemo(
    () => clients.filter((client) => !client.status_qrcode).length,
    [clients]
  );

  return {
    // raw filter values (read from URL)
    qrCodeFilter,
    agenceFilter,
    zoneFilter,
    quartierFilter,
    categorieFilter,
    nomFilter,
    updateFilter,
    searchParams,

    // options
    agenceOptions,
    zoneOptions,
    quartierOptions,
    categorieOptions,

    // results
    filteredClients,
    withQrCodeCount,
    withoutQrCodeCount,
  };
}