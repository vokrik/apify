import { Fragment } from "react";

import { StepCard } from "./StepCard";
import type { EditorViewProps } from "./steps";

// Variant 2: the same nodes in plain React on a plain background. Boxes stacked top to bottom, joined by
// connectors drawn with divs. No canvas library, so no panning or zooming.

function Connector() {
  return (
    <div aria-hidden className="relative h-[4.8rem] w-px bg-primary-text">
      <span className="absolute -top-[2.5px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-neutral-text" />
      <span className="absolute -bottom-[2.5px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-neutral-text" />
    </div>
  );
}

export function PlainCanvasView({ steps, onStepClick }: EditorViewProps) {
  return (
    <div className="flex h-full overflow-auto bg-neutral-background">
      <div data-test="automation-canvas-plain" className="m-auto flex flex-col items-center py-10">
        {steps.map((step, i) => (
          <Fragment key={step.kind}>
            {i > 0 && <Connector />}
            <StepCard step={step} onClick={() => onStepClick(step.kind)} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
