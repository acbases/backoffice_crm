import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

// Intercepteur pour transformer les URLs des images
api.interceptors.response.use((response) => {
  if (response.data) {
    const transformUrl = (url: string | null | undefined): string | null | undefined => {
      if (!url || typeof url !== "string") return url;
      
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      
      // Si c'est une URL complète, extraire le chemin et le reconstruire
      if (url.startsWith("http")) {
        try {
          const urlObj = new URL(url);
          const path = urlObj.pathname;
          const serverBase = apiBase.replace(/\/api\/?$/, "");
          const newUrl = `${serverBase}${path}`;
          console.log("Image URL transformed:", {
            original: url,
            path,
            serverBase,
            newUrl
          });
          return newUrl;
        } catch (e) {
          console.error("Error transforming URL:", url, e);
          return url;
        }
      }
      
      return url;
    };

    // Transformer les données pour les rapports B2B et Retail
    if (Array.isArray(response.data)) {
      response.data = response.data.map((item: any) => {
        if (item.sary) {
          item.sary = transformUrl(item.sary);
        }
        return item;
      });
    } else if (response.data && typeof response.data === 'object') {
      if (response.data.sary) {
        response.data.sary = transformUrl(response.data.sary);
      }
    }
  }

  return response;
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

  return data.length > 0 ? data[0] : null;
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

  return data ?? [];
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

 return data ?? [];
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

  return data ?? [];
}

/* =========================
   Rapport retail
========================= */

export type RapportRetailItem = {
  id: number;
  idvisite: number;
  description: string;
  autre_plv: string;
  created_at: string | null;
  updated_at: string | null;
  sary: string | null;
};

export async function getRapportRetailByIdVisite(
  idVisite: number
) {
  const { data } = await api.get<RapportRetailItem[]>(
    `/getRapportByIdVisite/${idVisite}`
  );
  console.log("Rapport retail data:", data);

  return data.length > 0 ? data[0] : null;
}