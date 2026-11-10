import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the custom theme values from src/styles/theme.css so that
// conflicting classes are resolved (the last one wins), e.g. cn("p-4", "p-0") → "p-0".
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      "font-weight": ["strong"],
      shadow: ["1", "2", "3", "4", "5", "active"],
    },
  },
});

/** Joins class names, skipping falsy values and resolving Tailwind conflicts. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
