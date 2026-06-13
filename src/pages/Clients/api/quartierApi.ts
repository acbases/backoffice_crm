import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

export async function getQuartiers(): Promise<string[]> {
  const { data } = await api.get<string[]>("/quartier");
  return [...data].sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" })
  );
}