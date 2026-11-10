import { cn } from "@/lib/cn";

export type PixelChartProps = {
  /** One value per elapsed day. */
  values: number[];
  /** Number of columns (days in month). */
  columns: number;
  rows?: number;
};

/**
 * Apify `PixelChart`: a dot matrix where each column is a day and lit dots (from the bottom)
 * show relative usage. Every elapsed day lights at least one dot.
 */
export function PixelChart({ values, columns, rows = 15 }: PixelChartProps) {
  const max = Math.max(...values, 0.0001);
  const heights = Array.from({ length: columns }, (_, day) => {
    const v = values[day];
    if (v === undefined) return 0;
    return Math.max(1, Math.round((v / max) * Math.min(rows, 4)));
  });
  return (
    <div
      aria-hidden="true"
      className="grid shrink-0 gap-[4px]"
      style={{
        gridTemplateColumns: `repeat(${columns}, 2px)`,
        gridTemplateRows: `repeat(${rows}, 2px)`,
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        heights.map((h, col) => (
          <span
            key={`${row}-${col}`}
            className={cn(
              "size-[2px] rounded-[0.5px]",
              rows - row <= h ? "bg-primary-action" : "bg-neutral-border",
            )}
          />
        )),
      )}
    </div>
  );
}
