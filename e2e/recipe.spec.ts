import { test, expect } from "@playwright/test";
import type { Recipe } from "../src/lib/types";

const sampleRecipe: Recipe = {
  id: "test-recipe-123",
  name: "Test Pasta",
  description: "A simple test pasta dish",
  ingredients: [
    { name: "Pasta", amount: "200g" },
    { name: "Tomato sauce", amount: "1 cup" },
  ],
  steps: [
    { stepNumber: 1, instruction: "Boil water in a large pot" },
    { stepNumber: 2, instruction: "Cook pasta for 10 minutes" },
    { stepNumber: 3, instruction: "Add tomato sauce and stir" },
  ],
};

// A minimal 1x1 transparent PNG in base64
const FAKE_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const FAKE_MIME_TYPE = "image/png";

test.beforeEach(async ({ page }) => {
  // Seed localStorage with a test recipe before navigating
  await page.goto("/");
  await page.evaluate((recipe: Recipe) => {
    localStorage.setItem(`recipe:${recipe.id}`, JSON.stringify(recipe));
  }, sampleRecipe);
});

test("recipe page renders with stepper UI", async ({ page }) => {
  await page.goto(`/recipe/${sampleRecipe.id}`);

  await expect(page.getByTestId("recipe-title")).toHaveText(sampleRecipe.name);
  await expect(page.getByTestId("recipe-stepper")).toBeVisible();
});

test("recipe page shows all steps in correct order", async ({ page }) => {
  await page.goto(`/recipe/${sampleRecipe.id}`);

  for (const step of sampleRecipe.steps) {
    await expect(page.getByTestId(`step-${step.stepNumber}`)).toBeVisible();
    await expect(page.getByTestId(`step-${step.stepNumber}`)).toContainText(step.instruction);
  }
});

test("recipe page has back button to home", async ({ page }) => {
  await page.goto(`/recipe/${sampleRecipe.id}`);

  await expect(page.getByTestId("back-button")).toBeVisible();
  await page.getByTestId("back-button").click();
  await expect(page).toHaveURL("/");
});

test("recipe page not-found for unknown id", async ({ page }) => {
  await page.goto("/recipe/nonexistent-id-xyz");
  await expect(page.getByTestId("recipe-not-found")).toBeVisible();
});

test("recipe steps show loading spinner while image generates", async ({ page }) => {
  // Intercept image API to add a delay so we can observe the loading state
  let resolveFirst: () => void;
  const firstRequestHeld = new Promise<void>((resolve) => {
    resolveFirst = resolve;
  });

  let requestCount = 0;
  await page.route("/api/generate-image", async (route) => {
    requestCount++;
    if (requestCount === 1) {
      // Hold the first request so loading state is visible
      await firstRequestHeld;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ base64: FAKE_IMAGE_BASE64, mimeType: FAKE_MIME_TYPE }),
    });
  });

  await page.goto(`/recipe/${sampleRecipe.id}`);

  // The first step should show a loading spinner while the request is held
  await expect(page.getByTestId("step-image-loading-1")).toBeVisible();

  // Release the held request so the rest can proceed
  resolveFirst!();
});

test("recipe steps display generated images after loading", async ({ page }) => {
  // Mock all image API calls to return a fake image immediately
  await page.route("/api/generate-image", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ base64: FAKE_IMAGE_BASE64, mimeType: FAKE_MIME_TYPE }),
    });
  });

  await page.goto(`/recipe/${sampleRecipe.id}`);

  // Wait for all step images to be displayed (progressively loaded)
  for (const step of sampleRecipe.steps) {
    await expect(page.getByTestId(`step-image-${step.stepNumber}`)).toBeVisible({
      timeout: 10000,
    });
  }
});
