export interface PixelImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

const CONTRAST_CLIP_RATIO = 0.005;

const SMALL_TEXT_HEIGHT_PX = 16;

const TARGET_TEXT_HEIGHT_PX = 28;

const MAX_UPSCALE = 4;

const MAX_OUTPUT_PIXELS = 16_000_000;

const INK_THRESHOLD = 128;

const MIN_TEXT_LINE_HEIGHT_PX = 4;

export function preprocessForOcr(image: PixelImage): PixelImage {
  const { width, height } = image;
  let gray = toGrayscale(image);

  if (hasDarkBackground(gray)) gray = invert(gray);

  gray = stretchContrast(gray);

  const scale = chooseScale(gray, width, height);
  if (scale === 1) return toRgba(gray, width, height);

  const resized = resize(gray, width, height, scale);
  return toRgba(resized.gray, resized.width, resized.height);
}

function chooseScale(gray: Uint8ClampedArray, width: number, height: number): number {
  const textHeight = estimateTextHeight(gray, width, height);
  if (textHeight === null || textHeight >= SMALL_TEXT_HEIGHT_PX) return 1;

  const maxScaleForSize = Math.sqrt(MAX_OUTPUT_PIXELS / (width * height));
  return Math.max(Math.min(TARGET_TEXT_HEIGHT_PX / textHeight, MAX_UPSCALE, maxScaleForSize), 1);
}

function estimateTextHeight(gray: Uint8ClampedArray, width: number, height: number): number | null {
  const lineHeights: number[] = [];
  let runLength = 0;

  for (let y = 0; y <= height; y++) {
    if (y < height && rowHasInk(gray, width, y)) {
      runLength++;
      continue;
    }

    if (runLength >= MIN_TEXT_LINE_HEIGHT_PX) lineHeights.push(runLength);
    runLength = 0;
  }

  if (lineHeights.length === 0) return null;

  lineHeights.sort((a, b) => a - b);
  return lineHeights[Math.floor(lineHeights.length / 2)];
}

function rowHasInk(gray: Uint8ClampedArray, width: number, y: number): boolean {
  const rowStart = y * width;

  for (let x = 0; x < width; x++) {
    if (gray[rowStart + x] < INK_THRESHOLD) return true;
  }

  return false;
}

function toGrayscale({ data, width, height }: PixelImage): Uint8ClampedArray {
  const gray = new Uint8ClampedArray(width * height);

  for (let i = 0; i < gray.length; i++) {
    const offset = i * 4;
    gray[i] = 0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2];
  }

  return gray;
}

function hasDarkBackground(gray: Uint8ClampedArray): boolean {
  return percentile(buildHistogram(gray), gray.length, 0.5) < 128;
}

function invert(gray: Uint8ClampedArray): Uint8ClampedArray {
  return gray.map((value) => 255 - value);
}

function stretchContrast(gray: Uint8ClampedArray): Uint8ClampedArray {
  const histogram = buildHistogram(gray);
  const low = percentile(histogram, gray.length, CONTRAST_CLIP_RATIO);
  const high = percentile(histogram, gray.length, 1 - CONTRAST_CLIP_RATIO);

  if (high <= low) return gray;

  const range = high - low;
  return gray.map((value) => ((value - low) * 255) / range);
}

function resize(gray: Uint8ClampedArray, width: number, height: number, scale: number) {
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);
  const output = new Uint8ClampedArray(targetWidth * targetHeight);

  for (let y = 0; y < targetHeight; y++) {
    const sourceY = Math.min((y + 0.5) / scale - 0.5, height - 1);
    const y0 = Math.max(Math.floor(sourceY), 0);
    const y1 = Math.min(y0 + 1, height - 1);
    const dy = Math.max(sourceY - y0, 0);

    for (let x = 0; x < targetWidth; x++) {
      const sourceX = Math.min((x + 0.5) / scale - 0.5, width - 1);
      const x0 = Math.max(Math.floor(sourceX), 0);
      const x1 = Math.min(x0 + 1, width - 1);
      const dx = Math.max(sourceX - x0, 0);

      const top = gray[y0 * width + x0] * (1 - dx) + gray[y0 * width + x1] * dx;
      const bottom = gray[y1 * width + x0] * (1 - dx) + gray[y1 * width + x1] * dx;
      output[y * targetWidth + x] = top * (1 - dy) + bottom * dy;
    }
  }

  return { gray: output, width: targetWidth, height: targetHeight };
}

function toRgba(gray: Uint8ClampedArray, width: number, height: number): PixelImage {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < gray.length; i++) {
    const offset = i * 4;
    data[offset] = data[offset + 1] = data[offset + 2] = gray[i];
    data[offset + 3] = 255;
  }

  return { data, width, height };
}

function buildHistogram(gray: Uint8ClampedArray): Uint32Array {
  const histogram = new Uint32Array(256);
  for (const value of gray) histogram[value]++;
  return histogram;
}

function percentile(histogram: Uint32Array, total: number, ratio: number): number {
  const target = total * ratio;
  let cumulative = 0;

  for (let level = 0; level < histogram.length; level++) {
    cumulative += histogram[level];
    if (cumulative >= target) return level;
  }

  return histogram.length - 1;
}
