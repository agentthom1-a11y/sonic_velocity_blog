'use client';

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Activity, User, Calendar, Link as LinkIcon,
  Twitter, Facebook, Linkedin, Copy, CheckCircle2, Share2,
  ArrowRight, Terminal, ShoppingBag, ArrowUp
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BLOG_POSTS, SITE_CONFIG } from '@/blogData';
import { BlogPost } from '@/types';

// SEO and Share components will be simplified or reused here

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const foundPost = BLOG_POSTS.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
    } else {
      router.push('/blog');
    }
  }, [slug, router]);

  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollY > 20);
      if (scrollHeight > 0) {
        setScrollProgress((scrollY / scrollHeight) * 100);
      }
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  if (!post) return null;

  const generateId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const headings = post.content.split('\n')
    .filter(line => line.trim().startsWith('##'))
    .map(line => {
      const level = line.trim().startsWith('###') ? 3 : 2;
      const text = line.replace(/^#+/, '').trim();
      const id = generateId(text);
      return { level, text, id };
    });

  let h2Idx = 0;
  let h3Idx = 0;
  let paragraphCount = 0;

  return (
    <div className="relative min-h-screen bg-black text-neutral-300">
      {/* Article Progress Bar */}
      <div className={`fixed transition-all duration-500 left-0 w-full h-0.5 bg-neutral-900 z-50 ${isScrolled ? 'top-16' : 'top-20'}`}>
        <div 
          className="h-full bg-white opacity-60 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <article className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
        <Link 
          href="/blog" 
          className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-16 text-neutral-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Archives
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           {/* Left Rail: Metadata / TOC */}
           <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-40 space-y-12">
                 <div className="space-y-4">
                    <h5 className="text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-900 pb-2">Transmission Log</h5>
                    <div className="space-y-3 font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
                       <div className="flex justify-between">
                          <span className="text-neutral-600 italic">Auth</span>
                          <span>{post.author}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-neutral-600 italic">Date</span>
                          <span>{post.date}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-neutral-600 italic">Read</span>
                          <span>{post.readingTime || '~6 Minutes'}</span>
                       </div>
                    </div>
                 </div>

                 {headings.length > 0 && (
                   <div className="space-y-4">
                      <h5 className="text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-900 pb-2">Navigation</h5>
                      <nav className="flex flex-col gap-3">
                         {headings.map((heading, i) => (
                            <a 
                              key={i} 
                              href={`#${heading.id}`}
                              className={`text-[11px] font-mono uppercase tracking-[0.2em] text-left hover:text-white transition-colors block ${
                                heading.level === 3 ? 'pl-4 text-neutral-600' : 'text-neutral-400 font-bold'
                              }`}
                            >
                               {heading.level === 3 ? '◦ ' : '/// '}{heading.text}
                            </a>
                         ))}
                      </nav>
                   </div>
                 )}
              </div>
           </aside>

           {/* Center: Article Body */}
           <div className="lg:col-span-9 max-w-3xl">
              <header className="mb-16">
                 <div className="inline-flex items-center gap-3 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                    {post.category}
                 </div>
                 <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 leading-[0.9] italic">
                    {post.title}
                 </h1>
                 <div className="aspect-[21/9] overflow-hidden border border-neutral-900 mb-12">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale opacity-80" />
                 </div>
                 <p className="font-mono text-xl md:text-3xl text-neutral-400 leading-[1.4] italic border-l-4 border-neutral-800 pl-10 mb-8 tracking-tight">
                    {post.excerpt}
                 </p>
              </header>

              <div className="article-body">
                 {post.content.split('\n').filter(p => p.trim()).map((para, i) => {
                    const trimmedPara = para.trim();
                    
                    if (trimmedPara.startsWith('##')) {
                      const level = trimmedPara.startsWith('###') ? 3 : 2;
                      const text = trimmedPara.replace(/^#+/, '').trim();
                      const id = generateId(text);
                      
                      if (level === 2) {
                        h2Idx++;
                        return (
                          <div key={i} className="mt-32 md:mt-48 mb-12 group/h2">
                            <div className="flex items-center gap-3 mb-8">
                              <span className="w-12 h-[1px] bg-neutral-800 transition-all group-hover/h2:w-16 group-hover/h2:bg-white"></span>
                              <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em]">Artifact_{h2Idx < 10 ? `0${h2Idx}` : h2Idx}</span>
                            </div>
                            <div className="flex items-center gap-6 group/anchor scroll-mt-32" id={id}>
                              <h2 className="font-sans text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] italic">
                                {text}
                              </h2>
                            </div>
                          </div>
                        );
                      }
                      h3Idx++;
                      return (
                        <div key={i} className="group/anchor flex items-center gap-4 mt-20 mb-10 scroll-mt-32" id={id}>
                          <h3 className="font-sans text-3xl md:text-5xl font-bold text-white uppercase tracking-tight flex items-center gap-4 italic opacity-90">
                            <span className="text-neutral-800 font-mono text-base tracking-normal font-normal">/{h3Idx < 10 ? `0${h3Idx}` : h3Idx}</span>
                            {text}
                          </h3>
                        </div>
                      );
                    }
                    
                    if (trimmedPara.startsWith('"') || trimmedPara.startsWith('“')) {
                      return (
                        <blockquote key={i} className="font-sans text-4xl md:text-6xl font-black text-white italic border-y border-neutral-900 py-24 md:py-32 my-24 text-center uppercase tracking-tighter leading-[0.9] relative group/quote">
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[160px] font-mono text-neutral-900 leading-none opacity-20 pointer-events-none">“</div>
                          <span className="relative z-10 block px-4">{trimmedPara.replace(/[“”"]/g, '')}</span>
                        </blockquote>
                      );
                    }

                    if (trimmedPara.startsWith('-')) {
                       return (
                         <div key={i} className="flex gap-8 items-start pl-10 py-6 border-l-2 border-neutral-800 my-12 group hover:border-white transition-colors">
                            <div className="w-2 h-2 mt-3.5 bg-neutral-800 rounded-full group-hover:bg-white transition-colors shrink-0"></div>
                            <p className="font-sans text-xl md:text-2xl leading-relaxed text-neutral-400 group-hover:text-neutral-200 transition-colors italic font-light">{trimmedPara.replace(/^-/, '').trim()}</p>
                         </div>
                       );
                    }

                    const isFirst = paragraphCount === 0;
                    paragraphCount++;
                    
                    return (
                      <p key={i} className={`font-sans text-xl md:text-[1.5rem] leading-[1.65] text-neutral-400 mb-14 tracking-tight font-light text-pretty ${
                        isFirst ? 'first-letter:text-8xl first-letter:font-black first-letter:text-white first-letter:mr-4 first-letter:float-left first-letter:leading-[0.75] first-letter:pt-4' : ''
                      }`}>
                        {trimmedPara}
                      </p>
                    );
                 })}
              </div>
           </div>
        </div>
      </article>
    </div>
  );
}
