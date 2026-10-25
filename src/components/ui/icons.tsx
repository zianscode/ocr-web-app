import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 15V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </BaseIcon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 5 5L19 7" />
    </BaseIcon>
  );
}
