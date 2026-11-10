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
  /** `xsmall` = Apify's 1.6rem-tall chip used for nav tags ("Beta", "New"). */
  size?: "xsmall" | "small" | "medium";
  className?: string;
  children: ReactNode;
};

/** Apify `badge__StyledBadge`: small rounded chip with optional leading icon. */
export function Badge({ variant = "primary", size = "small", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex w-fit flex-row items-center justify-center gap-1 rounded-xs text-xs font-medium whitespace-nowrap",
        size === "xsmall" && "h-[1.6rem] px-1",
        size === "small" && "px-[0.6rem] py-[0.2rem]",
        size === "medium" && "px-[0.6rem] py-1",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
