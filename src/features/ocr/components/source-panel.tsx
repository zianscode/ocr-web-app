import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { formatBytes } from '@/lib/format';
import type { ImagePreviewData } from '../types';
import { ImageDropzone } from './image-dropzone';
import { ImagePreview } from './image-preview';

interface SourcePanelProps {
  file: File | null;
  preview: ImagePreviewData | null;
  error: string | null;
  isRecognizing: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onExtract: () => void;
}

export function SourcePanel({
  file,
  preview,
  error,
  isRecognizing,
  onSelect,
  onRemove,
  onExtract,
}: SourcePanelProps) {
  return (
    <Panel
      title="Source"
      actions={
        file && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )
      }
      footer={
        file && (
          <>
            <FileDetails file={file} preview={preview} />
            <Button variant="primary" onClick={onExtract} disabled={isRecognizing || !preview}>
              {isRecognizing ? 'Extracting…' : 'Extract text'}
            </Button>
          </>
        )
      }
    >
      {file ? (
        <ImagePreview preview={preview} alt={`Preview of ${file.name}`} />
      ) : (
        <ImageDropzone onSelect={onSelect} />
      )}

      {error && (
        <p role="alert" className="mx-4 mb-4 text-sm text-danger">
          {error}
        </p>
      )}
    </Panel>
  );
}

interface FileDetailsProps {
  file: File;
  preview: ImagePreviewData | null;
}

function FileDetails({ file, preview }: FileDetailsProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-ink" title={file.name}>
        {file.name}
      </p>
      <p className="font-mono text-xs text-ink-muted">
        {preview && `${preview.dimensions.width} × ${preview.dimensions.height} px · `}
        {formatBytes(file.size)}
      </p>
    </div>
  );
}
