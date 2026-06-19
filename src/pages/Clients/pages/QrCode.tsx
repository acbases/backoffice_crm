import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import type { ClientsContext } from "../Clients";
import { getClientQrCode, updateClient } from "../api/clientApi";
import { generateA4QrImage } from "../utils/generateA4QrImage";

const getQuartierLabel = (quartier: string | { intitule: string }) =>
  typeof quartier === "object" ? quartier.intitule : quartier;

export default function ClientQrCode() {
  const { idclient } = useParams<{ idclient: string }>();
  const navigate = useNavigate();
  const { clients, setSelectedClientId, loadClients, loading: clientsLoading } =
    useOutletContext<ClientsContext>();
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrBlob, setQrBlob] = useState<Blob | null>(null);

  // Sync selectedClientId with URL param
  useEffect(() => {
    if (idclient) {
      setSelectedClientId(idclient);
    }
  }, [idclient, setSelectedClientId]);

  const selectedClient =
    clients.find((client) => String(client.id) === idclient) ??
    null;

  // Handle case where qr-code is accessed without ID, redirect to first client if available
  useEffect(() => {
    if (!idclient && clients.length > 0) {
      navigate(`../${clients[0].id}/qr-code`, { replace: true });
    }
  }, [idclient, clients, navigate]);

  //loading qr code of the client
  useEffect(() => {
    if (!selectedClient) {
      setQrUrl("");
      setError("");
      setQrBlob(null);
      return;
    }

    let active = true;
    let objectUrl = "";

    const loadQr = async () => {
      setLoading(true);
      setError("");

      try {
        const blob = await getClientQrCode(selectedClient.id);
        objectUrl = URL.createObjectURL(blob);

        if (active) {
          setQrUrl(objectUrl);
          setQrBlob(blob);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        if (active) {
          setError("QR image unavailable.");
          setQrUrl("");
          setQrBlob(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQr();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedClient]);

  // const generateA4QrImage = async () => {
  //   if (!qrUrl || !selectedClient) return;

  //   const canvas = document.createElement("canvas");

  //   const A4_WIDTH = 2480;
  //   const A4_HEIGHT = 3508;

  //   canvas.width = A4_WIDTH;
  //   canvas.height = A4_HEIGHT;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // White background
  //   ctx.fillStyle = "#ffffff";
  //   ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

  //   // Load QR image
  //   const qrImg = new Image();
  //   qrImg.src = qrUrl;

  //   // Load logo
  //   const logoImg = new Image();
  //   logoImg.src = "/crm_admin/logo-ac.png";

  //   await Promise.all([
  //     new Promise((resolve) => {
  //       qrImg.onload = resolve;
  //     }),
  //     new Promise((resolve) => {
  //       logoImg.onload = resolve;
  //     }),
  //   ]);

  //   // =====================
  //   // TOP SECTION : QR CODE
  //   // =====================

  //   const qrSize = 1800;

  //   ctx.drawImage(
  //     qrImg,
  //     (A4_WIDTH - qrSize) / 2,
  //     150,
  //     qrSize,
  //     qrSize
  //   );

  //   // =====================
  //   // BOTTOM SECTION : LOGO
  //   // =====================

  //   const logoWidth = 1300;
  //   const logoHeight = 900;

  //   ctx.drawImage(
  //     logoImg,
  //     (A4_WIDTH - logoWidth) / 2,
  //     2200,
  //     logoWidth,
  //     logoHeight
  //   );

  //   // Optional client name
  //   ctx.fillStyle = "#000";
  //   ctx.font = "bold 80px Arial";
  //   ctx.textAlign = "center";

  //   ctx.fillText(
  //     selectedClient.nom,
  //     A4_WIDTH / 2,
  //     2100
  //   );

  //   // Download
  //   const output = canvas.toDataURL("image/png");

  //   const link = document.createElement("a");
  //   link.href = output;
  //   link.download = `${selectedClient.nom}-A4-QR.png`;
  //   link.click();
  // };

  const [activating, setActivating] = useState(false);

  const handleActivateStatus = async () => {
    if (!selectedClient || activating || selectedClient.status_qrcode) return;
    setActivating(true);
    try {
      await updateClient(selectedClient.id, { status_qrcode: true });
      await loadClients(); // This "refreshes" the data
    } catch (err) {
      console.error("Failed to activate QR code status:", err);
    } finally {
      setActivating(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    navigate(`../${clientId}/qr-code`);
  };

  if (clientsLoading && clients.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Loading clients...
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        No client selected yet. Add one first or choose one from the list.
      </div>
    );
  }

  return (
    <div className="flex gap-6">

      <div className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">QR Code client</h2>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Choisir un client</span>
          <select
            value={String(selectedClient.id)}
            onChange={(event) => handleClientChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
          >
            {clients.map((client) => (
              <option key={client.id} value={String(client.id)}>
                {client.nom}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading QR code...</div>
          ) : error ? (
            <div className="text-sm text-gray-500">{error}</div>
          ) : qrUrl ? (
            <>
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">QR Code Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedClient.status_qrcode
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {selectedClient.status_qrcode ? "Active" : "Inactive"}
                </span>
              </div>
              <img
                src={qrUrl}
                alt={`QR code for ${selectedClient.nom}`}
                className="h-[400px] w-[400px] rounded-lg border border-gray-200 bg-white p-3"
              />
              <div className="w-full flex items-center justify-between space-x-2">
                <button
                  onClick={() =>
                    generateA4QrImage({
                      qrUrl,
                      clientName: selectedClient.nom,
                    })
                  }
                  disabled={!qrBlob}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-200 text-sm font-medium hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Télécharger QR Code
                </button>
                {!selectedClient.status_qrcode && (
                  <button
                    onClick={handleActivateStatus}
                    disabled={activating}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-400 text-sm font-medium hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activating ? "En cours..." : "Activer QR Code"}
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-1 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">Nom:</span> {selectedClient.nom}
          </div>
          <div>
            <span className="font-medium text-gray-900">Zone:</span> {selectedClient.zone}
          </div>
          <div>
            <span className="font-medium text-gray-900">Quartier:</span>{" "}
            {getQuartierLabel(selectedClient.quartier)}
          </div>
        </div>

      </div>
      <div>
        <iframe
          height="600"
          width="600"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${selectedClient.latitude},${selectedClient.longitude}&z=16&output=embed`}
        ></iframe>
      </div>
    </div>
  );
}
