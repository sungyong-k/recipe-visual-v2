"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Recipe } from "@/lib/types";
import RecipeStepper from "@/components/RecipeStepper";

function loadRecipe(id: string): { recipe: Recipe | null; notFound: boolean } {
  if (typeof window === "undefined") {
    return { recipe: null, notFound: false };
  }
  const stored = localStorage.getItem(`recipe:${id}`);
  if (!stored) {
    return { recipe: null, notFound: true };
  }
  try {
    return { recipe: JSON.parse(stored) as Recipe, notFound: false };
  } catch {
    return { recipe: null, notFound: true };
  }
}

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { recipe, notFound } = useMemo(() => loadRecipe(id), [id]);

  if (notFound) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-center text-gray-500" data-testid="recipe-not-found">
          Recipe not found.{" "}
          <button
            onClick={() => router.push("/")}
            className="text-orange-500 underline hover:text-orange-600"
          >
            Go back home
          </button>
        </p>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex justify-center" data-testid="recipe-loading">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        data-testid="back-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </button>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl" data-testid="recipe-title">
        {recipe.name}
      </h1>
      <p className="mt-2 text-gray-600">{recipe.description}</p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>
              {ing.name} — {ing.amount}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Cooking Steps</h2>
        <RecipeStepper recipe={recipe} />
      </div>
    </main>
  );
}
