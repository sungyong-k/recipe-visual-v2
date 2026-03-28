import type { Recipe } from "@/lib/types";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="mx-auto max-w-2xl" data-testid="recipe-card">
      <h2 className="text-3xl font-bold text-gray-900">{recipe.name}</h2>
      <p className="mt-2 text-gray-600">{recipe.description}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>
              {ing.name} — {ing.amount}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Steps</h3>
        <ol className="mt-3 space-y-4">
          {recipe.steps.map((step) => (
            <li key={step.stepNumber} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {step.stepNumber}
              </span>
              <p className="pt-1 text-gray-700">{step.instruction}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
