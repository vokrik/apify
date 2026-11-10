import type { ComponentType } from "react";

import { CubeIcon, FilterIcon, type IconProps, WebhookIcon } from "@/components/icons";

export type StepKind = "trigger" | "transformation" | "action";

export type AutomationStep = {
  kind: StepKind;
  /** Placeholder label shown until the step is configured. */
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
};

/** The three empty steps every new automation starts with, in execution order. */
export const placeholderSteps: AutomationStep[] = [
  {
    kind: "trigger",
    title: "Select Trigger",
    description: "Start when an Actor run finishes",
    icon: CubeIcon,
  },
  {
    kind: "transformation",
    title: "Add Transformation",
    description: "Filter or reshape the dataset",
    icon: FilterIcon,
  },
  {
    kind: "action",
    title: "Add Action",
    description: "Send the results with a webhook",
    icon: WebhookIcon,
  },
];
