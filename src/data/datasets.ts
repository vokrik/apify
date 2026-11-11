import type { Dataset, DatasetColumn, DatasetRow, Sentiment } from "./types";

// Output of the Amazon Scraper (understandable_hummock/amazon-scraper). The transformation editor
// uses it to suggest columns and to illustrate each transformation on a few example rows.

export const amazonProductColumns: DatasetColumn[] = [
  { key: "productId", type: "string" },
  { key: "sku", type: "string" },
  { key: "url", type: "string" },
  { key: "name", type: "string" },
  { key: "brand", type: "string" },
  { key: "description", type: "string" },
  { key: "price", type: "number" },
  { key: "weight", type: "number" },
  { key: "rating", type: "number" },
  { key: "latestReview", type: "string" },
];

/** The last run's dataset (first rows), used to detect which columns are unique. */
export const amazonProductsSample: DatasetRow[] = [
  {
    productId: "B0CHX1W1XY",
    sku: "SKU-123",
    url: "https://www.amazon.com/dp/B0CHX1W1XY",
    name: "Wireless earbuds",
    brand: "Soundcore",
    description: "Bluetooth 5.3 earbuds with 40h battery life.",
    price: 19.99,
    weight: 0.05,
    rating: 4.4,
    latestReview: "Battery died after a week.",
  },
  {
    productId: "B0BNPXL6KZ",
    sku: "SKU-456",
    url: "https://www.amazon.com/dp/B0BNPXL6KZ",
    name: "USB-C charger",
    brand: "Anker",
    description: null,
    price: 9.99,
    weight: 0.12,
    rating: 4.7,
    latestReview: "Charges fast, works as described.",
  },
  {
    productId: "B08L5NP6NG",
    sku: "SKU-789",
    url: "https://www.amazon.com/dp/B08L5NP6NG",
    name: "Phone stand",
    brand: "Lamicall",
    description: "Adjustable aluminium stand for phones and tablets.",
    price: 4.99,
    weight: null,
    rating: 4.7,
    latestReview: "It's a phone stand. Does the job.",
  },
  {
    productId: "B0C4QZ8TQ1",
    sku: "SKU-321",
    url: "https://www.amazon.com/dp/B0C4QZ8TQ1",
    name: "Laptop sleeve",
    brand: "Tomtoc",
    description: "Water-resistant 14-inch neoprene sleeve.",
    price: 29,
    weight: 0.3,
    rating: 4.6,
    latestReview: "Fits my laptop perfectly, love it.",
  },
  {
    productId: "B09V3HN1KC",
    sku: "SKU-654",
    url: "https://www.amazon.com/dp/B09V3HN1KC",
    name: "USB-C charger",
    brand: "Anker",
    description: "65W GaN charger with two ports.",
    price: 29,
    weight: 0.12,
    rating: 4.4,
    latestReview: null,
  },
  {
    productId: "B07PXGQC1Q",
    sku: "SKU-987",
    url: "https://www.amazon.com/dp/B07PXGQC1Q",
    name: "Wireless earbuds",
    brand: "JLab",
    description: "Budget earbuds with a charging case.",
    price: 24.99,
    weight: 0.05,
    rating: 4.2,
    latestReview: "Sound is fine for the price.",
  },
];

/** Example rows for the comparison transformations: what the baseline held… */
export const exampleBaselineRows: DatasetRow[] = [
  {
    productId: "B0CHX1W1XY",
    sku: "SKU-123",
    url: "…/dp/B0CHX1W1XY",
    name: "Wireless earbuds",
    price: 24.99,
  },
  {
    productId: "B0BNPXL6KZ",
    sku: "SKU-456",
    url: "…/dp/B0BNPXL6KZ",
    name: "USB-C charger",
    price: 9.99,
  },
  {
    productId: "B08L5NP6NG",
    sku: "SKU-789",
    url: "…/dp/B08L5NP6NG",
    name: "Phone stand",
    price: 4.99,
  },
];

/** …and what the new run scraped: SKU-123 got cheaper, SKU-789 is gone, SKU-321 is new. */
export const exampleNewRows: DatasetRow[] = [
  {
    productId: "B0CHX1W1XY",
    sku: "SKU-123",
    url: "…/dp/B0CHX1W1XY",
    name: "Wireless earbuds",
    price: 19.99,
  },
  {
    productId: "B0BNPXL6KZ",
    sku: "SKU-456",
    url: "…/dp/B0BNPXL6KZ",
    name: "USB-C charger",
    price: 9.99,
  },
  {
    productId: "B0C4QZ8TQ1",
    sku: "SKU-321",
    url: "…/dp/B0C4QZ8TQ1",
    name: "Laptop sleeve",
    price: 29,
  },
];

/** Example rows for the filters (a run's output). */
export const exampleFilterRows: DatasetRow[] = amazonProductsSample.slice(0, 4);

/**
 * Sentiment the AI model returns for each example row and text column. Precomputed: the prototype
 * doesn't call a model.
 */
export const exampleSentiments: Record<string, Record<string, Sentiment>> = {
  "SKU-123": { latestReview: "negative", description: "positive", name: "neutral" },
  "SKU-456": { latestReview: "positive", description: "neutral", name: "neutral" },
  "SKU-789": { latestReview: "neutral", description: "neutral", name: "neutral" },
  "SKU-321": { latestReview: "positive", description: "positive", name: "neutral" },
};

/** Saved datasets the user can compare against (newest first). */
export const datasets: Dataset[] = [
  {
    id: "amazon-products-baseline",
    name: "amazon-products-baseline",
    itemCount: 2063,
    createdAt: "2026-11-01T09:00:00",
  },
  {
    id: "headphones-q3-2026",
    name: "headphones-q3-2026",
    itemCount: 412,
    createdAt: "2026-09-30T17:20:00",
  },
  {
    id: "black-friday-2025-snapshot",
    name: "black-friday-2025-snapshot",
    itemCount: 1874,
    createdAt: "2025-11-28T08:00:00",
  },
];

export const sentimentModels = ["Claude Haiku 5.5", "Claude Sonnet 5.5", "GPT-4.1 mini"];
