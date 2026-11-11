import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Radio } from "@/components/ui/Radio";
import { Select } from "@/components/ui/Select";
import { exampleBaselineRows, exampleNewRows } from "@/data/datasets";
import type { DatasetRow } from "@/data/types";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import {
  type CompareSettings,
  compareRows,
  compareTargetLabel,
  getDatasetColumns,
  getDatasets,
  getSampleRowCount,
  getUniqueColumns,
  type RowChange,
  type TransformationConfig,
} from "@/services/transformations";

import { cellValue, ExamplePreview } from "./ExamplePreview";

type CompareConfig = Extract<TransformationConfig, CompareSettings>;

export type CompareFormProps = {
  config: CompareConfig;
  onChange: (config: CompareConfig) => void;
};

const changeBadge: Record<RowChange, ReactNode> = {
  changed: <Badge variant="warning">Changed</Badge>,
  new: <Badge variant="success">New</Badge>,
  deleted: <Badge variant="danger">Deleted</Badge>,
};

/** Settings for "Get changed rows", "Get new rows" and "Get missing rows". */
export function CompareForm({ config, onChange }: CompareFormProps) {
  const set = (patch: Partial<CompareConfig>) => onChange({ ...config, ...patch } as CompareConfig);
  const unique = getUniqueColumns();
  const sampleSize = getSampleRowCount();

  const key = config.uniqueKey;
  const columns = [key, "name", "price"];
  const baselineByKey = new Map(exampleBaselineRows.map((r) => [String(r[key]), r]));
  // Values that differ from the baseline are highlighted in the new data.
  const newDataCells = (row: DatasetRow) =>
    columns.map((c) => {
      const old = baselineByKey.get(String(row[key]));
      const changed = old !== undefined && old[c] !== row[c];
      return changed ? (
        <span key={c} className="font-semibold text-warning-text">
          {cellValue(row[c])}
        </span>
      ) : (
        cellValue(row[c])
      );
    });
  const result = compareRows(config, exampleBaselineRows, exampleNewRows);
  const target = compareTargetLabel(config);

  return (
    <div className="flex flex-col gap-6">
      <FormField
        label="Compare new data with"
        description="Each run's dataset is compared with this dataset to find the rows."
      >
        <label className="flex cursor-pointer items-start gap-2">
          <span className="pt-[2px]">
            <Radio
              name="compare-to"
              checked={config.compareTo === "previous-run"}
              onChange={() => set({ compareTo: "previous-run" })}
            />
          </span>
          <span>
            <span className="block text-sm">Previous run</span>
            <span className="block text-xs text-neutral-text-subtle">
              The dataset of the trigger's previous successful run.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2">
          <span className="pt-[2px]">
            <Radio
              name="compare-to"
              checked={config.compareTo === "dataset"}
              onChange={() => set({ compareTo: "dataset" })}
            />
          </span>
          <span>
            <span className="block text-sm">Baseline dataset</span>
            <span className="block text-xs text-neutral-text-subtle">
              A dataset you pick once. Every run is compared with it.
            </span>
          </span>
        </label>
        {config.compareTo === "dataset" && (
          <Select
            aria-label="Baseline dataset"
            className="ml-[2.4rem] w-[36rem]"
            placeholder="Select a dataset"
            value={config.datasetId ?? ""}
            onChange={(datasetId) => set({ datasetId })}
            options={getDatasets().map((d) => ({
              value: d.id,
              label: `${d.name} · ${formatNumber(d.itemCount)} items`,
            }))}
          />
        )}
      </FormField>

      <FormField
        label="Unique key"
        description={`The column that identifies a row across runs. Only columns with a distinct value in each of the ${sampleSize} rows of the latest run can be used.`}
      >
        <div className="grid grid-cols-5 gap-2">
          {getDatasetColumns().map(({ key: column }) => {
            const enabled = unique[column];
            return (
              <label
                key={column}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2 py-[0.6rem]",
                  enabled ? "cursor-pointer" : "cursor-default opacity-50",
                  config.uniqueKey === column
                    ? "border-primary-action bg-primary-background-subtle"
                    : "border-neutral-separator-subtle",
                )}
              >
                <Radio
                  name="unique-key"
                  checked={config.uniqueKey === column}
                  disabled={!enabled}
                  onChange={() => set({ uniqueKey: column })}
                />
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-neutral-text">
                    {column}
                  </span>
                  <span
                    className={cn(
                      "block text-xs",
                      enabled ? "text-success-text" : "text-neutral-text-subtle",
                    )}
                  >
                    {enabled ? "Unique" : "Not unique"}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </FormField>

      {config.id === "get-changed-rows" && (
        <FormField label="Options">
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              aria-label="Include new rows as changed"
              checked={config.includeNew}
              onChange={(includeNew) => set({ includeNew })}
            />
            Include new rows as changed
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              aria-label="Include deleted rows as changed"
              checked={config.includeDeleted}
              onChange={(includeDeleted) => set({ includeDeleted })}
            />
            Include deleted rows as changed
          </label>
        </FormField>
      )}

      <ExamplePreview
        inputs={[
          {
            title: "Baseline",
            subtitle: config.compareTo === "previous-run" ? "Previous run" : target,
            columns,
            rows: exampleBaselineRows.map((row) => columns.map((c) => cellValue(row[c]))),
          },
          {
            title: "New data",
            subtitle: "This run",
            columns,
            rows: exampleNewRows.map(newDataCells),
          },
        ]}
        result={{
          title: "Result",
          subtitle: result.length === 1 ? "1 row" : `${result.length} rows`,
          columns: [...columns, "change"],
          rows: result.map(({ row, change }) => [
            ...columns.map((c) => cellValue(row[c])),
            <span key="change">{change && changeBadge[change]}</span>,
          ]),
          empty: "No rows match",
        }}
      />
    </div>
  );
}
