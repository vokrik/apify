import { Link } from "react-router";

import { ActorAvatar } from "@/components/ActorAvatar";
import { ArrowRightIcon, RunsIcon, TasksIcon } from "@/components/icons";
import { runStatusLabel } from "@/components/runs/RunStatusBadge";
import { CardContainer } from "@/components/ui/CardContainer";
import { recentlyViewed } from "@/data/recentlyViewed";
import type { RecentlyViewedItem, RunStatus } from "@/data/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { getActor, getRun, getTask } from "@/services/actors";

const statusColor: Record<RunStatus, string> = {
  READY: "text-primary-icon",
  RUNNING: "text-primary-icon",
  SUCCEEDED: "text-success-icon",
  FAILED: "text-danger-icon",
  "TIMING-OUT": "text-danger-icon",
  "TIMED-OUT": "text-danger-icon",
  ABORTING: "text-warning-icon",
  ABORTED: "text-warning-icon",
};

type ItemView = {
  key: string;
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
};

function toView(item: RecentlyViewedItem): ItemView | null {
  if (item.kind === "actor") {
    const actor = getActor(item.actorId);
    if (!actor) return null;
    return {
      key: `actor-${actor.id}`,
      to: `/actors/${actor.id}`,
      icon: <ActorAvatar title={actor.title} imageUrl={actor.imageUrl} size={24} />,
      title: actor.title,
      subtitle: actor.slug,
    };
  }
  if (item.kind === "task") {
    const task = getTask(item.taskId);
    const actor = task && getActor(task.actorId);
    if (!task || !actor) return null;
    return {
      key: `task-${task.id}`,
      to: `/actors/tasks/${task.id}`,
      icon: <TasksIcon className="size-5 text-primary-icon" />,
      title: task.title,
      subtitle: actor.slug,
    };
  }
  const run = getRun(item.runId);
  const actor = run && getActor(run.actorId);
  if (!run || !actor) return null;
  return {
    key: `run-${run.id}`,
    to: `/actors/runs/${run.id}`,
    icon: <RunsIcon className="size-5 text-neutral-text-subtle" />,
    title: actor.slug,
    subtitle: (
      <>
        Started at {formatDateTime(run.startedAt)} ·{" "}
        <span className={cn("capitalize", statusColor[run.status])}>
          {runStatusLabel(run.status)}
        </span>
      </>
    ),
  };
}

// Corner rounding of the 2-column grid, copied from `.RecentlyViewed-grid` media rules.
const gridRadius =
  "[&>:first-child]:rounded-tl-[1.1rem] [&>:nth-child(2)]:rounded-tr-[1.1rem] [&>:nth-last-child(-n+2):nth-child(odd)]:rounded-bl-[1.1rem] [&>:last-child]:rounded-br-[1.1rem]";

export function RecentlyViewed() {
  const items = recentlyViewed.map(toView).filter((v): v is ItemView => !!v);
  return (
    <CardContainer
      header={<h2 className="text-sm font-medium">Recently viewed</h2>}
      contentClassName="overflow-visible bg-transparent p-0"
    >
      <div className={cn("grid grid-cols-2 gap-[0.2rem]", gridRadius)}>
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className="relative flex min-h-[5.9rem] cursor-pointer items-start justify-between bg-neutral-background px-2 pt-2 text-neutral-text-subtle transition-shadow hover:z-[1] hover:bg-neutral-background-subtle hover:outline-2 hover:outline-neutral-separator-subtle"
          >
            <div className="flex min-w-0 items-start gap-[0.6rem]">
              <span className="flex h-[2rem] w-[2.4rem] shrink-0 items-center justify-center">
                {item.icon}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="line-clamp-1 text-sm font-medium text-neutral-text">
                  {item.title}
                </span>
                <span className="line-clamp-1 pr-[0.6rem] text-xs font-medium">
                  {item.subtitle}
                </span>
              </span>
            </div>
            <ArrowRightIcon className="size-4 shrink-0 text-neutral-text-subtle" />
          </Link>
        ))}
      </div>
    </CardContainer>
  );
}
