import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-ink">
          <span
            aria-hidden="true"
            className="grid size-6 place-items-center rounded bg-ink font-mono text-[11px] font-medium text-canvas"
          >
            Aa
          </span>
          OCR Web App
        </Link>
        <span className="hidden font-mono text-xs text-ink-muted sm:inline">
          Runs locally in your browser
        </span>
      </div>
    </header>
  );
}
