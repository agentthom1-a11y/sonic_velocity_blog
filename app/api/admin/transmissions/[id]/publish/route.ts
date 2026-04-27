import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/app/api/admin/auth/route';
import { publishPost } from '@/lib/cms/posts';
import { initDB } from '@/lib/db';

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get('sv_admin')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  initDB();
  const post = publishPost(Number(id), 'admin_user', admin.email);
  return NextResponse.json({ id: post.id, slug: post.slug, status: post.status, published_at: post.publishedAt });
}
