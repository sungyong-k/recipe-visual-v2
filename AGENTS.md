# Recipe Visual V2

AI-powered recipe generator with step-by-step cooking images.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI Text**: Gemini 2.0 Flash (`gemini-2.0-flash`)
- **AI Image**: Gemini 3.1 Flash (`gemini-3.1-flash-image-preview`)

## Dev Commands

```bash
npm run dev       # Dev server (port 3000)
npm run build     # Production build
npm run lint      # ESLint
npm run test:e2e  # Playwright E2E tests
```

## Environment Variables

- `GOOGLE_API_KEY` — Google Gemini API key (required)

## Architecture

- `src/app/` — Pages and API routes (App Router)
- `src/components/` — React components
- `src/lib/` — Shared utilities and types
- `goals/` — Goal Documents
- `docs/` — Project documentation
