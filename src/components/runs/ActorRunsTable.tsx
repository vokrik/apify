import { Link } from "react-router";

import { ActorPill } from "@/components/ActorPill";
import type { ActorRun } from "@/data/types";
import { durationParts, formatDate, formatNumber, formatTime } from "@/lib/format";
import { getActor, getTask } from "@/services/actors";

import { RunStatusBadge } from "./RunStatusBadge";

const headCell =
  "sticky top-0 z-[5] h-[4rem] border-b border-neutral-separator-subtle bg-neutral-background-muted p-2 text-left text-xs font-normal text-neutral-text-muted";
const bodyCell = "p-2 align-middle";

/** Apify `SimpleTable` + `ActorRunsTable` column set used on the dashboard. */
export function ActorRunsTable({ runs }: { runs: ActorRun[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-separator-subtle">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={`${headCell} w-[15.6%] min-w-[18rem] rounded-tl-lg`}>Status</th>
              <th className={`${headCell} w-[45.2%] min-w-[25rem]`}>Actor</th>
              <th className={`${headCell} w-[6%] min-w-[6.5rem]`}>Task</th>
              <th className={`${headCell} w-[8.5%] min-w-[6.5rem]`}>Results</th>
              <th className={`${headCell} w-[13%] min-w-[10rem]`}>Started</th>
              <th className={`${headCell} w-[11.7%] min-w-[7.5rem] rounded-tr-lg`}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => {
              const actor = getActor(run.actorId);
              const task = run.taskId ? getTask(run.taskId) : undefined;
              return (
                <tr
                  key={run.id}
                  className={`hover:bg-neutral-hover ${i > 0 ? "[&>td]:border-t [&>td]:border-neutral-separator-subtle" : ""}`}
                >
                  <td className={bodyCell}>
                    <RunStatusBadge status={run.status} />
                  </td>
                  <td className={bodyCell}>{actor && <ActorPill actor={actor} />}</td>
                  <td className={bodyCell}>
                    {task && (
                      <Link
                        to={`/actors/tasks/${task.id}`}
                        className="text-primary-text-interactive"
                      >
                        {task.title}
                      </Link>
                    )}
                  </td>
                  <td className={`${bodyCell} tabular-nums`}>
                    {run.resultCount > 0 ? (
                      <Link
                        to={`/actors/runs/${run.id}#output`}
                        className="text-primary-text-interactive hover:text-primary-action-hover"
                      >
                        {formatNumber(run.resultCount)}
                      </Link>
                    ) : (
                      formatNumber(run.resultCount)
                    )}
                  </td>
                  <td className={`${bodyCell} tabular-nums`}>
                    {formatDate(run.startedAt)}
                    <br />
                    {formatTime(run.startedAt)}
                  </td>
                  <td className={`${bodyCell} tabular-nums`}>
                    {durationParts(run.durationSecs).map((part, j) => (
                      <span key={part.unit}>
                        {j > 0 && " "}
                        {part.value} <span className="text-neutral-text-subtle">{part.unit}</span>
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
