import { cn } from "@/lib/cn";

import type { AutomationStep } from "./steps";

// Node styling follows the schedule canvas in reference/console/schedules/: transparent card with a
// 1px separator border and 12px radius, a 32px icon tile, semibold title and subtle subtitle.
// Unconfigured steps use a dashed border.

export type StepCardProps = {
  step: AutomationStep;
  className?: string;
};

export function StepCard({ step, className }: StepCardProps) {
  const Icon = step.icon;
  return (
    <button
      type="button"
      data-test={`automation-step-${step.kind}`}
      className={cn(
        "flex w-[26rem] cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-border bg-neutral-background p-[1rem] text-left transition-colors duration-[120ms] hover:border-primary-action",
        className,
      )}
    >
      <span className="flex size-[3.2rem] shrink-0 items-center justify-center rounded-sm border border-neutral-separator-subtle bg-neutral-background-muted text-neutral-text">
        <Icon />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-neutral-text">{step.title}</span>
        <span className="block truncate text-xs text-neutral-text-subtle">{step.description}</span>
      </span>
    </button>
  );
}
