import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});
export type agencetItem = {
  id: number;
  intitule: string;
  region: string;
};

export async function getAgences() {
  const { data } = await api.get<agencetItem[]>("/agences");
  return [...data].sort((a, b) =>
    a.intitule.localeCompare(b.intitule, "fr", { sensitivity: "base" })
  );
}