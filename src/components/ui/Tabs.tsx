import { cn } from "@/lib/cn";

export type Tab<T extends string> = { id: T; label: string };

export type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

/** Apify underline tabs (`Tabs-wrapper` / `Tabs-item`). */
export function Tabs<T extends string>({ tabs, active, onChange, className }: TabsProps<T>) {
  return (
    <nav className={cn("border-b border-neutral-separator-subtle", className)}>
      <div role="tablist" className="flex h-[45px] justify-start gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative -mb-px flex cursor-pointer items-center rounded-t-sm border-b-2 px-2 pt-[2px] text-sm font-medium whitespace-nowrap transition-colors duration-[120ms] ease-in",
                isActive
                  ? "border-primary-text text-primary-text"
                  : "border-transparent text-neutral-text-subtle hover:border-neutral-separator-subtle hover:text-primary-text",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
