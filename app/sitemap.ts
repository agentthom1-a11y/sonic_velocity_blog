import { MetadataRoute } from 'next';
import { initDB } from '@/lib/db';
import { listPublishedPosts } from '@/lib/cms/posts';
import { i18n } from '@/lib/i18n-config';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';

  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: 'transmissions', priority: 0.9, changeFrequency: 'daily' },
    { path: 'blog', priority: 0.8, changeFrequency: 'daily' },
    { path: 'about', priority: 0.5, changeFrequency: 'monthly' },
    { path: 'pricing', priority: 0.6, changeFrequency: 'monthly' },
  ];

  let posts: any[] = [];
  try {
    initDB();
    posts = listPublishedPosts({ limit: 1000 });
  } catch (e) {
    console.error('Sitemap DB error:', e);
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and each route
  for (const locale of i18n.locales) {
    const isDefault = locale === i18n.defaultLocale;
    const localePath = isDefault ? '' : `/${locale}`;

    // Static pages
    for (const route of staticRoutes) {
      const path = route.path ? `/${route.path}` : '';
      const url = `${baseUrl}${localePath}${path}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency as any,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [
              l,
              `${baseUrl}${l === i18n.defaultLocale ? '' : `/${l}`}${path}`
            ])
          )
        }
      });
    }

    // Dynamic post pages
    for (const post of posts) {
      const path = `/transmissions/${post.slug}`;
      const url = `${baseUrl}${localePath}${path}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(post.publishedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: post.featured ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [
              l,
              `${baseUrl}${l === i18n.defaultLocale ? '' : `/${l}`}${path}`
            ])
          )
        }
      });
    }
  }

  return sitemapEntries;
}
