export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'id', 'jaksel', 'zh', 'ja', 'fr'],
  labels: {
    en: 'English',
    id: 'Indonesia',
    jaksel: 'Jaksel',
    zh: '简体中文',
    ja: '日本語',
    fr: 'Français',
  },
  directions: {
    en: 'ltr',
    id: 'ltr',
    jaksel: 'ltr',
    zh: 'ltr',
    ja: 'ltr',
    fr: 'ltr',
  },
} as const;

export type Locale = (typeof i18n)['locales'][number];
