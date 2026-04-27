import { MetadataRoute } from 'next';
import { initDB } from '@/lib/db';
import { listPublishedPosts } from '@/lib/cms/posts';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                    lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/transmissions`, lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/blog`,          lastModified: new Date(), changeFrequency: 'daily',  priority: 0.8 },
    { url: `${baseUrl}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/pricing`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  let postPages: MetadataRoute.Sitemap = [];
  try {
    initDB();
    const posts = listPublishedPosts({ limit: 1000 });
    postPages = posts.map(post => ({
      url:             `${baseUrl}/transmissions/${post.slug}`,
      lastModified:    new Date(post.publishedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority:        post.featured ? 0.9 : 0.7,
    }));
  } catch {
    // DB may not be initialized yet on first build
  }

  return [...staticPages, ...postPages];
}
