<<<<<<< HEAD
# rick-and-morty-project
=======
# Vanora Case (Rick and Morty Directory)

Responsive character directory built on top of `rickandmortyapi.com`, based on the provided desktop and mobile designs.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules (no UI library)

## Features

- Character list with responsive grid layout
- Name search triggers on `Enter` (no request on every keypress)
- Advanced filters (species, gender, status)
  - Desktop: inline selects
  - Mobile: modal with full focus trap, ESC + click-outside close, focus restored to the trigger button
- Active filters shown as chips with one-click clear, plus `Clear all`
- Load More pagination with spinner, without scroll-to-top
- Rate limit friendly UX:
  - `429 Too Many Requests` is surfaced to the user
  - Existing items stay on screen if Load More fails
- Character detail page shows a loading spinner while fetching character + episode data
- API requests are performed in the browser so they are visible in DevTools Network tab

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

## Notes

- The public API can respond with `429` when too many requests are fired in a short time window. The UI surfaces this error and keeps existing content visible.
- Remote images are enabled for `rickandmortyapi.com` via `next.config.mjs`.
>>>>>>> c9c92c6 (Initial commit)
