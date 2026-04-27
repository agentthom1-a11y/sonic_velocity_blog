import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/app/api/admin/auth/route';
import { createApiKey, listApiKeys, revokeApiKey, ApiScope } from '@/lib/cms/api-keys';
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
  return NextResponse.json({ keys: listApiKeys() });
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, scopes, expires_at } = await req.json();
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  initDB();
  const { raw, row } = createApiKey(name, scopes || ['write'], expires_at);
  return NextResponse.json({ raw_key: raw, key: { id: row.id, name: row.name, status: row.status, scopes: row.scopes } }, { status: 201 });
}
