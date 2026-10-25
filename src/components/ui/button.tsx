import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-canvas hover:bg-ink/85',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  ghost: 'text-ink-muted hover:bg-ink/5 hover:text-ink',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-2.5 text-[13px]',
  md: 'h-10 px-4 text-sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
