import { cn } from '@/lib/cn';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-line p-0.5">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-6 rounded px-2 text-xs font-medium transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent',
              isSelected ? 'bg-ink text-canvas' : 'text-ink-muted hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
