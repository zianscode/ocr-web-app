import Image from 'next/image';
import type { ImagePreviewData } from '../types';

interface ImagePreviewProps {
  preview: ImagePreviewData | null;
  alt: string;
}

export function ImagePreview({ preview, alt }: ImagePreviewProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-canvas p-6">
      {preview ? (
        <Image
          src={preview.url}
          alt={alt}
          width={preview.dimensions.width}
          height={preview.dimensions.height}
          unoptimized
          className="h-auto max-h-[26rem] w-auto max-w-full rounded-sm object-contain shadow-sm ring-1 ring-line"
        />
      ) : (
        <span className="font-mono text-xs text-ink-muted">Loading preview…</span>
      )}
    </div>
  );
}
