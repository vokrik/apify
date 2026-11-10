import { Link, useSearchParams } from "react-router";

import { ArrowLeftIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { type Segment, SegmentedControl } from "@/components/ui/SegmentedControl";

import { PlainCanvasView } from "./PlainCanvasView";
import { ReactFlowView } from "./ReactFlowView";
import { SentenceView } from "./SentenceView";
import { StepsPanelView } from "./StepsPanelView";

// Full-screen editor for a new automation. We're comparing four ways to present the
// Trigger → Transformation → Action chain; the switcher (top right) picks one, kept in `?view=`.

type EditorView = "react-flow" | "plain" | "steps" | "sentence";

const views: Segment<EditorView>[] = [
  { id: "react-flow", label: "React Flow" },
  { id: "plain", label: "Plain React" },
  { id: "steps", label: "Steps & panel" },
  { id: "sentence", label: "Sentence" },
];

const isEditorView = (value: string | null): value is EditorView =>
  views.some((v) => v.id === value);

export function AutomationEditorPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("view");
  const view: EditorView = isEditorView(requested) ? requested : "react-flow";

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
        {view === "react-flow" && <ReactFlowView />}
        {view === "plain" && <PlainCanvasView />}
        {view === "steps" && <StepsPanelView />}
        {view === "sentence" && <SentenceView />}
      </main>
    </div>
  );
}
