import type { Automation } from "./types";

export const automations: Automation[] = [
  {
    id: "daily-amazon-price-tracker",
    name: "Daily Amazon price tracker",
    slug: "understandable_hummock/daily-amazon-price-tracker",
    triggerActorId: "amazon-scraper",
    pricing: "PAY_PER_USAGE",
    lastRun: { startedAt: "2026-11-10T18:11:14", status: "SUCCEEDED" },
  },
  {
    id: "competitor-price-alerts",
    name: "Competitor price alerts",
    slug: "understandable_hummock/competitor-price-alerts",
    triggerActorId: "amazon-scraper",
    pricing: "PAY_PER_USAGE",
    lastRun: { startedAt: "2026-11-10T15:43:54", status: "FAILED" },
  },
  {
    id: "weekly-bestseller-report",
    name: "Weekly bestseller report",
    slug: "understandable_hummock/weekly-bestseller-report",
    triggerActorId: "amazon-scraper",
    pricing: "PAY_PER_USAGE",
    lastRun: { startedAt: "2026-11-09T08:00:12", status: "SUCCEEDED" },
  },
  {
    id: "new-review-digest",
    name: "New review digest",
    slug: "understandable_hummock/new-review-digest",
    triggerActorId: "amazon-scraper",
    pricing: "PAY_PER_USAGE",
  },
];
