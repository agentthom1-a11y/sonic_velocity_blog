import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

/** Returns the current authenticated user or { user: null } if unauthenticated. */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });

  const session = verifySession(token);
  if (!session) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { email: session.email, tier: session.tier },
  });
}
