"use client";

import { useState, type KeyboardEvent } from "react";

interface Props {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (index: number) => void;
}

export default function IngredientInput({ ingredients, onAdd, onRemove }: Props) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type an ingredient and press Enter"
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        data-testid="ingredient-input"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {ingredients.map((ing, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800"
          >
            {ing}
            <button
              onClick={() => onRemove(i)}
              className="ml-1 text-orange-500 hover:text-orange-700"
              aria-label={`Remove ${ing}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
