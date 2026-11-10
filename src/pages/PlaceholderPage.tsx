import { useLocation } from "react-router";

import { allNavItems } from "@/components/layout/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

/** Stand-in for Console screens that aren't part of the prototype yet. */
export function PlaceholderPage() {
  const { pathname } = useLocation();
  const title = allNavItems.find((item) => item.to === pathname)?.label ?? "Not built yet";
  return (
    <>
      <PageHeader title={title} />
      <div className="mt-4 px-6">
        <div className="flex min-h-[20rem] items-center justify-center rounded-lg border border-dashed border-neutral-border text-sm text-neutral-text-subtle">
          This screen isn't part of the prototype yet.
        </div>
      </div>
    </>
  );
}
