'use client';
import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('');
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
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)]">
            <LockClosedIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-ink">Admin Access</h1>
          <p className="mt-1 text-sm text-ink-muted">ItsCoreyE Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            className="input"
            autoFocus
          />
          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger-soft p-3">
              <p className="text-center text-sm text-danger">{error}</p>
            </div>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
            {isSubmitting ? 'Signing in…' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
