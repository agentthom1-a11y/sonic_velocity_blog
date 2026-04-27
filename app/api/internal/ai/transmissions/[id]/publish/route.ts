import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, hasScope } from '@/lib/cms/api-keys';
import { publishPost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const keyRow = validateApiKey(auth.slice(7).trim());
  if (!keyRow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!hasScope(keyRow, 'publish') && !hasScope(keyRow, 'auto_publish')) {
    return NextResponse.json({ error: 'Forbidden: publish scope required' }, { status: 403 });
  }

  const { id } = await params;
  initDB();

  try {
    const post = publishPost(Number(id), 'ai_agent', keyRow.id.toString());
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    return NextResponse.json({
      id: post.id, slug: post.slug, status: post.status,
      published_at: post.publishedAt,
      url: `${baseUrl}/transmissions/${post.slug}`,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}
