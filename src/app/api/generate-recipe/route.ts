import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import type { Recipe, GenerateRecipeRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: GenerateRecipeRequest = await req.json();

  if (!body.ingredients?.length) {
    return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
  }

  const cuisineHint = body.cuisine ? ` The cuisine style should be ${body.cuisine}.` : "";
  const prompt = `You are a professional chef. Given these ingredients: ${body.ingredients.join(", ")}.${cuisineHint}

Create a recipe and respond ONLY with valid JSON (no markdown, no code blocks) in this exact format:
{
  "name": "Dish Name",
  "description": "Brief description",
  "ingredients": [{"name": "ingredient", "amount": "quantity"}],
  "steps": [{"stepNumber": 1, "instruction": "Step instruction"}]
}

Keep it to 4-6 steps. Each step instruction should be concise and actionable.`;

  const text = await generateText(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse recipe" }, { status: 500 });
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const recipe: Recipe = {
    id: crypto.randomUUID(),
    name: parsed.name,
    description: parsed.description,
    ingredients: parsed.ingredients,
    steps: parsed.steps,
  };

  return NextResponse.json(recipe);
}
