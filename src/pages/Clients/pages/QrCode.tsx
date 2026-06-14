import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import type { ClientsContext } from "../Clients";
import { getClientQrCode, updateClient } from "../api/clientApi";

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

  const handleDownload = () => {
    if (!qrBlob || !selectedClient) return;
    const url = URL.createObjectURL(qrBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedClient.nom}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
    <div className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">QR Code client</h2>
        <p className="text-sm text-gray-500">
          Current client: {selectedClient.nom}
        </p>
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedClient.status_qrcode
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
                onClick={handleDownload}
                disabled={!qrBlob}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Télécharger QR Code
              </button>
              {!selectedClient.status_qrcode && (
                <button
                  onClick={handleActivateStatus}
                  disabled={activating}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activating ? "Activating..." : "Activate QR Code"}
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
  );
}
