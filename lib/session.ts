/**
 * Server-side session helper (Node.js runtime only).
 * Uses HMAC-SHA256 to sign a JSON payload stored in an httpOnly cookie.
 * Do NOT import this in client components or Edge middleware.
 */
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-production';

export type UserTier = 'free' | 'premium' | 'pro';

export interface SessionPayload {
  email: string;
  tier: UserTier;
  /** Unix ms timestamp when the session expires */
  exp: number;
}

/** Encode payload and append HMAC signature → `data.sig` */
export function signSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/** Verify signature and expiry. Returns the payload or null on failure. */
export function verifySession(token: string): SessionPayload | null {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;

    const data = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    const expected = createHmac('sha256', SECRET).update(data).digest('base64url');

    // Timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig, 'base64url');
    const expBuf = Buffer.from(expected, 'base64url');
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf-8')
    );

    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'sv_session';
/** 7 days in seconds */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
