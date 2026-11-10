import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type CardContainerProps = {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Apify `card_container__Wrapper`: a subtle 2px frame (12px radius) around a content panel
 * (11px radius) with an optional header strip on the frame.
 */
export function CardContainer({
  header,
  children,
  className,
  contentClassName,
}: CardContainerProps) {
  return (
    <div
      className={cn("flex flex-col rounded-lg bg-neutral-background-subtle p-[0.2rem]", className)}
    >
      {header && (
        <div className="flex h-[3.2rem] items-center justify-between px-2 py-1">{header}</div>
      )}
      <div className={cn("grow rounded-[1.1rem] bg-neutral-background p-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
