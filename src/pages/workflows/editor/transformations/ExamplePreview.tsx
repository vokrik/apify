import type { ReactNode } from "react";

import type { DatasetRow } from "@/data/types";
import { cn } from "@/lib/cn";

export type PreviewTable = {
  title: string;
  subtitle?: string;
  /** Column headers (dataset field names). */
  columns: string[];
  rows: ReactNode[][];
  /** Shown when there are no rows. */
  empty?: string;
};

/** Renders a dataset value: `null` as a muted "null", numbers with tabular figures. */
export function cellValue(value: DatasetRow[string] | undefined): ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-neutral-text-placeholder italic">null</span>;
  }
  if (typeof value === "number") return <span className="tabular-nums">{value}</span>;
  return value;
}

function Table({ table, className }: { table: PreviewTable; className?: string }) {
  return (
    <figure
      aria-label={table.title}
      className={cn(
        "min-w-0 overflow-hidden rounded-md border border-neutral-separator-subtle bg-neutral-background",
        className,
      )}
    >
      <figcaption className="flex items-baseline justify-between gap-2 border-b border-neutral-separator-subtle bg-neutral-background-muted px-2 py-[0.6rem]">
        <span className="text-xs font-semibold text-neutral-text">{table.title}</span>
        {table.subtitle && (
          <span className="truncate text-xs text-neutral-text-subtle">{table.subtitle}</span>
        )}
      </figcaption>
      <table className="w-full text-xs">
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th
                key={column}
                className="border-b border-neutral-separator-subtle px-2 py-1 text-left font-mono font-normal whitespace-nowrap text-neutral-text-subtle"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((cells, i) => (
            // Example rows are static, so the index is a stable key.
            <tr key={i} className="border-b border-neutral-separator-subtle last:border-0">
              {cells.map((cell, j) => (
                <td key={j} className="h-[3.2rem] px-2 whitespace-nowrap text-neutral-text">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {table.rows.length === 0 && (
            <tr>
              <td
                colSpan={table.columns.length}
                className="h-[3.2rem] px-2 text-center text-neutral-text-subtle"
              >
                {table.empty ?? "No rows"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </figure>
  );
}

const dot = "absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-text";

/** Lines from the input table(s) down to the result, drawn like the canvas edges. */
function Connector({ inputs }: { inputs: 1 | 2 }) {
  const starts = inputs === 2 ? [25, 75] : [50];
  return (
    <div aria-hidden className="relative h-[4.8rem]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        {starts.map((x) => (
          <path
            key={x}
            d={`M${x} 0 C${x} 50, 50 50, 50 100`}
            fill="none"
            stroke="var(--color-primary-text)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {starts.map((x) => (
        <span key={x} className={dot} style={{ left: `${x}%`, top: 0 }} />
      ))}
      <span className={dot} style={{ left: "50%", top: "100%" }} />
    </div>
  );
}

export type ExamplePreviewProps = {
  /** One input (a filter) or two (baseline and new data for a comparison). */
  inputs: [PreviewTable] | [PreviewTable, PreviewTable];
  result: PreviewTable;
};

/** Example of what the transformation does: input table(s), joined by lines to the result. */
export function ExamplePreview({ inputs, result }: ExamplePreviewProps) {
  const half = "w-[calc(50%-1.2rem)]";
  return (
    <section aria-label="Example" className="flex flex-col gap-3">
      <header>
        <h3 className="text-sm font-semibold">Example</h3>
        <p className="mt-[0.2rem] text-xs text-neutral-text-subtle">
          A few rows from the Amazon Scraper dataset and what this transformation returns. The
          preview updates as you change the settings.
        </p>
      </header>
      <div>
        {inputs.length === 2 ? (
          <div className="grid grid-cols-2 gap-6">
            <Table table={inputs[0]} />
            <Table table={inputs[1]} />
          </div>
        ) : (
          <Table table={inputs[0]} className={cn("mx-auto", half)} />
        )}
        <Connector inputs={inputs.length} />
        <Table table={result} className={cn("mx-auto", half)} />
      </div>
    </section>
  );
}
