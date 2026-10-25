const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;
const BYTES_PER_UNIT = 1024;

export function formatBytes(bytes: number): string {
  if (bytes < BYTES_PER_UNIT) return `${bytes} B`;

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(BYTES_PER_UNIT)),
    BYTE_UNITS.length - 1,
  );
  const value = bytes / BYTES_PER_UNIT ** exponent;
  const decimals = value < 10 ? 1 : 0;

  return `${value.toFixed(decimals)} ${BYTE_UNITS[exponent]}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
