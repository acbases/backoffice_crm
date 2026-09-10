import type { ClientItem } from "../api/clientApi";
import { getAllFournisseurClients } from "../api/fournisseurClientApi";
import { getAllCorrespondantClients } from "../api/correspondantClientApi";

const getQuartierLabel = (quartier: ClientItem["quartier"]) =>
  quartier && typeof quartier === "object" ? quartier.intitule : quartier;

const HEADERS = [
  "Nom",
  "Agence",
  "Zone",
  "Quartier",
  "Catégorie",
  "Avec QR code",
  "Statut",
  "Fournisseurs",
  "Correspondants",
];

const HEADER_FILL = "FF2E7D32"; // vert
const MIN_COLUMN_WIDTH = 10;
const MAX_COLUMN_WIDTH = 40;

const groupByClientId = <T extends { idclient: number }>(items: T[]) => {
  const map = new Map<number, T[]>();
  items.forEach((item) => {
    const bucket = map.get(item.idclient);
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(item.idclient, [item]);
    }
  });
  return map;
};

export const exportClientsToExcel = async (
  clients: ClientItem[],
  onProgress?: (done: number, total: number) => void
) => {
  const total = clients.length;
  onProgress?.(0, total);

  // récupère fournisseurs/correspondants en 2 requêtes au lieu de 2 par client
  const [fournisseurClients, correspondantClients] = await Promise.all([
    getAllFournisseurClients().catch(() => []),
    getAllCorrespondantClients().catch(() => []),
  ]);

  const fournisseursByClientId = groupByClientId(fournisseurClients);
  const correspondantsByClientId = groupByClientId(correspondantClients);

  const rows = clients.map((client, index) => {
    const fournisseurs = fournisseursByClientId.get(client.id) ?? [];
    const correspondants = correspondantsByClientId.get(client.id) ?? [];

    onProgress?.(index + 1, total);

    return [
      client.nom,
      client.agence?.intitule ?? "",
      client.zone ?? "",
      getQuartierLabel(client.quartier) ?? "",
      client.categorie_client?.intitule ?? "",
      client.status_qrcode ? "Oui" : "Non",
      client.statut ? "Actif" : "Inactif",
      fournisseurs.map((f) => f.fournisseur?.nom).filter(Boolean).join(", "),
      correspondants.map((c) => c.correspondant?.nom).filter(Boolean).join(", "),
    ];
  });

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
