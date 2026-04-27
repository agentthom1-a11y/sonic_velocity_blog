import type { Metadata } from 'next';
import { initDB } from '@/lib/db';
import { adminListPosts } from '@/lib/cms/posts';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Transmissions' };

const STATUS_COLORS: Record<string, string> = {
  draft:     'text-neutral-500 border-neutral-800',
  review:    'text-yellow-500 border-yellow-900',
  scheduled: 'text-blue-400 border-blue-900',
  published: 'text-green-400 border-green-900',
  archived:  'text-neutral-700 border-neutral-900',
};

export default function AdminTransmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  initDB();

  // In Next.js 16, searchParams is async
  // We'll handle filtering client-side via URL since this is a server component
  const posts = adminListPosts({ limit: 200 });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 border-b border-neutral-900 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-neutral-700 uppercase tracking-[0.5em] mb-2">Editorial System</p>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">All Transmissions</h1>
          <p className="text-[9px] text-neutral-600 mt-2">{posts.length} total records</p>
        </div>
        <Link
          href="/admin/transmissions/new"
          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 transition-colors"
        >
          + New
        </Link>
      </div>

      {/* Status filter buttons (client JS via href query strings) */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'draft', 'review', 'scheduled', 'published', 'archived'].map(s => (
          <a
            key={s}
            href={s === 'all' ? '/admin/transmissions' : `/admin/transmissions?status=${s}`}
            className="px-4 py-2 text-[9px] uppercase tracking-widest border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-all"
          >
            {s}
          </a>
        ))}
      </div>

      <div className="border border-neutral-900 divide-y divide-neutral-900">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-[8px] uppercase tracking-[0.3em] text-neutral-700">
          <span className="col-span-1">#</span>
          <span className="col-span-4">Title</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1">Source</span>
          <span className="col-span-2">Updated</span>
          <span className="col-span-1">Actions</span>
        </div>

        {posts.length === 0 && (
          <div className="py-20 text-center text-[10px] text-neutral-700 uppercase tracking-widest">
            No transmissions found.
          </div>
        )}

        {posts.map(post => (
          <div key={post.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-neutral-950 transition-colors items-center">
            <span className="col-span-1 text-[9px] text-neutral-700">#{post.id}</span>
            <div className="col-span-4">
              <Link href={`/admin/transmissions/${post.id}`} className="text-sm font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2">
                {post.title}
              </Link>
              {post.featured ? <span className="text-[7px] text-amber-500 uppercase tracking-widest ml-2">★ featured</span> : null}
            </div>
            <span className="col-span-2 text-[9px] text-neutral-500">{post.categoryName || '—'}</span>
            <span className={`col-span-1 text-[8px] border px-2 py-1 uppercase tracking-widest inline-block ${STATUS_COLORS[post.status] || ''}`}>
              {post.status}
            </span>
            <span className={`col-span-1 text-[8px] uppercase ${post.sourceType === 'ai_agent' ? 'text-cyan-500' : 'text-neutral-700'}`}>
              {post.sourceType === 'ai_agent' ? 'AI' : 'manual'}
            </span>
            <span className="col-span-2 text-[9px] text-neutral-700 font-mono">{post.updatedAt?.slice(0, 16)}</span>
            <div className="col-span-1 flex gap-3">
              <Link href={`/admin/transmissions/${post.id}`} className="text-[8px] uppercase text-neutral-500 hover:text-white transition-colors">
                Edit
              </Link>
              {post.status === 'published' && (
                <a href={`/transmissions/${post.slug}`} target="_blank" className="text-[8px] uppercase text-neutral-500 hover:text-cyan-400 transition-colors">
                  View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
