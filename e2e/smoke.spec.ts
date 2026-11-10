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
