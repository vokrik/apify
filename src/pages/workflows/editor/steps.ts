import type { ComponentType } from "react";

import { CubeIcon, FilterIcon, type IconProps, TasksIcon, WebhookIcon } from "@/components/icons";
import { summarizeAction, type WebhookAction } from "@/services/actions";
import { getActor, getTask } from "@/services/actors";
import {
  getTransformation,
  summarizeConfig,
  type TransformationConfig,
} from "@/services/transformations";

import { transformationIcons } from "./transformations/transformationIcons";

export type StepKind = "trigger" | "transformation" | "action";

export type AutomationStep = {
  kind: StepKind;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
  /** False while the step still shows its placeholder. */
  configured: boolean;
  /** Description is a `username/name` slug (monospace, like the schedule canvas). */
  mono?: boolean;
  /** Steps are filled in order; a step is locked until the one before it is configured. */
  locked?: boolean;
};

/** Description of a locked step: what to do first. */
const lockedHint: Record<StepKind, string> = {
  trigger: "",
  transformation: "Select a trigger first",
  action: "Add a transformation first",
};

/** What starts the automation: a finished run of this Actor or task. */
export type TriggerSelection = { type: "actor"; id: string } | { type: "task"; id: string };

/** The draft automation being edited; steps get filled in one by one. */
export type AutomationDraft = {
  trigger: TriggerSelection | null;
  transformation: TransformationConfig | null;
  action: WebhookAction | null;
};

/** The three empty steps every new automation starts with, in execution order. */
export const placeholderSteps: AutomationStep[] = [
  {
    kind: "trigger",
    title: "Select Trigger",
    description: "Start when an Actor run finishes",
    icon: CubeIcon,
    configured: false,
  },
  {
    kind: "transformation",
    title: "Add Transformation",
    description: "Filter or reshape the dataset",
    icon: FilterIcon,
    configured: false,
  },
  {
    kind: "action",
    title: "Add Action",
    description: "Send the results with a webhook",
    icon: WebhookIcon,
    configured: false,
  },
];

function triggerStep(trigger: TriggerSelection): AutomationStep | undefined {
  if (trigger.type === "actor") {
    const actor = getActor(trigger.id);
    return (
      actor && {
        kind: "trigger",
        title: actor.title,
        description: actor.slug,
        icon: CubeIcon,
        configured: true,
        mono: true,
      }
    );
  }
  const task = getTask(trigger.id);
  return (
    task && {
      kind: "trigger",
      // Apify's schedule canvas labels tasks the same way: "Scrape Web - Monday (Task)".
      title: `${task.title} (Task)`,
      description: task.slug,
      icon: TasksIcon,
      configured: true,
      mono: true,
    }
  );
}

function transformationStep(config: TransformationConfig): AutomationStep {
  return {
    kind: "transformation",
    title: getTransformation(config.id).title,
    description: summarizeConfig(config),
    icon: transformationIcons[config.id],
    configured: true,
  };
}

/** Steps as they should be displayed for the current draft. */
export function buildSteps(draft: AutomationDraft): AutomationStep[] {
  const steps = placeholderSteps.map((step) => {
    if (step.kind === "trigger" && draft.trigger) return triggerStep(draft.trigger) ?? step;
    if (step.kind === "transformation" && draft.transformation) {
      return transformationStep(draft.transformation);
    }
    if (step.kind === "action" && draft.action) {
      return {
        ...step,
        title: "Send webhook",
        description: summarizeAction(draft.action),
        configured: true,
      };
    }
    return step;
  });
  return steps.map((step, i) => {
    const previous = steps[i - 1];
    if (!previous || previous.configured) return step;
    return { ...step, locked: true, description: lockedHint[step.kind] };
  });
}

/** Props shared by every editor variant. */
export type EditorViewProps = {
  steps: AutomationStep[];
  onStepClick: (kind: StepKind) => void;
};
