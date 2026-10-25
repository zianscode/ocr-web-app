import { OCR_LANGUAGE } from '../constants';
import type { RecognitionResult } from '../types';
import { collectWords } from './collect-words';
import { prepareImageForOcr } from './prepare-image';
import { reconstructLayout } from './reconstruct-layout';

type ProgressHandler = (percentage: number) => void;

export async function recognizeText(
  image: File,
  onProgress: ProgressHandler,
): Promise<RecognitionResult> {
  const [{ createWorker, OEM, PSM }, preparedImage] = await Promise.all([
    import('tesseract.js'),
    prepareImageForOcr(image),
  ]);

  const worker = await createWorker(OCR_LANGUAGE, OEM.LSTM_ONLY, {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress(Math.round(message.progress * 100));
      }
    },
  });

  try {
    await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK });

    const { data } = await worker.recognize(preparedImage, {}, { blocks: true });

    const { lines, plainText } = collectWords(data.blocks ?? []);

    return {
      plainText,
      layoutText: reconstructLayout(lines),
    };
  } finally {
    await worker.terminate();
  }
}
