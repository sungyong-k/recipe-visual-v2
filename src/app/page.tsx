"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IngredientInput from "@/components/IngredientInput";
import CuisineSelector from "@/components/CuisineSelector";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addIngredient(ing: string) {
    if (!ingredients.includes(ing)) {
      setIngredients([...ingredients, ing]);
    }
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  async function generateRecipe() {
    if (!ingredients.length) return;
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, ...(cuisine ? { cuisine } : {}) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate recipe");
      }

      const data: Recipe = await res.json();
      localStorage.setItem(`recipe:${data.id}`, JSON.stringify(data));
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-center text-4xl font-bold text-gray-900">
        AI Recipe Visualizer
      </h1>
      <p className="mt-2 text-center text-gray-500">
        Add your ingredients and let AI create a recipe for you
      </p>

      <div className="mt-8">
        <IngredientInput
          ingredients={ingredients}
          onAdd={addIngredient}
          onRemove={removeIngredient}
        />
      </div>

      <div className="mt-4">
        <CuisineSelector value={cuisine} onChange={setCuisine} />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={generateRecipe}
          disabled={!ingredients.length || loading}
          className="rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="generate-button"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700" data-testid="error-message">
          {error}
        </div>
      )}

      {recipe && (
        <div className="mt-8">
          <RecipeCard recipe={recipe} />
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/recipe/${recipe.id}`)}
              className="rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-orange-600"
              data-testid="view-recipe-button"
            >
              View Step-by-Step with Images
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
