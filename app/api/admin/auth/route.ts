/**
 * Admin auth endpoint — separate from user auth.
 * Reads ADMIN_EMAIL + ADMIN_PASSWORD from env vars.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { timingSafeEqual, createHmac } from 'crypto';

const ADMIN_COOKIE  = 'sv_admin';
const ADMIN_MAX_AGE = 60 * 60 * 8; // 8 hours
const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-production';

function signAdminToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + ADMIN_MAX_AGE * 1000 })).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string): { email: string } | null {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;
    const payload = token.slice(0, dot);
    const sig     = token.slice(dot + 1);
    const expected = createHmac('sha256', SECRET).update(payload).digest('base64url');
    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (parsed.exp < Date.now()) return null;
    return { email: parsed.email };
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { email, password } = body as { email?: string; password?: string };

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@velocity.ai';
  const adminPass  = process.env.ADMIN_PASSWORD ?? 'admin123';

  const emailMatch = email === adminEmail;
  const passMatch  = password === adminPass; // simple compare OK — HMAC on token itself
  if (!emailMatch || !passMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signAdminToken(email!);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_MAX_AGE,
    path: '/',
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
