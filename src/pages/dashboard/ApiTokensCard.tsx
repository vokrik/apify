import { Link } from "react-router";

import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { CardContainer } from "@/components/ui/CardContainer";
import { apiTokens } from "@/data/apiTokens";

export function ApiTokensCard() {
  return (
    <CardContainer
      className="h-full"
      header={
        <div className="flex flex-1 items-center justify-between">
          <h2 className="text-sm font-medium">API tokens</h2>
          <div className="flex items-center gap-1">
            <Link
              to="/settings/integrations"
              aria-label="Create API token"
              className="inline-flex size-[2.4rem] items-center justify-center rounded-sm text-neutral-text hover:bg-neutral-on-surface"
            >
              <PlusIcon />
            </Link>
            <Link
              to="/settings/integrations"
              aria-label="All API tokens"
              className="inline-flex size-[2.4rem] items-center justify-center rounded-sm text-neutral-text hover:bg-neutral-on-surface"
            >
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      }
      contentClassName="flex min-h-0 flex-col p-0"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
        {apiTokens.map((token) => (
          <div
            key={token.id}
            className="flex min-h-[3.2rem] items-center justify-between gap-2 rounded-md py-[0.6rem] pr-[0.6rem] pl-2 hover:bg-neutral-background-subtle"
          >
            <span className="line-clamp-1 min-w-0 text-sm">{token.title}</span>
          </div>
        ))}
      </div>
    </CardContainer>
  );
}
