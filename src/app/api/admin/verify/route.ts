import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { attachAdminSessionCookie, createAdminSessionToken } from '@/lib/server/adminAuth';

interface AttemptState {
  failedAttempts: number;
  windowStartedAt: number;
  lockUntil: number;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 8;
const LOCKOUT_MS = 30 * 60 * 1000;
const attemptsByIp = new Map<string, AttemptState>();

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
};

const hashValue = (value: string) => createHash('sha256').update(value).digest();

const passwordsMatch = (providedPassword: string, expectedPassword: string) => {
  const providedHash = hashValue(providedPassword);
  const expectedHash = hashValue(expectedPassword);
  return timingSafeEqual(providedHash, expectedHash);
};

const getAttemptState = (ip: string, now: number) => {
  const state = attemptsByIp.get(ip);
  if (!state) {
    return { failedAttempts: 0, windowStartedAt: now, lockUntil: 0 };
  }
  if (now - state.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    return { failedAttempts: 0, windowStartedAt: now, lockUntil: 0 };
  }
  return state;
};

export async function POST(request: NextRequest) {
  try {
    const now = Date.now();
    const ip = getClientIp(request);
    const attemptState = getAttemptState(ip, now);

    if (attemptState.lockUntil > now) {
      const retryAfterSeconds = Math.ceil((attemptState.lockUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'Too many failed attempts. Please try again later.',
          retryAfter: retryAfterSeconds,
        },
        { status: 429, headers: { 'Retry-After': `${retryAfterSeconds}` } }
      );
    }

    const body = (await request.json()) as { password?: unknown };
    const password =
      typeof body.password === 'string'
        ? body.password.trim()
        : '';

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error('ADMIN_PASSWORD not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (passwordsMatch(password, correctPassword)) {
      attemptsByIp.delete(ip);

      const token = createAdminSessionToken();
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Server configuration error' },
          { status: 500 }
        );
      }

      const response = NextResponse.json({
        success: true, 
        message: 'Authentication successful' 
      });
      attachAdminSessionCookie(response, token);
      return response;
    }

    const nextFailedAttempts = attemptState.failedAttempts + 1;
    const lockUntil =
      nextFailedAttempts >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_MS : 0;

    attemptsByIp.set(ip, {
      failedAttempts: nextFailedAttempts,
      windowStartedAt: attemptState.windowStartedAt,
      lockUntil,
    });

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in admin verification:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
