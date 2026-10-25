import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, actions, footer, children }: PanelProps) {
  return (
    <section className="flex min-h-[28rem] flex-col overflow-hidden rounded-lg border border-line bg-surface">
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink-muted">{title}</h2>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </header>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>

      {footer && (
        <footer className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2">
          {footer}
        </footer>
      )}
    </section>
  );
}
