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

/**
 * "understandable_hummock/amazon-scraper" → "underst...scraper" — Apify shortens long
 * technical names in tables by keeping the start and the end.
 */
export function truncateMiddle(value: string, keep = 7): string {
  if (value.length <= keep * 2 + 3) return value;
  return `${value.slice(0, keep)}...${value.slice(-keep)}`;
}

/** 144375 → "141 KB", 5242880 → "5 MB" (binary units, like Apify's storage pages). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
}
