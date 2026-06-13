import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ClientsContext } from "../Clients";
import { getClientQrCode } from "../api/clientApi";

const getQuartierLabel = (quartier: string | { intitule: string }) =>
  typeof quartier === "object" ? quartier.intitule : quartier;

export default function ClientQrCode() {
  const { clients, selectedClientId, setSelectedClientId } =
    useOutletContext<ClientsContext>();
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedClient =
    clients.find((client) => String(client.id) === selectedClientId) ??
    clients[0] ??
    null;

  useEffect(() => {
    if (!selectedClientId && clients[0]) {
      setSelectedClientId(String(clients[0].id));
    }
  }, [clients, selectedClientId, setSelectedClientId]);

  useEffect(() => {
    if (!selectedClient) {
      setQrUrl("");
      setError("");
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
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        if (active) {
          setError("QR image unavailable.");
          setQrUrl("");
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
          onChange={(event) => setSelectedClientId(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-red-500"
        >
          {clients.map((client) => (
            <option key={client.id} value={String(client.id)}>
              {client.nom}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center justify-center rounded-xl bg-gray-50 p-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading QR code...</div>
        ) : error ? (
          <div className="text-sm text-gray-500">{error}</div>
        ) : qrUrl ? (
          <img
            src={qrUrl}
            alt={`QR code for ${selectedClient.nom}`}
            className="h-[400px] w-[400px] rounded-lg border border-gray-200 bg-white p-3"
          />
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
