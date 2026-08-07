import type { UserItem } from "../api/utilisateurApi";

const HEADERS = ["Nom", "Matricule", "Email", "Rôle", "Statut"];

const HEADER_FILL = "FF2E7D32"; // vert
const MIN_COLUMN_WIDTH = 10;
const MAX_COLUMN_WIDTH = 40;

export const exportUtilisateursToExcel = async (utilisateurs: UserItem[]) => {
  const rows = utilisateurs.map((utilisateur) => [
    `${utilisateur.firstname} ${utilisateur.name}`,
    utilisateur.matricule,
    utilisateur.email,
    utilisateur.role_crm,
    utilisateur.statut ? "Actif" : "Inactif",
  ]);

  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Utilisateurs");

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
  link.download = `utilisateurs_${today}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
};
