# Goal 01: MVP — AI Recipe Visualizer

> status: inactive
> created: 2026-03-28

## Vision

A web app where users input ingredients they have, and AI generates a recipe with step-by-step cooking images for each stage. The app combines Gemini's text generation (for recipes) and image generation (for cooking step visuals) into a seamless cooking guide experience.

## Core Features

### 1. Ingredient Input
- Text input for listing available ingredients
- Tag-style UI for adding/removing ingredients
- Optional: cuisine preference selector (Korean, Italian, Japanese, etc.)

### 2. AI Recipe Generation
- Gemini API generates a structured recipe from ingredients
- Output: dish name, description, ingredients list (with quantities), step-by-step instructions
- Each step should be concise and actionable

### 3. Step-by-Step Visual Guide
- Each cooking step gets an AI-generated image (Gemini 3.1 Flash image model)
- Timeline/stepper UI showing progress through recipe
- Each step displays: step number, instruction text, generated image

### 4. Recipe Display
- Clean, readable recipe card layout
- Responsive design (mobile-friendly)
- Loading states during AI generation (text first, then images progressively)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI - Text**: Gemini API (text generation for recipes)
- **AI - Image**: Gemini 3.1 Flash (`gemini-3.1-flash-image-preview`) for cooking step images
- **Language**: TypeScript

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — ingredient input + generate button |
| `/recipe/[id]` | Recipe result — full recipe with step images |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generate-recipe` | POST | Takes ingredients → returns structured recipe JSON |
| `/api/generate-image` | POST | Takes step description → returns generated image |

## Success Criteria

- [ ] User can input ingredients and get a generated recipe
- [ ] Each recipe step has an AI-generated image
- [ ] Recipe displays in a clear, step-by-step format
- [ ] Build passes (`npm run build`)
- [ ] E2E tests pass (home page load, recipe generation flow)
- [ ] Mobile-responsive layout

## Non-Goals (MVP)

- User accounts / authentication
- Recipe saving / history
- Sharing functionality
- Multiple recipe suggestions
- Ingredient recognition from photos
