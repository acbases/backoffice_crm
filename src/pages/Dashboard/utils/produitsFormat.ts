export function formatPrice(value: number | null): string {
  return value == null ? "—" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} Ar`;
}

export function formatVolumeNumber(value: number | null): string {
  return value == null ? "—" : value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

export function formatVolume(value: number | null): string {
  return value == null ? "—" : `${formatVolumeNumber(value)} t/semaine`;
}

export function formatPercent(value: number | null): string {
  return value == null ? "—" : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}%`;
}
