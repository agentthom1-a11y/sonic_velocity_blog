import type { Metadata } from 'next';
import { Link } from '@/components/Link';
import { initDB } from '@/lib/db';
import { listPublishedPosts } from '@/lib/cms/posts';
import { listCategories } from '@/lib/cms/categories';
import { SITE_CONFIG } from '@/blogData';
import { ArrowRight, Terminal } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { i18n, Locale } from '@/lib/i18n-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';
  
  return {
    title: `${dict.common.transmissions} | ${SITE_CONFIG.brand}`,
    description: `Browse all transmissions and signals from ${SITE_CONFIG.brand} regarding AI audio and remix culture.`,
    alternates: {
      canonical: `${baseUrl}/${locale}/transmissions`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `${baseUrl}/${l}/transmissions`])
      ),
    },
    openGraph: {
      title: `${dict.common.transmissions} | ${SITE_CONFIG.brand}`,
      description: dict.home.heroSubtitle,
      type: 'website',
      url: `${baseUrl}/${locale}/transmissions`,
    },
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function TransmissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  const dict = await getDictionary(locale);
  
  initDB();
  const categories = listCategories();

  // Get published posts with optional search
  const allPosts = listPublishedPosts({ limit: 100, locale, search: q });
  const featured = allPosts.filter(p => p.featured === 1);
  const latest   = allPosts.filter(p => p.featured !== 1);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${dict.common.transmissions} | ${SITE_CONFIG.brand}`,
    description: dict.home.heroSubtitle,
    url: `${baseUrl}/${locale}/transmissions`,
    hasPart: allPosts.map(post => ({
      '@type': 'TechArticle',
      headline: post.title,
      url: `${baseUrl}/${locale}/transmissions/${post.slug}`
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-12 text-neutral-500 hover:text-white transition-colors">
        ← {dict.common.brand} // Base Console
      </Link>

      <header className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-neutral-900 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-6">
              <Terminal className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                {dict.common.transmissions} // {SITE_CONFIG.brand}
              </span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 italic">
              {dict.common.transmissions}
            </h1>
            <p className="font-mono text-xs md:text-sm text-neutral-500 uppercase tracking-widest leading-relaxed">
              {dict.home.heroSubtitle}
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <form action={`/transmissions`} method="GET" className="relative group">
               <input 
                 type="text" 
                 name="q"
                 defaultValue={q}
                 placeholder="Search_Archive..." 
                 className="w-full md:w-80 bg-neutral-950 border border-neutral-900 py-3 pl-12 pr-6 text-[11px] font-mono text-white focus:outline-none focus:border-neutral-700 transition-all uppercase tracking-widest"
               />
               <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
                 <Terminal className="w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
               </button>
             </form>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto py-6 border-b border-neutral-900/50">
          <Link
            href="/transmissions"
            className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest transition-all rounded-sm whitespace-nowrap text-neutral-500 hover:text-white hover:bg-neutral-900"
          >
            All
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/transmissions/category/${cat.slug}`}
              className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest transition-all rounded-sm whitespace-nowrap text-neutral-500 hover:text-white hover:bg-neutral-900"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Featured Posts */}
      {featured.length > 0 && (
        <section className="mb-20">
          <p className="text-[9px] font-mono text-neutral-700 uppercase tracking-[0.5em] mb-8">
            ★ Featured {dict.common.transmissions}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.slice(0, 2).map((post, i) => (
              <Link
                key={post.id}
                href={`/transmissions/${post.slug}`}
                className={`group border border-neutral-800 bg-neutral-950/30 overflow-hidden hover:border-neutral-600 transition-all ${i === 0 ? 'md:col-span-2' : ''}`}
              >
                {post.coverImageUrl && (
                  <div className={`overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ${i === 0 ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                    <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-2 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest">{post.categoryName || 'Uncategorized'}</span>
                    <span className="text-[9px] font-mono text-neutral-600">{post.publishedAt?.slice(0, 10)}</span>
                    <span className="text-[8px] font-mono text-neutral-700">★ Featured</span>
                  </div>
                  <h2 className={`font-black text-white uppercase tracking-tighter mb-4 group-hover:text-white transition-colors leading-tight ${i === 0 ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>
                    {post.title}
                  </h2>
                  <p className="text-sm text-neutral-500 font-mono leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-6 text-[10px] font-bold text-white uppercase tracking-widest">
                    {dict.common.readMore} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts Grid */}
      {latest.length > 0 && (
        <section>
          <p className="text-[9px] font-mono text-neutral-700 uppercase tracking-[0.5em] mb-8">
            Latest {dict.common.transmissions} — {latest.length} signals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latest.map(post => (
              <Link
                key={post.id}
                href={`/transmissions/${post.slug}`}
                className="group flex flex-col h-full border border-neutral-900 bg-neutral-950/20 hover:border-neutral-700 transition-all overflow-hidden"
              >
                {post.coverImageUrl && (
                  <div className="aspect-[16/10] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative">
                    <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[8px] font-mono text-white uppercase tracking-widest">
                        {post.categoryName}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                    <span>{post.publishedAt?.slice(0, 10)}</span>
                    <span className="w-1 h-px bg-neutral-800" />
                    <span>{post.authorName || 'Sonic Velocity'}</span>
                    {post.readingTime && <span className="text-neutral-700">{post.readingTime}</span>}
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-white transition-colors leading-tight">{post.title}</h3>
                  <p className="text-xs text-neutral-500 font-mono leading-relaxed mb-8 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-900/50 mt-auto">
                    <span className="text-[8px] font-mono text-neutral-700 uppercase">{post.sourceType === 'ai_agent' ? 'AI' : 'editorial'}</span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group/more">
                      {dict.common.readMore} <ArrowRight className="w-3.5 h-3.5 group-hover/more:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {allPosts.length === 0 && (
        <div className="py-40 text-center border border-dashed border-neutral-900">
          <p className="text-sm font-mono text-neutral-600 uppercase tracking-[0.3em]">No transmissions published yet.</p>
          <p className="text-[10px] font-mono text-neutral-800 uppercase tracking-widest mt-4">Check back soon or visit /admin to publish content.</p>
        </div>
      )}
    </div>
  );
}
