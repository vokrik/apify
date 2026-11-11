import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

const step = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-test="automation-step-${kind}"]`)!;

/** Steps unlock in order, so pick a trigger before opening the transformation. */
async function selectTrigger(user: ReturnType<typeof renderApp>["user"], view: string) {
  if (view !== "steps") {
    await user.click(await screen.findByRole("button", { name: /Select Trigger/ }));
  }
  const picker = view === "steps" ? document.body : await screen.findByRole("dialog");
  await user.click(await within(picker).findByRole("button", { name: /Amazon Scraper/ }));
}

async function openTransformation(view = "plain") {
  const result = renderApp(`/workflows/new?view=${view}`);
  await selectTrigger(result.user, view);
  await result.user.click(await screen.findByRole("button", { name: /Add Transformation/ }));
  return result;
}

describe("Add transformation", () => {
  it("is locked until a trigger is selected, and the action until it's saved", async () => {
    const { user } = renderApp("/workflows/new?view=plain");
    expect(await screen.findByRole("button", { name: /Add Transformation/ })).toBeDisabled();
    expect(step("transformation")).toHaveTextContent("Select a trigger first");
    expect(step("action")).toBeDisabled();

    await selectTrigger(user, "plain");
    expect(step("transformation")).toBeEnabled();
    expect(step("transformation")).toHaveTextContent("Filter or reshape the dataset");
    expect(step("action")).toBeDisabled();
    expect(step("action")).toHaveTextContent("Add a transformation first");

    await user.click(step("transformation"));
    await user.click(await screen.findByRole("button", { name: /Get new rows/ }));
    await user.click(screen.getByRole("button", { name: "Save transformation" }));
    expect(step("action")).toBeEnabled();
  });

  it("goes back from the settings to the list with the arrow in the header", async () => {
    const { user } = await openTransformation();
    await user.click(await screen.findByRole("button", { name: /Get new rows/ }));
    await screen.findByRole("dialog", { name: "Get new rows" });
    await user.click(screen.getByRole("button", { name: "Back to transformations" }));
    const dialog = await screen.findByRole("dialog", { name: "Add transformation" });
    expect(within(dialog).getByRole("button", { name: /Get new rows/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("lists all transformations, and each category on its own tab", async () => {
    const { user } = await openTransformation();
    const dialog = await screen.findByRole("dialog", { name: "Add transformation" });
    const names = (list: string) =>
      within(within(dialog).getByRole("list", { name: list }))
        .getAllByRole("button")
        .map((b) => b.querySelector(".font-semibold")?.textContent);

    expect(names("All transformations")).toEqual([
      "Get changed rows",
      "Get new rows",
      "Get missing rows",
      "Filter incomplete data",
      "Filter by sentiment",
      "Products below threshold",
    ]);
    await user.click(within(dialog).getByRole("tab", { name: "Built-in" }));
    expect(names("Built-in transformations")).toEqual([
      "Get changed rows",
      "Get new rows",
      "Get missing rows",
    ]);
    await user.click(within(dialog).getByRole("tab", { name: "Marketplace" }));
    expect(names("Marketplace transformations")).toEqual([
      "Filter incomplete data",
      "Filter by sentiment",
    ]);
    await user.click(within(dialog).getByRole("tab", { name: "Own" }));
    expect(names("Own transformations")).toEqual(["Products below threshold"]);
  });

  it("configures Get changed rows with a live example and saves it", async () => {
    const { user } = await openTransformation();
    await user.click(await screen.findByRole("button", { name: /Get changed rows/ }));
    const dialog = await screen.findByRole("dialog", { name: "Get changed rows" });
    const result = () => within(dialog).getByRole("figure", { name: "Result" });

    // Columns with duplicates can't be the unique key.
    expect(within(dialog).getByRole("radio", { name: /^name/ })).toBeDisabled();
    expect(within(dialog).getByRole("radio", { name: /^sku/ })).toBeChecked();

    expect(result()).toHaveTextContent("SKU-123");
    expect(result()).not.toHaveTextContent("SKU-321");
    await user.click(within(dialog).getByRole("checkbox", { name: "Include new rows as changed" }));
    expect(result()).toHaveTextContent("SKU-321");

    await user.click(within(dialog).getByRole("radio", { name: /^Baseline dataset/ }));
    const save = within(dialog).getByRole("button", { name: "Save transformation" });
    expect(save).toBeDisabled();
    await user.selectOptions(
      within(dialog).getByRole("combobox", { name: "Baseline dataset" }),
      "amazon-products-baseline",
    );
    expect(within(dialog).getByRole("figure", { name: "Baseline" })).toHaveTextContent(
      "amazon-products-baseline",
    );
    await user.click(save);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(step("transformation")).toHaveTextContent("Get changed rows");
    expect(step("transformation")).toHaveTextContent("vs. amazon-products-baseline · key: sku");
  });

  it("edits threshold rules and reopens a saved transformation on its settings", async () => {
    const { user } = await openTransformation("sentence");
    let dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("tab", { name: "Own" }));
    await user.click(within(dialog).getByRole("button", { name: /Products below threshold/ }));
    dialog = await screen.findByRole("dialog", { name: "Products below threshold" });

    expect(within(dialog).getAllByRole("listitem", { name: /^Rule/ })).toHaveLength(2);
    await user.click(within(dialog).getByRole("button", { name: "Add rule" }));
    expect(within(dialog).getAllByRole("listitem", { name: /^Rule/ })).toHaveLength(3);
    // An incomplete rule can't be saved.
    expect(within(dialog).getByRole("button", { name: "Save transformation" })).toBeDisabled();
    await user.click(within(dialog).getByRole("button", { name: "Remove rule 3" }));

    // Removing rule 2 drops the phone stand from the result.
    expect(within(dialog).getByRole("figure", { name: "Result" })).toHaveTextContent("SKU-789");
    await user.click(within(dialog).getByRole("button", { name: "Remove rule 2" }));
    expect(within(dialog).getByRole("figure", { name: "Result" })).not.toHaveTextContent("SKU-789");

    await user.click(within(dialog).getByRole("button", { name: "Save transformation" }));
    expect(step("transformation")).toHaveTextContent("Products below threshold");

    await user.click(step("transformation"));
    dialog = await screen.findByRole("dialog", { name: "Products below threshold" });
    expect(within(dialog).getAllByRole("listitem", { name: /^Rule/ })).toHaveLength(1);
    await user.click(within(dialog).getByRole("button", { name: "Back to transformations" }));
    expect(
      within(dialog).getByRole("button", { name: /Products below threshold/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("opens in the side panel in the Steps & panel variant", async () => {
    const { user } = await openTransformation("steps");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Marketplace" }));
    await user.click(screen.getByRole("button", { name: /Filter by sentiment/ }));
    expect(screen.getByRole("heading", { name: "Filter by sentiment" })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Positive" }));
    await user.click(screen.getByRole("button", { name: "Save transformation" }));
    expect(step("transformation")).toHaveTextContent(
      "latestReview is positive, neutral or negative",
    );
  });
});
