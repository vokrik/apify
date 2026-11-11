import type { Transformation } from "./types";

/** Transformations the user can add to an automation, grouped by category in the picker. */
export const transformations: Transformation[] = [
  {
    id: "get-changed-rows",
    title: "Get changed rows",
    description: "Keep rows whose values changed since the previous run or a baseline dataset.",
    category: "builtin",
  },
  {
    id: "get-new-rows",
    title: "Get new rows",
    description: "Keep rows that weren't in the previous run or a baseline dataset.",
    category: "builtin",
  },
  {
    id: "get-missing-rows",
    title: "Get missing rows",
    description: "Return rows from the previous run or a baseline dataset that are now gone.",
    category: "builtin",
  },
  {
    id: "filter-incomplete-data",
    title: "Filter incomplete data",
    description: "Let a row through only if all the columns you pick have a value.",
    category: "marketplace",
    author: "dataops_labs",
  },
  {
    id: "filter-by-sentiment",
    title: "Filter by sentiment",
    description:
      "Classify a text column with an AI model and keep rows with the sentiment you pick.",
    category: "marketplace",
    author: "textlens",
  },
  {
    id: "products-below-threshold",
    title: "Products below threshold",
    description: "Keep selected products when a numeric column (e.g. price) drops below a limit.",
    category: "own",
    author: "understandable_hummock",
  },
];
