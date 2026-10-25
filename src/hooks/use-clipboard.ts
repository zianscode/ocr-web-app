import { useCallback, useEffect, useState } from 'react';

type CopyStatus = 'idle' | 'copied' | 'failed';

const STATUS_RESET_DELAY_MS = 2000;

export function useClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (status === 'idle') return;

    const timeoutId = setTimeout(() => setStatus('idle'), STATUS_RESET_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [status]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setStatus('failed');
    }
  }, []);

  return { status, copy };
}
