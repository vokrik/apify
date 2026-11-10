import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

describe("WorkflowsPage", () => {
  it("lists automations with their trigger, pricing and last run", async () => {
    renderApp("/workflows");
    expect(await screen.findByRole("heading", { name: "Workflows" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Automation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "API" })).toBeInTheDocument();
    expect(screen.getByText("4 automations")).toBeInTheDocument();

    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(5); // header + 4 automations
    // Default sort: most recent last run first.
    expect(within(rows[1]!).getByText("Daily Amazon price tracker")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Amazon Scraper")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("underst...scraper")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Pay per usage")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("2026-11-10 18:11:14")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Succeeded")).toBeInTheDocument();
  });

  it("filters automations by name", async () => {
    const { user } = renderApp("/workflows");
    await user.type(await screen.findByLabelText("Search by automation name"), "price");
    expect(screen.getByText("2 automations")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Search by automation name"));
    await user.type(screen.getByLabelText("Search by automation name"), "nothing");
    expect(screen.getByText("0 automations")).toBeInTheDocument();
    expect(screen.getByText("No automations match your search.")).toBeInTheDocument();
  });

  it("sorts by name", async () => {
    const { user } = renderApp("/workflows");
    await user.click(await screen.findByRole("button", { name: "Name" }));
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(within(rows[1]!).getByText("Weekly bestseller report")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(
      within(within(screen.getByRole("table")).getAllByRole("row")[1]!).getByText(
        "Competitor price alerts",
      ),
    ).toBeInTheDocument();
  });

  it("selects all rows from the header checkbox", async () => {
    const { user } = renderApp("/workflows");
    await user.click(await screen.findByRole("checkbox", { name: "Select all automations" }));
    for (const box of screen.getAllByRole("checkbox", { name: /^Select (?!all)/ })) {
      expect(box).toBeChecked();
    }
  });
});
