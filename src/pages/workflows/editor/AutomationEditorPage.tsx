import { useState } from "react";
import { Link, useSearchParams } from "react-router";

import { ArrowLeftIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { type Segment, SegmentedControl } from "@/components/ui/SegmentedControl";
import type { WebhookAction } from "@/services/actions";
import type { TransformationConfig } from "@/services/transformations";

import { ActionEditor } from "./actions/ActionEditor";
import { PlainCanvasView } from "./PlainCanvasView";
import { ReactFlowView } from "./ReactFlowView";
import { SentenceView } from "./SentenceView";
import { StepEditorHeader } from "./StepEditorHeader";
import {
  type AutomationDraft,
  buildSteps,
  type EditorViewProps,
  type StepKind,
  type TriggerSelection,
} from "./steps";
import { StepsPanelView } from "./StepsPanelView";
import { TransformationEditor } from "./transformations/TransformationEditor";
import { TriggerPicker } from "./TriggerPicker";

// Full-screen editor for a new automation. We're comparing four ways to present the
// Trigger → Transformation → Action chain; the switcher (top right) picks one, kept in `?view=`.
// Clicking the trigger step opens the Actor/task picker.

type EditorView = "react-flow" | "plain" | "steps" | "sentence";

const views: Segment<EditorView>[] = [
  { id: "react-flow", label: "React Flow" },
  { id: "plain", label: "Plain React" },
  { id: "steps", label: "Steps & panel" },
  { id: "sentence", label: "Sentence" },
];

const isEditorView = (value: string | null): value is EditorView =>
  views.some((v) => v.id === value);

const triggerCopy = {
  title: "Select trigger",
  description: "The automation runs every time the selected Actor or task finishes a run.",
};

export function AutomationEditorPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("view");
  const view: EditorView = isEditorView(requested) ? requested : "react-flow";

  // The draft lives here, so switching variants keeps what the user picked.
  const [draft, setDraft] = useState<AutomationDraft>({
    trigger: null,
    transformation: null,
    action: null,
  });
  // Canvas variants edit a step in a modal; "Steps & panel" edits it in the side panel.
  const [modalStep, setModalStep] = useState<StepKind | null>(null);
  // The panel starts on the trigger picker, since picking a trigger is always the first step.
  const [panelStep, setPanelStep] = useState<StepKind | null>("trigger");

  const steps = buildSteps(draft);
  const openStep = (kind: StepKind) => {
    if (steps.find((s) => s.kind === kind)?.locked) return; // Steps are filled in order.
    if (view === "steps") setPanelStep(panelStep === kind ? null : kind);
    else setModalStep(kind);
  };
  const closeEditor = () => {
    setModalStep(null);
    setPanelStep(null);
  };
  const selectTrigger = (trigger: TriggerSelection) => {
    setDraft({ ...draft, trigger });
    closeEditor();
  };
  const saveTransformation = (transformation: TransformationConfig) => {
    setDraft({ ...draft, transformation });
    closeEditor();
  };
  const saveAction = (action: WebhookAction) => {
    setDraft({ ...draft, action });
    closeEditor();
  };

  /** The editor of a step; the same content goes in the modal or the side panel. */
  const stepEditor = (kind: StepKind | null, inDialog: boolean) => {
    if (kind === "trigger") {
      return (
        <>
          <StepEditorHeader {...triggerCopy} onClose={closeEditor} inDialog={inDialog} />
          <TriggerPicker value={draft.trigger} onSelect={selectTrigger} />
        </>
      );
    }
    if (kind === "transformation") {
      return (
        <TransformationEditor
          value={draft.transformation}
          onSave={saveTransformation}
          onClose={closeEditor}
          inDialog={inDialog}
        />
      );
    }
    if (kind === "action") {
      return (
        <ActionEditor
          value={draft.action}
          trigger={draft.trigger}
          transformation={draft.transformation}
          onSave={saveAction}
          onClose={closeEditor}
          inDialog={inDialog}
        />
      );
    }
    return null;
  };

  const viewProps: EditorViewProps = { steps, onStepClick: openStep };

  return (
    <div className="flex h-screen min-w-[768px] flex-col bg-neutral-background">
      <header className="flex h-[5.6rem] shrink-0 items-center justify-between gap-4 border-b border-neutral-separator-subtle px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/workflows"
            aria-label="Back to workflows"
            className="flex size-[32px] items-center justify-center rounded-sm text-neutral-text transition-colors duration-[120ms] hover:bg-neutral-hover"
          >
            <ArrowLeftIcon />
          </Link>
          <h1 className="truncate text-base font-semibold">New automation</h1>
          <Badge variant="neutral" size="small">
            Draft
          </Badge>
        </div>
        <SegmentedControl
          aria-label="Editor variant"
          segments={views}
          value={view}
          onChange={(id) => setParams({ view: id }, { replace: true })}
        />
      </header>
      <main className="min-h-0 flex-1">
        {view === "react-flow" && <ReactFlowView {...viewProps} />}
        {view === "plain" && <PlainCanvasView {...viewProps} />}
        {view === "steps" && (
          <StepsPanelView
            {...viewProps}
            activeStep={panelStep}
            panel={stepEditor(panelStep, false)}
          />
        )}
        {view === "sentence" && <SentenceView {...viewProps} />}
      </main>
      <Modal
        open={modalStep !== null}
        onOpenChange={(open) => !open && closeEditor()}
        className={modalStep === "trigger" ? "h-[56rem]" : "h-[calc(100vh-8rem)] w-[100rem]"}
      >
        {stepEditor(modalStep, true)}
      </Modal>
    </div>
  );
}
