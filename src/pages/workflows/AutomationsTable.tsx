import { useState } from "react";
import { Link } from "react-router";

import { ActorPill } from "@/components/ActorPill";
import { ArrowDownIcon, ArrowUpIcon, SortIcon } from "@/components/icons";
import { RunStatusBadge } from "@/components/runs/RunStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { TablePagination } from "@/components/ui/TablePagination";
import type { Automation } from "@/data/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { getActor } from "@/services/actors";
import { pricingLabel } from "@/services/automations";

type SortKey = "name" | "lastRunStartedAt";
type Sort = { key: SortKey; direction: "asc" | "desc" };

const headCell =
  "h-[4.8rem] border-b border-neutral-separator-subtle bg-neutral-background-muted p-2 text-left text-xs font-normal whitespace-nowrap text-neutral-text-muted";
const bodyCell = "p-2 align-middle";

function sortAutomations(rows: Automation[], sort: Sort): Automation[] {
  const value = (a: Automation) =>
    sort.key === "name" ? a.name.toLowerCase() : (a.lastRun?.startedAt ?? "");
  return rows.toSorted((a, b) => {
    const cmp = value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
    return sort.direction === "asc" ? cmp : -cmp;
  });
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: Sort;
  onSort: (sort: Sort) => void;
}) {
  const active = sort.key === sortKey;
  const Icon = !active ? SortIcon : sort.direction === "desc" ? ArrowDownIcon : ArrowUpIcon;
  return (
    <button
      type="button"
      onClick={() =>
        onSort({
          key: sortKey,
          direction: active && sort.direction === "desc" ? "asc" : "desc",
        })
      }
      className="flex cursor-pointer items-center gap-1 text-xs text-neutral-text-muted"
    >
      {label}
      <Icon className={cn("size-4", active ? "text-primary-icon" : "text-neutral-icon")} />
    </button>
  );
}

/** Apify `SimpleTable` styled like the Tasks / Actors list pages. */
export function AutomationsTable({ automations }: { automations: Automation[] }) {
  const [sort, setSort] = useState<Sort>({ key: "lastRunStartedAt", direction: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const rows = sortAutomations(automations, sort);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someSelected = !allSelected && rows.some((r) => selected.has(r.id));

  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-separator-subtle">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th aria-label="Selection" className={cn(headCell, "w-[38px] pr-0 pl-[12px]")}>
                <Checkbox
                  aria-label="Select all automations"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(on) => setSelected(on ? new Set(rows.map((r) => r.id)) : new Set())}
                />
              </th>
              <th className={cn(headCell, "w-[28%] min-w-[25rem] pl-[30px]")}>
                <SortableHeader label="Name" sortKey="name" sort={sort} onSort={setSort} />
              </th>
              <th className={cn(headCell, "w-[28%] min-w-[25rem]")}>Trigger</th>
              <th className={cn(headCell, "w-[13%] min-w-[12rem]")}>Pricing</th>
              <th className={cn(headCell, "w-[16%] min-w-[16rem]")}>
                <SortableHeader
                  label="Last run started"
                  sortKey="lastRunStartedAt"
                  sort={sort}
                  onSort={setSort}
                />
              </th>
              <th className={cn(headCell, "w-[15%] min-w-[14rem]")}>Last run status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-sm text-neutral-text-subtle">
                  No automations match your search.
                </td>
              </tr>
            )}
            {rows.map((automation, i) => {
              const actor = getActor(automation.triggerActorId);
              return (
                <tr
                  key={automation.id}
                  className={cn(
                    "hover:bg-neutral-hover",
                    i > 0 && "[&>td]:border-t [&>td]:border-neutral-separator-subtle",
                  )}
                >
                  <td aria-label="Selection" className={cn(bodyCell, "pr-0 pl-[12px]")}>
                    <Checkbox
                      aria-label={`Select ${automation.name}`}
                      checked={selected.has(automation.id)}
                      onChange={(on) => toggle(automation.id, on)}
                    />
                  </td>
                  <td className={cn(bodyCell, "pl-[18px]")}>
                    <Link
                      to={`/workflows/${automation.id}`}
                      aria-label={automation.name}
                      className="group block min-w-0"
                    >
                      <span className="block truncate text-sm font-semibold text-neutral-text group-hover:text-primary-action-hover">
                        {automation.name}
                      </span>
                      <span className="block truncate text-xs text-neutral-text-subtle">
                        {automation.slug}
                      </span>
                    </Link>
                  </td>
                  <td className={bodyCell}>{actor && <ActorPill actor={actor} slug="middle" />}</td>
                  <td className={bodyCell}>
                    <Badge variant="primary">{pricingLabel[automation.pricing]}</Badge>
                  </td>
                  <td className={cn(bodyCell, "whitespace-nowrap tabular-nums")}>
                    {automation.lastRun && formatDateTime(automation.lastRun.startedAt)}
                  </td>
                  <td className={bodyCell}>
                    {automation.lastRun && <RunStatusBadge status={automation.lastRun.status} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TablePagination />
    </div>
  );
}
