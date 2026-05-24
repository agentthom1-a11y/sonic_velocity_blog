import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── CORS Headers ──────────────────────────────────────────────────────────────
function corsHeaders(origin?: string | null) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get('origin')),
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    service: 'sonicvelo-blog',
    time: new Date().toISOString(),
  }, {
    headers: corsHeaders(req.headers.get('origin')),
  });
}
