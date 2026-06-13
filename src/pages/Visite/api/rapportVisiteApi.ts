import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

/* =========================
   Rapport B2B
========================= */

export type RapportB2BItem = {
  id: number;
  idvisite: number;
  description: string;
  action_a_faire: string | null;
  sary: string | null;
  prochaine_visite: string | null;
  idcorrespondant: number | null;
  created_at: string | null;
  updated_at: string | null;

  correspondant: {
    id: number;
    nom: string;
    poste: string;
    contact: string;
  } | null;
};

export async function getRapportB2BByIdVisite(idVisite: number) {
  const { data } = await api.get<RapportB2BItem[]>(
    `/getRapportB2BByIdVisite/${idVisite}`
  );

  return data[0];
}

/* =========================
   Vue Rapport Produits
========================= */

export type VueRapportProduitItem = {
  idvisite: number;
  description: string;
  autre_plv: string;
  intitule: string;
  prix_achat: string;
  prix_vente_gros: string;
  prix_vente_details: string;
  cout_transport: string;
  marge: string;
  volume: string;
};

export async function getVueRapportProduitsByIdVisite(
  idVisite: number
) {
  const { data } = await api.get<VueRapportProduitItem[]>(
    `/getVueRapportProduitsByIdVisite/${idVisite}`
  );

  return data;
}

/* =========================
   Vue Rapport Autres Produits
========================= */

export type VueRapportAutreProduitItem = {
  idvisite: number;
  autre_produit_id: number;
  nom: string;
  prix_achat: string;
  prix_vente_gros: string;
  prix_vente_details: string;
  cout_transport: string;
  marge: string;
  volume: string;
};

export async function getVueRapportAutresProduitsByIdVisite(
  idVisite: number
) {
  const { data } = await api.get<VueRapportAutreProduitItem[]>(
    `/getVueRapportAutresProduitsByIdVisite/${idVisite}`
  );

  return data;
}

/* =========================
   Vue Rapport PLV
========================= */

export type VueRapportPlvItem = {
  idvisite: number;
  plv_id: number;
  plv_nom: string;
};

export async function getVueRapportPlvByIdVisite(
  idVisite: number
) {
  const { data } = await api.get<VueRapportPlvItem[]>(
    `/getVueRapportPlvByIdVisite/${idVisite}`
  );

  return data;
}

/* =========================
   Rapport
========================= */

export type RapportItem = {
  id: number;
  idvisite: number;
  description: string;
  autre_plv: string;
  created_at: string | null;
  updated_at: string | null;
};

export async function getRapportByIdVisite(
  idVisite: number
) {
  const { data } = await api.get<RapportItem[]>(
    `/getRapportByIdVisite/${idVisite}`
  );

  return data;
}