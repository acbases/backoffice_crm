import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

export async function getZones(): Promise<string[]> {
  const { data } = await api.get<string[]>("/zone");
  return [...data].sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" })
  );
}