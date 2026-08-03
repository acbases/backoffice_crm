// ClientMap.tsx
import { useLocation } from "react-router-dom";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import type { ClientItem } from "../api/clientApi";
import { useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import type { ClientsContext } from "../Clients";
import { googleMapsConfig } from "@/utils/GoogleMaps";
import { useEffect, useMemo, useState } from "react";
import ClientFilters from "../components/ClientFilters";
import { getAgences, type agencetItem } from "../api/agenceApi";
import { getCategorieClients, type categorieClientItem } from "../api/categorieClientApi";
import { getQuartiers } from "../api/quartierApi";
import { getZones } from "../api/zoneApi";

// const containerStyle = {
//     width: "100%",
//     height: "100vh",
//     marginTop: "50px",
//     marginLeft: "20px",
// };
const containerStyle = {
    width: "100%",
    height: "100%",
};


export default function MapsClient() {
    const { clients } = useOutletContext<ClientsContext>();
    const [agenceOptions, setAgenceOptions] = useState<agencetItem[]>([]);
    const [zoneOptions, setZoneOptions] = useState<string[]>([]);
    const [quartierOptions, setQuartierOptions] = useState<string[]>([]);
    const [categorieOptions, setCategorieOptions] = useState<categorieClientItem[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [agences, zones, quartiers, categories] =
                    await Promise.all([
                        getAgences(),
                        getZones(),
                        getQuartiers(),
                        getCategorieClients(),
                    ]);

                setAgenceOptions(agences);
                setZoneOptions(zones);
                setQuartierOptions(quartiers);
                setCategorieOptions(categories);
            } catch (err) {
                console.error(err);
            }
        };

        loadFilters();
    }, []);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        setSearchParams(params);
    };

    const withQrCodeCount = useMemo(
        () => clients.filter((c) => c.status_qrcode).length,
        [clients]
    );

    const withoutQrCodeCount = useMemo(
        () => clients.filter((c) => !c.status_qrcode).length,
        [clients]
    );

    const agence = searchParams.get("agence") ?? "";
    const zone = searchParams.get("zone") ?? "";
    const quartier = searchParams.get("quartier") ?? "";
    const categorie = searchParams.get("categorie") ?? "";
    const nom = searchParams.get("nom") ?? "";
    const qrcode = searchParams.get("qrcode") ?? "all"; // "all" | "with" | "without"

    const normalizeText = (v: string | null | undefined) =>
        (v ?? "").trim().toLowerCase();

    const getQuartierLabel = (q: ClientItem["quartier"]) =>
        typeof q === "object" ? q.intitule : q;

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            if (qrcode === "with" && !client.status_qrcode) return false;
            if (qrcode === "without" && client.status_qrcode) return false;
            if (agence && normalizeText(client.agence?.intitule) !== normalizeText(agence)) return false;
            if (zone && normalizeText(client.zone) !== normalizeText(zone)) return false;
            if (quartier && normalizeText(getQuartierLabel(client.quartier)) !== normalizeText(quartier)) return false;
            if (categorie && normalizeText(client.categorie_client?.intitule) !== normalizeText(categorie)) return false;
            if (nom) {
                const regex = new RegExp(nom.trim().split(/\s+/).join(".*"), "i");
                if (!regex.test(normalizeText(client.nom))) return false;
            }
            return true;
        });
    }, [clients, agence, zone, quartier, categorie, nom, qrcode]);

    const { isLoaded } = useJsApiLoader(googleMapsConfig);

    const center = useMemo(() => {
        const first = filteredClients[0];
        if (!first) return { lat: -18.8792, lng: 47.5079 }; // fallback default

        return {
            lat: Number(first.latitude),
            lng: Number(first.longitude),
        };
    }, [filteredClients]);
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="flex h-screen flex-col">

            {/* Filtres */}
            <div className="border-b bg-white p-4 shadow-sm">
                <ClientFilters
                    qrCodeFilter={qrcode}
                    setQrCodeFilter={(value) => updateFilter("qrcode", value)}

                    agenceFilter={agence}
                    setAgenceFilter={(value) => updateFilter("agence", value)}

                    zoneFilter={zone}
                    setZoneFilter={(value) => updateFilter("zone", value)}

                    quartierFilter={quartier}
                    setQuartierFilter={(value) => updateFilter("quartier", value)}

                    categorieFilter={categorie}
                    setCategorieFilter={(value) => updateFilter("categorie", value)}

                    nomFilter={nom}
                    setNomFilter={(value) => updateFilter("nom", value)}

                    agenceOptions={agenceOptions}
                    zoneOptions={zoneOptions}
                    quartierOptions={quartierOptions}
                    categorieOptions={categorieOptions}

                    totalCount={clients.length}
                    withQrCodeCount={withQrCodeCount}
                    withoutQrCodeCount={withoutQrCodeCount}
                />
            </div>

            {/* Carte */}
            <div className="flex-1">
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    center={center}
                    zoom={12}
                >
                    {filteredClients.map((client) => (
                        <MarkerF
                            key={client.id}
                            position={{
                                lat: Number(client.latitude),
                                lng: Number(client.longitude),
                            }}
                            title={client.nom}
                        />
                    ))}
                </GoogleMap>
            </div>

        </div>

    );
}