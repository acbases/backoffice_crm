// ClientMap.tsx
import { useLocation } from "react-router-dom";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import type { ClientItem } from "../api/clientApi";
import { useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import type { ClientsContext } from "../Clients";
const containerStyle = {
    width: "100%",
    height: "100vh",
    marginTop: "20px",
    marginLeft: "20px",
};


export default function MapsClient() {
    const { clients } = useOutletContext<ClientsContext>();
    const [searchParams] = useSearchParams();

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
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

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
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
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
    );
}