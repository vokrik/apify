import type { InputHTMLAttributes } from "react";

import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Apify table search field (dark field background, 36px tall). */
export function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={cn(
        "relative flex min-h-[36px] cursor-text items-center gap-[8px] rounded-sm border border-neutral-field-border bg-neutral-field-background px-[11px] py-[2px] text-neutral-text-subtle transition-colors duration-[120ms] focus-within:border-primary-field-border-active focus-within:bg-neutral-background focus-within:shadow-active hover:border-primary-field-border-active",
        className,
      )}
    >
      <SearchIcon className="size-4" />
      <input
        type="search"
        // Apify's placeholder rule doesn't match, so browsers show their default gray.
        className="w-full min-w-[20px] flex-1 border-none bg-transparent p-0 text-sm text-neutral-text outline-none placeholder:text-[#757575] [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
    </label>
  );
}
