import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'itscoreye_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

interface SessionPayload {
  iat: number;
  exp: number;
}

const getSessionSecret = () => {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
};

const base64UrlEncode = (value: string) => Buffer.from(value, 'utf8').toString('base64url');

const base64UrlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const signPayload = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

export const createAdminSessionToken = () => {
  const secret = getSessionSecret();
  if (!secret) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: nowSeconds,
    exp: nowSeconds + SESSION_TTL_SECONDS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
};

export const verifyAdminSessionToken = (token?: string | null) => {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = signPayload(encodedPayload, secret);

  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (typeof payload.exp !== 'number') return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

export const isAdminRequestAuthorized = (request: NextRequest) => {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
};

export const attachAdminSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
};

export const clearAdminSessionCookie = (response: NextResponse) => {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
};
