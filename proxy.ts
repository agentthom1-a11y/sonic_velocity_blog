import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'sv_session';
const PROTECTED_PATHS = ['/dashboard'];

/**
 * Verifies the HMAC-SHA256 session token using the Web Crypto API
 * (compatible with the Edge runtime).
 *
 * Must replicate lib/session.ts logic — Node.js crypto cannot run in Edge.
 */
async function verifySessionEdge(token: string): Promise<boolean> {
  try {
    const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-production';

    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;

    const data = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    const keyMaterial = new TextEncoder().encode(SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // base64url → Uint8Array
    const b64 = sig.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '=='.slice(0, (4 - (b64.length % 4)) % 4);
    const sigBytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(data)
    );
    if (!valid) return false;

    // Check expiry — decode the payload
    const payloadB64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const payloadPadded = payloadB64 + '=='.slice(0, (4 - (payloadB64.length % 4)) % 4);
    const payload = JSON.parse(atob(payloadPadded));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const isProtected = PROTECTED_PATHS.some(p =>
    req.nextUrl.pathname.startsWith(p)
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionEdge(token))) {
    const loginUrl = new URL('/login', req.url);
    // Preserve the originally requested URL so we can redirect after login
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
