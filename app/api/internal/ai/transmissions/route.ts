import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateApiKey, hasScope } from '@/lib/cms/api-keys';
import { createPost, listPublishedPosts, adminListPosts, slugifyPost, uniqueSlug, autoPublishPost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';
import { getDefaultLocale, getSiteOrigin } from '@/lib/site-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── Schema Validation ─────────────────────────────────────────────────────────
const TransmissionSchema = z.object({
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
  canonical_url:     z.string().url().optional(),
  og_image_url:      z.string().optional(),
  featured:          z.boolean().optional().default(false),
  status:            z.enum(['draft', 'review', 'scheduled', 'published']).optional().default('draft'),
  scheduled_at:      z.string().datetime().optional(),
  author_name:       z.string().optional(),
  source_type:       z.enum(['ai_agent', 'import', 'manual']).optional().default('ai_agent'),
  source_reference:  z.string().optional(),
  ai_summary:        z.string().optional(),
  ai_prompt_version: z.string().optional(),
});

// ── Auth Helper ────────────────────────────────────────────────────────────────
function authenticate(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  const raw = auth.slice(7).trim();
  return validateApiKey(raw);
}

// ── POST /api/internal/ai/transmissions ───────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth
  const keyRow = authenticate(req);
  if (!keyRow) {
    return NextResponse.json({ error: 'Unauthorized', code: 'INVALID_API_KEY' }, { status: 401 });
  }
  if (!hasScope(keyRow, 'write')) {
    return NextResponse.json({ error: 'Forbidden', code: 'MISSING_SCOPE_WRITE' }, { status: 403 });
  }

  // Parse body
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

  const parsed = TransmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    }, { status: 422 });
  }

  const data = parsed.data;

  // Determine effective status: auto_publish scope overrides everything
  const isTrustedSource = hasScope(keyRow, 'auto_publish');
  let effectiveStatus = data.status ?? 'draft';
  if (isTrustedSource) effectiveStatus = 'published';
  else if (effectiveStatus === 'published' && !hasScope(keyRow, 'publish')) {
    effectiveStatus = 'review'; // downgrade if no publish scope
  }

  initDB();

  // Create the post
  const post = createPost({
    title:           data.title,
    slug:            data.slug,
    excerpt:         data.excerpt,
    contentMarkdown: data.content_markdown,
    categoryName:    data.category,
    tags:            data.tags,
    coverImageUrl:   data.cover_image_url,
    coverImageAlt:   data.cover_image_alt,
    seoTitle:        data.seo_title,
    metaDescription: data.meta_description,
    canonicalUrl:    data.canonical_url,
    ogImageUrl:      data.og_image_url,
    featured:        data.featured,
    status:          effectiveStatus as any,
    scheduledAt:     data.scheduled_at,
    authorName:      data.author_name,
    sourceType:      data.source_type,
    sourceReference: data.source_reference,
    aiSummary:       data.ai_summary,
    aiPromptVersion: data.ai_prompt_version,
  }, 'ai_agent', keyRow.id.toString());

  const baseUrl = getSiteOrigin(req.nextUrl.origin);
  const locale = getDefaultLocale();

  return NextResponse.json({
    id:          post.id,
    slug:        post.slug,
    status:      post.status,
    auto_published: isTrustedSource,
    published_at: post.publishedAt,
    preview_url:  `${baseUrl}/${locale}/transmissions/${post.slug}`,
    admin_url:    `${baseUrl}/${locale}/admin/transmissions/${post.id}`,
  }, { status: 201 });
}

// ── GET /api/internal/ai/transmissions?status=draft ───────────────────────────
export async function GET(req: NextRequest) {
  const keyRow = authenticate(req);
  if (!keyRow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasScope(keyRow, 'write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? undefined;
  const limit  = parseInt(searchParams.get('limit') ?? '20');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  initDB();
  const posts = adminListPosts({ status, limit, offset });

  return NextResponse.json({ posts, meta: { limit, offset, count: posts.length } });
}
