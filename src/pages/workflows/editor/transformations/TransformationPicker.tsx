import { useState } from "react";

import { CheckIcon } from "@/components/icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs } from "@/components/ui/Tabs";
import type { TransformationCategory, TransformationId } from "@/data/types";
import { cn } from "@/lib/cn";
import { getTransformations } from "@/services/transformations";

import { transformationIcons } from "./transformationIcons";

type Filter = TransformationCategory | "all";

const categories: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "builtin", label: "Built-in" },
  { id: "marketplace", label: "Marketplace" },
  { id: "own", label: "Own" },
];

export type TransformationPickerProps = {
  value: TransformationId | null;
  onSelect: (id: TransformationId) => void;
};

/** First stage of the transformation editor: pick one (all, or by category), with search. */
export function TransformationPicker({ value, onSelect }: TransformationPickerProps) {
  const [category, setCategory] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const items = getTransformations(category === "all" ? undefined : category).filter(
    (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
  );
  const label = categories.find((c) => c.id === category)!.label;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Tabs tabs={categories} active={category} onChange={setCategory} className="px-4" />
      <div className="px-4 pt-4 pb-2">
        <SearchInput
          aria-label="Search transformations"
          placeholder="Search transformations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul
        aria-label={`${label} transformations`}
        className="min-h-0 flex-1 overflow-y-auto px-2 pb-2"
      >
        {items.map((t) => {
          const Icon = transformationIcons[t.id];
          const selected = t.id === value;
          return (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(t.id)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-[120ms] hover:bg-neutral-background-subtle",
                  selected && "bg-neutral-background-subtle",
                )}
              >
                <span className="flex size-[3.2rem] shrink-0 items-center justify-center rounded-sm border border-neutral-separator-subtle bg-neutral-background-muted text-neutral-text">
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-neutral-text group-hover:text-primary-action-hover">
                    {t.title}
                  </span>
                  <span className="block text-xs text-neutral-text-subtle">{t.description}</span>
                </span>
                <span className="shrink-0 text-xs text-neutral-text-subtle">
                  {[
                    // Under "All", say which category each transformation comes from.
                    category === "all" && categories.find((c) => c.id === t.category)!.label,
                    t.author && `by ${t.author}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                {selected && <CheckIcon className="size-4 shrink-0 text-primary-text" />}
              </button>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="px-2 py-6 text-center text-sm text-neutral-text-subtle">
            No transformations match your search.
          </li>
        )}
      </ul>
    </div>
  );
}
