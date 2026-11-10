import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello, Apify Console" })).toBeVisible();
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});
