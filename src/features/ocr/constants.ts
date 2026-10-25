export const OCR_LANGUAGE = 'eng';

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

/** Formats Tesseract can decode in the browser. */
export const ACCEPTED_IMAGE_TYPES: readonly string[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
];

export const ACCEPTED_FORMATS_LABEL = 'PNG, JPG, WebP, GIF or BMP';
