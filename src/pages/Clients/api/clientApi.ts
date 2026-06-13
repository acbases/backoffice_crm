import axios from "axios";
// create client 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

// POST create client 
export type ClientPayload = {
  nom: string;
  latitude: number;
  longitude: number;
  zone: string;
  quartier: string;
  idagence: number;
  idcategorie: number;
};

export type ClientResponse = ClientPayload & {
  id: number;
};

export async function createClient(payload: ClientPayload) {
  const { data } = await api.post<ClientResponse>("/client", payload);
  return data;
}

// GET all clients 
export type Agence = {
  id: number;
  intitule: string;
  region: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CategorieClient = {
  id: number;
  intitule: string;
  created_at: string | null;
  updated_at: string | null;
  statut: string;
};

export type Quartier = {
  id: number;
  intitule: string;
};

export type ClientItem = {
  id: number;
  nom: string;
  latitude: string;
  longitude: string;
  zone: string;
  quartier: Quartier | string;
  idagence: number;
  idcategorie: number;
  status_qrcode: boolean;
  created_at: string | null;
  updated_at: string | null;
  agence: Agence;
  categorie_client: CategorieClient;
};

export async function getClients() {
  const { data } = await api.get<ClientItem[]>("/clients");

  return [...data].sort((a, b) =>
    a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" })
  );
}

// get client qr code 
export async function getClientQrCode(idclient: number) {
  const response = await api.get(`/client/${idclient}/qrcode`, {
    responseType: "blob",
  });
  return response.data as Blob;
}

// update client 
// PUT update client

export type UpdateClientPayload = Partial<{
  nom: string;
  latitude: number;
  longitude: number;
  zone: string;
  quartier: string;
  idagence: number;
  idcategorie: number;
  status_qrcode: boolean;
}>;

export async function updateClient(
  id: number,
  payload: UpdateClientPayload
) {
  const { data } = await api.put<ClientItem>(`/client/${id}`, payload);
  return data;
}


