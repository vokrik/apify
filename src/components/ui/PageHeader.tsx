import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  /**
   * `default` — list pages (Actors, Tasks, …): 1.6rem padding, description, bottom border.
   * `dashboard` — no border, 3.2rem top / 2.4rem side padding.
   */
  variant?: "default" | "dashboard";
};

/** Apify `PageHeader`. */
export function PageHeader({ title, description, actions, variant = "default" }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        variant === "dashboard" ? "px-6 pt-8 pb-2" : "border-b border-neutral-separator-subtle p-4",
      )}
    >
      <div className="flex items-center justify-between self-stretch">
        <div className="flex h-[3.2rem] items-center gap-1">
          <h1 className="text-xl leading-[2.4rem] font-strong">{title}</h1>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {description && (
        <p className="flex h-[2.4rem] items-center text-xs font-medium">{description}</p>
      )}
    </header>
  );
}
