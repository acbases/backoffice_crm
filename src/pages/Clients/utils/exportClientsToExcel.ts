import type { ClientItem } from "../api/clientApi";
import { getFournisseurClientByIdClient } from "../api/fournisseurClientApi";
import { getCorrespondantClientByIdClient } from "../api/correspondantClientApi";

const getQuartierLabel = (quartier: ClientItem["quartier"]) =>
  typeof quartier === "object" ? quartier.intitule : quartier;

const HEADERS = [
  "Nom",
  "Agence",
  "Zone",
  "Quartier",
  "Catégorie",
  "Avec QR code",
  "Fournisseurs",
  "Correspondants",
];

const HEADER_FILL = "FF2E7D32"; // vert
const MIN_COLUMN_WIDTH = 10;
const MAX_COLUMN_WIDTH = 40;

export const exportClientsToExcel = async (
  clients: ClientItem[],
  onProgress?: (done: number, total: number) => void
) => {
  let done = 0;
  const total = clients.length;

  const rows = await Promise.all(
    clients.map(async (client) => {
      const [fournisseurs, correspondants] = await Promise.all([
        getFournisseurClientByIdClient(client.id).catch(() => []),
        getCorrespondantClientByIdClient(client.id).catch(() => []),
      ]);

      done += 1;
      onProgress?.(done, total);

      return [
        client.nom,
        client.agence?.intitule ?? "",
        client.zone ?? "",
        getQuartierLabel(client.quartier) ?? "",
        client.categorie_client?.intitule ?? "",
        client.status_qrcode ? "Oui" : "Non",
        fournisseurs.map((f) => f.fournisseur?.nom).filter(Boolean).join(", "),
        correspondants.map((c) => c.correspondant?.nom).filter(Boolean).join(", "),
      ];
    })
  );

  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Clients");

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
  link.download = `clients_${today}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
};
