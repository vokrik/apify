import { SettingsIcon } from "@/components/icons";

import { StepCard } from "./StepCard";
import { placeholderSteps } from "./steps";

// Variant 3: a form-style builder. A numbered list of steps on the left, joined by a timeline,
// and a panel on the right where the selected step's settings would open (instead of a modal).

export function StepsPanelView() {
  return (
    <div data-test="automation-canvas-steps" className="flex h-full">
      <aside className="w-[34rem] shrink-0 overflow-y-auto border-r border-neutral-separator-subtle p-4">
        <h2 className="mb-3 text-sm font-semibold">Steps</h2>
        <ol>
          {placeholderSteps.map((step, i) => (
            <li key={step.kind} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-[2.4rem] shrink-0 items-center justify-center rounded-full border border-neutral-border bg-neutral-background-muted text-xs font-medium text-neutral-text-muted">
                  {i + 1}
                </span>
                {i < placeholderSteps.length - 1 && (
                  <span aria-hidden className="w-px flex-1 bg-neutral-border" />
                )}
              </div>
              <div className="min-w-0 flex-1 pb-4">
                <StepCard step={step} className="w-full" />
              </div>
            </li>
          ))}
        </ol>
      </aside>
      <section className="flex flex-1 items-center justify-center bg-neutral-background-muted p-6">
        <div className="flex max-w-[36rem] flex-col items-center gap-2 text-center">
          <span className="flex size-[4rem] items-center justify-center rounded-md border border-neutral-separator-subtle bg-neutral-background text-neutral-text-subtle">
            <SettingsIcon className="size-5" />
          </span>
          <h2 className="text-base font-semibold">Configure your automation</h2>
          <p className="text-sm text-neutral-text-subtle">
            Start by selecting a trigger. The settings of each step open here.
          </p>
        </div>
      </section>
    </div>
  );
}
