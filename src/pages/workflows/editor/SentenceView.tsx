import { cn } from "@/lib/cn";

import type { AutomationStep, EditorViewProps } from "./steps";

// Variant 4: the automation reads as a plain-English sentence, in the spirit of the schedule
// summary ("This schedule will run every week…"). Each blank is a step: a dashed blue chip
// until it's configured, then a solid chip with the chosen value.

function Blank({ step, onClick }: { step: AutomationStep; onClick: () => void }) {
  const Icon = step.icon;
  return (
    <button
      type="button"
      data-test={`automation-step-${step.kind}`}
      onClick={onClick}
      className={cn(
        "mx-[0.2rem] inline-flex h-[3.6rem] cursor-pointer items-center gap-2 rounded-md border px-2 align-middle text-xl font-medium transition-colors duration-[120ms] hover:border-primary-action",
        step.configured
          ? "border-solid border-neutral-border bg-neutral-background-muted text-neutral-text hover:bg-neutral-background-subtle"
          : "border-dashed border-primary-border-subtle bg-primary-background-subtle text-primary-text hover:bg-primary-background",
      )}
    >
      <Icon className="size-5 shrink-0" />
      {step.title}
    </button>
  );
}

export function SentenceView({ steps, onStepClick }: EditorViewProps) {
  const [trigger, transformation, action] = steps as [
    AutomationStep,
    AutomationStep,
    AutomationStep,
  ];
  const blank = (step: AutomationStep) => (
    <Blank step={step} onClick={() => onStepClick(step.kind)} />
  );
  return (
    <div className="flex h-full overflow-auto bg-neutral-background">
      <div
        data-test="automation-canvas-sentence"
        className="m-auto max-w-[100rem] px-6 py-10 text-xl leading-[5.2rem] font-medium text-neutral-text-muted"
      >
        <p>
          When {blank(trigger)} finishes, {blank(transformation)} and then {blank(action)}.
        </p>
      </div>
    </div>
  );
}
