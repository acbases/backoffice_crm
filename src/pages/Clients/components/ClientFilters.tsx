import type { agencetItem } from "../api/agenceApi";
import type { categorieClientItem } from "../api/categorieClientApi";

type FilterValue = string;

type ClientFiltersProps = {
  qrCodeFilter: FilterValue;
  setQrCodeFilter: (value: FilterValue) => void;
  agenceFilter: FilterValue;
  setAgenceFilter: (value: FilterValue) => void;
  zoneFilter: FilterValue;
  setZoneFilter: (value: FilterValue) => void;
  quartierFilter: FilterValue;
  setQuartierFilter: (value: FilterValue) => void;
  categorieFilter: FilterValue;
  setCategorieFilter: (value: FilterValue) => void;
  nomFilter: FilterValue;
  setNomFilter: (value: FilterValue) => void;
  agenceOptions: agencetItem[];
  zoneOptions: string[];
  quartierOptions: string[];
  categorieOptions: categorieClientItem[];
  totalCount: number;
  withQrCodeCount: number;
  withoutQrCodeCount: number;
};

function FilterSelect({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-gray-600" htmlFor={id}>
      <span className="font-medium text-gray-700">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ClientFilters({
  qrCodeFilter,
  setQrCodeFilter,
  agenceFilter,
  setAgenceFilter,
  zoneFilter,
  setZoneFilter,
  quartierFilter,
  setQuartierFilter,
  categorieFilter,
  setCategorieFilter,
  nomFilter,
  setNomFilter,
  agenceOptions,
  zoneOptions,
  quartierOptions,
  categorieOptions,
  totalCount,
  withQrCodeCount,
  withoutQrCodeCount,
}: ClientFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      
      <label className="flex flex-col gap-1.5 text-sm text-gray-600" htmlFor="nom-filter">
        <span className="font-medium text-gray-700">Nom</span>
        <input
          id="nom-filter"
          type="text"
          value={nomFilter}
          onChange={(e) => setNomFilter(e.target.value)}
          placeholder="Rechercher par nom..."
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>

      <FilterSelect
        label="Agence"
        id="agence-filter"
        value={agenceFilter}
        onChange={setAgenceFilter}
        placeholder="Toutes les agences"
        options={agenceOptions.map((agence) => ({
          value: agence.intitule,
          label: agence.intitule,
        }))}
      />

      <FilterSelect
        label="Zone"
        id="zone-filter"
        value={zoneFilter}
        onChange={setZoneFilter}
        placeholder="Toutes les zones"
        options={zoneOptions.map((zone) => ({
          value: zone,
          label: zone,
        }))}
      />

      <FilterSelect
        label="Quartier"
        id="quartier-filter"
        value={quartierFilter}
        onChange={setQuartierFilter}
        placeholder="Tous les quartiers"
        options={quartierOptions.map((quartier) => ({
          value: quartier,
          label: quartier,
        }))}
      />

      <FilterSelect
        label="Categorie"
        id="categorie-filter"
        value={categorieFilter}
        onChange={setCategorieFilter}
        placeholder="Toutes les categories"
        options={categorieOptions.map((categorie) => ({
          value: categorie.intitule,
          label: categorie.intitule,
        }))}
      />
      <label className="flex flex-col gap-1.5 text-sm text-gray-600" htmlFor="qr-code-filter">
        <span className="font-medium text-gray-700">QR code</span>
        <select
          id="qr-code-filter"
          value={qrCodeFilter}
          onChange={(e) => setQrCodeFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Tous ({totalCount})</option>
          <option value="with">Avec QR code ({withQrCodeCount})</option>
          <option value="without">Sans QR code ({withoutQrCodeCount})</option>
        </select>
      </label>
    </div>
  );
}
