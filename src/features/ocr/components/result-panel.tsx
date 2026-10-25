import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from '@/components/ui/icons';
import { Panel } from '@/components/ui/panel';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useClipboard } from '@/hooks/use-clipboard';
import { cn } from '@/lib/cn';
import { countWords, formatNumber } from '@/lib/format';
import type { RecognitionResult, RecognitionStatus, TextView } from '../types';

const TEXT_VIEW_OPTIONS = [
  { value: 'layout', label: 'Layout' },
  { value: 'plain', label: 'Plain' },
] as const;

interface ResultPanelProps {
  status: RecognitionStatus;
  progress: number;
  result: RecognitionResult | null;
  error: string | null;
}

export function ResultPanel({ status, progress, result, error }: ResultPanelProps) {
  const [view, setView] = useState<TextView>('layout');

  if (status === 'success' && result) {
    const text = view === 'layout' ? result.layoutText : result.plainText;

    return (
      <Panel
        title="Text"
        actions={
          <>
            <SegmentedControl
              label="Text view"
              options={TEXT_VIEW_OPTIONS}
              value={view}
              onChange={setView}
            />
            <CopyButton text={text} />
          </>
        }
        footer={<TextStats text={result.plainText} />}
      >
        <pre
          className={cn(
            'max-h-[32rem] flex-1 overflow-auto p-4 font-mono text-[13px] leading-6 text-ink',
            view === 'layout' ? 'whitespace-pre' : 'whitespace-pre-wrap break-words',
          )}
        >
          {text}
        </pre>
      </Panel>
    );
  }

  return (
    <Panel title="Text">
      {status === 'recognizing' ? (
        <RecognitionProgress progress={progress} />
      ) : (
        <Placeholder>
          {error ? (
            <span role="alert" className="text-danger">
              {error}
            </span>
          ) : (
            'Extracted text will appear here.'
          )}
        </Placeholder>
      )}
    </Panel>
  );
}

function RecognitionProgress({ progress }: { progress: number }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3 px-8">
      <div className="flex justify-between font-mono text-xs text-ink-muted">
        <span>{progress === 0 ? 'Loading OCR engine…' : 'Reading text…'}</span>
        <span>{progress}%</span>
      </div>
      <ProgressBar value={progress} label="Text recognition progress" />
    </div>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-ink-muted">
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { status, copy } = useClipboard();

  const label = {
    idle: 'Copy',
    copied: 'Copied',
    failed: 'Copy failed',
  }[status];

  return (
    <Button variant="ghost" size="sm" onClick={() => copy(text)} aria-live="polite">
      {status === 'copied' ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      {label}
    </Button>
  );
}

function TextStats({ text }: { text: string }) {
  return (
    <p className="font-mono text-xs text-ink-muted">
      {formatNumber(text.length)} characters · {formatNumber(countWords(text))} words
    </p>
  );
}
