import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import { fieldClass } from "./fieldStyles";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      className={cn(fieldClass, "min-w-0 placeholder:text-neutral-text-placeholder", className)}
      {...props}
    />
  );
}
