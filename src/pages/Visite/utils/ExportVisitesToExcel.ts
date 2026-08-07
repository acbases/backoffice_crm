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

const HEADERS = [
    "ID",
    "Client",
    "Utilisateur",
    "Matricule",
    "Planifiée",
    "Type visite",
    "Catégorie visite",
    "Zone",
    "Quartier",
    "Catégorie client",
    "Date",
    "Statut",
    "Objet",
];

const HEADER_FILL = "FF2E7D32"; // vert
const MIN_COLUMN_WIDTH = 10;
const MAX_COLUMN_WIDTH = 40;

export const exportVisitesToExcel = async (visites: VisiteItem[]) => {
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

        return [
            visite.id,
            visite.client?.nom ?? "",
            visite.utilisateur
                ? `${visite.utilisateur.firstname ?? ""} ${visite.utilisateur.name ?? ""}`.trim()
                : "",
            visite.utilisateur?.matricule ?? "",
            visite.type === 0 ? "Oui" : "Non",
            visite.type_visite?.nom ?? "",
            visite.categorie_visite?.intitule ?? "",
            visite.client?.zone ?? "",
            visite.client?.quartier ?? "",
            visite.client?.categorie_client?.intitule ?? "",
            visite.date,
            statut,
            visite.object ?? "",
        ];
    });

    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Visites");

    worksheet.addRow(HEADERS);
    rows.forEach((row) => worksheet.addRow(row));

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: HEADER_FILL },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { vertical: "middle", horizontal: "left" };
    });

    // ajuste la largeur de chaque colonne selon le contenu le plus long
    HEADERS.forEach((header, index) => {
        let maxLength = header.length;
        rows.forEach((row) => {
            const value = row[index];
            if (value) maxLength = Math.max(maxLength, String(value).length);
        });

        worksheet.getColumn(index + 1).width = Math.min(
            Math.max(maxLength + 2, MIN_COLUMN_WIDTH),
            MAX_COLUMN_WIDTH
        );
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const today = new Date().toISOString().split("T")[0];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `visites_${today}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};
