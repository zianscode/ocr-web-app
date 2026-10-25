import { useCallback, useRef, useState } from 'react';
import { recognizeText } from '../lib/recognize-text';
import type { RecognitionResult, RecognitionStatus } from '../types';

interface RecognitionState {
  status: RecognitionStatus;
  progress: number;
  result: RecognitionResult | null;
  error: string | null;
}

const INITIAL_STATE: RecognitionState = {
  status: 'idle',
  progress: 0,
  result: null,
  error: null,
};

const NO_TEXT_FOUND_ERROR = 'No text was found. Try a sharper, higher-contrast image.';
const RECOGNITION_FAILED_ERROR = 'Something went wrong while reading the image. Please try again.';

export function useTextRecognition() {
  const [state, setState] = useState<RecognitionState>(INITIAL_STATE);

  const latestRunIdRef = useRef(0);

  const recognize = useCallback(async (image: File) => {
    const runId = ++latestRunIdRef.current;
    const isLatestRun = () => runId === latestRunIdRef.current;

    setState({ ...INITIAL_STATE, status: 'recognizing' });

    try {
      const result = await recognizeText(image, (progress) => {
        if (isLatestRun()) setState((current) => ({ ...current, progress }));
      });

      if (!isLatestRun()) return;

      setState(
        result.plainText
          ? { ...INITIAL_STATE, status: 'success', result }
          : { ...INITIAL_STATE, status: 'error', error: NO_TEXT_FOUND_ERROR },
      );
    } catch (error) {
      if (!isLatestRun()) return;

      console.error('Text recognition failed:', error);
      setState({ ...INITIAL_STATE, status: 'error', error: RECOGNITION_FAILED_ERROR });
    }
  }, []);

  const reset = useCallback(() => {
    latestRunIdRef.current += 1;
    setState(INITIAL_STATE);
  }, []);

  return { ...state, recognize, reset };
}
