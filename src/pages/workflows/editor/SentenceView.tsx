import type { AutomationStep } from "./steps";
import { placeholderSteps } from "./steps";

// Variant 4: the automation reads as a plain-English sentence, in the spirit of the schedule
// summary ("This schedule will run every week…"). Each blank is a step placeholder.

function Blank({ step }: { step: AutomationStep }) {
  const Icon = step.icon;
  return (
    <button
      type="button"
      data-test={`automation-step-${step.kind}`}
      className="mx-[0.2rem] inline-flex h-[3.6rem] cursor-pointer items-center gap-2 rounded-md border border-dashed border-primary-border-subtle bg-primary-background-subtle px-2 align-middle text-xl font-medium text-primary-text transition-colors duration-[120ms] hover:border-primary-action hover:bg-primary-background"
    >
      <Icon className="size-5 shrink-0" />
      {step.title}
    </button>
  );
}

export function SentenceView() {
  const [trigger, transformation, action] = placeholderSteps as [
    AutomationStep,
    AutomationStep,
    AutomationStep,
  ];
  return (
    <div className="flex h-full overflow-auto bg-neutral-background">
      <div
        data-test="automation-canvas-sentence"
        className="m-auto max-w-[100rem] px-6 py-10 text-xl leading-[5.2rem] font-medium text-neutral-text-muted"
      >
        <p>
          When <Blank step={trigger} /> finishes, <Blank step={transformation} /> and then{" "}
          <Blank step={action} />.
        </p>
      </div>
    </div>
  );
}
