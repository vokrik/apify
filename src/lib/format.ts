const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-10" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "15:43:54" */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** "2026-11-10 15:43:54" */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

export type DurationPart = { value: number; unit: "d" | "h" | "m" | "s" };

/** 3091 → [{51, "m"}, {31, "s"}] — Apify renders units in a muted color. */
export function durationParts(totalSecs: number): DurationPart[] {
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = Math.floor(totalSecs % 60);
  const parts: DurationPart[] = [];
  if (d) parts.push({ value: d, unit: "d" });
  if (h) parts.push({ value: h, unit: "h" });
  if (m) parts.push({ value: m, unit: "m" });
  if (s || parts.length === 0) parts.push({ value: s, unit: "s" });
  return parts.slice(0, 2);
}

/** 10020 → "10,020" */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** 0.57 → "$0.57" */
export function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** "November 2026" */
export function formatMonth(date: Date): string {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}
