import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});
export type categorieClientItem = {
  id: number;
  intitule: string;
  statut: string;
};

export async function getCategorieClients() {
  const { data } = await api.get<categorieClientItem[]>("/categorieClients");
  return [...data].sort((a, b) =>
    a.intitule.localeCompare(b.intitule, "fr", { sensitivity: "base" })
  );
}