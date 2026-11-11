import { describe, expect, it } from "vitest";

import { exampleBaselineRows, exampleFilterRows, exampleNewRows } from "@/data/datasets";

import {
  compareRows,
  defaultConfig,
  filterRows,
  getUniqueColumns,
  isComparison,
  isConfigValid,
  summarizeConfig,
  type TransformationConfig,
} from "./transformations";

const skus = (rows: { row: Record<string, unknown> }[]) => rows.map((r) => r.row.sku);

function compare(config: TransformationConfig) {
  if (!isComparison(config)) throw new Error("not a comparison");
  return compareRows(config, exampleBaselineRows, exampleNewRows);
}

function filter(config: TransformationConfig) {
  if (isComparison(config)) throw new Error("not a filter");
  return filterRows(config, exampleFilterRows);
}

describe("transformations", () => {
  it("suggests only columns with distinct values as unique keys", () => {
    const unique = getUniqueColumns();
    expect(Object.keys(unique).filter((k) => unique[k])).toEqual(["productId", "sku", "url"]);
  });

  it("gets changed rows, optionally with new and deleted ones", () => {
    const config = defaultConfig("get-changed-rows");
    expect(compare(config).map((r) => [r.row.sku, r.change])).toEqual([["SKU-123", "changed"]]);
    expect(
      compare({ ...config, includeNew: true, includeDeleted: true } as TransformationConfig).map(
        (r) => [r.row.sku, r.change],
      ),
    ).toEqual([
      ["SKU-123", "changed"],
      ["SKU-321", "new"],
      ["SKU-789", "deleted"],
    ]);
  });

  it("gets new and missing rows", () => {
    expect(skus(compare(defaultConfig("get-new-rows")))).toEqual(["SKU-321"]);
    expect(skus(compare(defaultConfig("get-missing-rows")))).toEqual(["SKU-789"]);
  });

  it("applies the first threshold rule whose selector matches", () => {
    const config = defaultConfig("products-below-threshold");
    expect(filter(config).map((r) => [r.row.sku, r.rule])).toEqual([
      ["SKU-456", 1],
      ["SKU-789", 2],
    ]);
    if (config.id !== "products-below-threshold") throw new Error();
    // A rule above that also matches SKU-789 takes priority over rule 2.
    const stricter = {
      ...config.rules[0]!,
      id: "strict",
      selector: { column: "sku", operator: "equals" as const, value: "SKU-789" },
      threshold: { column: "price", value: "1" },
    };
    expect(skus(filter({ ...config, rules: [stricter, ...config.rules] }))).toEqual(["SKU-456"]);
  });

  it("filters incomplete data and by sentiment", () => {
    expect(skus(filter(defaultConfig("filter-incomplete-data")))).toEqual(["SKU-123", "SKU-321"]);
    expect(skus(filter(defaultConfig("filter-by-sentiment")))).toEqual(["SKU-123", "SKU-789"]);
  });

  it("needs a dataset when comparing with a baseline", () => {
    const config = {
      ...defaultConfig("get-new-rows"),
      compareTo: "dataset",
    } as TransformationConfig;
    expect(isConfigValid(config)).toBe(false);
    const withDataset = {
      ...config,
      datasetId: "amazon-products-baseline",
    } as TransformationConfig;
    expect(isConfigValid(withDataset)).toBe(true);
    expect(summarizeConfig(withDataset)).toBe("vs. amazon-products-baseline · key: sku");
  });
});
