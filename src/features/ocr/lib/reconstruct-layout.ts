import type { BoundingBox, OcrLine, OcrWord } from '../types';

/** Lines sharing at least this fraction of the shorter line's height belong to the same row. */
const ROW_OVERLAP_RATIO = 0.5;

/**
 * Horizontal gaps wider than this fraction of the row height separate columns.
 * Regular word spacing is roughly a quarter of the font height.
 */
const COLUMN_GAP_RATIO = 0.8;

/** Columns are also at least this many characters apart, so a space after narrow punctuation is not mistaken for one. */
const MIN_COLUMN_GAP_IN_CHARS = 2;

/** Phrases shorter than this are too noisy to measure character width from. */
const MIN_MEASURABLE_PHRASE_LENGTH = 4;

const MAX_CONSECUTIVE_BLANK_LINES = 3;

interface Row {
  top: number;
  bottom: number;
  words: OcrWord[];
}

/** A run of words separated only by regular word spacing. */
interface Phrase {
  text: string;
  x0: number;
  x1: number;
}

/**
 * Rebuilds the spatial layout of recognized text as monospaced plain text.
 *
 * Phrases keep their horizontal position (so indentation, columns and tables
 * stay aligned), lines that sit side by side are merged into one row, and large
 * vertical gaps become blank lines.
 */
export function reconstructLayout(lines: OcrLine[]): string {
  const rows = groupIntoRows(lines);
  if (rows.length === 0) return '';

  // First pass: rough phrases (split by row height alone) to measure character width.
  const roughPhrases = rows.flatMap((row) => splitIntoPhrases(row, height(row) * COLUMN_GAP_RATIO));
  const charWidth = estimateCharWidth(roughPhrases);

  // Second pass: final phrases, now that the character width is known.
  const phrasesByRow = rows.map((row) =>
    splitIntoPhrases(
      row,
      Math.max(height(row) * COLUMN_GAP_RATIO, charWidth * MIN_COLUMN_GAP_IN_CHARS),
    ),
  );
  const leftEdge = Math.min(...phrasesByRow.flat().map((phrase) => phrase.x0));
  const rowHeight = median(rows.map(height));

  const output: string[] = [];

  rows.forEach((row, index) => {
    if (index > 0) {
      const gap = row.top - rows[index - 1].bottom;
      // Regular line spacing is well under one row height, so only larger gaps become blank lines.
      const blankLines = clamp(Math.floor(gap / rowHeight), 0, MAX_CONSECUTIVE_BLANK_LINES);
      output.push(...Array<string>(blankLines).fill(''));
    }

    output.push(renderRow(phrasesByRow[index], leftEdge, charWidth));
  });

  return output.join('\n');
}

function groupIntoRows(lines: OcrLine[]): Row[] {
  const sortedLines = lines
    .filter((line) => line.words.length > 0)
    .sort((a, b) => verticalCenter(a.bbox) - verticalCenter(b.bbox));

  const rows: Row[] = [];

  for (const line of sortedLines) {
    const currentRow = rows.at(-1);

    if (currentRow && sharesRow(currentRow, line.bbox)) {
      currentRow.top = Math.min(currentRow.top, line.bbox.y0);
      currentRow.bottom = Math.max(currentRow.bottom, line.bbox.y1);
      currentRow.words.push(...line.words);
    } else {
      rows.push({ top: line.bbox.y0, bottom: line.bbox.y1, words: [...line.words] });
    }
  }

  return rows;
}

function sharesRow(row: Row, bbox: BoundingBox): boolean {
  const overlap = Math.min(row.bottom, bbox.y1) - Math.max(row.top, bbox.y0);
  const shorterHeight = Math.min(height(row), bbox.y1 - bbox.y0);
  return overlap >= shorterHeight * ROW_OVERLAP_RATIO;
}

function splitIntoPhrases(row: Row, columnGap: number): Phrase[] {
  const sortedWords = [...row.words].sort((a, b) => a.bbox.x0 - b.bbox.x0);
  const phrases: Phrase[] = [];

  for (const word of sortedWords) {
    const currentPhrase = phrases.at(-1);

    if (currentPhrase && word.bbox.x0 - currentPhrase.x1 < columnGap) {
      currentPhrase.text += ` ${word.text}`;
      currentPhrase.x1 = Math.max(currentPhrase.x1, word.bbox.x1);
    } else {
      phrases.push({ text: word.text, x0: word.bbox.x0, x1: word.bbox.x1 });
    }
  }

  return phrases;
}

function renderRow(phrases: Phrase[], leftEdge: number, charWidth: number): string {
  let text = '';

  for (const phrase of phrases) {
    const column = Math.round((phrase.x0 - leftEdge) / charWidth);
    // Never let a phrase overlap the previous one.
    const minColumn = text.length === 0 ? 0 : text.length + 1;
    text = text.padEnd(Math.max(column, minColumn)) + phrase.text;
  }

  return text;
}

/**
 * Average character advance in pixels (spaces included), used to map pixel
 * positions to text columns.
 */
function estimateCharWidth(phrases: Phrase[]): number {
  const measurable = phrases.filter((phrase) => phrase.text.length >= MIN_MEASURABLE_PHRASE_LENGTH);
  const sample = measurable.length > 0 ? measurable : phrases;
  const widths = sample.map((phrase) => (phrase.x1 - phrase.x0) / phrase.text.length);

  return Math.max(median(widths), 1);
}

function height(row: Row): number {
  return row.bottom - row.top;
}

function verticalCenter(bbox: BoundingBox): number {
  return (bbox.y0 + bbox.y1) / 2;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
