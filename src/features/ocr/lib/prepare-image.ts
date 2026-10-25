import { preprocessForOcr } from './preprocess-image';

export async function prepareImageForOcr(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D context is not available');

  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const processed = preprocessForOcr(context.getImageData(0, 0, canvas.width, canvas.height));

  canvas.width = processed.width;
  canvas.height = processed.height;
  const output = context.createImageData(processed.width, processed.height);
  output.data.set(processed.data);
  context.putImageData(output, 0, 0);

  return canvasToPngBlob(canvas);
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode the preprocessed image'));
    }, 'image/png');
  });
}
