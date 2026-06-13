import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});
export type CategorieVisiteItem = {
  id: number;
  intitule: string;
  created_at: string | null;
  updated_at: string | null;
  statut: boolean | null;
};

export async function getCategorieVisites() {
  const { data } = await api.get<CategorieVisiteItem[]>(
    "/categorieVisites"
  );

  return [...data].sort((a, b) =>
    a.intitule.localeCompare(b.intitule, "fr", {
      sensitivity: "base",
    })
  );
}