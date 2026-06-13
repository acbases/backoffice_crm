import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});
export type UserItem = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  matricule: string;
  firstname: string;
  statut: boolean;
  legacy_utilisateur_id: number;
  role_crm: string;
};

export async function getUsers() {
  const { data } = await api.get<UserItem[]>("/users");

  return [...data].sort((a, b) =>
    `${a.firstname} ${a.name}`.localeCompare(
      `${b.firstname} ${b.name}`,
      "fr",
      { sensitivity: "base" }
    )
  );
}