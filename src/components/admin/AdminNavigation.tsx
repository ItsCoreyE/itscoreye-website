'use client';
import { ArrowTopRightOnSquareIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface AdminNavigationProps {
  onLogout: () => void;
}

export default function AdminNavigation({ onLogout }: AdminNavigationProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-lg font-bold text-ink">Corey Edwards</span>
          <span className="rounded-md border border-accent-border bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <span className="hidden sm:inline">View Site</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
