import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { attachAdminSessionCookie, createAdminSessionToken } from '@/lib/server/adminAuth';
import { redis } from '@/lib/server/redis';

// Rate-limit state lives in Redis so it survives serverless cold starts and
// is shared across instances.
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const MAX_FAILED_ATTEMPTS = 8;
const LOCKOUT_SECONDS = 30 * 60;

const attemptsKey = (ip: string) => `admin:attempts:${ip}`;
const lockKey = (ip: string) => `admin:lock:${ip}`;

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

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const lockTtlSeconds = await redis.ttl(lockKey(ip));
    if (lockTtlSeconds > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many failed attempts. Please try again later.',
          retryAfter: lockTtlSeconds,
        },
        { status: 429, headers: { 'Retry-After': `${lockTtlSeconds}` } }
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
      await redis.del(attemptsKey(ip), lockKey(ip));

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

    const failedAttempts = await redis.incr(attemptsKey(ip));
    if (failedAttempts === 1) {
      await redis.expire(attemptsKey(ip), RATE_LIMIT_WINDOW_SECONDS);
    }
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      await redis.set(lockKey(ip), '1', { ex: LOCKOUT_SECONDS });
      await redis.del(attemptsKey(ip));
    }

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
