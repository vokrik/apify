import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

// Mirrors Apify's design-system button (`buttonstyle__StyledButton`):
// secondary = muted bg + border, primary = blue, ghost = transparent until hover.
const variants = {
  primary:
    "border-primary-action bg-primary-action text-neutral-text-on-primary hover:border-primary-action-hover hover:bg-primary-action-hover active:border-primary-action-active active:bg-primary-action-active",
  secondary:
    "border-neutral-border bg-neutral-background-muted text-neutral-text hover:bg-neutral-action-secondary-hover active:bg-neutral-action-secondary-active",
  ghost:
    "border-transparent bg-transparent text-neutral-text hover:border-neutral-hover hover:bg-neutral-hover active:bg-neutral-action-secondary-active disabled:border-transparent disabled:bg-transparent",
} as const;

const sizes = {
  small: "h-[28px] px-[8px] text-xs font-medium",
  medium: "h-[32px] px-[12px] text-sm font-medium",
} as const;

const iconOnlySizes = {
  small: "size-[28px] p-0",
  medium: "size-[32px] p-0",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  iconOnly?: boolean;
};

export function Button({
  variant = "secondary",
  size = "medium",
  iconOnly = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1 rounded-sm border border-solid whitespace-nowrap transition-colors duration-[120ms] ease-out disabled:cursor-default disabled:border-neutral-disabled disabled:bg-neutral-disabled disabled:text-neutral-text-disabled",
        variants[variant],
        iconOnly ? iconOnlySizes[size] : sizes[size],
        className,
      )}
      {...props}
    />
  );
}
