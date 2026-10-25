import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'OCR Web App',
  description: 'Extract text from images directly in your browser.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
