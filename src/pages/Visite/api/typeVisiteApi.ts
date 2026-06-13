import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});
export type TypeVisiteItem = {
  id: number;
  nom: string;
  created_at: string | null;
  updated_at: string | null;
};

export async function getTypeVisites() {
  const { data } = await api.get<TypeVisiteItem[]>("/typeVisites");

  return [...data].sort((a, b) =>
    a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" })
  );
}