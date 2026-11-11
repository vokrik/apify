import { useState } from "react";

import { ActorOrTaskLabel } from "@/components/ActorOrTaskLabel";
import { CheckIcon } from "@/components/icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs } from "@/components/ui/Tabs";
import type { Actor } from "@/data/types";
import { cn } from "@/lib/cn";
import { getActor, getMyActors, getMyTasks } from "@/services/actors";

import type { TriggerSelection } from "./steps";

type TriggerType = TriggerSelection["type"];

type Option = {
  selection: TriggerSelection;
  title: string;
  subtitle: string;
  avatar: Actor;
  isOwn?: boolean;
  /** Shown on the right (a task's Actor). */
  meta?: string;
};

const tabs: { id: TriggerType; label: string }[] = [
  { id: "actor", label: "Actors" },
  { id: "task", label: "Tasks" },
];

function actorOptions(): Option[] {
  return getMyActors().map((actor) => ({
    selection: { type: "actor", id: actor.id },
    title: actor.title,
    subtitle: actor.slug,
    avatar: actor,
    isOwn: actor.isOwn,
  }));
}

function taskOptions(): Option[] {
  return getMyTasks().flatMap((task) => {
    const actor = getActor(task.actorId);
    if (!actor) return [];
    return [
      {
        selection: { type: "task", id: task.id } as const,
        title: task.title,
        subtitle: task.slug,
        avatar: actor,
        meta: actor.title,
      },
    ];
  });
}

const copy = {
  actor: { search: "Search by Actor name", empty: "No Actors match your search." },
  task: { search: "Search by task name", empty: "No tasks match your search." },
} as const;

export type TriggerPickerProps = {
  value: TriggerSelection | null;
  onSelect: (selection: TriggerSelection) => void;
  className?: string;
};

/** Pick the Actor or task whose finished runs start the automation. */
export function TriggerPicker({ value, onSelect, className }: TriggerPickerProps) {
  const [type, setType] = useState<TriggerType>(value?.type ?? "actor");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const options = (type === "actor" ? actorOptions() : taskOptions()).filter(
    (o) => o.title.toLowerCase().includes(q) || o.subtitle.toLowerCase().includes(q),
  );

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <Tabs tabs={tabs} active={type} onChange={setType} className="px-4" />
      <div className="px-4 pt-4 pb-2">
        <SearchInput
          aria-label={copy[type].search}
          placeholder={copy[type].search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul
        aria-label={type === "actor" ? "Actors" : "Tasks"}
        className="min-h-0 flex-1 overflow-y-auto px-2 pb-2"
      >
        {options.map((option) => {
          const selected =
            value?.type === option.selection.type && value.id === option.selection.id;
          return (
            <li key={option.selection.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(option.selection)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left transition-colors duration-[120ms] hover:bg-neutral-background-subtle",
                  selected && "bg-neutral-background-subtle",
                )}
              >
                <span className="flex min-w-0 flex-1">
                  <ActorOrTaskLabel
                    title={option.title}
                    subtitle={option.subtitle}
                    avatar={option.avatar}
                    isOwn={option.isOwn}
                  />
                </span>
                {option.meta && (
                  <span className="shrink-0 text-xs text-neutral-text-subtle">{option.meta}</span>
                )}
                {selected && <CheckIcon className="size-4 shrink-0 text-primary-text" />}
              </button>
            </li>
          );
        })}
        {options.length === 0 && (
          <li className="px-2 py-6 text-center text-sm text-neutral-text-subtle">
            {copy[type].empty}
          </li>
        )}
      </ul>
    </div>
  );
}
