import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("dashboard — top of page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page).toHaveScreenshot("dashboard-top.png");
});

test("dashboard — full page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page).toHaveScreenshot("dashboard-full.png", { fullPage: true });
});

test("workflows — automations list", async ({ page }) => {
  await page.goto("/workflows");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page).toHaveScreenshot("workflows.png");
});

for (const view of ["react-flow", "plain", "steps", "sentence"]) {
  test(`new automation — ${view} variant`, async ({ page }) => {
    await page.goto(`/workflows/new?view=${view}`);
    await expect(page.locator(`[data-test="automation-canvas-${view}"]`)).toBeVisible();
    await expect(page.locator('[data-test="automation-step-action"]')).toBeVisible();
    await expect(page).toHaveScreenshot(`new-automation-${view}.png`);
  });
}

test("new automation — trigger picker modal", async ({ page }) => {
  await page.goto("/workflows/new");
  await page.locator('[data-test="automation-step-trigger"]').click();
  await expect(page.getByRole("dialog", { name: "Select trigger" })).toBeVisible();
  await expect(page).toHaveScreenshot("new-automation-trigger-modal.png");
});

test("new automation — task selected as trigger", async ({ page }) => {
  await page.goto("/workflows/new");
  await page.locator('[data-test="automation-step-trigger"]').click();
  await page.getByRole("tab", { name: "Tasks" }).click();
  await page.getByRole("button", { name: /Brand mentions on Google/ }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.mouse.move(0, 0);
  await expect(page.locator('[data-test="automation-step-trigger"]')).toContainText(
    "Brand mentions on Google (Task)",
  );
  await expect(page).toHaveScreenshot("new-automation-trigger-selected.png");
});

test.describe("new automation — transformation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/workflows/new");
    await page.locator('[data-test="automation-step-transformation"]').click();
    await expect(page.getByRole("dialog", { name: "Add transformation" })).toBeVisible();
  });

  test("picker", async ({ page }) => {
    await expect(page).toHaveScreenshot("transformation-picker.png");
  });

  for (const [tab, title] of [
    ["Built-in", "Get changed rows"],
    ["Own", "Products below threshold"],
    ["Marketplace", "Filter incomplete data"],
    ["Marketplace", "Filter by sentiment"],
  ] as const) {
    test(`settings — ${title}`, async ({ page }) => {
      await page.getByRole("tab", { name: tab }).click();
      await page.getByRole("button", { name: new RegExp(title) }).click();
      await expect(page.getByRole("dialog", { name: title })).toBeVisible();
      await page.mouse.move(0, 0);
      const slug = title.toLowerCase().replaceAll(" ", "-");
      await expect(page).toHaveScreenshot(`transformation-${slug}.png`);
      // The example's result sits below the settings; scroll to it.
      await page.getByRole("figure", { name: "Result" }).scrollIntoViewIfNeeded();
      await expect(page).toHaveScreenshot(`transformation-${slug}-example.png`);
    });
  }

  test("saved", async ({ page }) => {
    await page.getByRole("button", { name: /Get new rows/ }).click();
    await page.getByRole("button", { name: "Save transformation" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.mouse.move(0, 0);
    await expect(page.locator('[data-test="automation-step-transformation"]')).toContainText(
      "Get new rows",
    );
    await expect(page).toHaveScreenshot("transformation-saved.png");
  });
});
