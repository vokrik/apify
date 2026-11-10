import { useState } from "react";
import { Link } from "react-router";

import { ActorRunsTable } from "@/components/runs/ActorRunsTable";
import { Tabs } from "@/components/ui/Tabs";
import { getRecentRuns } from "@/services/actors";

type Tab = "recent" | "scheduled";

export function ActorRunsSection() {
  const [tab, setTab] = useState<Tab>("recent");
  return (
    <section aria-labelledby="actor-runs-heading">
      <div className="mb-[1.3rem] flex items-center justify-between">
        <h2 id="actor-runs-heading" className="text-base font-strong">
          Actor runs
        </h2>
        <Link
          to="/actors/runs"
          className="px-3 text-xs font-medium text-neutral-text hover:text-primary-action-hover"
        >
          View all runs
        </Link>
      </div>
      <Tabs
        className="mb-4"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "recent", label: "Recent" },
          { id: "scheduled", label: "Scheduled" },
        ]}
      />
      {tab === "recent" ? (
        <ActorRunsTable runs={getRecentRuns()} />
      ) : (
        <div className="flex min-h-[12rem] items-center justify-center rounded-lg border border-neutral-separator-subtle text-xs font-medium text-neutral-text-subtle">
          You don't have any scheduled runs.
        </div>
      )}
    </section>
  );
}
