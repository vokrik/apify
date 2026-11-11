import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { exampleFilterRows } from "@/data/datasets";
import { cn } from "@/lib/cn";
import {
  filterRows,
  getDatasetColumns,
  type TransformationConfig,
} from "@/services/transformations";

import { cellValue, ExamplePreview } from "./ExamplePreview";

type IncompleteConfig = Extract<TransformationConfig, { id: "filter-incomplete-data" }>;

export type IncompleteDataFormProps = {
  config: IncompleteConfig;
  onChange: (config: IncompleteConfig) => void;
};

/** Settings for "Filter incomplete data": which columns must have a value. */
export function IncompleteDataForm({ config, onChange }: IncompleteDataFormProps) {
  const required = new Set(config.requiredColumns);
  const toggle = (column: string, on: boolean) =>
    onChange({
      ...config,
      // Keep the dataset's column order.
      requiredColumns: getDatasetColumns()
        .map((c) => c.key)
        .filter((key) => (key === column ? on : required.has(key))),
    });

  const previewColumns = ["sku", ...config.requiredColumns.filter((c) => c !== "sku")].slice(0, 5);
  const result = filterRows(config, exampleFilterRows);
  const rowCells = (row: (typeof exampleFilterRows)[number]) =>
    previewColumns.map((c) =>
      row[c] === null ? (
        <span key={c} className="rounded-xs bg-danger-background px-1 text-danger-chip-text">
          null
        </span>
      ) : (
        cellValue(row[c])
      ),
    );

  return (
    <div className="flex flex-col gap-6">
      <FormField
        label="Required columns"
        description="A row is let through only if every selected column has a value (isn't empty or null)."
      >
        <div className="grid grid-cols-5 gap-2">
          {getDatasetColumns().map(({ key }) => (
            <label
              key={key}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-2 py-[0.6rem]",
                required.has(key)
                  ? "border-primary-action bg-primary-background-subtle"
                  : "border-neutral-separator-subtle",
              )}
            >
              <Checkbox
                aria-label={key}
                checked={required.has(key)}
                onChange={(on) => toggle(key, on)}
              />
              <span className="truncate font-mono text-xs">{key}</span>
            </label>
          ))}
        </div>
      </FormField>

      <ExamplePreview
        inputs={[
          {
            title: "New data",
            subtitle: "This run",
            columns: previewColumns,
            rows: exampleFilterRows.map(rowCells),
          },
        ]}
        result={{
          title: "Result",
          subtitle: result.length === 1 ? "1 row" : `${result.length} rows`,
          columns: previewColumns,
          rows: result.map(({ row }) => rowCells(row)),
          empty: "No rows match",
        }}
      />
    </div>
  );
}
