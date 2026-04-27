import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, hasScope } from '@/lib/cms/api-keys';
import { schedulePost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';
import { z } from 'zod';

const Schema = z.object({
  scheduled_at: z.string().datetime(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const keyRow = validateApiKey(auth.slice(7).trim());
  if (!keyRow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasScope(keyRow, 'schedule')) return NextResponse.json({ error: 'Forbidden: schedule scope required' }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'scheduled_at (ISO 8601) is required' }, { status: 422 });

  const { id } = await params;
  initDB();
  const post = schedulePost(Number(id), parsed.data.scheduled_at, 'ai_agent', keyRow.id.toString());
  return NextResponse.json({ id: post.id, slug: post.slug, status: post.status, scheduled_at: post.scheduledAt });
}
