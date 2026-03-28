"use client";

import { useEffect, useState } from "react";
import type { Recipe } from "@/lib/types";

interface StepImage {
  status: "idle" | "loading" | "done" | "error";
  src?: string;
}

interface Props {
  recipe: Recipe;
}

export default function RecipeStepper({ recipe }: Props) {
  const [images, setImages] = useState<StepImage[]>(
    recipe.steps.map(() => ({ status: "idle" }))
  );

  useEffect(() => {
    // Load images sequentially (one per step), progressively
    let cancelled = false;

    async function loadImages() {
      for (let i = 0; i < recipe.steps.length; i++) {
        if (cancelled) break;

        setImages((prev) => {
          const next = [...prev];
          next[i] = { status: "loading" };
          return next;
        });

        try {
          const res = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stepDescription: recipe.steps[i].instruction,
              dishName: recipe.name,
            }),
          });

          if (!res.ok) throw new Error("Image generation failed");

          const { base64, mimeType } = await res.json();
          if (cancelled) break;

          setImages((prev) => {
            const next = [...prev];
            next[i] = { status: "done", src: `data:${mimeType};base64,${base64}` };
            return next;
          });
        } catch {
          if (cancelled) break;
          setImages((prev) => {
            const next = [...prev];
            next[i] = { status: "error" };
            return next;
          });
        }
      }
    }

    loadImages();
    return () => {
      cancelled = true;
    };
  }, [recipe]);

  const totalSteps = recipe.steps.length;

  return (
    <ol className="relative" data-testid="recipe-stepper">
      {recipe.steps.map((step, index) => {
        const isLast = index === totalSteps - 1;
        const img = images[index];

        return (
          <li key={step.stepNumber} className="relative flex gap-4 pb-10 last:pb-0">
            {/* Vertical line connecting steps */}
            {!isLast && (
              <div className="absolute left-4 top-8 h-full w-0.5 -translate-x-1/2 bg-orange-200" />
            )}

            {/* Step number circle */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              {step.stepNumber}
            </div>

            {/* Step content */}
            <div className="flex-1 pt-0.5" data-testid={`step-${step.stepNumber}`}>
              <p className="text-gray-800">{step.instruction}</p>

              {/* Image area */}
              <div className="mt-3">
                {img.status === "idle" && (
                  <div className="h-48 w-full rounded-lg bg-gray-100" />
                )}

                {img.status === "loading" && (
                  <div
                    className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100"
                    data-testid={`step-image-loading-${step.stepNumber}`}
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
                      <span className="text-xs">Generating image...</span>
                    </div>
                  </div>
                )}

                {img.status === "done" && img.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt={`Step ${step.stepNumber}: ${step.instruction}`}
                    className="h-48 w-full rounded-lg object-cover"
                    data-testid={`step-image-${step.stepNumber}`}
                  />
                )}

                {img.status === "error" && (
                  <div
                    className="flex h-20 w-full items-center justify-center rounded-lg bg-red-50 text-sm text-red-400"
                    data-testid={`step-image-error-${step.stepNumber}`}
                  >
                    Image could not be generated
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
