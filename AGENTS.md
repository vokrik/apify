# AGENTS.md

## Project overview

A **frontend-only prototype** of the Apify Console. Its job is to show a **user flow**, not a technical implementation.

- **No backend.** All data is hardcoded on the frontend (mock data modules).
- Anything a backend would normally do (persistence, filtering, search, auth, run state, API calls) is **simulated on the frontend**: in-memory state, optionally persisted to `localStorage`, with fake latency where it helps the flow feel real.
- Prefer believable, realistic mock data over generic placeholders. It should look like a real Apify account.
- Don't build production concerns (real auth, error handling for network failures, security, performance tuning) unless the user flow needs them.

## Phases

1. **Replica of the current Apify Console.** The user provides screenshots and saved HTML of the real site. The goal is to get **as close as possible** visually: layout, spacing, typography, colors, icons, copy. Mirror the reference markup's structure and copy. Don't invent a different design.
2. **New feature.** Once the replica is in place, a new feature is designed and built on top of it. Details will follow.

## Tech stack

- **React 19** + **TypeScript** (strict, `tsc` v7) + **React Router** (data router, `react-router` package)
- **Vite** (dev server and build)
- **Tailwind CSS v4** (configured in CSS; there is no `tailwind.config.js`)
- **Vitest** + React Testing Library + jsdom (unit and component tests)
- **Playwright** (e2e and visual regression screenshots)
- **oxfmt** (formatting, plus import and Tailwind class sorting) and **oxlint** (linting)
- **pnpm** (package manager), Node ≥ 24

## Commands

| Command                | What it does                                                          |
| ---------------------- | --------------------------------------------------------------------- |
| `pnpm dev`             | Dev server at http://localhost:5173                                   |
| `pnpm build`           | Typecheck + production build                                          |
| `pnpm format`          | Format everything with oxfmt                                          |
| `pnpm lint`            | oxlint (warnings fail the run)                                        |
| `pnpm typecheck`       | `tsc` (no emit)                                                       |
| `pnpm test`            | Vitest unit and component tests                                       |
| `pnpm test:e2e`        | Playwright against a production build, including screenshot diffs     |
| `pnpm test:e2e:update` | Re-record Playwright screenshots (only after an intended UI change)   |
| `pnpm check`           | format:check + lint + typecheck + unit tests (**runs on pre-commit**) |
| `pnpm verify`          | `check` + e2e. **Run before finishing any task.**                     |

First-time setup: `pnpm install && pnpm exec playwright install chromium`.

## Don't break finished work

Finished screens must stay pixel-stable while we keep building. Guard rails:

- **The pre-commit hook** (simple-git-hooks) runs `pnpm check`. Don't bypass it with `--no-verify`.
- **Visual regression:** every finished screen or flow state gets a Playwright `toHaveScreenshot` in `e2e/`. Baselines live in `e2e/__screenshots__/` and are committed. If `pnpm test:e2e` shows a diff you did not intend, fix the code. Only run `test:e2e:update` when the change is intentional, and say so in the commit message. Baselines are recorded on macOS; if they're re-recorded on another OS, expect font-rendering diffs.
- **Component and flow tests:** use `renderApp(path)` from `src/test/render.tsx`, which renders the real route table in a memory router. Test user flows through roles and text (`getByRole`, `user.click`), not implementation details.
- **Keep shared pieces shared.** Once a layout, component or token is used by a finished screen, change it carefully and re-run `pnpm verify`.

## Project structure

```
src/
  main.tsx              App entry (RouterProvider)
  router.tsx            Browser router
  routes.tsx            Route table, shared by the app and tests. Add pages here.
  pages/                One component per route (plus *.test.tsx next to it)
  components/           Reusable UI (layout, sidebar, buttons, tables, …)
    icons/index.tsx     Apify icons extracted from the real Console markup
  data/                 Hardcoded mock data (actors, runs, user, …)
  services/             Simulated "backend": functions/hooks over mock data + localStorage
  lib/                  Small helpers (e.g. `cn` for conditional classes)
  styles/
    apify-tokens.css    Apify design tokens, verbatim (light on `body`, dark on `body.theme-dark`)
    theme.css           Tailwind @theme mapping those tokens to utilities
    index.css           Entry stylesheet (Tailwind, fonts, base styles)
  test/                 Vitest setup and render helpers
e2e/                    Playwright specs + committed screenshot baselines
public/                 Static assets (Apify logos, favicon, background textures)
reference/              Saved real-Console pages; read-only source of truth (see reference/README.md)
```

`data/` and `services/` are created when they're first needed. Components should read data through `services/` as if they were calling a real API, so a flow can be changed in one place.

## Styling rules (fidelity first)

- **Source of truth:** the saved pages in `reference/` plus any screenshots the user shares. Before building a screen, find its markup in the reference and copy structure, copy text and exact CSS values (from the `<style data-styled>` block and `assets/main.css`). Don't eyeball values when the real ones are available.
- **Root font size is 10px** (same as Apify). `1rem` = 10px, so Apify rem values carry over 1:1. Tailwind's `--spacing` is `0.4rem` (4px), so `p-2` = 8px and `gap-4` = 16px, the same px values as stock Tailwind. Use arbitrary values (`p-[0.6rem]`, `w-[100px]`) for values that aren't on the scale.
- **Colors: only Apify tokens.** Tailwind's default palette is disabled. Use token utilities such as `bg-neutral-background`, `bg-neutral-card-background`, `text-neutral-text`, `text-neutral-text-muted`, `border-neutral-border`, `text-primary-text-interactive` and `bg-primary-action`. The full list is in `src/styles/theme.css`. In arbitrary values, use `var(--color-…)`. Never hardcode hex colors.
- **Theme:** the app runs in **dark theme** (`<body class="theme-dark">`, matching the reference). Because the tokens switch automatically, light theme works by removing that class. Don't write theme-specific colors.
- **Typography:** Inter (body), IBM Plex Mono (code). Type scale: `text-xs` 12/16, `text-sm` 14/20 (default body), `text-base` 16/24, `text-lg` 18/28, `text-xl` 20/28, `text-2xl` 24/32, `text-3xl` 36/46, `text-4xl` 48/58. Weights: `font-normal` 400, `font-medium` 500, `font-semibold` 600, `font-strong` 650, `font-bold` 700. GT Walsheim (`font-display`) is licensed and not bundled, so Inter is the fallback.
- **Radii:** `rounded-xs` 4px, `rounded-sm` 6px, `rounded-md` 8px, `rounded-lg` 12px. **Shadows:** `shadow-1` … `shadow-5`, `shadow-active`.
- **Icons:** use `src/components/icons` (e.g. `<StoreIcon className="size-5" />`). The default size is `size-4` (16px); Apify uses 12/16/20px. When a reference page has an icon that isn't there yet, copy its `<svg>` from the reference markup into that file in the same format. Don't substitute a different icon set.
- **Images:** Actor images from the reference live in `reference/console/*/assets/`. Copy the ones you need into `public/` with readable names.
- Hand-build components with Tailwind. Add a headless library (e.g. Radix) only for complex behavior such as menus, dialogs or popovers, and style it to match Apify exactly.

## Code conventions

- Function components, named exports, one component per file (file name = component name).
- Import from `src` with the `@/` alias.
- Use `cn(...)` from `@/lib/cn` for conditional classes. oxfmt sorts Tailwind classes automatically.
- Keep mock data in `src/data/` and out of components.
- Let tooling settle formatting and import order: run `pnpm format`. Don't hand-format.
