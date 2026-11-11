import {
  amazonProductColumns,
  amazonProductsSample,
  datasets,
  exampleSentiments,
  sentimentModels,
} from "@/data/datasets";
import { transformations } from "@/data/transformations";
import type {
  Dataset,
  DatasetColumn,
  DatasetRow,
  Sentiment,
  Transformation,
  TransformationCategory,
  TransformationId,
} from "@/data/types";

// Simulated backend for automation transformations: the catalog, default settings, and the
// transformation logic itself (run on the example rows to preview the result).

export function getTransformations(category?: TransformationCategory): Transformation[] {
  return category ? transformations.filter((t) => t.category === category) : transformations;
}

export function getTransformation(id: TransformationId): Transformation {
  return transformations.find((t) => t.id === id)!;
}

export function getDatasets(): Dataset[] {
  return datasets;
}

export function getSentimentModels(): string[] {
  return sentimentModels;
}

/** Columns of the trigger's dataset (the Amazon Scraper output in this prototype). */
export function getDatasetColumns(): DatasetColumn[] {
  return amazonProductColumns;
}

/** For each column: does every row in the latest run have a distinct, non-empty value? */
export function getUniqueColumns(): Record<string, boolean> {
  return Object.fromEntries(
    amazonProductColumns.map(({ key }) => {
      const values = amazonProductsSample.map((row) => row[key]);
      const unique = values.every((v) => v !== null) && new Set(values).size === values.length;
      return [key, unique];
    }),
  );
}

export function getSampleRowCount(): number {
  return amazonProductsSample.length;
}

// --- Settings ---------------------------------------------------------------------------------

export type CompareSettings = {
  compareTo: "previous-run" | "dataset";
  datasetId: string | null;
  /** Column that identifies a row across runs. */
  uniqueKey: string;
};

export type SelectorOperator =
  | "equals"
  | "not-equals"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "regex"
  | "one-of";

export const selectorOperators: { id: SelectorOperator; label: string }[] = [
  { id: "equals", label: "=" },
  { id: "not-equals", label: "≠" },
  { id: "lt", label: "<" },
  { id: "lte", label: "≤" },
  { id: "gt", label: ">" },
  { id: "gte", label: "≥" },
  { id: "regex", label: "matches regexp" },
  { id: "one-of", label: "is one of" },
];

export type ThresholdRule = {
  id: string;
  /** Which rows the rule applies to. */
  selector: { column: string; operator: SelectorOperator; value: string };
  /** Keep the row if `column` is below `value`. Kept as typed; parsed when evaluated. */
  threshold: { column: string; value: string };
};

export type TransformationConfig =
  | ({ id: "get-changed-rows"; includeNew: boolean; includeDeleted: boolean } & CompareSettings)
  | ({ id: "get-new-rows" | "get-missing-rows" } & CompareSettings)
  | { id: "products-below-threshold"; rules: ThresholdRule[] }
  | { id: "filter-incomplete-data"; requiredColumns: string[] }
  | { id: "filter-by-sentiment"; column: string; model: string; sentiments: Sentiment[] };

let ruleCounter = 0;
export function newThresholdRule(): ThresholdRule {
  ruleCounter += 1;
  return {
    id: `rule-${ruleCounter}`,
    selector: { column: "sku", operator: "equals", value: "" },
    threshold: { column: "price", value: "" },
  };
}

const compareDefaults: CompareSettings = {
  compareTo: "previous-run",
  datasetId: null,
  uniqueKey: "sku",
};

export function defaultConfig(id: TransformationId): TransformationConfig {
  switch (id) {
    case "get-changed-rows":
      return { id, ...compareDefaults, includeNew: false, includeDeleted: false };
    case "get-new-rows":
    case "get-missing-rows":
      return { id, ...compareDefaults };
    case "products-below-threshold":
      return {
        id,
        rules: [
          {
            ...newThresholdRule(),
            selector: { column: "sku", operator: "one-of", value: "SKU-123, SKU-456" },
            threshold: { column: "price", value: "10.5" },
          },
          {
            ...newThresholdRule(),
            selector: { column: "name", operator: "regex", value: "stand" },
            threshold: { column: "price", value: "5" },
          },
        ],
      };
    case "filter-incomplete-data":
      return { id, requiredColumns: ["description", "weight"] };
    case "filter-by-sentiment":
      return {
        id,
        column: "latestReview",
        model: sentimentModels[0]!,
        sentiments: ["neutral", "negative"],
      };
  }
}

const isNumber = (value: string) => value.trim() !== "" && Number.isFinite(Number(value));

/** Whether the settings are complete enough to save. */
export function isConfigValid(config: TransformationConfig): boolean {
  switch (config.id) {
    case "get-changed-rows":
    case "get-new-rows":
    case "get-missing-rows":
      return config.compareTo === "previous-run" || config.datasetId !== null;
    case "products-below-threshold":
      return (
        config.rules.length > 0 &&
        config.rules.every((r) => r.selector.value.trim() !== "" && isNumber(r.threshold.value))
      );
    case "filter-incomplete-data":
      return config.requiredColumns.length > 0;
    case "filter-by-sentiment":
      return config.sentiments.length > 0;
  }
}

