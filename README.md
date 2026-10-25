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
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack) |
| `npm run build` | Create a production build        |
| `npm run start` | Serve the production build       |
| `npm run lint`  | Run ESLint                       |

## Recognition pipeline

1. **Preprocessing** (`src/features/ocr/lib/preprocess-image.ts`): converts to grayscale,
   inverts dark-themed images, stretches contrast and upscales small text (line height
   under 16 px) to about 28 px. Upscaling helps screenshots and code most; larger text is
   left as is because upscaling made blurry text worse in benchmarks.
2. **Tesseract** runs in single-block mode (PSM 6), which keeps narrow columns such as
   code line numbers.
3. **Layout reconstruction** rebuilds spacing from word positions (see below).

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
├── app/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   └── ocr/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── constants.ts
│       ├── types.ts
│       └── index.ts
├── hooks/
└── lib/
```

## Conventions

- File names are `kebab-case`; components and hooks use named exports.
- Code outside a feature imports it only through its `index.ts`.
- Colors come from design tokens in `src/app/globals.css` (`bg-canvas`, `text-ink`,
  `border-line`, `text-accent`, ...). Avoid raw Tailwind palette colors.
- `'use client'` is declared only at the client boundary (`ocr-workspace.tsx`).
