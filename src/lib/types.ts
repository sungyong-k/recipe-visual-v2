export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  steps: RecipeStep[];
}

export interface GenerateRecipeRequest {
  ingredients: string[];
  cuisine?: string;
}
