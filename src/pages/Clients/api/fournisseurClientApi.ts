import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 15000,
});

export type FournisseurClientItem = {
  id: number;
  idfournisseur: number;
  idclient: number;
  created_at: string | null;
  updated_at: string | null;
  fournisseur: {
    id: number;
    nom: string;
    created_at: string | null;
    updated_at: string | null;
  };
};

export async function getFournisseurClientByIdClient(idClient: number) {
  const { data } = await api.get<FournisseurClientItem[]>(
    `/fournisseurClientByIdClient/${idClient}`
  );
  return data ?? [];
}
