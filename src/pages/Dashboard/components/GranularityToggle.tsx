import type { Granularity } from "../utils/aggregateVisites";

const OPTIONS: { value: Granularity; label: string }[] = [
  { value: "day", label: "Jour" },
  { value: "month", label: "Mois" },
  { value: "year", label: "Année" },
];

type GranularityToggleProps = {
  value: Granularity;
  onChange: (value: Granularity) => void;
};

export default function GranularityToggle({ value, onChange }: GranularityToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === option.value
              ? "bg-red-100 text-red-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
