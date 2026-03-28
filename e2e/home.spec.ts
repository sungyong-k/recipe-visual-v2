import { test, expect } from "@playwright/test";


test("home page loads with title and input", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("AI Recipe Visualizer");
  await expect(page.getByTestId("ingredient-input")).toBeVisible();
  await expect(page.getByTestId("generate-button")).toBeVisible();
  await expect(page.getByTestId("generate-button")).toBeDisabled();
});

test("can add and remove ingredients", async ({ page }) => {
  await page.goto("/");
  const input = page.getByTestId("ingredient-input");

  await input.fill("chicken");
  await input.press("Enter");
  await expect(page.getByText("chicken")).toBeVisible();

  await input.fill("rice");
  await input.press("Enter");
  await expect(page.getByText("rice")).toBeVisible();

  // Generate button should be enabled with ingredients
  await expect(page.getByTestId("generate-button")).toBeEnabled();

  // Remove first ingredient
  await page.getByLabel("Remove chicken").click();
  await expect(page.getByText("chicken")).not.toBeVisible();
});

test("cuisine selector is visible and allows selection", async ({ page }) => {
  await page.goto("/");
  const selector = page.getByTestId("cuisine-select");
  await expect(selector).toBeVisible();

  // Default is "Any Style" (empty value)
  await expect(selector).toHaveValue("");

  // Select Korean cuisine
  await selector.selectOption("Korean");
  await expect(selector).toHaveValue("Korean");

  // Select Italian cuisine
  await selector.selectOption("Italian");
  await expect(selector).toHaveValue("Italian");
});
