import { useCallback, useEffect, useState } from 'react';
import { loadImageDimensions } from '../lib/load-image-dimensions';
import { validateImage } from '../lib/validate-image';
import type { ImagePreviewData } from '../types';

const UNREADABLE_IMAGE_ERROR = 'This image could not be read. Try a different file.';

export function useImageFile() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImagePreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);
    if (!file) return;

    const url = URL.createObjectURL(file);
    let isCancelled = false;

    loadImageDimensions(url)
      .then((dimensions) => {
        if (!isCancelled) setPreview({ url, dimensions });
      })
      .catch(() => {
        if (isCancelled) return;
        setError(UNREADABLE_IMAGE_ERROR);
        setFile(null);
      });

    return () => {
      isCancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const select = useCallback((candidate: File): boolean => {
    const validationError = validateImage(candidate);
    setError(validationError);

    if (validationError) return false;

    setFile(candidate);
    return true;
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  return { file, preview, error, select, clear };
}
