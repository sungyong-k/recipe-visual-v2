import { test, expect } from "@playwright/test";
import type { Recipe } from "../src/lib/types";

const MOCK_RECIPE: Recipe = {
  id: "flow-test-recipe-456",
  name: "Chicken Rice Bowl",
  description: "A simple and delicious chicken rice bowl",
  ingredients: [
    { name: "Chicken", amount: "200g" },
    { name: "Rice", amount: "1 cup" },
  ],
  steps: [
    { stepNumber: 1, instruction: "Cook rice in a pot with water" },
    { stepNumber: 2, instruction: "Season and grill the chicken" },
    { stepNumber: 3, instruction: "Serve chicken over rice" },
  ],
};

// A minimal 1x1 transparent PNG in base64
const FAKE_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const FAKE_MIME_TYPE = "image/png";

test("full flow: input ingredients → generate → navigate to recipe page → verify steps", async ({
  page,
}) => {
  // Mock the generate-recipe API to return a controlled recipe
  await page.route("/api/generate-recipe", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_RECIPE),
    });
  });

  // Mock image generation to avoid real API calls
  await page.route("/api/generate-image", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ base64: FAKE_IMAGE_BASE64, mimeType: FAKE_MIME_TYPE }),
    });
  });

  // Step 1: Navigate to home page
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("AI Recipe Visualizer");

  // Step 2: Input ingredients
  const input = page.getByTestId("ingredient-input");
  await input.fill("chicken");
  await input.press("Enter");
  await expect(page.getByText("chicken")).toBeVisible();

  await input.fill("rice");
  await input.press("Enter");
  await expect(page.getByText("rice")).toBeVisible();

  // Step 3: Click generate
  const generateButton = page.getByTestId("generate-button");
  await expect(generateButton).toBeEnabled();
  await generateButton.click();

  // Step 4: Wait for recipe card to appear
  await expect(page.getByTestId("recipe-card")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("recipe-card")).toContainText(MOCK_RECIPE.name);

  // Step 5: Navigate to recipe page
  await page.getByTestId("view-recipe-button").click();
  await expect(page).toHaveURL(`/recipe/${MOCK_RECIPE.id}`);

  // Step 6: Verify recipe page shows all steps
  await expect(page.getByTestId("recipe-title")).toHaveText(MOCK_RECIPE.name);
  await expect(page.getByTestId("recipe-stepper")).toBeVisible();

  for (const step of MOCK_RECIPE.steps) {
    await expect(page.getByTestId(`step-${step.stepNumber}`)).toBeVisible();
    await expect(page.getByTestId(`step-${step.stepNumber}`)).toContainText(
      step.instruction
    );
  }
});

test("mobile viewport: home page renders correctly at 375px width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  // All key elements should be visible without horizontal overflow
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByTestId("ingredient-input")).toBeVisible();
  await expect(page.getByTestId("generate-button")).toBeVisible();
  await expect(page.getByTestId("cuisine-select")).toBeVisible();

  // Check no horizontal scrollbar (page width should not exceed viewport)
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});

test("mobile viewport: recipe page renders correctly at 375px width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  // Seed localStorage with a test recipe
  await page.goto("/");
  await page.evaluate((recipe: Recipe) => {
    localStorage.setItem(`recipe:${recipe.id}`, JSON.stringify(recipe));
  }, MOCK_RECIPE);

  // Mock image generation
  await page.route("/api/generate-image", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ base64: FAKE_IMAGE_BASE64, mimeType: FAKE_MIME_TYPE }),
    });
  });

  await page.goto(`/recipe/${MOCK_RECIPE.id}`);

  // Key elements should be visible
  await expect(page.getByTestId("recipe-title")).toBeVisible();
  await expect(page.getByTestId("recipe-stepper")).toBeVisible();
  await expect(page.getByTestId("back-button")).toBeVisible();

  // No horizontal overflow
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
});
