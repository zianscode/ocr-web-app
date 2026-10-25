import type { BoundingBox, OcrLine, OcrWord } from '../types';

const MIN_WORD_CONFIDENCE = 60;

interface RecognizedWord {
  text: string;
  confidence: number;
  bbox: BoundingBox;
}

interface RecognizedBlock {
  paragraphs: { lines: { words: RecognizedWord[] }[] }[];
}

interface CollectedText {
  lines: OcrLine[];
  plainText: string;
}

export function collectWords(blocks: RecognizedBlock[]): CollectedText {
  const paragraphs = blocks
    .flatMap((block) => block.paragraphs)
    .map((paragraph) => paragraph.lines.map(toConfidentLine).filter(isNotEmpty))
    .filter((lines) => lines.length > 0);

  const plainText = paragraphs
    .map((lines) => lines.map((line) => line.words.map((word) => word.text).join(' ')).join('\n'))
    .join('\n\n');

  return { lines: paragraphs.flat(), plainText };
}

function toConfidentLine({ words }: { words: RecognizedWord[] }): OcrLine | null {
  const confidentWords: OcrWord[] = words
    .filter((word) => word.confidence >= MIN_WORD_CONFIDENCE)
    .map((word) => ({ text: word.text.trim(), bbox: word.bbox }))
    .filter((word) => word.text.length > 0);

  if (confidentWords.length === 0) return null;

  return { words: confidentWords, bbox: unionBox(confidentWords.map((word) => word.bbox)) };
}

function unionBox(boxes: BoundingBox[]): BoundingBox {
  return {
    x0: Math.min(...boxes.map((box) => box.x0)),
    y0: Math.min(...boxes.map((box) => box.y0)),
    x1: Math.max(...boxes.map((box) => box.x1)),
    y1: Math.max(...boxes.map((box) => box.y1)),
  };
}

function isNotEmpty(line: OcrLine | null): line is OcrLine {
  return line !== null;
}
