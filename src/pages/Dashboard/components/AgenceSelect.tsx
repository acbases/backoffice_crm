import { useEffect, useState } from "react";
import { getAgences, type agencetItem } from "@/pages/Clients/api/agenceApi";

type AgenceSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AgenceSelect({ value, onChange }: AgenceSelectProps) {
  const [agences, setAgences] = useState<agencetItem[]>([]);

  useEffect(() => {
    getAgences()
      .then(setAgences)
      .catch((err) => console.error("Erreur chargement agences :", err));
  }, []);

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 outline-none focus:border-red-500"
    >
      <option value="">Toutes les agences</option>
      {agences.map((agence) => (
        <option key={agence.id} value={String(agence.id)}>
          {agence.intitule}
        </option>
      ))}
    </select>
  );
}
