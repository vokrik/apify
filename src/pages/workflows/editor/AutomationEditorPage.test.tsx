import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

const stepTitles = ["Select Trigger", "Add Transformation", "Add Action"];

describe("AutomationEditorPage", () => {
  it("opens from the New Automation button on the Workflows page", async () => {
    const { user, router } = renderApp("/workflows");
    await user.click(await screen.findByRole("button", { name: "New Automation" }));
    expect(router.state.location.pathname).toBe("/workflows/new");
    expect(await screen.findByRole("heading", { name: "New automation" })).toBeInTheDocument();
    // Full screen: no sidebar.
    expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
  });

  it("starts on the React Flow canvas", async () => {
    renderApp("/workflows/new");
    const switcher = await screen.findByRole("group", { name: "Editor variant" });
    expect(within(switcher).getByRole("button", { name: "React Flow" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.querySelector('[data-test="automation-canvas-react-flow"]')).not.toBeNull();
  });

  it.each([
    ["Plain React", "plain"],
    ["Steps & panel", "steps"],
    ["Sentence", "sentence"],
  ])("switches to the %s variant with all three placeholders", async (label, id) => {
    const { user, router } = renderApp("/workflows/new");
    await user.click(await screen.findByRole("button", { name: label }));
    expect(router.state.location.search).toBe(`?view=${id}`);
    const canvas = document.querySelector<HTMLElement>(`[data-test="automation-canvas-${id}"]`)!;
    expect(canvas).not.toBeNull();
    const steps = [...canvas.querySelectorAll("[data-test^=automation-step-]")];
    expect(steps.map((s) => s.textContent)).toEqual(
      stepTitles.map((title) => expect.stringContaining(title)),
    );
  });

  it("goes back to the Workflows list", async () => {
    const { user } = renderApp("/workflows/new?view=plain");
    await user.click(await screen.findByRole("link", { name: "Back to workflows" }));
    expect(await screen.findByRole("heading", { name: "Workflows" })).toBeInTheDocument();
  });
});
