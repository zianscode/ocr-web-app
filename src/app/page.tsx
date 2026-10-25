import { OcrWorkspace } from '@/features/ocr';

export default function HomePage() {
  return (
    <>
      <section className="mb-8 max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Turn images into editable text.
        </h1>
        <p className="mt-2 text-ink-muted">
          Upload a scan, screenshot or photo. Recognition runs entirely in your browser, so your
          images never leave your device.
        </p>
      </section>

      <OcrWorkspace />
    </>
  );
}
