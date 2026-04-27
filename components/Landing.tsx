'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  Terminal, 
  Zap, 
  Activity, 
  ChevronRight, 
  Mail, 
  Twitter, 
  Instagram, 
  Music,
  Calendar,
  User,
  Users,
  Clock,
  Filter,
  ArrowUpRight,
  AudioLines as WaveIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BLOG_POSTS, CATEGORIES, SITE_CONFIG } from '../blogData';

const Landing: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const router = useRouter();

  const categoryOptions = useMemo(() => [
    { slug: 'all', name: 'All' },
    ...CATEGORIES.map(c => ({ slug: c.slug, name: c.name }))
  ], []);

  const trendingPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  }, []);

  const trendingByViews = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  }, []);

  const scenePosts = useMemo(() => {
    return BLOG_POSTS.filter(p => p.category === 'scene-radar' || p.tags.includes('Regional')).slice(0, 3);
  }, []);

    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const featuredPost = filteredPosts[0] || BLOG_POSTS[0];
  const recentPosts = filteredPosts.filter(p => !featuredPost || p.id !== featuredPost.id);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-black selection:bg-white selection:text-black">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05),transparent_70%)]"></div>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* HERO / PUBLICATION IDENTITY */}
      <section className="relative z-10 pt-32 pb-24 px-6 border-b border-neutral-900 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-left relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-8 backdrop-blur-sm">
                  <Activity className="w-3 h-3 text-white animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neutral-400">Signal Captured // {SITE_CONFIG.brand} {SITE_CONFIG.publicationTitle}</span>
               </div>
               
               <h1 className="text-5xl sm:text-7xl md:text-[140px] font-black text-white tracking-tighter mb-8 leading-[0.8] uppercase italic">
                  SONIC<br/>VELO<span className="text-neutral-900 stroke-neutral-800" style={{ WebkitTextStroke: '1px #333' }}>CITY</span>
               </h1>

               <div className="flex items-center gap-12 py-10 border-y border-neutral-900">
                  <p className="max-w-md text-neutral-400 text-sm md:text-base font-mono leading-relaxed uppercase tracking-wider">
                     {SITE_CONFIG.subtitle}
                  </p>
                  <div className="hidden lg:flex flex-col gap-1 font-mono text-[10px] text-neutral-600 uppercase">
                     <span>OPERATOR: GEN_Z_SIGNAL</span>
                     <span>VERSION: ED_v2.04</span>
                     <span>STATUS: BROADCASTING</span>
                  </div>
               </div>
            </div>

            <div className="hidden lg:block w-72 shrink-0">
               <div className="p-8 border border-neutral-900 bg-neutral-950/50 space-y-8 backdrop-blur-md">
                  <h4 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.4em] mb-4">Trending Signals</h4>
                  <div className="space-y-6">
                     {trendingPosts.map((post, i) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group block cursor-pointer">
                           <div className="flex gap-4 items-start">
                              <span className="text-xl font-black text-neutral-800 group-hover:text-white transition-colors leading-none">0{i+1}</span>
                              <div>
                                 <p className="text-[9px] font-mono text-neutral-600 uppercase mb-1">{post.category}</p>
                                 <h5 className="text-[11px] font-bold text-neutral-400 group-hover:text-white transition-colors uppercase leading-snug">{post.title}</h5>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Tech Overlay Decor */}
         <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent -translate-y-1/2 -z-10"></div>
         <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-neutral-900 to-transparent -translate-x-1/2 -z-10"></div>
      </section>

      {/* DISCOVERY BAR / FILTERS */}
      <section className="relative z-10 border-b border-neutral-900 px-6 py-6 transition-all duration-300">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-1 scroll-smooth">
               {categoryOptions.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className="relative whitespace-nowrap px-5 py-2 text-[10px] font-mono uppercase tracking-[0.25em] transition-all z-10 group"
                  >
                    <span className={`relative z-10 ${activeCategory === cat.slug ? 'text-black font-black' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                      {cat.name}
                    </span>
                    {activeCategory === cat.slug && (
                      <motion.div 
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-white rounded-sm z-0"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </button>
               ))}
            </div>

            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
               <input 
                  type="text"
                  placeholder="SEARCH_THE_ARCHIVE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950/50 border border-neutral-900 py-4 pl-12 pr-6 text-[11px] font-mono text-white placeholder:text-neutral-800 focus:outline-none focus:border-neutral-700 transition-all uppercase tracking-[0.2em] focus:bg-neutral-900"
               />
            </div>
         </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
         
         {/* FEATURED TRANSMISSION (Large Hero Layout) */}
         {activeCategory === 'all' && !searchQuery && featuredPost && (
           <Link id="featured" href={`/blog/${featuredPost.slug}`} className="group block cursor-pointer mb-32">
              <div className="relative border border-neutral-900 bg-neutral-950 overflow-hidden">
                 <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-900">
                       <img 
                          src={featuredPost.image} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                       />
                       <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <span className="w-fit px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">Featured</span>
                          <span className="w-fit px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-mono uppercase tracking-[0.2em] border border-neutral-800">{featuredPost.id}</span>
                       </div>
                    </div>

                    <div className="p-8 md:p-16 flex flex-col justify-between">
                       <div className="space-y-8">
                          <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                             <div className="flex items-center gap-2">
                                <User className="w-3 h-3" /> {featuredPost.author}
                             </div>
                             <div className="w-1 h-px bg-neutral-800"></div>
                             <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {featuredPost.date}
                             </div>
                             <div className="w-1 h-px bg-neutral-800"></div>
                             <span className="px-2 py-0.5 border border-neutral-800 rounded">{featuredPost.category}</span>
                          </div>

                          <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 group-hover:italic transition-all duration-500">
                             {featuredPost.title}
                          </h2>

                          <p className="text-neutral-400 text-lg font-mono italic leading-relaxed border-l-2 border-neutral-800 pl-8 mb-12 max-w-xl">
                             {featuredPost.excerpt}
                          </p>
                       </div>

                       <div className="flex items-center justify-between pt-12 border-t border-neutral-900/50 mt-12">
                          <span className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-[0.4em] group/btn">
                             Read Full Transmission <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </span>
                          <div className="hidden sm:flex gap-1">
                             {[1,2,3,4].map(dot => <div key={dot} className="w-1 h-8 bg-neutral-900"></div>)}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </Link>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LATEST TRANSMISSIONS GRID */}
            <div className={activeCategory === 'all' && !searchQuery ? 'lg:col-span-8' : 'lg:col-span-12'}>
               <section id="latest" className="space-y-12">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-neutral-700" /> Recent Archives
                     </h3>
                     <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">{filteredPosts.length} Items Indexed</span>
                  </div>

                  {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {recentPosts.map((post, i) => (
                        <Link 
                          key={post.id} 
                          href={`/blog/${post.slug}`}
                          className="group flex flex-col h-full border border-neutral-900 bg-neutral-950/20 hover:border-neutral-700 transition-all overflow-hidden cursor-pointer"
                        >
                          <div className="aspect-[16/10] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            />
                            <div className="absolute top-4 left-4">
                               <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[8px] font-mono text-white uppercase tracking-widest">{post.category}</span>
                            </div>
                          </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col text-left">
                            <div className="flex items-center gap-4 mb-4 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                              <span>{post.date}</span>
                              <span className="w-1 h-px bg-neutral-800"></span>
                              <span>{post.author}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-white transition-colors leading-tight">
                              {post.title}
                            </h4>
                            <p className="text-xs text-neutral-500 font-mono leading-relaxed mb-8 flex-1">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-neutral-900/50">
                               <span className="text-[8px] font-mono text-neutral-700 uppercase">Signal: Encrypted</span>
                               <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group/more">
                                 Open <ArrowRight className="w-3.5 h-3.5 group-hover/more:translate-x-1 transition-transform" />
                               </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-neutral-900">
                       <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest">No transmissions match your query.</p>
                    </div>
                  )}
               </section>
            </div>

            {/* SIDEBAR: MOST READ / TRENDS (Active in index view) */}
            {activeCategory === 'all' && !searchQuery && (
              <aside className="lg:col-span-4 space-y-16">
                 {/* Trending Signals / Most Read */}
                 <div className="p-8 border border-neutral-900 bg-neutral-950 shadow-2xl relative group">
                    <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em] mb-8 border-b border-neutral-800 pb-4">Trending Signals</h4>
                    <div className="flex flex-col gap-3">
                       {trendingByViews.map((post, i) => (
                          <Link 
                            key={post.id} 
                            href={`/blog/${post.slug}`}
                            className="group/item cursor-pointer flex gap-3 items-center bg-neutral-900/40 border border-neutral-900 p-2 hover:bg-neutral-900 hover:border-neutral-800 transition-all rounded-sm" 
                          >
                             <div className="w-12 h-12 relative shrink-0 overflow-hidden border border-neutral-800">
                                <img src={post.image} alt="" className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 bg-white/10 group-hover/item:bg-transparent"></div>
                                <div className="absolute bottom-0 right-0 bg-black/80 px-1 text-[7px] font-mono text-white/50">{i+1}</div>
                             </div>
                             <div className="space-y-1 min-w-0">
                                <p className="text-[7px] font-mono text-neutral-600 uppercase tracking-widest">{post.category}</p>
                                <h5 className="text-[10px] font-bold text-neutral-400 group-hover/item:text-white transition-colors uppercase leading-tight line-clamp-2">{post.title}</h5>
                             </div>
                          </Link>
                       ))}
                    </div>
                 </div>

                 {/* Scene Radar Highlight */}
                 <div className="p-8 border border-neutral-900 bg-neutral-950 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Activity className="w-20 h-20 text-white" />
                    </div>
                    <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em] mb-8 border-b border-neutral-800 pb-4">Scene Radar</h4>
                    <div className="space-y-8">
                       {scenePosts.map(post => (
                          <Link key={post.id} href={`/blog/${post.slug}`} className="block cursor-pointer">
                             <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 shrink-0 overflow-hidden border border-neutral-800 grayscale">
                                   <img src={post.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[8px] font-mono text-neutral-600 uppercase">{post.category}</p>
                                   <h5 className="text-[10px] font-bold text-neutral-400 hover:text-white transition-colors uppercase leading-snug">{post.title}</h5>
                                </div>
                             </div>
                          </Link>
                       ))}
                    </div>
                    <button 
                      onClick={() => setActiveCategory('scene-radar')}
                      className="w-full mt-10 py-3 border border-neutral-800 text-[9px] font-mono text-neutral-500 uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                    >
                       Expand Radar Feed
                    </button>
                 </div>

                 {/* Newsletter Sidebar */}
                 <div className="p-8 bg-neutral-100 text-black">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Stay Sync'd</h4>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-8 leading-relaxed opacity-70">
                       Weekly transmissions on the frontier of AI audio & youth culture.
                    </p>
                    <div className="space-y-2">
                       <input 
                          type="email" 
                          placeholder="OPERATOR_EMAIL" 
                          className="w-full px-4 py-3 bg-transparent border-b-2 border-black text-xs font-mono focus:outline-none placeholder:text-black/30"
                       />
                       <button className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                          Join Network
                       </button>
                    </div>
                 </div>

                 {/* Trend Labels */}
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em]">Trend Labels</h4>
                    <div className="flex flex-wrap gap-2">
                       {Array.from(new Set(BLOG_POSTS.flatMap(p => p.tags))).slice(0, 10).map(tag => (
                          <Link 
                             key={tag} 
                             href={`/blog?tag=${tag}`}
                             className="px-3 py-1.5 border border-neutral-900 bg-neutral-950 text-[8px] font-mono text-neutral-600 uppercase tracking-widest hover:border-white hover:text-white cursor-pointer transition-all rounded-sm"
                          >
                             #{tag}
                          </Link>
                       ))}
                    </div>
                 </div>
              </aside>
            )}

         </div>

         {/* CATEGORY RAILS / FEATURED RAILS */}
         {activeCategory === 'all' && !searchQuery && (
           <section className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-24 mt-24 border-t border-neutral-900">
              {CATEGORIES.slice(0, 4).map((category) => {
                const icons: Record<string, any> = {
                  'scene-radar': Activity,
                  'archive': Clock,
                  'engineering': Zap,
                  'product': WaveIcon,
                  'culture': Users
                };
                const Icon = icons[category.slug] || Activity;
                
                return (
                  <div key={category.slug} className="p-8 border border-neutral-900 bg-neutral-950/30 hover:bg-neutral-950 transition-all group">
                    <div className="flex flex-col gap-6 text-left">
                       <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                          <Icon className="w-5 h-5 text-neutral-600 group-hover:text-black transition-all" strokeWidth={1.5} />
                       </div>
                       <div>
                         <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 italic">/// {category.name}</h4>
                         <p className="text-[10px] text-neutral-500 font-mono leading-relaxed mb-6 uppercase">
                            {category.description}
                         </p>
                         <button 
                            onClick={() => {
                              setActiveCategory(category.slug);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-[9px] font-bold text-white uppercase tracking-[0.2em] border-b border-neutral-800 pb-1 hover:border-white transition-colors"
                         >
                            Enter Feed
                         </button>
                       </div>
                    </div>
                  </div>
                );
              })}
           </section>
         )}

         {/* NEWSLETTER MODULE */}
         <section className="relative py-20 px-8 border border-neutral-900 bg-neutral-950 overflow-hidden text-center group">
            <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-neutral-800 hidden md:block">
               STATUS: BROADCASTING<br/>
               SIGNAL: SECURE
            </div>
            
            <div className="relative z-10 max-w-xl mx-auto">
               <Mail className="w-8 h-8 text-neutral-700 mx-auto mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  Stay Synchronized
               </h3>
               <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest leading-relaxed mb-10 text-center">
                  Get the next transmission before it breaks. Receive engineering updates, product drops, and sonic culture reports from Sonic Velocity.
               </p>
               
               <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="ENTER OPERATOR EMAIL..." 
                    className="flex-1 bg-black border border-neutral-800 px-6 py-4 text-[11px] font-mono text-white placeholder:text-neutral-700 focus:outline-none focus:border-neutral-600 transition-colors uppercase"
                  />
                  <button className="bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all">
                     Join Transmission
                  </button>
               </form>

               <p className="mt-6 text-[8px] font-mono text-neutral-700 uppercase tracking-widest">
                  Secure broadcast // Zero noise // Opt-out anytime
               </p>
            </div>

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
         </section>

      </main>

      {/* REBRANDED FOOTER */}
      <footer className="py-20 border-t border-neutral-900 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
               <div className="md:col-span-1 space-y-6 text-left">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Sonic Velocity</h4>
                    <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest leading-loose">
                       Advancing Neural Audio Systems & Cultural Engineering.
                    </p>
                  </div>
                  <div className="flex gap-4">
                     {[Twitter, Instagram, Music].map((Icon, i) => (
                        <a key={i} href="#" className="w-8 h-8 flex items-center justify-center border border-neutral-800 hover:border-white hover:text-white text-neutral-600 transition-all">
                           <Icon className="w-4 h-4" />
                        </a>
                     ))}
                  </div>
               </div>

               <div className="space-y-4 text-left">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2">Publication</h5>
                  <div className="flex flex-col gap-2">
                     {CATEGORIES.map(category => (
                        <Link key={category.slug} href="/blog" className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{category.name}</Link>
                     ))}
                  </div>
               </div>

               <div className="space-y-4 text-left">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2">Resources</h5>
                  <div className="flex flex-col gap-2">
                     {['Studio', 'Systems', 'Pricing', 'API'].map(item => (
                        <Link key={item} href={`/${item.toLowerCase() === 'systems' ? 'showcase' : item.toLowerCase()}`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{item}</Link>
                     ))}
                  </div>
               </div>

               <div className="space-y-4 text-left">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2">Company</h5>
                  <div className="flex flex-col gap-2">
                     {['About', 'Privacy', 'Terms', 'Status'].map(item => (
                        <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{item}</Link>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-neutral-900 font-mono text-[9px] text-neutral-700 uppercase tracking-[0.3em]">
               <span>OPERATIONAL_STATUS: OPTIMAL</span>
               <span>VELOCITY SYSTEMS © 2024. ALL RIGHTS RESERVED.</span>
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 hover:text-white transition-colors">
                  Return To Top <ArrowUpRight className="w-3 h-3" />
               </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

