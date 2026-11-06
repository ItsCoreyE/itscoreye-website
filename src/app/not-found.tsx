import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Replaces the default Next.js 404, which printed its own <title> next to the site title.
// robots overrides the layout's "index, follow" so it agrees with the noindex Next.js adds.
export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-canvas px-5 py-16">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-md text-center">
        <Image
          src="/icons/android-chrome-512x512.png"
          alt=""
          width={192}
          height={192}
          priority
          className="mx-auto h-20 w-20 sm:h-24 sm:w-24"
        />
        {/* The icon's transparent band already adds space below the mark */}
        <p className="mt-4 text-sm font-semibold tracking-wide text-accent uppercase">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          <span className="gradient-text">Page Not Found</span>
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          This page does not exist or has moved. Head back to the homepage to see what I&apos;m working on.
        </p>
        <Link href="/" className="btn-primary mt-8 px-6">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
