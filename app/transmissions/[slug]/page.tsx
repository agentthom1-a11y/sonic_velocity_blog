import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { initDB } from '@/lib/db';
import { getPublishedPost, listPublishedPosts } from '@/lib/cms/posts';
import { SITE_CONFIG } from '@/blogData';
import { ArrowLeft, ArrowRight, Clock, User, Calendar, Share2, Activity, Link as LinkIcon } from 'lucide-react';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  initDB();
  const post = getPublishedPost(slug);
  if (!post) return { title: 'Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const canonical = post.canonicalUrl || `${baseUrl}/transmissions/${post.slug}`;

  return {
    title:       post.seoTitle || `${post.title} | ${SITE_CONFIG.brand}`,
    description: post.metaDescription || post.excerpt || undefined,
    alternates:  { canonical },
    robots:      { index: true, follow: true },
    openGraph: {
      title:       post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type:        'article',
      publishedTime: post.publishedAt || undefined,
      images:      post.ogImageUrl || post.coverImageUrl ? [{ url: post.ogImageUrl || post.coverImageUrl! }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images:      post.ogImageUrl || post.coverImageUrl ? [post.ogImageUrl || post.coverImageUrl!] : [],
    },
  };
}

function generateHeadingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderMarkdown(content: string) {
  const lines = content.split('\n').filter(l => l.trim());
  let paragraphCount = 0;
  let h2Idx = 0;
  let h3Idx = 0;

  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      h3Idx++;
      const text = trimmed.replace(/^### /, '');
      const id = generateHeadingId(text);
      return (
        <div key={i} className="group/anchor flex items-center gap-4 mt-20 mb-10 scroll-mt-32" id={id}>
          <h3 className="font-sans text-3xl md:text-5xl font-bold text-white uppercase tracking-tight flex items-center gap-4 italic opacity-90">
            <span className="text-neutral-800 font-mono text-base tracking-normal font-normal">/{h3Idx < 10 ? `0${h3Idx}` : h3Idx}</span>
            {text}
          </h3>
        </div>
      );
    }

    if (trimmed.startsWith('## ')) {
      h2Idx++;
      const text = trimmed.replace(/^## /, '');
      const id = generateHeadingId(text);
      return (
        <div key={i} className="mt-32 md:mt-48 mb-12 group/h2">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-neutral-800 transition-all group-hover/h2:w-16 group-hover/h2:bg-white" />
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em]">Artifact_{h2Idx < 10 ? `0${h2Idx}` : h2Idx}</span>
          </div>
          <div className="flex items-center gap-6 group/anchor scroll-mt-32" id={id}>
            <h2 className="font-sans text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] italic">{text}</h2>
          </div>
        </div>
      );
    }

    if (trimmed.startsWith('# ')) {
      const text = trimmed.replace(/^# /, '');
      return <h1 key={i} className="text-4xl font-black text-white uppercase tracking-tighter mb-8 italic">{text}</h1>;
    }

    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i} className="font-sans text-4xl md:text-6xl font-black text-white italic border-y border-neutral-900 py-24 my-24 text-center uppercase tracking-tighter leading-[0.9] relative">
          <span className="relative z-10 block px-4">{trimmed.replace(/^> /, '')}</span>
        </blockquote>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={i} className="flex gap-8 items-start pl-10 py-6 border-l-2 border-neutral-800 my-12 group hover:border-white transition-colors">
          <div className="w-2 h-2 mt-3.5 bg-neutral-800 rounded-full group-hover:bg-white transition-colors shrink-0" />
          <p className="font-sans text-xl md:text-2xl leading-relaxed text-neutral-400 group-hover:text-neutral-200 transition-colors italic font-light">
            {trimmed.replace(/^[-*] /, '')}
          </p>
        </div>
      );
    }

    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return (
        <p key={i} className="font-sans text-xl md:text-2xl text-white font-black uppercase tracking-tight mb-6">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    }

    const isFirst = paragraphCount === 0;
    paragraphCount++;
    return (
      <p key={i} className={`font-sans text-xl md:text-[1.5rem] leading-[1.65] text-neutral-400 mb-14 tracking-tight font-light text-pretty ${
        isFirst ? 'first-letter:text-8xl first-letter:font-black first-letter:text-white first-letter:mr-4 first-letter:float-left first-letter:leading-[0.75] first-letter:pt-4' : ''
      }`}>
        {trimmed}
      </p>
    );
  });
}

