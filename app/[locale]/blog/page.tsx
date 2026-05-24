'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Filter, Terminal, Activity, ArrowRight,
  User, Calendar, Clock, ChevronRight
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BLOG_POSTS, CATEGORIES, SITE_CONFIG } from '@/blogData';

function BlogListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('tag') || '');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const q = searchQuery.toLowerCase();
    const searchTarget = `${post.title} ${post.tags.join(' ')} ${post.category}`.toLowerCase();
    const matchesSearch = !searchQuery || searchTarget.includes(q);
    
    const matchesCategory = activeCategory === 'All' || 
      post.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-12 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Base Console
      </Link>

      <header className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-neutral-900 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-6">
              <Terminal className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Archives Access // {SITE_CONFIG.brand}</span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 italic">The Blog</h1>
            <p className="font-mono text-xs md:text-sm text-neutral-500 uppercase tracking-widest leading-relaxed">
              Transmissions from the frontier of AI audio synthesis & youth culture engineering.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search_Archive..." 
                 className="w-full md:w-80 bg-neutral-950 border border-neutral-900 py-3 pl-12 pr-6 text-[11px] font-mono text-white focus:outline-none focus:border-neutral-700 transition-all uppercase tracking-widest"
               />
             </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-6 border-b border-neutral-900/50">
           {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 text-[10px] font-mono uppercase tracking-widest transition-all rounded-sm whitespace-nowrap ${
                  activeCategory === cat ? 'bg-white text-black font-black' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {cat}
              </button>
           ))}
        </div>
      </header>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col h-full border border-neutral-900 bg-neutral-950/20 hover:border-neutral-700 transition-all overflow-hidden"
          >
            <div className="aspect-[16/10] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[8px] font-mono text-white uppercase tracking-widest">{post.category}</span>
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
               <div className="flex items-center gap-4 mb-4 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="w-1 h-px bg-neutral-800"></span>
                  <span>{post.author}</span>
               </div>
               <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-white transition-colors leading-tight">{post.title}</h3>
               <p className="text-xs text-neutral-500 font-mono leading-relaxed mb-8 flex-1">{post.excerpt}</p>
               <div className="flex items-center justify-between pt-6 border-t border-neutral-900/50 mt-auto">
                  <span className="text-[8px] font-mono text-neutral-700 uppercase">Archive_{post.id}</span>
                  <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group/more">
                    Read Transmission <ArrowRight className="w-3.5 h-3.5 group-hover/more:translate-x-1 transition-transform" />
                  </span>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-40 text-center border border-dashed border-neutral-900">
          <Activity className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
          <p className="text-sm font-mono text-neutral-600 uppercase tracking-[0.3em]">No signals found for this coordinate.</p>
          <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-8 text-[10px] font-bold text-white uppercase border-b border-white pb-1">Reset Filters</button>
        </div>
      )}
    </div>
  );
}

export default function BlogListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}>
      <BlogListContent />
    </Suspense>
  );
}
