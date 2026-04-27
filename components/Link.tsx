'use client';

import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';

interface LinkProps extends React.ComponentProps<typeof NextLink> {
  href: string;
  locale?: Locale;
}

export const Link = ({ href, locale, ...props }: LinkProps) => {
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || i18n.defaultLocale;
  const targetLocale = locale || currentLocale;

  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  
  if (isExternal) {
    return <NextLink href={href} {...props} />;
  }

  // Handle root and paths
  const localizedHref = href.startsWith('/') 
    ? `/${targetLocale}${href === '/' ? '' : href}`
    : href;

  return <NextLink href={localizedHref} {...props} />;
};
