import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

describe("Sidebar", () => {
  it("highlights the current page and navigates", async () => {
    const { user, router } = renderApp("/");
    const dashboard = await screen.findByRole("link", { name: "Dashboard" });
    expect(dashboard).toHaveClass("bg-neutral-background-subtle");

    await user.click(screen.getByRole("link", { name: "Storage" }));
    expect(router.state.location.pathname).toBe("/storage");
    expect(screen.getByRole("heading", { name: "Storage" })).toBeInTheDocument();
  });

  it("shows Workflows with a New badge and opens its page", async () => {
    const { user, router } = renderApp("/");
    const workflows = await screen.findByRole("link", { name: /^Workflows/ });
    expect(within(workflows).getByText("New")).toBeInTheDocument();
    await user.click(workflows);
    expect(router.state.location.pathname).toBe("/workflows");
    expect(screen.getByRole("heading", { name: "Workflows" })).toBeInTheDocument();
  });

  it("collapses the Development section", async () => {
    const { user } = renderApp("/");
    await user.click(await screen.findByRole("button", { name: "Development" }));
    expect(screen.queryByRole("link", { name: "My Actors" })).not.toBeInTheDocument();
  });
});
