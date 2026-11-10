import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
} from "@/components/icons";

import { Button } from "./Button";

/**
 * Apify table footer (`Pagination`): "Items per page" + first/previous/next buttons.
 * The prototype never has more than one page, so navigation is disabled.
 */
export function TablePagination({ pageSize = 20 }: { pageSize?: number }) {
  return (
    <div className="flex w-full justify-between rounded-b-lg bg-neutral-background-muted py-[6px] pr-[8px] pl-[16px]">
      <div className="inline-flex items-center gap-[8px]">
        <span className="text-sm text-neutral-text">Items per page:</span>
        <Button className="gap-2 px-3">
          {pageSize}
          <ChevronDownIcon />
        </Button>
      </div>
      <div className="inline-flex items-center gap-[4px]">
        <Button size="small" iconOnly disabled aria-label="First page">
          <ChevronsLeftIcon />
        </Button>
        <Button size="small" iconOnly disabled aria-label="Previous page">
          <ChevronLeftIcon />
        </Button>
        <Button size="small" iconOnly disabled aria-label="Next page">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
