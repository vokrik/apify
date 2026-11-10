import { cn } from "@/lib/cn";

export type Segment<T extends string> = { id: T; label: string };

export type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (id: T) => void;
  "aria-label": string;
  className?: string;
};

/** A row of mutually exclusive options in one bordered pill (secondary button styling). */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <fieldset
      aria-label={props["aria-label"]}
      className={cn(
        "inline-flex gap-[2px] rounded-sm border border-neutral-border bg-neutral-background-muted p-[2px]",
        className,
      )}
    >
      {segments.map((segment) => {
        const active = segment.id === value;
        return (
          <button
            key={segment.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(segment.id)}
            className={cn(
              "h-[2.6rem] cursor-pointer rounded-xs px-2 text-xs font-medium whitespace-nowrap transition-colors duration-[120ms]",
              active
                ? "bg-neutral-hover text-neutral-text"
                : "text-neutral-text-subtle hover:text-neutral-text",
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </fieldset>
  );
}
