export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImagePreviewData {
  url: string;
  dimensions: ImageDimensions;
}

export type RecognitionStatus = 'idle' | 'recognizing' | 'success' | 'error';

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
  plainText: string;
  layoutText: string;
}

export type TextView = 'layout' | 'plain';
