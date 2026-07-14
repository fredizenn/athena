# Gradient — ML & Statistics Flashcards

A production-quality, Duolingo-meets-Notion-meets-Anki flashcard app for mastering
Statistics, Math for ML, Machine Learning, Deep Learning, and AI Engineering interview
concepts. Built with SvelteKit, TypeScript, and Tailwind CSS. Dark mode by default,
fully client-side (no backend — all progress lives in your browser's `localStorage`).

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle (deployable to any static host — Vercel, Netlify,
GitHub Pages, S3, etc.):

```bash
npm run build
npm run preview   # to sanity-check the production build locally
```

The build output lands in `build/` and is a fully static single-page app.

## What's included

- **Dashboard** — streak, accuracy, cards studied today, mastery ring, recently studied,
  suggested topics to jump back into.
- **22 topics** across 6 groups (Foundations → Python & Tooling → Classical ML → Deep
  Learning & AI → MLOps & Deployment → Interviews & Ethics), each with a progress bar,
  difficulty spread, and estimated study time.
- **90 seed flashcards** (see "Adding more content" below to grow this — the schema and
  loader already support thousands).
- **9 study modes**: Normal, Random, Review (spaced-repetition due cards), Interview,
  Quiz, Timed (60s/card), Hard Cards Only, Favorites, Today's Review.
- **Flip-card experience** with question → answer/explanation/example/code/real-world
  application/interview question/memory tip/common mistake/tags/references, plus
  per-card notes and bookmarking, all persisted locally.
- **Search & filtering** by topic, keyword, tag, and difficulty.
- **Stats page** with a GitHub-style study heatmap, strongest/weakest topics, weekly and
  monthly totals.
- **Bookmarks page** to review favorited cards as their own deck.
- **Confetti** on session completion, animated progress bars/rings, smooth flip and
  slide transitions throughout.

## Adding more content

Flashcards live as plain JSON in `src/lib/data/cards/`, one file per topic (e.g.
`statistics.json`, `transformers-attention.json`). Every file is auto-discovered and
loaded by `src/lib/data/index.ts` via `import.meta.glob` — **you never need to register
a new file anywhere else.**

To add more cards:

1. Open (or create) `src/lib/data/cards/<topic-slug>.json`.
2. Add objects matching the `Flashcard` schema in `src/lib/types.ts`:

```json
{
  "id": "stats-009",
  "topic": "statistics",
  "subtopic": "Skewness",
  "difficulty": "Intermediate",
  "question": "...",
  "answer": "...",
  "explanation": "...",
  "example": "...",
  "code": "...",
  "real_world": "...",
  "interview_question": "...",
  "related": ["outliers"],
  "tags": ["descriptive-statistics"],
  "references": ["..."],
  "memory_tip": "...",
  "common_mistake": "..."
}
```

`topic` must match a `slug` in `src/lib/data/topics.ts`. To add a brand-new topic
(rather than more cards in an existing one), add an entry to the `TOPICS` array there
(pick a `group`, a `lucide` icon name, and an accent color), then create its JSON file.

`id` must be globally unique across all files — the app will still run with duplicates,
but progress tracking is keyed by `id`, so collisions will merge two different cards'
progress.

## Architecture notes

- **State**: `src/lib/stores/progress.ts` is the single source of truth for all user
  progress (seen/correct/incorrect counts, a lightweight spaced-repetition schedule,
  bookmarks, notes, streaks, and daily logs), persisted to `localStorage` on every
  mutation.
- **Rendering mode**: the app is built as a client-only SPA (`ssr = false` in the root
  layout, `adapter-static` with a `fallback: 'index.html'`) since there's no backend and
  everything is keyed off `localStorage`. This also means dynamic routes like
  `/topics/[topic]` work correctly once deployed to any static host with SPA-style
  fallback routing.
- **Styling**: Tailwind CSS with a custom token system (see `tailwind.config.js` —
  the `ink` / `violet` / `cyan` / `amber` / `coral` palette, `Space Grotesk` /
  `Inter` / `JetBrains Mono` type system) rather than default Tailwind colors.

## Known follow-ups if you keep building this out

- `lucide-svelte` is currently imported broadly (`import * as icons`) in a couple of
  components for dynamic icon lookup by name, which bundles the whole icon set into one
  chunk. Fine for this app's size; if the flashcard set grows very large, swap to
  per-icon imports or a lookup map to keep bundle size down.
- The spaced-repetition scheduler in `progress.ts` is intentionally simple (an
  ease-factor-based interval, not full SM-2). It's a good foundation to extend if you
  want a more sophisticated algorithm later.
