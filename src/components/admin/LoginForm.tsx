'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else if (response.status === 429) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (loginError) {
      console.error('Authentication error:', loginError);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-canvas px-5 py-[max(1.5rem,env(safe-area-inset-top))]">
      {/* Same quiet backdrop as the homepage hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute top-[-8rem] left-[-8rem] h-[32rem] w-[32rem]"
          style={{ background: 'radial-gradient(closest-side, rgb(147 51 234 / 0.14), transparent 70%)' }}
        />
        <div
          className="absolute right-[-8rem] bottom-[-6rem] h-[30rem] w-[30rem]"
          style={{ background: 'radial-gradient(closest-side, rgb(6 182 212 / 0.12), transparent 70%)' }}
        />
      </div>

      <Link
        href="/"
        className="relative inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Site
      </Link>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <div className="animate-rise card w-full max-w-md p-6 sm:p-10">
          <div className="text-center">
            <Image
              src="/icons/android-chrome-512x512.png"
              alt=""
              width={96}
              height={96}
              priority
              className="mx-auto h-12 w-12"
            />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">Admin Access</h1>
            <p className="mt-1 text-sm text-ink-muted">ItsCoreyE Control Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-ink-secondary">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-muted" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  className="input min-h-12 pr-12 pl-12"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'admin-login-error' : undefined}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div id="admin-login-error" role="alert" className="rounded-xl border border-danger/20 bg-danger-soft p-3">
                <p className="text-center text-sm text-danger">{error}</p>
              </div>
            )}
            <button type="submit" disabled={isSubmitting || !password} className="btn-primary w-full disabled:opacity-50">
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
