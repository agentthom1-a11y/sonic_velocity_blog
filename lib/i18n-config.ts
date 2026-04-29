export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'ja', 'zh', 'id', 'jaksel'],
  labels: {
    en: 'English',
    fr: 'Français',
    ja: '日本語',
    zh: '中文',
    id: 'Bahasa Indonesia',
    jaksel: 'Jaksel',
  },
  directions: {
    en: 'ltr',
    fr: 'ltr',
    ja: 'ltr',
    zh: 'ltr',
    id: 'ltr',
  },
} as const;

export type Locale = (typeof i18n)['locales'][number];
