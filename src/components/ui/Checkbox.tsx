import { useEffect, useRef } from "react";

import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type CheckboxProps = {
  checked: boolean;
  /** Shows a dash (some rows selected). */
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  "aria-label": string;
};

/** Native checkbox (for accessibility) drawn as Apify's 16px rounded box. */
export function Checkbox({ checked, indeterminate = false, onChange, ...props }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const on = checked || indeterminate;

  return (
    <span className="relative flex size-[16px] shrink-0">
      <input
        ref={ref}
        type="checkbox"
        aria-label={props["aria-label"]}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none flex size-full items-center justify-center rounded-xs border transition-colors duration-[120ms] peer-focus-visible:outline-2 peer-focus-visible:outline-primary-field-border-active",
          on
            ? "border-primary-action bg-primary-action text-neutral-text-on-primary"
            : "border-neutral-border bg-neutral-background-muted peer-hover:border-neutral-action-secondary-hover",
        )}
      >
        {indeterminate ? (
          <span className="h-[2px] w-[8px] rounded-full bg-current" />
        ) : (
          checked && <CheckIcon className="size-3" />
        )}
      </span>
    </span>
  );
}
