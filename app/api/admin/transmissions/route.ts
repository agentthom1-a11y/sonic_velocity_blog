import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/app/api/admin/auth/route';
import { adminListPosts, createPost, updatePost, archivePost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';
import { z } from 'zod';

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get('sv_admin')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function GET(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? undefined;
  const limit  = parseInt(searchParams.get('limit') ?? '50');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  initDB();
  const posts = adminListPosts({ status, limit, offset });
  return NextResponse.json({ posts });
}

const CreateSchema = z.object({
  title:           z.string().min(3),
  excerpt:         z.string().optional(),
  content_markdown: z.string().optional(),
  category:        z.string().optional(),
  tags:            z.array(z.string()).optional(),
  cover_image_url:  z.string().optional(),
  cover_image_alt:  z.string().optional(),
  seo_title:       z.string().optional(),
  meta_description: z.string().optional(),
  featured:        z.boolean().optional(),
  status:          z.enum(['draft', 'review', 'scheduled', 'published', 'archived']).optional(),
  scheduled_at:    z.string().optional(),
  author_name:     z.string().optional(),
});

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });

  initDB();
  const d = parsed.data;
  const post = createPost({
    title: d.title, excerpt: d.excerpt, contentMarkdown: d.content_markdown,
    categoryName: d.category, tags: d.tags, coverImageUrl: d.cover_image_url,
    coverImageAlt: d.cover_image_alt, seoTitle: d.seo_title, metaDescription: d.meta_description,
    featured: d.featured, status: d.status as any, scheduledAt: d.scheduled_at,
    authorName: d.author_name, sourceType: 'manual',
  }, 'admin_user', admin.email);

  return NextResponse.json({ post }, { status: 201 });
}
