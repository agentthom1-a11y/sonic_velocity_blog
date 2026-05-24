'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  Terminal, 
  Zap, 
  Activity, 
  Mail, 
  User,
  Calendar,
  ArrowUpRight,
  Globe2,
  Database,
  Music4
} from 'lucide-react';
import { Link } from './Link';
import { BLOG_POSTS, CATEGORIES, SITE_CONFIG } from '../blogData';
import DailyHitsRateForm from './DailyHitsRateForm';

interface LandingProps {
  dict: any;
  locale: string;
}

const Landing: React.FC<LandingProps> = ({ dict, locale }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent, source: string) => {
    e.preventDefault();
    const targetEmail = e.currentTarget.querySelector('input')?.value || email;
    
    if (!targetEmail) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setEmail('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to sync.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const recentPosts = filteredPosts.slice(0, 4);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-black selection:bg-white selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05),transparent_70%)]"></div>
      
      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-32 pb-24 px-6 border-b border-neutral-900 overflow-hidden text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-800 bg-neutral-900/50 rounded-full backdrop-blur-sm">
            <Activity className="w-3 h-3 text-white animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Platform Active // Signal Strong
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none uppercase italic max-w-5xl">
            Sonic Velocity — AI Music Trends, Audio Synthesis & Viral Song Intelligence
          </h1>
          
          <p className="max-w-3xl text-neutral-400 text-sm md:text-lg font-mono leading-relaxed uppercase tracking-wider mt-4">
            Sonic Velocity tracks AI music models, Indonesian and Asian music trends, viral song patterns, momentum songs, and creator growth signals. Built for artists, producers, AI creators, music founders, and trend researchers.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link href={`/blog`} className="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors">
              Read Latest Transmissions
            </Link>
            <Link href={`/models`} className="px-8 py-4 border border-neutral-700 text-white font-black uppercase text-xs tracking-widest hover:border-white transition-colors">
              Explore AI Models
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 space-y-32">

        {/* 2. WHAT SONIC VELOCITY TRACKS */}
        <section id="what-we-track">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-3">
            <Zap className="w-6 h-6 text-neutral-500" /> What Sonic Velocity Tracks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 3. AI MUSIC INTELLIGENCE */}
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900 transition-colors group block">
              <Database className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">AI Music Intelligence</h3>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed mb-6">Deep analysis into generative audio systems, prompt engineering, and neural audio culture.</p>
              <Link href={`/song-trend-signals`} className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:underline">Read Signal Reports &rarr;</Link>
            </div>

            {/* 4. INDONESIAN MUSIC TRENDS */}
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900 transition-colors group block">
              <Globe2 className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Indonesian Music Trend Signals</h3>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed mb-6">Tracking the fastest growing sounds, from Dangdut Koplo AI remixes to Jakarta underground waves.</p>
              <Link href={`/music-trends/indonesia/2026`} className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:underline">View 2026 Forecast &rarr;</Link>
            </div>

            {/* 5. ASIAN MUSIC TRENDS */}
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900 transition-colors group block">
              <Activity className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Asian Music Trend Signals</h3>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed mb-6">Cross-border virality, regional platform algorithms, and the rise of Pan-Asian pop momentum.</p>
              <Link href={`/music-trends/asia/2026`} className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:underline">View Asia Report &rarr;</Link>
            </div>

            {/* 6. VIRAL SONG PATTERN ANALYSIS */}
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900 transition-colors group block">
              <Activity className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Viral Song Pattern Analysis</h3>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed mb-6">Deconstructing the DNA of TikTok hits, YouTube Shorts spikes, and Spotify momentum vectors.</p>
              <Link href={`/song-trend-signals`} className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:underline">Learn the Framework &rarr;</Link>
            </div>

            {/* 7. AI AUDIO SYNTHESIS MODELS */}
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900 transition-colors group block">
              <Music4 className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">AI Audio Synthesis Models</h3>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed mb-6">Tracking Suno, Udio, Stable Audio, and the expanding landscape of text-to-music generation tools.</p>
              <Link href={`/glossary/ai-audio-synthesis`} className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:underline">Define Synthesis &rarr;</Link>
            </div>

            {/* 8. MOMENTUM SONGS */}
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900 transition-colors group block">
              <ArrowUpRight className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Momentum Songs</h3>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed mb-6">Identifying tracks that break containment and create sustained cultural feedback loops.</p>
              <Link href={`/glossary/momentum-song`} className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:underline">What is a Momentum Song? &rarr;</Link>
            </div>
          </div>
        </section>

        {/* 9. AI MODELS INDEX */}
        <section className="p-12 border border-neutral-900 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-neutral-950 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-xl">
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">AI Models Index</h2>
             <p className="text-sm font-mono text-neutral-400 leading-relaxed">Access our comprehensive, searchable directory of AI music generators, voice synthesizers, stem splitters, and production assistance tools.</p>
           </div>
           <Link href={`/models`} className="shrink-0 px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors">
              Access The Index
           </Link>
        </section>

        {/* 10. LATEST TRANSMISSIONS / BLOG */}
        <section id="latest">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Terminal className="w-6 h-6 text-neutral-700" /> Latest Transmissions
            </h2>
            <Link href={`/blog`} className="text-[10px] font-mono text-neutral-400 hover:text-white uppercase tracking-widest underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post, i) => (
              <Link 
                key={post.id} 
                href={`/transmissions/${post.slug}`}
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
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-white transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono leading-relaxed mb-8 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-900/50">
                      <span className="text-[8px] font-mono text-neutral-700 uppercase">Signal: Encrypted</span>
                      <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group/more">
                        Read Intelligence <ArrowRight className="w-3.5 h-3.5 group-hover/more:translate-x-1 transition-transform" />
                      </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 11. NEWSLETTER CTA */}
        <section className="relative py-24 px-8 border border-neutral-900 bg-neutral-950 overflow-hidden text-center group">
          <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-neutral-800 hidden md:block">
              STATUS: BROADCASTING<br/>
              SIGNAL: SECURE
          </div>
          
          <div className="relative z-10 max-w-xl mx-auto">
              <Mail className="w-8 h-8 text-neutral-700 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                Join the Intelligence Network
              </h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest leading-relaxed mb-10 text-center">
                Weekly intelligence on AI audio models, Indonesian trends, and viral song patterns.
              </p>
              
              {submitStatus === 'success' ? (
                <div className="py-10 border border-neutral-800 bg-black/40">
                    <Zap className="w-8 h-8 text-white mx-auto mb-4 animate-pulse" />
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Network Connection Established</h4>
                    <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Verify your inbox for encryption keys.</p>
                </div>
              ) : (
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => handleSubscribe(e, 'footer')}>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER_OPERATOR_EMAIL" 
                      className="flex-1 bg-black border border-neutral-800 px-6 py-4 text-[11px] font-mono text-white placeholder:text-neutral-700 focus:outline-none focus:border-neutral-600 transition-colors uppercase"
                    />
                    <button 
                      disabled={isSubmitting}
                      className="bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'ESTABLISHING...' : 'Subscribe'}
                    </button>
                </form>
              )}
              {submitStatus === 'error' && (
                <p className="mt-4 text-[9px] font-mono text-red-500 uppercase tracking-widest">Error: {errorMessage}</p>
              )}
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </section>

      </main>
    </div>
  );
};

export default Landing;
