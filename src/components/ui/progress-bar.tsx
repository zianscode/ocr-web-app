interface ProgressBarProps {
  /** Percentage from 0 to 100. */
  value: number;
  label: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-1 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
