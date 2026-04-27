import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const SESSION_COOKIE = 'sv_session';
const ADMIN_COOKIE = 'sv_admin';
const PROTECTED_PATHS = ['/dashboard'];
const ADMIN_PATHS = ['/admin'];

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    const locale = matchLocale(languages, locales, i18n.defaultLocale);
    return locale;
  } catch (error) {
    return i18n.defaultLocale;
  }
}

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

    const payloadB64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const payloadPadded = payloadB64 + '=='.slice(0, (4 - (payloadB64.length % 4)) % 4);
    const payload = JSON.parse(atob(payloadPadded));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Skip if it's a public file or api
  if (
    pathname.includes('.') || // e.g. .ico, .png, .svg
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return;
  }

  // 3. Locale Redirect if missing
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // 4. Auth Logic on locale-prefixed paths
  const localePrefix = i18n.locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);
  const pathWithoutLocale = localePrefix ? pathname.replace(`/${localePrefix}`, '') || '/' : pathname;

  // Admin route protection
  const isAdminRoute = ADMIN_PATHS.some(p => pathWithoutLocale.startsWith(p));
  if (isAdminRoute && pathWithoutLocale !== '/admin/login') {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!adminToken || !(await verifySessionEdge(adminToken))) {
      const loginUrl = new URL(`/${localePrefix || i18n.defaultLocale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Dashboard route protection
  const isProtected = PROTECTED_PATHS.some(p => pathWithoutLocale.startsWith(p));
  if (isProtected) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !(await verifySessionEdge(token))) {
      const loginUrl = new URL(`/${localePrefix || i18n.defaultLocale}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)'],
};
