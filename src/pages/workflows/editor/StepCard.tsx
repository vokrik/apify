import { cn } from "@/lib/cn";

import type { AutomationStep } from "./steps";

// Node styling follows the schedule canvas in reference/console/schedules/: transparent card with a
// 1px separator border and 12px radius, a 32px icon tile, semibold title and subtle subtitle
// (monospace for `username/name`, like the schedule's Actor nodes). Unconfigured steps use a
// dashed border; locked ones (waiting for the previous step) are dimmed and disabled.

export type StepCardProps = {
  step: AutomationStep;
  onClick?: () => void;
  /** Highlighted as the step being edited. */
  active?: boolean;
  className?: string;
};

export function StepCard({ step, onClick, active = false, className }: StepCardProps) {
  const Icon = step.icon;
  return (
    <button
      type="button"
      data-test={`automation-step-${step.kind}`}
      onClick={onClick}
      disabled={step.locked}
      className={cn(
        "flex w-max max-w-[44rem] min-w-[26rem] cursor-pointer items-center gap-2 rounded-lg border bg-neutral-background p-[1rem] text-left transition-colors duration-[120ms] hover:border-primary-action disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-border",
        step.configured
          ? "border-solid border-neutral-separator-subtle"
          : "border-dashed border-neutral-border",
        active && "border-primary-action",
        className,
      )}
    >
      <span className="flex size-[3.2rem] shrink-0 items-center justify-center rounded-sm border border-neutral-separator-subtle bg-neutral-background-muted text-neutral-text">
        <Icon />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-neutral-text">{step.title}</span>
        <span
          className={cn(
            "block truncate text-xs text-neutral-text-subtle",
            step.mono && "font-mono",
          )}
        >
          {step.description}
        </span>
      </span>
    </button>
  );
}
