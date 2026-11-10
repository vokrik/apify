import { CheckIcon, CloseIcon, SquareIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import type { RunStatus } from "@/data/types";

const config: Record<
  RunStatus,
  { label: string; variant: "success" | "danger" | "warning" | "primary"; icon: typeof CheckIcon }
> = {
  READY: { label: "Ready", variant: "primary", icon: CheckIcon },
  RUNNING: { label: "Running", variant: "primary", icon: CheckIcon },
  SUCCEEDED: { label: "Succeeded", variant: "success", icon: CheckIcon },
  FAILED: { label: "Failed", variant: "danger", icon: CloseIcon },
  "TIMING-OUT": { label: "Timing out", variant: "danger", icon: CloseIcon },
  "TIMED-OUT": { label: "Timed out", variant: "danger", icon: CloseIcon },
  ABORTING: { label: "Aborting", variant: "danger", icon: SquareIcon },
  ABORTED: { label: "Aborted", variant: "danger", icon: SquareIcon },
};

export function runStatusLabel(status: RunStatus): string {
  return config[status].label;
}

export function RunStatusBadge({ status }: { status: RunStatus }) {
  const { label, variant, icon: Icon } = config[status];
  return (
    <Badge variant={variant} size="medium" className="font-normal">
      <Icon className="size-3 shrink-0" />
      {label}
    </Badge>
  );
}
