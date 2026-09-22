import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

export type PlvClassementItem = {
  plv_id: number;
  nom: string;
  nb_recensements: number;
  nb_visites: number;
  taux_presence: number;
};

export type AutrePlvItem = {
  valeur: string;
  variantes: string[];
  nb_occurrences: number;
};

export type PlvStatsResponse = {
  periode: { annee: number | null; mois: number | null };
  total_visites_avec_rapport: number;
  total_visites_avec_plv: number;
  taux_presence_global: number;
  plv_le_plus_present: PlvClassementItem | null;
  classement_plv: PlvClassementItem[];
  autre_plv: AutrePlvItem[];
};

export type PlvStatsParams = {
  annee?: number;
  mois?: number;
};

// GET dashboard PLV stats (présence des PLV pendant les visites)
export async function getPlvStats(params: PlvStatsParams = {}) {
  const { data } = await api.get<PlvStatsResponse>("/dashboard/plv-stats", {
    params,
    headers: { Accept: "application/json" },
  });
  return data;
}
