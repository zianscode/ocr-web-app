import { formatBytes } from '@/lib/format';
import { ACCEPTED_FORMATS_LABEL, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '../constants';

export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `Unsupported file type. Use ${ACCEPTED_FORMATS_LABEL}.`;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `File is too large. The maximum size is ${formatBytes(MAX_IMAGE_SIZE_BYTES)}.`;
  }

  return null;
}
