# Reference material

Snapshots of the real Apify Console used as the source of truth for the replica.
**Read-only:** don't edit or format these files, and never import them from `src/`.

## `console/store/` — Apify Store page (`/store`), dark theme, captured 2026-11-10

- `index.html`: the saved page with scripts, trackers, Intercom and Monaco styles removed.
  It keeps the full rendered DOM, the styled-components `<style data-styled>` block (the
  actual component CSS) and the design-system class names (`Sidebar-*`, `CardContainer-*`, …).
  To view it, open the file in a browser.
- `assets/main.css`: the Console's global stylesheet (normalize, design tokens, design-system
  component classes).
- `assets/*.webp`: Actor images. Each filename is the base64url-encoded original URL.

## `console/dashboard/` — Dashboard (`/`), dark theme, captured 2026-11-10

Screenshots only, with no saved markup yet. They're 2x Retina captures of a 1440×900 window, and the
file name records the scroll offset in CSS px. Most of the dashboard's CSS (`RecentlyViewed-*`,
`ApiTokens-*`, `PixelChart-*`, `SimpleTable-*`, `Tabs-*`, …) is cached in the Store page's
`<style data-styled>` block. Find it with `node scripts/inspect-reference.ts` or by searching for
the class name.

## Working with a reference page

1. Find the element in `index.html` (search for its visible text or `data-test` attribute).
2. Look up its styled-components class hashes (e.g. `.kVVLKi`) in the `<style data-styled>`
   block, plus any design-system class in `assets/main.css`, to get the exact CSS values.
3. Translate them into Tailwind. Root font size is 10px in both Apify and this app, so rem
   values carry over 1:1 (`padding: 0.8rem` → `p-2` or `p-[0.8rem]`).