const joinOr = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;

export function compareTargetLabel(settings: CompareSettings): string {
  if (settings.compareTo === "previous-run") return "previous run";
  return datasets.find((d) => d.id === settings.datasetId)?.name ?? "baseline dataset";
}

/** One-line summary shown on the step card once the transformation is configured. */
export function summarizeConfig(config: TransformationConfig): string {
  switch (config.id) {
    case "get-changed-rows":
    case "get-new-rows":
    case "get-missing-rows":
      return `vs. ${compareTargetLabel(config)} · key: ${config.uniqueKey}`;
    case "products-below-threshold":
      return config.rules.length === 1 ? "1 rule" : `${config.rules.length} rules`;
    case "filter-incomplete-data":
      return `Requires ${config.requiredColumns.join(", ")}`;
    case "filter-by-sentiment":
      return `${config.column} is ${joinOr(config.sentiments)}`;
  }
}

// --- Evaluation -------------------------------------------------------------------------------

export type RowChange = "changed" | "new" | "deleted";

export type ResultRow = {
  row: DatasetRow;
  change?: RowChange;
  /** 1-based index of the threshold rule that kept the row. */
  rule?: number;
  sentiment?: Sentiment;
};

const keyOf = (row: DatasetRow, key: string) => String(row[key]);

const differs = (a: DatasetRow, b: DatasetRow) =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].some((k) => a[k] !== b[k]);

/** Rows of `current` compared with `baseline`, matched by the unique key. */
export function compareRows(
  config: Extract<TransformationConfig, CompareSettings>,
  baseline: DatasetRow[],
  current: DatasetRow[],
): ResultRow[] {
  const key = config.uniqueKey;
  const before = new Map(baseline.map((row) => [keyOf(row, key), row]));
  const nowKeys = new Set(current.map((row) => keyOf(row, key)));
  const wantNew =
    config.id === "get-new-rows" || (config.id === "get-changed-rows" && config.includeNew);
  const wantDeleted =
    config.id === "get-missing-rows" || (config.id === "get-changed-rows" && config.includeDeleted);

  const result: ResultRow[] = [];
  for (const row of current) {
    const old = before.get(keyOf(row, key));
    if (!old) {
      if (wantNew) result.push({ row, change: "new" });
    } else if (config.id === "get-changed-rows" && differs(old, row)) {
      result.push({ row, change: "changed" });
    }
  }
  if (wantDeleted) {
    for (const row of baseline) {
      if (!nowKeys.has(keyOf(row, key))) result.push({ row, change: "deleted" });
    }
  }
  return result;
}

function selectorMatches(row: DatasetRow, selector: ThresholdRule["selector"]): boolean {
  const cell = row[selector.column];
  if (cell === null || cell === undefined) return false;
  const value = selector.value.trim();
  const asNumber = Number(value);
  switch (selector.operator) {
    case "equals":
      return String(cell) === value;
    case "not-equals":
      return String(cell) !== value;
    case "lt":
      return Number(cell) < asNumber;
    case "lte":
      return Number(cell) <= asNumber;
    case "gt":
      return Number(cell) > asNumber;
    case "gte":
      return Number(cell) >= asNumber;
    case "regex":
      try {
        return new RegExp(value, "i").test(String(cell));
      } catch {
        return false;
      }
    case "one-of":
      return value
        .split(",")
        .map((v) => v.trim())
        .includes(String(cell));
  }
}

/** Filters rows (everything except the comparisons, which need a baseline). */
export function filterRows(
  config: Exclude<TransformationConfig, CompareSettings>,
  rows: DatasetRow[],
): ResultRow[] {
  switch (config.id) {
    case "products-below-threshold":
      return rows.flatMap((row) => {
        // Rules are checked top to bottom; the first one whose selector matches decides.
        const index = config.rules.findIndex((r) => selectorMatches(row, r.selector));
        const rule = config.rules[index];
        if (!rule || !isNumber(rule.threshold.value)) return [];
        const cell = row[rule.threshold.column];
        return typeof cell === "number" && cell < Number(rule.threshold.value)
          ? [{ row, rule: index + 1 }]
          : [];
      });
    case "filter-incomplete-data":
      return rows
        .filter((row) => config.requiredColumns.every((c) => row[c] !== null && row[c] !== ""))
        .map((row) => ({ row }));
    case "filter-by-sentiment":
      return rows.flatMap((row) => {
        const sentiment = exampleSentiments[String(row.sku)]?.[config.column] ?? "neutral";
        return config.sentiments.includes(sentiment) ? [{ row, sentiment }] : [];
      });
  }
}

export const isComparison = (
  config: TransformationConfig,
): config is Extract<TransformationConfig, CompareSettings> =>
  config.id === "get-changed-rows" ||
  config.id === "get-new-rows" ||
  config.id === "get-missing-rows";
