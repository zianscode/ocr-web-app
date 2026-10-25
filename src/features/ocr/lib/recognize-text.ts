import { OCR_LANGUAGE } from '../constants';
import type { OcrLine, RecognitionResult } from '../types';
import { reconstructLayout } from './reconstruct-layout';

type ProgressHandler = (percentage: number) => void;

/**
 * Runs OCR on an image with a short-lived Tesseract worker.
 * Tesseract is imported lazily so it stays out of the initial bundle.
 */
export async function recognizeText(
  image: File,
  onProgress: ProgressHandler,
): Promise<RecognitionResult> {
  const { createWorker, OEM } = await import('tesseract.js');

  const worker = await createWorker(OCR_LANGUAGE, OEM.LSTM_ONLY, {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress(Math.round(message.progress * 100));
      }
    },
  });

  try {
    // `blocks` includes the bounding box of every line and word.
    const { data } = await worker.recognize(image, {}, { text: true, blocks: true });

    const lines: OcrLine[] = (data.blocks ?? [])
      .flatMap((block) => block.paragraphs)
      .flatMap((paragraph) => paragraph.lines)
      .map((line) => ({
        bbox: line.bbox,
        words: line.words
          .map((word) => ({ text: word.text.trim(), bbox: word.bbox }))
          .filter((word) => word.text.length > 0),
      }));

    return {
      plainText: data.text.trim(),
      layoutText: reconstructLayout(lines),
    };
  } finally {
    await worker.terminate();
  }
}
