import type { ReactNode } from "react";

import { SettingsIcon } from "@/components/icons";

import { StepCard } from "./StepCard";
import type { EditorViewProps, StepKind } from "./steps";

// Variant 3: a form-style builder. A numbered list of steps on the left, joined by a timeline,
// and a panel on the right where the selected step's settings open (instead of a modal).

export type StepsPanelViewProps = EditorViewProps & {
  activeStep: StepKind | null;
  /** Settings of the active step; the empty state is shown when there's none. */
  panel: ReactNode;
};

const nextStepHint: Record<StepKind, string> = {
  trigger: "Start by selecting a trigger.",
  transformation: "Next, add a transformation.",
  action: "Next, add an action.",
};

function EmptyPanel({ next }: { next: StepKind | undefined }) {
  return (
    <div className="flex max-w-[36rem] flex-col items-center gap-2 text-center">
      <span className="flex size-[4rem] items-center justify-center rounded-md border border-neutral-separator-subtle bg-neutral-background text-neutral-text-subtle">
        <SettingsIcon className="size-5" />
      </span>
      <h2 className="text-base font-semibold">Configure your automation</h2>
      <p className="text-sm text-neutral-text-subtle">
        {next ? `${nextStepHint[next]} ` : ""}The settings of each step open here.
      </p>
    </div>
  );
}

export function StepsPanelView({ steps, onStepClick, activeStep, panel }: StepsPanelViewProps) {
  const next = steps.find((s) => !s.configured)?.kind;
  return (
    <div data-test="automation-canvas-steps" className="flex h-full">
      <aside className="w-[34rem] shrink-0 overflow-y-auto border-r border-neutral-separator-subtle p-4">
        <h2 className="mb-3 text-sm font-semibold">Steps</h2>
        <ol>
          {steps.map((step, i) => (
            <li key={step.kind} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-[2.4rem] shrink-0 items-center justify-center rounded-full border border-neutral-border bg-neutral-background-muted text-xs font-medium text-neutral-text-muted">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span aria-hidden className="w-px flex-1 bg-neutral-border" />
                )}
              </div>
              <div className="min-w-0 flex-1 pb-4">
                <StepCard
                  step={step}
                  active={step.kind === activeStep}
                  onClick={() => onStepClick(step.kind)}
                  className="w-full max-w-none min-w-0"
                />
              </div>
            </li>
          ))}
        </ol>
      </aside>
      {panel ? (
        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-background">
          {panel}
        </section>
      ) : (
        <section className="flex flex-1 items-center justify-center bg-neutral-background-muted p-6">
          <EmptyPanel next={next} />
        </section>
      )}
    </div>
  );
}
