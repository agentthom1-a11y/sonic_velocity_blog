'use client';

import { usePathname, useParams } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';
import NextLink from 'next/link';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const LanguageSwitcher = () => {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || i18n.defaultLocale;
  const [isOpen, setIsOpen] = useState(false);

  const redirectedPathname = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 bg-neutral-900/50 rounded-sm text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
        aria-label="Select language"
      >
        <Globe className="w-3 h-3" />
        <span>{i18n.labels[currentLocale]}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-black border border-neutral-800 shadow-2xl z-50 py-2"
            >
              {i18n.locales.map((locale) => (
                <NextLink
                  key={locale}
                  href={redirectedPathname(locale)}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-neutral-900 transition-colors ${
                    currentLocale === locale ? 'text-white font-bold' : 'text-neutral-500'
                  }`}
                >
                  {i18n.labels[locale]}
                </NextLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
