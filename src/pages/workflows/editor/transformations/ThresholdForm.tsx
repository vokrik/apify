import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { exampleFilterRows } from "@/data/datasets";
import {
  filterRows,
  getDatasetColumns,
  newThresholdRule,
  type SelectorOperator,
  selectorOperators,
  type ThresholdRule,
  type TransformationConfig,
} from "@/services/transformations";

import { cellValue, ExamplePreview } from "./ExamplePreview";

type ThresholdConfig = Extract<TransformationConfig, { id: "products-below-threshold" }>;

export type ThresholdFormProps = {
  config: ThresholdConfig;
  onChange: (config: ThresholdConfig) => void;
};

const valuePlaceholder: Partial<Record<SelectorOperator, string>> = {
  "one-of": "e.g. SKU-123, SKU-456",
  regex: "e.g. ^USB",
};

/** Settings for "Products below threshold": an ordered list of selector → threshold rules. */
export function ThresholdForm({ config, onChange }: ThresholdFormProps) {
  const columns = getDatasetColumns();
  const columnOptions = columns.map((c) => ({ value: c.key, label: c.key }));
  const numericOptions = columns
    .filter((c) => c.type === "number")
    .map((c) => ({ value: c.key, label: c.key }));

  const setRules = (rules: ThresholdRule[]) => onChange({ ...config, rules });
  const update = (id: string, patch: (rule: ThresholdRule) => ThresholdRule) =>
    setRules(config.rules.map((r) => (r.id === id ? patch(r) : r)));
  const move = (index: number, by: -1 | 1) => {
    const rules = [...config.rules];
    [rules[index], rules[index + by]] = [rules[index + by]!, rules[index]!];
    setRules(rules);
  };

  // Example columns: the product, plus every column a rule's threshold looks at.
  const previewColumns = [
    "sku",
    "name",
    ...new Set(["price", ...config.rules.map((r) => r.threshold.column)]),
  ];
  const result = filterRows(config, exampleFilterRows);

  return (
    <div className="flex flex-col gap-6">
      <FormField
        label="Rules"
        description="Rules are checked from top to bottom. The first rule whose selector matches a row decides: the row is kept if its value is below the threshold. Rows that match no rule are dropped."
      >
        <ol className="flex flex-col gap-2">
          {config.rules.map((rule, i) => (
            <li
              key={rule.id}
              aria-label={`Rule ${i + 1}`}
              className="flex flex-col gap-2 rounded-md border border-neutral-separator-subtle bg-neutral-background-muted p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-text-muted">Rule {i + 1}</span>
                <span className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="small"
                    iconOnly
                    aria-label={`Move rule ${i + 1} up`}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ChevronUpIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    iconOnly
                    aria-label={`Move rule ${i + 1} down`}
                    disabled={i === config.rules.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ChevronDownIcon className="size-4 [stroke-width:2px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    iconOnly
                    aria-label={`Remove rule ${i + 1}`}
                    disabled={config.rules.length === 1}
                    onClick={() => setRules(config.rules.filter((r) => r.id !== rule.id))}
                  >
                    <TrashIcon />
                  </Button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10rem] shrink-0 text-xs text-neutral-text-subtle">
                  Select rows where
                </span>
                <Select
                  aria-label={`Rule ${i + 1} selector column`}
                  className="w-[16rem]"
                  value={rule.selector.column}
                  options={columnOptions}
                  onChange={(column) =>
                    update(rule.id, (r) => ({ ...r, selector: { ...r.selector, column } }))
                  }
                />
                <Select
                  aria-label={`Rule ${i + 1} operator`}
                  className="w-[16rem]"
                  value={rule.selector.operator}
                  options={selectorOperators.map((o) => ({ value: o.id, label: o.label }))}
                  onChange={(operator) =>
                    update(rule.id, (r) => ({
                      ...r,
                      selector: { ...r.selector, operator: operator as SelectorOperator },
                    }))
                  }
                />
                <TextInput
                  aria-label={`Rule ${i + 1} value`}
                  className="flex-1"
                  placeholder={valuePlaceholder[rule.selector.operator] ?? "Value"}
                  value={rule.selector.value}
                  onChange={(e) =>
                    update(rule.id, (r) => ({
                      ...r,
                      selector: { ...r.selector, value: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[10rem] shrink-0 text-xs text-neutral-text-subtle">
                  Keep them if
                </span>
                <Select
                  aria-label={`Rule ${i + 1} threshold column`}
                  className="w-[16rem]"
                  value={rule.threshold.column}
                  options={numericOptions}
                  onChange={(column) =>
                    update(rule.id, (r) => ({ ...r, threshold: { ...r.threshold, column } }))
                  }
                />
                <span className="w-[16rem] px-[12px] text-sm text-neutral-text-muted">
                  is below
                </span>
                <TextInput
                  aria-label={`Rule ${i + 1} threshold`}
                  inputMode="decimal"
                  className="flex-1"
                  placeholder="e.g. 10.5"
                  value={rule.threshold.value}
                  onChange={(e) =>
                    update(rule.id, (r) => ({
                      ...r,
                      threshold: { ...r.threshold, value: e.target.value },
                    }))
                  }
                />
              </div>
            </li>
          ))}
        </ol>
        <Button
          size="small"
          className="w-fit"
          onClick={() => setRules([...config.rules, newThresholdRule()])}
        >
          <PlusIcon />
          Add rule
        </Button>
      </FormField>

      <ExamplePreview
        inputs={[
          {
            title: "New data",
            subtitle: "This run",
            columns: previewColumns,
            rows: exampleFilterRows.map((row) => previewColumns.map((c) => cellValue(row[c]))),
          },
        ]}
        result={{
          title: "Result",
          subtitle: result.length === 1 ? "1 row" : `${result.length} rows`,
          columns: [...previewColumns, "rule"],
          rows: result.map(({ row, rule }) => [
            ...previewColumns.map((c) => cellValue(row[c])),
            <span key="rule" className="text-neutral-text-subtle">
              Rule {rule}
            </span>,
          ]),
          empty: "No rows match",
        }}
      />
    </div>
  );
}
