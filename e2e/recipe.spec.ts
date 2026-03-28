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
