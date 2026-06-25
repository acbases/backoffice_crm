import * as XLSX from "xlsx";

type VisiteItem = {
    id: number;
    date: string;
    statut: number;
    type: number;
    object?: string | null;

    client?: {
        nom?: string;
        zone?: string;
        quartier?: string;
        latitude?: string;
        longitude?: string;
        categorie_client?: {
            intitule?: string;
            statut?: string;
        };
    };

    utilisateur?: {
        firstname?: string;
        name?: string;
        matricule?: string;
    };

    categorie_visite?: {
        intitule?: string;
    };

    type_visite?: {
        nom?: string;
    };
};

export const exportVisitesToExcel = (visites: VisiteItem[]) => {
    const rows = visites.map((visite) => {
        const isPast = visite.date
            ? new Date(visite.date) < new Date()
            : false;

        let statut = "A venir";

        if (visite.statut === 1) {
            statut = "Effectuée";
        } else if (visite.statut === 0 && isPast) {
            statut = "En retard";
        }

        return {
            ID: visite.id,

            Client: visite.client?.nom ?? "",

            Utilisateur: visite.utilisateur
                ? `${visite.utilisateur.firstname ?? ""} ${visite.utilisateur.name ?? ""}`.trim()
                : "",

            Matricule: visite.utilisateur?.matricule ?? "",

            Planifiée: visite.type === 0 ? "Oui" : "Non",

            "Type visite": visite.type_visite?.nom ?? "",

            "Catégorie visite":
                visite.categorie_visite?.intitule ?? "",

            Zone: visite.client?.zone ?? "",

            Quartier: visite.client?.quartier ?? "",

            "Catégorie client":
                visite.client?.categorie_client?.intitule ?? "",

            Date: visite.date,

            Statut: statut,

            Objet: visite.object ?? "",
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Visites"
    );

    const today = new Date().toISOString().split("T")[0];

    XLSX.writeFile(
        workbook,
        `visites_${today}.xlsx`
    );
};
