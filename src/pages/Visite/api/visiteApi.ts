import axios from "axios";

// POST Visite
export type VisitePayload = {
  idclient: number;
  idutilisateur: number;
  idcategorie: number;
  date: string;
  statut: number;
  type: number;
  idtype: number;
  object: string;
};

export type VisiteResponse = VisitePayload & {
  id: number; // Assuming the response includes an ID after creation
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

export async function createVisite(payload: VisitePayload) {
  const { data } = await api.post<VisiteResponse>("/visite", payload);
  return data;
}

// GET visites
export type VisiteItem = {
    id: number;
    date: string;
    statut: number;
    type: number;
    idtype: number;
    created_at: string;
    updated_at: string;
    object: string | null;
    client: {
        id: number;
        nom: string;
        latitude: string;
        longitude: string;
        zone: string;
        quartier: string;
        idagence: number;
        idcategorie: number;
        status_qrcode: boolean;
        categorie_client: {
            id: number;
            intitule: string;
        };
    };
    categorie_visite: {
        id: number;
        intitule: string;
    };
    type_visite: {
        id: number;
        nom: string;
    };
};
export async function getVisites() {
  const { data } = await api.get<VisiteItem[]>("/visite");
  return data;
}