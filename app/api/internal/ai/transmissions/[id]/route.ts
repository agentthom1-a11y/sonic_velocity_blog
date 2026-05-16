import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, hasScope } from '@/lib/cms/api-keys';
import { adminGetPost, updatePost, publishPost, schedulePost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authenticate(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  return validateApiKey(auth.slice(7).trim());
}

// ── GET /api/internal/ai/transmissions/[id] ───────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const keyRow = authenticate(req);
  if (!keyRow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  initDB();
  const post = adminGetPost(Number(id));
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ post });
}

const PatchSchema = z.object({
  title:             z.string().min(3).optional(),
  excerpt:           z.string().optional(),
  content_markdown:  z.string().optional(),
  category:          z.string().optional(),
  tags:              z.array(z.string()).optional(),
  cover_image_url:   z.string().optional(),
  cover_image_alt:   z.string().optional(),
  seo_title:         z.string().optional(),
  meta_description:  z.string().optional(),
  featured:          z.boolean().optional(),
  status:            z.enum(['draft', 'review', 'scheduled', 'published', 'archived']).optional(),
  scheduled_at:      z.string().datetime().optional(),
  ai_summary:        z.string().optional(),
  ai_prompt_version: z.string().optional(),
});

// ── PATCH /api/internal/ai/transmissions/[id] ─────────────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const keyRow = authenticate(req);
  if (!keyRow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasScope(keyRow, 'write')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const numId = Number(id);

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }

  initDB();
  const data = parsed.data;

  // Scope checks for status escalation
  if (data.status === 'published' && !hasScope(keyRow, 'publish') && !hasScope(keyRow, 'auto_publish')) {
    return NextResponse.json({ error: 'Forbidden: publish scope required' }, { status: 403 });
  }

  const post = updatePost({
    id:              numId,
    title:           data.title,
    excerpt:         data.excerpt,
    contentMarkdown: data.content_markdown,
    categoryName:    data.category,
    tags:            data.tags,
    coverImageUrl:   data.cover_image_url,
    coverImageAlt:   data.cover_image_alt,
    seoTitle:        data.seo_title,
    metaDescription: data.meta_description,
    featured:        data.featured,
    status:          data.status as any,
    scheduledAt:     data.scheduled_at,
    aiSummary:       data.ai_summary,
    aiPromptVersion: data.ai_prompt_version,
  }, 'ai_agent', keyRow.id.toString());

  return NextResponse.json({ post });
}
