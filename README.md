# OCR Web App

Extract text from images directly in the browser. Recognition runs client-side with
[Tesseract.js](https://tesseract.projectnaptha.com/), so images are never uploaded to a server.

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Tesseract.js 6 (English, LSTM engine)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script          | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack) |
| `npm run build` | Create a production build      |
| `npm run start` | Serve the production build     |
| `npm run lint`  | Run ESLint                     |

## Output views

- **Layout** (default): rebuilds the text so it mirrors the image. Indentation, columns and
  tables stay aligned, using the word positions Tesseract reports
  (`src/features/ocr/lib/reconstruct-layout.ts`).
- **Plain**: text in reading order, best for pasting into documents.

The first extraction downloads the Tesseract engine and English language data from a CDN,
so an internet connection is required.

## Project structure

```
src/
├── app/                    # Routes, root layout, global styles, icons
├── components/
│   ├── layout/             # Site header and footer
│   └── ui/                 # Generic, reusable UI primitives (Button, Panel, ...)
├── features/
│   └── ocr/                # Everything specific to text recognition
│       ├── components/     # Feature UI (workspace, source & result panels)
│       ├── hooks/          # Feature state (image file, recognition)
│       ├── lib/            # Pure helpers and the Tesseract wrapper
│       ├── constants.ts
│       ├── types.ts
│       └── index.ts        # Public API of the feature
├── hooks/                  # Shared hooks
└── lib/                    # Shared utilities
```

## Conventions

- File names are `kebab-case`; components and hooks use named exports.
- Code outside a feature imports it only through its `index.ts`.
- Colors come from design tokens in `src/app/globals.css` (`bg-canvas`, `text-ink`,
  `border-line`, `text-accent`, ...). Avoid raw Tailwind palette colors.
- `'use client'` is declared only at the client boundary (`ocr-workspace.tsx`).
