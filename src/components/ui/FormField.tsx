import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type FormFieldProps = {
  label: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A labelled group of controls: semibold label, subtle help text, then the controls. */
export function FormField({ label, description, children, className }: FormFieldProps) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="p-0 text-sm font-semibold text-neutral-text">{label}</legend>
      {description && <p className="mt-[0.2rem] text-xs text-neutral-text-subtle">{description}</p>}
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}
