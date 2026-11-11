import type { SelectHTMLAttributes } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

import { fieldClass } from "./fieldStyles";

export type SelectOption = { value: string; label: string };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Shown while `value` is empty. */
  placeholder?: string;
};

/** Native select drawn as an Apify field with a chevron. */
export function Select({ options, onChange, placeholder, className, ...props }: SelectProps) {
  return (
    <span className={cn("relative inline-flex min-w-0", className)}>
      <select
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldClass, "w-full cursor-pointer appearance-none pr-[3.2rem]")}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-[11px] size-4 -translate-y-1/2 [stroke-width:2px] text-neutral-text-subtle" />
    </span>
  );
}
