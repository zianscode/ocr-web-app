'use client';

import { useImageFile } from '../hooks/use-image-file';
import { useTextRecognition } from '../hooks/use-text-recognition';
import { ResultPanel } from './result-panel';
import { SourcePanel } from './source-panel';

export function OcrWorkspace() {
  const image = useImageFile();
  const recognition = useTextRecognition();

  function handleSelect(file: File) {
    if (image.select(file)) recognition.reset();
  }

  function handleRemove() {
    image.clear();
    recognition.reset();
  }

  function handleExtract() {
    if (image.file) void recognition.recognize(image.file);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <SourcePanel
        file={image.file}
        preview={image.preview}
        error={image.error}
        isRecognizing={recognition.status === 'recognizing'}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onExtract={handleExtract}
      />
      <ResultPanel
        status={recognition.status}
        progress={recognition.progress}
        result={recognition.result}
        error={recognition.error}
      />
    </div>
  );
}
