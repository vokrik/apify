import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

const step = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-test="automation-step-${kind}"]`)!;

describe("Select trigger", () => {
  it("picks an Actor in a modal and shows it in place of the placeholder", async () => {
    const { user } = renderApp("/workflows/new?view=plain");
    await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));

    const dialog = await screen.findByRole("dialog", { name: "Select trigger" });
    expect(within(dialog).getByRole("tab", { name: "Actors" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    const list = within(dialog).getByRole("list", { name: "Actors" });
    expect(within(list).getAllByRole("button")).toHaveLength(4);

    await user.type(within(dialog).getByRole("searchbox"), "google");
    expect(within(list).getAllByRole("button")).toHaveLength(2);
    await user.click(within(list).getByRole("button", { name: /Google Search Results Scraper/ }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(step("trigger")).toHaveTextContent("Google Search Results Scraper");
    expect(step("trigger")).toHaveTextContent("apify/google-search-scraper");
  });

  it("picks a task and reopens on the Tasks tab with it selected", async () => {
    const { user } = renderApp("/workflows/new?view=sentence");
    await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));
    const dialog = await screen.findByRole("dialog", { name: "Select trigger" });
    await user.click(within(dialog).getByRole("tab", { name: "Tasks" }));
    await user.click(within(dialog).getByRole("button", { name: /Prague hotel reviews/ }));

    expect(step("trigger")).toHaveTextContent("Prague hotel reviews (Task)");

    await user.click(step("trigger"));
    const reopened = await screen.findByRole("dialog", { name: "Select trigger" });
    expect(within(reopened).getByRole("tab", { name: "Tasks" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(within(reopened).getByRole("button", { name: /Prague hotel reviews/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows an empty state when nothing matches", async () => {
    const { user } = renderApp("/workflows/new?view=plain");
    await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByRole("searchbox"), "nothing like this");
    expect(within(dialog).getByText("No Actors match your search.")).toBeInTheDocument();
  });

  it("closes without changing anything", async () => {
    const { user } = renderApp("/workflows/new?view=plain");
    await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));
    await user.click(
      within(await screen.findByRole("dialog")).getByRole("button", { name: "Close" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(step("trigger")).toHaveTextContent("Select Trigger");
  });

  it("is open in the side panel by default in the Steps & panel variant", async () => {
    const { user } = renderApp("/workflows/new?view=steps");

    expect(await screen.findByRole("heading", { name: "Select trigger" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Amazon Scraper/ }));

    expect(screen.queryByRole("heading", { name: "Select trigger" })).not.toBeInTheDocument();
    expect(step("trigger")).toHaveTextContent("Amazon Scraper");
    expect(screen.getByText(/Next, add a transformation/)).toBeInTheDocument();

    // Clicking the step reopens the picker; clicking it again closes it.
    await user.click(step("trigger"));
    expect(screen.getByRole("heading", { name: "Select trigger" })).toBeInTheDocument();
    await user.click(step("trigger"));
    expect(screen.queryByRole("heading", { name: "Select trigger" })).not.toBeInTheDocument();
  });

  it("keeps the selected trigger when switching variants", async () => {
    const { user } = renderApp("/workflows/new?view=plain");
    await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));
    await user.click(
      within(await screen.findByRole("dialog")).getByRole("button", { name: /Amazon Scraper/ }),
    );
    await user.click(screen.getByRole("button", { name: "Sentence" }));
    expect(step("trigger")).toHaveTextContent("Amazon Scraper");
  });
});
