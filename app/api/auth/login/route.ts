import { NextRequest, NextResponse } from 'next/server';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE, SessionPayload } from '@/lib/session';

/**
 * Demo accounts validated SERVER-SIDE only.
 * Credentials are read from env vars and never sent to the client.
 * In production, replace with a real user database query.
 */
const DEMO_ACCOUNTS: Record<string, { password: string; tier: SessionPayload['tier'] }> = {
  [process.env.DEMO_S1_EMAIL ?? 's1@velocity.ai']: {
    password: process.env.DEMO_S1_PASSWORD ?? 'velocity2025',
    tier: 'premium',
  },
  [process.env.DEMO_S2_EMAIL ?? 's2@velocity.ai']: {
    password: process.env.DEMO_S2_PASSWORD ?? 'velocity2025',
    tier: 'pro',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (
      !email || !password ||
      typeof email !== 'string' || typeof password !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    let tier: SessionPayload['tier'] = 'free';

    const demoAccount = DEMO_ACCOUNTS[normalized];
    if (demoAccount) {
      // Exact password match required for demo accounts
      if (demoAccount.password !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      tier = demoAccount.tier;
    } else {
      // Free-tier accounts: require minimum password length only
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 401 });
      }
    }

    const payload: SessionPayload = {
      email: normalized,
      tier,
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    };

    const token = signSession(payload);

    const res = NextResponse.json({ tier });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,                                         // not readable by JS
      secure: process.env.NODE_ENV === 'production',          // HTTPS only in prod
      sameSite: 'lax',                                        // CSRF protection
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
