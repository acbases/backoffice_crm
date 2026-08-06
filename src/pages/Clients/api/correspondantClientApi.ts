import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 15000,
});

export type CorrespondantClientItem = {
  id: number;
  idclient: number;
  idcorrespondant: number;
  created_at: string | null;
  updated_at: string | null;
  correspondant: {
    id: number;
    nom: string;
    poste: string | null;
    contact: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
};

export async function getCorrespondantClientByIdClient(idClient: number) {
  const { data } = await api.get<CorrespondantClientItem[]>(
    `/correspondantClientByIdClient/${idClient}`
  );
  return data ?? [];
}
