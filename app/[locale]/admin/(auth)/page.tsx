import type { Metadata } from 'next';
import { initDB } from '@/lib/db';
import { getPostStats, adminListPosts } from '@/lib/cms/posts';
import { seedDefaultCategories } from '@/lib/cms/categories';
import { Link } from '@/components/Link';
import { Locale } from '@/lib/i18n-config';

export const metadata: Metadata = { title: 'Dashboard' };

const STATUS_COLORS: Record<string, string> = {
  draft:     'text-neutral-500 border-neutral-800',
  review:    'text-yellow-500 border-yellow-900',
  scheduled: 'text-blue-400 border-blue-900',
  published: 'text-green-400 border-green-900',
  archived:  'text-neutral-700 border-neutral-900',
};

export default async function AdminDashboard({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  // Bootstrap DB on first visit
  initDB();
  seedDefaultCategories();

  const stats = getPostStats();
  const recent = adminListPosts({ limit: 8 });

  const statCards = [
    { label: 'Total',     value: stats.total,     color: 'text-white' },
    { label: 'Published', value: stats.published, color: 'text-green-400' },
    { label: 'Draft',     value: stats.draft,     color: 'text-neutral-400' },
    { label: 'Review',    value: stats.review,    color: 'text-yellow-500' },
    { label: 'Scheduled', value: stats.scheduled, color: 'text-blue-400' },
    { label: 'AI Ingested', value: stats.ai,      color: 'text-cyan-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 border-b border-neutral-900 pb-8 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-neutral-700 uppercase tracking-[0.5em] mb-2">Sonic Velocity CMS</p>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Dashboard</h1>
        </div>
        <Link
          href="/admin/transmissions/new"
          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 transition-colors"
        >
          + New Transmission
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {statCards.map(s => (
          <div key={s.label} className="border border-neutral-900 bg-neutral-950 p-6 text-center">
            <p className={`text-4xl font-black ${s.color} mb-2`}>{s.value}</p>
            <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-700">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { href: '/admin/transmissions?status=draft',     label: 'Review Drafts',    color: 'border-neutral-800' },
          { href: '/admin/transmissions?status=review',    label: 'Pending Review',   color: 'border-yellow-900' },
          { href: '/admin/import',                         label: 'Bulk Import',      color: 'border-neutral-800' },
          { href: '/admin/settings/api-keys',              label: 'Manage API Keys',  color: 'border-cyan-900' },
        ].map(l => (
          <Link key={l.href} href={l.href} className={`border ${l.color} bg-neutral-950 p-4 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-600 transition-all block`}>
            {l.label} →
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-6 border-b border-neutral-900 pb-4">
          Recent Transmissions
        </h2>
        <div className="divide-y divide-neutral-900">
          {recent.map(post => (
            <div key={post.id} className="py-4 flex items-center gap-6 hover:bg-neutral-950 px-2 transition-colors group">
              <span className="text-[9px] text-neutral-700 font-mono w-8 shrink-0">#{post.id}</span>
              <Link href={`/admin/transmissions/${post.id}`} className="flex-1 text-sm text-white font-bold hover:text-cyan-400 transition-colors truncate">
                {post.title}
              </Link>
              <span className="text-[8px] text-neutral-600 shrink-0 hidden md:block">{post.categoryName || '—'}</span>
              <span className={`text-[8px] uppercase tracking-widest border px-2 py-1 shrink-0 ${STATUS_COLORS[post.status] || ''}`}>
                {post.status}
              </span>
              <span className={`text-[8px] uppercase tracking-widest shrink-0 hidden lg:block ${post.sourceType === 'ai_agent' ? 'text-cyan-500' : 'text-neutral-700'}`}>
                {post.sourceType === 'ai_agent' ? 'AI' : 'manual'}
              </span>
              <span className="text-[8px] text-neutral-700 shrink-0 hidden xl:block font-mono">
                {post.updatedAt?.slice(0, 10)}
              </span>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/transmissions/${post.id}`} className="text-[8px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors">
                  Edit
                </Link>
                {post.status === 'published' && (
                  <a href={`/transmissions/${post.slug}`} target="_blank" className="text-[8px] uppercase tracking-widest text-neutral-600 hover:text-cyan-400 transition-colors">
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/admin/transmissions" className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 hover:text-white transition-colors">
            View All Transmissions →
          </Link>
        </div>
      </div>
    </div>
  );
}
