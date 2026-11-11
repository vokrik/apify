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
    // Steps unlock in order: pick a trigger first.
    await page.locator('[data-test="automation-step-trigger"]').click();
    await page.getByRole("button", { name: /Amazon Scraper/ }).click();
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

test.describe("new automation — action", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/workflows/new");
    await page.locator('[data-test="automation-step-trigger"]').click();
    await page.getByRole("button", { name: /Amazon Scraper/ }).click();
    await page.locator('[data-test="automation-step-transformation"]').click();
    await page.getByRole("button", { name: /Get changed rows/ }).click();
    await page
      .getByRole("checkbox", { name: "Include new rows as changed" })
      .check({ force: true });
    await page.getByRole("button", { name: "Save transformation" }).click();
    await page.locator('[data-test="automation-step-action"]').click();
    const dialog = page.getByRole("dialog", { name: "Send webhook" });
    await dialog
      .getByRole("textbox", { name: "URL" })
      .fill("https://hooks.example.com/apify/price-changes");
    await dialog.getByRole("combobox", { name: "Authentication" }).selectOption("bearer");
    await dialog.getByLabel("Token").fill("sk_live_51Hx9Q2abcdEFGH7f3k");
    await page.mouse.move(0, 0);
  });

  test("dataset link", async ({ page }) => {
    await expect(page.getByRole("figure", { name: "Request preview" })).toContainText('"dataset"');
    await expect(page).toHaveScreenshot("action-dataset-link.png");
  });

  test("data in payload", async ({ page }) => {
    await page
      .getByRole("checkbox", { name: "Include data in the payload" })
      .check({ force: true });
    await expect(page.getByRole("figure", { name: "Request preview" })).toContainText('"data"');
    await expect(page).toHaveScreenshot("action-data-in-payload.png");
  });

  test("saved — complete automation", async ({ page }) => {
    await page.getByRole("button", { name: "Save action" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.mouse.move(0, 0);
    await expect(page.locator('[data-test="automation-step-action"]')).toContainText(
      "Send webhook",
    );
    await expect(page).toHaveScreenshot("action-saved.png");
  });

  test("all options — signing secret, split payload, failure handling, test request", async ({
    page,
  }) => {
    const dialog = page.getByRole("dialog", { name: "Send webhook" });
    await dialog.getByRole("combobox", { name: "Authentication" }).selectOption("signature");
    await dialog.getByLabel("Signing secret").fill("whsec_3kF9qPz2LmX8vR1tY6bN0cW4");
    await dialog
      .getByRole("checkbox", { name: "Include data in the payload" })
      .check({ force: true });
    await dialog.getByRole("textbox", { name: "Size limit in MB" }).fill("0.05");
    await dialog.getByRole("combobox", { name: "If the rows don't fit" }).selectOption("split");
    await dialog.getByRole("button", { name: /Failure handling/ }).click();
    await dialog.getByRole("checkbox", { name: "Retry failed requests" }).check({ force: true });
    await dialog.getByRole("button", { name: "Send test request" }).click();
    await expect(dialog.getByText("200 OK")).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(page).toHaveScreenshot("action-all-options.png");
  });
});
