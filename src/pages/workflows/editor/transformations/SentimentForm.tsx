import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { exampleFilterRows } from "@/data/datasets";
import type { Sentiment } from "@/data/types";
import {
  filterRows,
  getSentimentModels,
  type TransformationConfig,
} from "@/services/transformations";

import { cellValue, ExamplePreview } from "./ExamplePreview";

type SentimentConfig = Extract<TransformationConfig, { id: "filter-by-sentiment" }>;

export type SentimentFormProps = {
  config: SentimentConfig;
  onChange: (config: SentimentConfig) => void;
};

/** Text columns of the Amazon dataset worth classifying. */
const textColumns = ["latestReview", "description", "name"];

const sentiments: { id: Sentiment; label: string; badge: "success" | "neutral" | "danger" }[] = [
  { id: "positive", label: "Positive", badge: "success" },
  { id: "neutral", label: "Neutral", badge: "neutral" },
  { id: "negative", label: "Negative", badge: "danger" },
];

/** Settings for "Filter by sentiment": text column, AI model and the sentiments to keep. */
export function SentimentForm({ config, onChange }: SentimentFormProps) {
  const set = (patch: Partial<SentimentConfig>) => onChange({ ...config, ...patch });
  const toggle = (id: Sentiment, on: boolean) =>
    set({
      sentiments: sentiments
        .map((s) => s.id)
        .filter((s) => (s === id ? on : config.sentiments.includes(s))),
    });

  const columns = ["sku", config.column];
  const result = filterRows(config, exampleFilterRows);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField label="Text column" description="The column the AI model reads.">
          <Select
            aria-label="Text column"
            value={config.column}
            options={textColumns.map((c) => ({ value: c, label: c }))}
            onChange={(column) => set({ column })}
          />
        </FormField>
        <FormField
          label="AI model"
          description="Classifies each row as positive, neutral or negative."
        >
          <Select
            aria-label="AI model"
            value={config.model}
            options={getSentimentModels().map((m) => ({ value: m, label: m }))}
            onChange={(model) => set({ model })}
          />
        </FormField>
      </div>
      <FormField label="Let rows through if the sentiment is">
        <div className="flex gap-6">
          {sentiments.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                aria-label={s.label}
                checked={config.sentiments.includes(s.id)}
                onChange={(on) => toggle(s.id, on)}
              />
              {s.label}
            </label>
          ))}
        </div>
      </FormField>

      <ExamplePreview
        inputs={[
          {
            title: "New data",
            subtitle: "This run",
            columns,
            rows: exampleFilterRows.map((row) => columns.map((c) => cellValue(row[c]))),
          },
        ]}
        result={{
          title: "Result",
          subtitle: `${result.length === 1 ? "1 row" : `${result.length} rows`} · ${config.model}`,
          columns: [...columns, "sentiment"],
          rows: result.map(({ row, sentiment }) => {
            const s = sentiments.find((x) => x.id === sentiment)!;
            return [
              ...columns.map((c) => cellValue(row[c])),
              <Badge key="sentiment" variant={s.badge}>
                {s.label}
              </Badge>,
            ];
          }),
          empty: "No rows match",
        }}
      />
    </div>
  );
}
