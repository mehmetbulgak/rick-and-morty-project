
# rick-and-morty-project

live link: https://rick-and-morty-project-app.netlify.app/

Responsive character directory built on top of `rickandmortyapi.com`, based on the provided desktop and mobile designs.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules (no UI library)

## Project Structure

```text
src/
  app/                      # Next.js routes (App Router)
  features/characters/       # Feature folder (api, hooks, components, types)
  shared/                   # Reusable UI + utils (container, header, footer, spinner, icons)
  assets/                   # Static assets used by components (logo)
```

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

## Environment Variables (Optional)

You can override the API base URL:

```bash
RICK_AND_MORTY_API_BASE_URL=https://rickandmortyapi.com/api
```
