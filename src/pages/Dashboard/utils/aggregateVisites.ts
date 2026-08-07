import type { VisiteItem } from "@/pages/Visite/api/visiteApi";
import type { StatusKey } from "./visiteStatus";

export type Granularity = "day" | "month" | "year";

export type BucketCount = {
  key: string;
  label: string;
  value: number;
};

export type StatusBucketCount = {
  key: string;
  label: string;
} & Record<StatusKey, number>;

const pad = (n: number) => String(n).padStart(2, "0");

const dayKeyFromDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKeyFromDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const yearKeyFromDate = (d: Date) => String(d.getFullYear());

export function bucketKey(dateStr: string, granularity: Granularity): string {
  const d = new Date(dateStr);
  if (granularity === "year") return yearKeyFromDate(d);
  if (granularity === "month") return monthKeyFromDate(d);
  return dayKeyFromDate(d);
}

export function bucketLabel(key: string, granularity: Granularity): string {
  if (granularity === "year") return key;

  if (granularity === "month") {
    const [y, m] = key.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  }

  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export function buildTimeline(granularity: Granularity, referenceDate: Date = new Date()): string[] {
  if (granularity === "day") {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => dayKeyFromDate(new Date(year, month, i + 1)));
  }

  if (granularity === "month") {
    const year = referenceDate.getFullYear();
    return Array.from({ length: 12 }, (_, i) => monthKeyFromDate(new Date(year, i, 1)));
  }

  const currentYear = referenceDate.getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(currentYear - (4 - i)));
}

export function countVisitesByBucket(
  visites: VisiteItem[],
  granularity: Granularity,
  timeline: string[]
): BucketCount[] {
  const counts = new Map<string, number>();

  visites.forEach((visite) => {
    if (!visite.date) return;
    const key = bucketKey(visite.date, granularity);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return timeline.map((key) => ({
    key,
    label: bucketLabel(key, granularity),
    value: counts.get(key) ?? 0,
  }));
}

export function countVisitesByBucketAndStatus(
  visites: VisiteItem[],
  granularity: Granularity,
  timeline: string[]
): StatusBucketCount[] {
  const counts = new Map<string, Record<StatusKey, number>>();
  const now = new Date();

  visites.forEach((visite) => {
    if (!visite.date) return;
    const key = bucketKey(visite.date, granularity);
    const entry = counts.get(key) ?? { effectuee: 0, enRetard: 0, aVenir: 0 };

    if (visite.statut === 1) {
      entry.effectuee += 1;
    } else if (new Date(visite.date) < now) {
      entry.enRetard += 1;
    } else {
      entry.aVenir += 1;
    }

    counts.set(key, entry);
  });

  return timeline.map((key) => {
    const entry = counts.get(key) ?? { effectuee: 0, enRetard: 0, aVenir: 0 };
    return { key, label: bucketLabel(key, granularity), ...entry };
  });
}
