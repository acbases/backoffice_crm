import { STATUS_META, STATUS_ORDER, type StatusKey } from "../utils/visiteStatus";

export type StatusFilter = StatusKey | "all";

type StatusToggleProps = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

export default function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
          value === "all"
            ? "border-gray-300 bg-white text-gray-700"
            : "border-gray-200 bg-gray-50 text-gray-400"
        }`}
      >
        Tous
      </button>

      {STATUS_ORDER.map((key) => {
        const meta = STATUS_META[key];
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-gray-300 bg-white text-gray-700"
                : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: active ? meta.color : "#d1d5db" }}
            />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
