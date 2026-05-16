import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateApiKey, hasScope } from '@/lib/cms/api-keys';
import { createPost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';
import { getDefaultLocale, getSiteOrigin } from '@/lib/site-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PostItemSchema = z.object({
  title:             z.string().min(3).max(500),
  slug:              z.string().regex(/^[a-z0-9-]+$/).optional(),
  excerpt:           z.string().min(10).max(1000),
  content_markdown:  z.string().min(20),
  category:          z.string().optional(),
  tags:              z.array(z.string()).optional(),
  cover_image_url:   z.string().optional(),
  cover_image_alt:   z.string().optional(),
  seo_title:         z.string().max(200).optional(),
  meta_description:  z.string().max(400).optional(),
  featured:          z.boolean().optional().default(false),
  status:            z.enum(['draft', 'review', 'scheduled', 'published']).optional().default('draft'),
  author_name:       z.string().optional(),
  source_type:       z.enum(['ai_agent', 'import', 'manual']).optional().default('ai_agent'),
  source_reference:  z.string().optional(),
  ai_prompt_version: z.string().optional(),
});

const BulkSchema = z.object({
  collection: z.string().optional(),
  posts:      z.array(PostItemSchema).min(1).max(100),
});

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const keyRow = validateApiKey(auth.slice(7).trim());
  if (!keyRow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasScope(keyRow, 'write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const isTrustedSource = hasScope(keyRow, 'auto_publish');

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

  const parsed = BulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }

  initDB();

  const { collection, posts } = parsed.data;
  const results: { index: number; title: string; id?: number; slug?: string; error?: string }[] = [];
  const createdIds: number[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i];
    try {
      let effectiveStatus: string = item.status ?? 'draft';
      if (isTrustedSource) effectiveStatus = 'published';
      else if (effectiveStatus === 'published' && !hasScope(keyRow, 'publish')) effectiveStatus = 'draft';

      const post = createPost({
        title:           item.title,
        slug:            item.slug,
        excerpt:         item.excerpt,
        contentMarkdown: item.content_markdown,
        categoryName:    item.category,
        tags:            item.tags,
        coverImageUrl:   item.cover_image_url,
        coverImageAlt:   item.cover_image_alt,
        seoTitle:        item.seo_title,
        metaDescription: item.meta_description,
        featured:        item.featured,
        status:          effectiveStatus as any,
        authorName:      item.author_name,
        sourceType:      item.source_type,
        sourceReference: item.source_reference ?? collection,
        aiPromptVersion: item.ai_prompt_version,
      }, 'ai_agent', keyRow.id.toString());

      createdIds.push(post.id);
      results.push({ index: i, title: item.title, id: post.id, slug: post.slug });
      successCount++;
    } catch (err: unknown) {
      failCount++;
      results.push({ index: i, title: item.title, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  const baseUrl = getSiteOrigin(req.nextUrl.origin);
  const locale = getDefaultLocale();

  return NextResponse.json({
    collection,
    auto_published: isTrustedSource,
    total:       posts.length,
    success:     successCount,
    failed:      failCount,
    created_ids: createdIds,
    results,
    admin_import_url: `${baseUrl}/${locale}/admin/import`,
  }, { status: 207 });
}
