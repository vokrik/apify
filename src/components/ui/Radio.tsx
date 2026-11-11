import { cn } from "@/lib/cn";

export type RadioProps = {
  name: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

/** Native radio (for accessibility) drawn as Apify's 16px circle. Wrap it in a `<label>`. */
export function Radio({ name, checked, onChange, disabled = false, ...props }: RadioProps) {
  return (
    <span className="relative flex size-[16px] shrink-0">
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={props["aria-label"]}
        className="peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-default"
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none flex size-full items-center justify-center rounded-full border transition-colors duration-[120ms] peer-focus-visible:outline-2 peer-focus-visible:outline-primary-field-border-active",
          checked
            ? "border-primary-action bg-primary-action"
            : "border-neutral-border bg-neutral-background-muted peer-hover:border-neutral-action-secondary-hover",
          disabled && "opacity-50",
        )}
      >
        {checked && <span className="size-[6px] rounded-full bg-neutral-text-on-primary" />}
      </span>
    </span>
  );
}
