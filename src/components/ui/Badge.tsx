import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-primary-background text-primary-chip-text",
  success: "bg-success-background text-success-chip-text",
  danger: "bg-danger-background text-danger-chip-text",
  warning: "bg-warning-background text-warning-chip-text",
  neutral: "bg-neutral-chip-background text-neutral-text",
} as const;

export type BadgeProps = {
  variant?: keyof typeof variants;
  size?: "small" | "medium";
  className?: string;
  children: ReactNode;
};

/** Apify `badge__StyledBadge`: small rounded chip with optional leading icon. */
export function Badge({ variant = "primary", size = "small", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex w-fit flex-row items-center justify-center gap-1 rounded-xs text-xs font-medium whitespace-nowrap",
        size === "small" ? "px-[0.6rem] py-[0.2rem]" : "px-[0.6rem] py-1",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
