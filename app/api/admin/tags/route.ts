import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/app/api/admin/auth/route';
import { upsertTags, listTags } from '@/lib/cms/tags';
import { initDB } from '@/lib/db';

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get('sv_admin')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  initDB();
  return NextResponse.json({ tags: listTags() });
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  initDB();
  const [tag] = upsertTags([name]);
  return NextResponse.json({ tag }, { status: 201 });
}
