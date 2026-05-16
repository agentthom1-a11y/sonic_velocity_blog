import { i18n } from './i18n-config';

export function getSiteOrigin(requestOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && !configured.includes('your-domain.com')) {
    return configured.replace(/\/$/, '');
  }

  return (requestOrigin || 'http://localhost:3000').replace(/\/$/, '');
}

export function getDefaultLocale() {
  return i18n.defaultLocale;
}
