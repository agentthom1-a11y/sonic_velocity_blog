import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/components/Link';
import { initDB } from '@/lib/db';
import { listPublishedPosts } from '@/lib/cms/posts';
import { getCategoryBySlug, listCategories } from '@/lib/cms/categories';
import { SITE_CONFIG } from '@/blogData';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Locale, i18n } from '@/lib/i18n-config';

export const revalidate = 60;

interface Props { params: Promise<{ slug: string; locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  initDB();
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: 'Not Found' };
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';

  return {
    title: `${cat.name} — ${SITE_CONFIG.brand} Transmissions`,
    description: cat.description || `${cat.name} transmissions from Sonic Velocity`,
    alternates: {
      canonical: `${baseUrl}/${locale}/transmissions/category/${slug}`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `${baseUrl}/${l}/transmissions/category/${slug}`])
      ),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params;
  initDB();
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const posts = listPublishedPosts({ categorySlug: slug, locale, limit: 50 });
  const allCategories = listCategories();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/transmissions" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-12 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> All Transmissions
      </Link>

      <header className="mb-16 border-b border-neutral-900 pb-12">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          {cat.name}
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic">{cat.name}</h1>
        {cat.description && <p className="font-mono text-sm text-neutral-500 max-w-xl">{cat.description}</p>}
        <p className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest mt-4">{posts.length} transmission{posts.length !== 1 ? 's' : ''}</p>
      </header>

      {/* Other categories */}
      <div className="flex gap-2 mb-12 flex-wrap">
        <Link href="/transmissions" className="px-4 py-2 text-[9px] font-mono uppercase tracking-widest text-neutral-600 hover:text-white border border-neutral-900 hover:border-neutral-600 transition-all">All</Link>
        {allCategories.map(c => (
          <Link key={c.slug} href={`/transmissions/category/${c.slug}`}
            className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest border transition-all ${c.slug === slug ? 'bg-white text-black border-white' : 'text-neutral-600 hover:text-white border-neutral-900 hover:border-neutral-600'}`}
          >{c.name}</Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map(post => (
          <Link key={post.id} href={`/transmissions/${post.slug}`}
            className="group flex flex-col h-full border border-neutral-900 bg-neutral-950/20 hover:border-neutral-700 transition-all overflow-hidden"
          >
            {post.coverImageUrl && (
              <div className="aspect-[16/10] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            )}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-4 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                <span>{post.publishedAt?.slice(0, 10)}</span>
                {post.readingTime && <span className="text-neutral-700">{post.readingTime}</span>}
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4 leading-tight">{post.title}</h2>
              <p className="text-xs text-neutral-500 font-mono leading-relaxed mb-6 flex-1">{post.excerpt}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-neutral-900/50 text-[10px] font-bold text-white uppercase tracking-widest mt-auto">
                Read Transmission <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-32 text-center border border-dashed border-neutral-900">
          <p className="text-sm font-mono text-neutral-600 uppercase tracking-widest">No transmissions in {cat.name} yet.</p>
        </div>
      )}
    </div>
  );
}
