export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImagePreviewData {
  url: string;
  dimensions: ImageDimensions;
}

export type RecognitionStatus = 'idle' | 'recognizing' | 'success' | 'error';

/** Pixel coordinates in the source image. */
export interface BoundingBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface OcrWord {
  text: string;
  bbox: BoundingBox;
}

export interface OcrLine {
  words: OcrWord[];
  bbox: BoundingBox;
}

export interface RecognitionResult {
  /** Text as Tesseract reads it, in reading order. */
  plainText: string;
  /** Text positioned to mirror the layout of the source image. */
  layoutText: string;
}

export type TextView = 'layout' | 'plain';
