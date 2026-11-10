import { describe, expect, it } from "vitest";

import { cn } from "./cn";

// oxfmt sorts classes inside cn(), so compare as sets.
const classes = (value: string) => new Set(value.split(" "));

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, "b", null, undefined, "c")).toBe("a b c");
  });

  it("lets later Tailwind classes override earlier ones", () => {
    expect(classes(cn("bg-neutral-background p-4", "bg-transparent p-0"))).toEqual(
      classes("bg-transparent p-0"),
    );
    expect(cn("font-medium", "font-strong")).toBe("font-strong");
  });

  it("keeps text color and text size apart", () => {
    expect(classes(cn("text-sm text-neutral-text", "text-neutral-text-muted"))).toEqual(
      classes("text-sm text-neutral-text-muted"),
    );
  });
});
