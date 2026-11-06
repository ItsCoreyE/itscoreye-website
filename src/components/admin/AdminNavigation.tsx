'use client';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface AdminNavigationProps {
  onLogout: () => void;
}

export default function AdminNavigation({ onLogout }: AdminNavigationProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/icons/android-chrome-512x512.png"
            alt=""
            width={80}
            height={80}
            className="h-10 w-10 shrink-0"
          />
          <span className="hidden truncate text-base font-semibold tracking-tight text-ink sm:block">
            Corey Edwards
          </span>
          <span className="shrink-0 rounded-full border border-accent-border bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View site in a new tab"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink md:min-h-10"
          >
            <span className="hidden sm:inline">View Site</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-danger/20 bg-danger-soft px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10 md:min-h-10"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