export default async function TransmissionArticlePage({ params }: Props) {
  const { slug } = await params;
  initDB();
  const post = getPublishedPost(slug);
  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = `${baseUrl}/transmissions/${post.slug}`;

  // Related posts
  const allPosts = listPublishedPosts({ limit: 50 });
  const related = allPosts
    .filter(p => p.id !== post.id)
    .map(p => ({
      post: p,
      score: (p.tags.filter(t => post.tags.includes(t)).length * 10) + (p.categoryName === post.category?.name ? 1 : 0),
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(p => p.post);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImageUrl || undefined,
    author: { '@type': 'Organization', name: post.author?.name || SITE_CONFIG.defaultAuthor },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.brand,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    datePublished: post.publishedAt,
    dateModified:  post.updatedAt,
    description:   post.metaDescription || post.excerpt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
    articleSection: post.category?.name,
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
        <Link
          href="/transmissions"
          className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-16 text-neutral-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Transmissions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-40 space-y-10">
              <div className="space-y-4">
                <h5 className="text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-900 pb-2">Transmission Log</h5>
                <div className="space-y-3 font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 italic">Auth</span>
                    <span>{post.author?.name || SITE_CONFIG.defaultAuthor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 italic">Date</span>
                    <span>{post.publishedAt?.slice(0, 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 italic">Read</span>
                    <span>{post.readingTime || '~5 min'}</span>
                  </div>
                  {post.category && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600 italic">Category</span>
                      <Link href={`/transmissions/category/${post.category.slug}`} className="hover:text-white transition-colors">{post.category.name}</Link>
                    </div>
                  )}
                  {post.sourceType === 'ai_agent' && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600 italic">Source</span>
                      <span className="text-cyan-500">AI Generated</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-900 pb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono px-2 py-1 border border-neutral-800 text-neutral-500 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main article body */}
          <div className="lg:col-span-9 max-w-3xl">
            <header className="mb-16">
              {post.category && (
                <Link href={`/transmissions/category/${post.category.slug}`} className="inline-flex items-center gap-3 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:bg-cyan-400 transition-colors">
                  {post.category.name}
                </Link>
              )}
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 leading-[0.9] italic">
                {post.title}
              </h1>
              {post.coverImageUrl && (
                <div className="aspect-[21/9] overflow-hidden border border-neutral-900 mb-12">
                  <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover grayscale opacity-80" />
                </div>
              )}
              <p className="font-mono text-xl md:text-3xl text-neutral-400 leading-[1.4] italic border-l-4 border-neutral-800 pl-10 mb-8 tracking-tight">
                {post.excerpt}
              </p>
            </header>

            <div className="selection:bg-white selection:text-black article-body">
              {renderMarkdown(post.contentMarkdown || '')}
            </div>

            {/* Signal Insight block */}
            <div className="mt-20 p-12 bg-white text-black relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-black" />
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="shrink-0">
                  <h5 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] mb-4">Signal Insight</h5>
                  <Activity className="w-8 h-8" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-6 leading-none">Why This Matters</h4>
                  <p className="text-sm font-mono leading-relaxed opacity-80 uppercase tracking-wider">
                    In the hyper-accelerated Indonesian youth market, sounds move faster than infrastructure. This transmission represents a fundamental shift in how{' '}
                    {post.category?.name === 'Engineering' ? 'machine intelligence' : 'cultural signals'} are processed and remixed by the next generation of mobile-first creators.
                  </p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="mt-16 pt-10 border-t border-neutral-900 flex gap-6 items-center">
              <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.3em]">Share:</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest">X</a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest">LinkedIn</a>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-20 pt-16 border-t border-neutral-900">
                <h3 className="text-[11px] font-mono font-black text-neutral-600 uppercase tracking-[0.4em] mb-10">Related Transmissions</h3>
                <div className="space-y-6">
                  {related.map(p => (
                    <Link key={p.id} href={`/transmissions/${p.slug}`} className="group flex gap-6 items-start border border-neutral-900 p-5 hover:border-neutral-700 transition-all">
                      {p.coverImageUrl && (
                        <div className="w-24 h-16 shrink-0 overflow-hidden">
                          <img src={p.coverImageUrl} alt="" className="w-full h-full object-cover grayscale" />
                        </div>
                      )}
                      <div>
                        <p className="text-[8px] text-neutral-700 uppercase tracking-widest mb-2">{p.categoryName}</p>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">{p.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
