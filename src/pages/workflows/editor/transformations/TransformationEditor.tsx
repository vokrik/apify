import { useState } from "react";

import { ChevronLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { TransformationId } from "@/data/types";
import {
  defaultConfig,
  getTransformation,
  isComparison,
  isConfigValid,
  type TransformationConfig,
} from "@/services/transformations";

import { StepEditorHeader } from "../StepEditorHeader";
import { CompareForm } from "./CompareForm";
import { IncompleteDataForm } from "./IncompleteDataForm";
import { SentimentForm } from "./SentimentForm";
import { ThresholdForm } from "./ThresholdForm";
import { TransformationPicker } from "./TransformationPicker";

function SettingsForm({
  config,
  onChange,
}: {
  config: TransformationConfig;
  onChange: (config: TransformationConfig) => void;
}) {
  if (isComparison(config)) return <CompareForm config={config} onChange={onChange} />;
  switch (config.id) {
    case "products-below-threshold":
      return <ThresholdForm config={config} onChange={onChange} />;
    case "filter-incomplete-data":
      return <IncompleteDataForm config={config} onChange={onChange} />;
    case "filter-by-sentiment":
      return <SentimentForm config={config} onChange={onChange} />;
  }
}

export type TransformationEditorProps = {
  /** The saved transformation; editing it opens straight on its settings. */
  value: TransformationConfig | null;
  onSave: (config: TransformationConfig) => void;
  onClose: () => void;
  inDialog: boolean;
};

/** Two stages: pick a transformation, then configure it (with a live example). */
export function TransformationEditor({
  value,
  onSave,
  onClose,
  inDialog,
}: TransformationEditorProps) {
  const [stage, setStage] = useState<"pick" | "configure">(value ? "configure" : "pick");
  const [config, setConfig] = useState<TransformationConfig | null>(value);

  const pick = (id: TransformationId) => {
    // Picking the same transformation again keeps its settings.
    setConfig(config?.id === id ? config : defaultConfig(id));
    setStage("configure");
  };

  if (stage === "pick" || !config) {
    return (
      <>
        <StepEditorHeader
          title="Add transformation"
          description="Choose what to do with the dataset of each finished run."
          onClose={onClose}
          inDialog={inDialog}
        />
        <TransformationPicker value={config?.id ?? null} onSelect={pick} />
      </>
    );
  }

  const transformation = getTransformation(config.id);
  return (
    <>
      <StepEditorHeader
        title={transformation.title}
        description={transformation.description}
        onClose={onClose}
        inDialog={inDialog}
      />
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-neutral-separator-subtle px-4 py-4">
        <SettingsForm config={config} onChange={setConfig} />
      </div>
      <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-neutral-separator-subtle px-4 py-3">
        <Button onClick={() => setStage("pick")}>
          <ChevronLeftIcon />
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!isConfigValid(config)}
            onClick={() => onSave(config)}
          >
            Save transformation
          </Button>
        </div>
      </footer>
    </>
  );
}
