import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePersistentState } from "@/lib/usePersistentState";

import { ActorRunsSection } from "./ActorRunsSection";
import { ApiTokensCard } from "./ApiTokensCard";
import { CreatorPlanBanner } from "./CreatorPlanBanner";
import { AiChatCard, McpCard, UsageCard } from "./DiscoveryCards";
import { RecentlyViewed } from "./RecentlyViewed";
import { SuggestedActors } from "./SuggestedActors";

export function DashboardPage() {
  const [bannerClosed, setBannerClosed] = usePersistentState(
    "dashboard.creatorBanner.closed",
    false,
  );
  const [suggestionsClosed, setSuggestionsClosed] = usePersistentState(
    "dashboard.suggestedActors.closed",
    false,
  );

  return (
    <>
      <PageHeader
        variant="dashboard"
        title="Dashboard"
        actions={
          <Button>
            Create
            <ChevronDownIcon />
          </Button>
        }
      />
      <div className="mt-4 px-6 pb-10 [&>*]:mb-10">
        {!bannerClosed && <CreatorPlanBanner onClose={() => setBannerClosed(true)} />}

        {/* `DiscoveryRow` grid: AI chat | usage | MCP, then recently viewed | API tokens. */}
        <div className="!mb-[2.8rem] grid auto-rows-[minmax(10.8rem,auto)] gap-x-4 gap-y-6 min-[1366px]:grid-cols-[calc(50%-0.8rem)_minmax(0,3fr)_minmax(0,2fr)]">
          <div className="col-span-full min-[1366px]:col-span-1">
            <AiChatCard />
          </div>
          <UsageCard />
          <McpCard />
          <div className="col-span-full min-[1366px]:col-span-1">
            <RecentlyViewed />
          </div>
          <div className="relative min-[1366px]:col-span-2">
            <div className="absolute inset-0 flex flex-col">
              <ApiTokensCard />
            </div>
          </div>
        </div>

        {!suggestionsClosed && <SuggestedActors onClose={() => setSuggestionsClosed(true)} />}

        <ActorRunsSection />
      </div>
    </>
  );
}
