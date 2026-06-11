import axios from "axios";
// create client 
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

export async function createClient(payload: ClientPayload) {
  const { data } = await api.post<ClientResponse>("/client", payload);
  return data;
}

// get clients and client
export type ClientItem = {
  id: number;
  nom: string;
  latitude: string;
  longitude: string;
  zone: string;
  quartier: string;
  idagence: number;
  idcategorie: number;
  status_qrcode: boolean;
};

export async function getClients() {
  const { data } = await api.get<ClientItem[]>("/clients");
  return data;
}

// get client qr code 
export async function getClientQrCode(idclient: number) {
  const response = await api.get(`/client/${idclient}/qrcode`, {
    responseType: "blob",
  });
  return response.data as Blob;
}
