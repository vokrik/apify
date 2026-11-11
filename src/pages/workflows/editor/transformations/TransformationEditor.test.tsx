import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/render";

const step = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-test="automation-step-${kind}"]`)!;

async function openTransformation(view = "plain") {
  const result = renderApp(`/workflows/new?view=${view}`);
  await result.user.click(await screen.findByRole("button", { name: /Add Transformation/ }));
  return result;
}

describe("Add transformation", () => {
  it("lists transformations by category", async () => {
    const { user } = await openTransformation();
    const dialog = await screen.findByRole("dialog", { name: "Add transformation" });
    const names = (list: string) =>
      within(within(dialog).getByRole("list", { name: list }))
        .getAllByRole("button")
        .map((b) => b.querySelector(".font-semibold")?.textContent);

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
    await user.click(within(dialog).getByRole("button", { name: "Back" }));
    expect(
      within(dialog).getByRole("button", { name: /Products below threshold/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("opens in the side panel in the Steps & panel variant", async () => {
    const { user } = renderApp("/workflows/new?view=steps");
    await user.click(await screen.findByRole("button", { name: /Add Transformation/ }));
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
