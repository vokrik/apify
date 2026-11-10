import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { getAutomations } from "@/services/automations";

import { AutomationsTable } from "./AutomationsTable";

export function WorkflowsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const automations = getAutomations().filter((a) =>
    a.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const count = automations.length;

  return (
    <>
      <PageHeader
        title="Workflows"
        description={
          <>
            <span>
              Automate what happens after your Actors run. Trigger follow-up steps, alerts, and
              integrations without writing code.&nbsp;
            </span>
            <Link
              to="/workflows"
              className="text-primary-text-interactive hover:text-primary-action-hover"
            >
              Learn more about workflows
            </Link>
          </>
        }
        actions={
          <>
            <Button variant="primary" onClick={() => navigate("/workflows/new")}>
              New Automation
            </Button>
            <Button>API</Button>
          </>
        }
      />
      <div className="px-6 pt-6 pb-10">
        <div className="flex flex-row items-end justify-between">
          <div className="mb-2 flex min-h-[28px] items-center gap-4">
            <SearchInput
              aria-label="Search by automation name"
              placeholder="Search by automation name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-[24rem]"
            />
          </div>
          <div className="mb-2 flex min-h-[28px] items-center">
            <span className="text-sm font-semibold">
              {count} {count === 1 ? "automation" : "automations"}
            </span>
          </div>
        </div>
        <AutomationsTable automations={automations} />
      </div>
    </>
  );
}
