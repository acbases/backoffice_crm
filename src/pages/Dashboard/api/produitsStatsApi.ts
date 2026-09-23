import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

export type ProduitStatOrigine = "nos_produits" | "externe";
export type ProduitStatType = "catalogue" | "autre";

export type ProduitStat = {
  type: ProduitStatType;
  origine: ProduitStatOrigine;
  produit_id: number | null;
  nom: string;
  variantes: string[];
  volume_total: number;
  prix_achat_moyen: number | null;
  prix_vente_gros_moyen: number | null;
  prix_vente_details_moyen: number | null;
  nb_occurrences: number;
};

export type ProduitsStatsResponse = {
  periode: { annee: number | null; mois: number | null; agence_id: number | null };
  prix_moyen_par_type: {
    prix_achat: number | null;
    prix_vente_gros: number | null;
    prix_vente_details: number | null;
  };
  meilleur_produit: ProduitStat | null;
  produits: ProduitStat[];
  part_marche: {
    nos_produits: { volume: number; pourcentage: number | null };
    produits_externes: { volume: number; pourcentage: number | null };
  };
};

export type ProduitsStatsParams = {
  limit?: number;
  annee?: number;
  mois?: number;
  agence_id?: number;
};

// GET dashboard produits stats (prix moyens, top produits, part de marché)
export async function getProduitsStats(params: ProduitsStatsParams = {}) {
  const { data } = await api.get<ProduitsStatsResponse>("/dashboard/produits-stats", {
    params,
    headers: { Accept: "application/json" },
  });
  return data;
}

export type PrixReleveExtreme = {
  valeur: number;
  client_id: number;
  client: string;
};

export type ProduitDetailResponse = {
  periode: { annee: number | null; mois: number | null; agence_id: number | null };
  type: ProduitStatType;
  produit_id: number | null;
  nom: string;
  origine: ProduitStatOrigine;
  nb_occurrences: number;
  prix_moyen: {
    prix_achat: number | null;
    prix_vente_gros: number | null;
    prix_vente_details: number | null;
  };
  volume_moyen: number | null;
  prix_max: {
    prix_achat: PrixReleveExtreme | null;
    prix_vente_gros: PrixReleveExtreme | null;
    prix_vente_details: PrixReleveExtreme | null;
  };
  prix_min: {
    prix_achat: PrixReleveExtreme | null;
    prix_vente_gros: PrixReleveExtreme | null;
    prix_vente_details: PrixReleveExtreme | null;
  };
  volume_max: PrixReleveExtreme | null;
  volume_min: PrixReleveExtreme | null;
};

export type ProduitDetailParams = {
  type: ProduitStatType;
  produit_id?: number;
  nom?: string;
  annee?: number;
  mois?: number;
  agence_id?: number;
};

// GET détail d'un produit (prix/volume moyens, min, max) pour la fiche cliquable
export async function getProduitDetail(params: ProduitDetailParams) {
  const { data } = await api.get<ProduitDetailResponse>("/dashboard/produit-detail", {
    params,
    headers: { Accept: "application/json" },
  });
  return data;
}
