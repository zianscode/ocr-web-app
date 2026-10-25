import { useId, useState, type ChangeEvent, type DragEvent } from 'react';
import { UploadIcon } from '@/components/ui/icons';
import { cn } from '@/lib/cn';
import { formatBytes } from '@/lib/format';
import { ACCEPTED_FORMATS_LABEL, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '../constants';

interface ImageDropzoneProps {
  onSelect: (file: File) => void;
}

export function ImageDropzone({ onSelect }: ImageDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onSelect(file);

    event.target.value = '';
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) onSelect(file);
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'group m-4 flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 py-16 text-center transition-colors',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
        '[&>*]:pointer-events-none',
        isDragging ? 'border-accent bg-accent/5' : 'border-line hover:border-ink-muted',
      )}
    >
      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleInputChange}
        className="sr-only"
      />
      <UploadIcon className="size-5 text-ink-muted" />
      <span className="text-sm font-medium text-ink">
        Drop an image here, or{' '}
        <span className="underline decoration-line underline-offset-4 group-hover:decoration-ink">
          browse
        </span>
      </span>
      <span className="font-mono text-xs text-ink-muted">
        {ACCEPTED_FORMATS_LABEL} · up to {formatBytes(MAX_IMAGE_SIZE_BYTES)}
      </span>
    </label>
  );
}
