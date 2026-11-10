import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

describe("DashboardPage", () => {
  it("renders the dashboard on the root route", async () => {
    renderApp("/");
    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recently viewed" })).toBeInTheDocument();
    expect(screen.getByText("$0.57")).toBeInTheDocument();
  });

  it("lists recent runs with their status", async () => {
    renderApp("/");
    const table = await screen.findByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(11); // header + 10 runs
    expect(within(rows[1]!).getByText("Succeeded")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("2,063")).toBeInTheDocument();
  });

  it("remembers a dismissed Creator plan banner", async () => {
    const { user, unmount } = renderApp("/");
    const banner = await screen.findByRole("region", { name: "Creator plan" });
    await user.click(within(banner).getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("region", { name: "Creator plan" })).not.toBeInTheDocument();

    unmount();
    renderApp("/");
    await screen.findByRole("heading", { name: "Dashboard" });
    expect(screen.queryByRole("region", { name: "Creator plan" })).not.toBeInTheDocument();
  });

  it("hides suggested Actors", async () => {
    const { user } = renderApp("/");
    await user.click(await screen.findByRole("button", { name: "Hide suggested Actors" }));
    expect(screen.queryByText("Suggested Actors for you")).not.toBeInTheDocument();
  });

  it("switches between recent and scheduled runs", async () => {
    const { user } = renderApp("/");
    await user.click(await screen.findByRole("tab", { name: "Scheduled" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("You don't have any scheduled runs.")).toBeInTheDocument();
  });
});
