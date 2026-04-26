
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Download, Copy, Users, Target, Zap, FileText, Briefcase, 
  ChevronRight, Hash, ArrowRight, ShoppingBag, Clock, User, Tag, Link,
  Calendar, CheckCircle2, Search, X, Info, Twitter, Facebook, Linkedin, Share2, Activity,
  ArrowUp
} from 'lucide-react';
import { BLOG_POSTS, SITE_CONFIG, CATEGORIES } from '../blogData';
import { BlogPost } from '../types';

interface PageProps {
  onBack: () => void;
}

// SEO Component for Blog
const BlogSEO = ({ post }: { post?: BlogPost }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://velocity-audio.ai/blog';
  
  useEffect(() => {
    const title = post ? `${post.title} | ${SITE_CONFIG.brand}` : `${SITE_CONFIG.publicationTitle} | ${SITE_CONFIG.brand}`;
    const description = post ? post.excerpt : SITE_CONFIG.subtitle;
    const keywords = post ? post.tags.join(', ') : "AI, Music, Dangdut, Koplo, TikTok, Audio Synthesis";
    const image = post ? post.image : SITE_CONFIG.defaultOgImage;

    // Set Document Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMeta = (identifier: string, content: string, isProperty = false) => {
      let el = document.querySelector(isProperty ? `meta[property="${identifier}"]` : `meta[name="${identifier}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', identifier);
        else el.setAttribute('name', identifier);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', currentUrl, true);
    updateMeta('og:type', post ? 'article' : 'website', true);
    updateMeta('og:site_name', 'Velocity AI', true);

    // Twitter
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', '@velocity_ai');

  }, [post, currentUrl]);

  const ldData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "author": { 
      "@type": "Person", 
      "name": post.author,
      "url": "https://velocity-audio.ai/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.brand,
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": post.publishedAt || post.date,
    "dateModified": post.publishedAt || post.date,
    "description": post.metaDescription || post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "keywords": post.tags.join(', ')
  } : {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `${SITE_CONFIG.brand} ${SITE_CONFIG.publicationTitle}`,
    "description": SITE_CONFIG.subtitle,
    "url": currentUrl,
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.brand
    }
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldData) }} />
  );
};

// Social Share Component
const ShareSection = ({ title, showLabel = true }: { title: string; showLabel?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : 'https://velocity-audio.ai/blog';
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    { 
      name: 'X', 
      icon: Twitter, 
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-white'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-white'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-white'
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col gap-6 ${showLabel ? 'border-t border-neutral-900 pt-10 mt-16' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
          {showLabel && (
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.3em] flex items-center gap-2">
              <Share2 className="w-3 h-3" /> Share Sequence:
            </span>
          )}
          <div className="flex items-center gap-6">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-neutral-500 transition-all duration-300 transform hover:scale-110 ${link.color}`}
                title={`Share on ${link.name}`}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 hover:text-white transition-all duration-300 uppercase tracking-[0.3em] group"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-white animate-pulse" /> pointer copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 group-hover:translate-y-[-1px] transition-transform" /> Copy Log Pointer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Comments Component
const CommentsSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize with some mock data for the specific post
  useEffect(() => {
    setComments([
      {
        id: '1',
        name: 'Echo_Prime',
        date: '2026.04.10',
        content: 'This transmission is exactly what the scene needs. The predictive models for Phonk are showing massive growth indices.',
        replies: [
          {
            id: '1-1',
            name: 'Signal_Void',
            date: '2026.04.11',
            content: 'Agreed. The friction between bedroom production and viral output is finally being addressed.'
          }
        ]
      }
    ]);
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newComment = {
        id: Date.now().toString(),
        name,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        content,
        replies: []
      };
      
      setComments(prev => [newComment, ...prev]);
      setName('');
      setEmail('');
      setContent('');
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="mt-32 pt-20 border-t border-neutral-900">
      <div className="flex items-center gap-4 mb-12">
        <Activity className="w-5 h-5 text-cyan-500" />
        <h3 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em]">Signal_Response_Node</h3>
      </div>

      {/* Comment Form */}
      <div className="bg-neutral-950 border border-neutral-900 p-8 mb-20 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-800 group-hover:bg-cyan-500 transition-colors"></div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Operator_Identity</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name" 
                className="w-full bg-black border border-neutral-800 p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-neutral-700" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Digital_Pointer</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email_Address" 
                className="w-full bg-black border border-neutral-800 p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-neutral-700" 
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Transmission_Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Inject your thoughts into the stream..." 
              rows={4}
              className="w-full bg-black border border-neutral-800 p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-neutral-700 resize-none" 
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">
              * Verification required. System logs are encrypted.
            </p>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'BUFFERING...' : 'Post Transmission'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center text-center p-6 border border-cyan-500/30"
            >
              <div>
                <CheckCircle2 className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                <h4 className="text-white font-black uppercase tracking-tighter mb-2">Transmission Logged</h4>
                <p className="text-[10px] font-mono text-neutral-500 uppercase">Your signal has been injected successfully.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comments List */}
      <div className="space-y-12">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 border border-neutral-800 bg-neutral-950 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">{comment.name.charAt(0)}</span>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-baseline gap-4">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">{comment.name}</h4>
                  <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">[{comment.date}]</span>
                </div>
                <p className="text-base text-neutral-400 font-light leading-relaxed tracking-tight">{comment.content}</p>
                <div className="flex gap-4">
                  <button className="text-[9px] font-mono text-neutral-500 hover:text-white uppercase tracking-widest pt-1 border-t border-transparent hover:border-neutral-700 transition-all">
                    Link_Thread
                  </button>
                  <button className="text-[9px] font-mono text-neutral-500 hover:text-white uppercase tracking-widest pt-1 border-t border-transparent hover:border-neutral-700 transition-all">
                    Upvote_Sig
                  </button>
                </div>
              </div>
            </div>

            {/* Threaded Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-16 pl-8 border-l border-neutral-900 space-y-12">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-6 items-start">
                    <div className="w-8 h-8 border border-neutral-800 bg-neutral-950 flex items-center justify-center shrink-0">
                      <span className="text-neutral-500 font-bold text-[10px]">{reply.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-baseline gap-4">
                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">{reply.name}</h4>
                        <span className="text-[8px] font-mono text-neutral-700 uppercase tracking-widest">[{reply.date}]</span>
                      </div>
                      <p className="text-sm text-neutral-500 font-light leading-relaxed tracking-tight italic">-- {reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MERCH PAGE (Formerly Brand) ---
export const Merch: React.FC<PageProps> = ({ onBack }) => (
  <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" /> Return to Base
    </button>

    <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-6">
                <ShoppingBag className="w-3 h-3 text-neutral-400" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Supply Depot</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Merch</h1>
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Official Velocity Hardware & Apparel</p>
        </div>
        <div className="text-right hidden md:block">
             <p className="font-mono text-xs text-neutral-600 mb-2">STATUS: RESTOCKED</p>
             <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-green-500"></div>
             </div>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
            { 
                id: "ITEM_01",
                name: "Velocity Core Tee",
                price: "Rp 350.000",
                type: "Apparel",
                color: "bg-neutral-900"
            },
            { 
                id: "ITEM_02",
                name: "Neural Hoodie [Black]",
                price: "Rp 650.000",
                type: "Apparel",
                color: "bg-black"
            },
            { 
                id: "ITEM_03",
                name: "System Cap v1",
                price: "Rp 250.000",
                type: "Accessory",
                color: "bg-neutral-800"
            },
            { 
                id: "ITEM_04",
                name: "Koplo Syntax Vinyl",
                price: "Rp 450.000",
                type: "Physical Media",
                color: "bg-neutral-950"
            }
        ].map((item, i) => (
            <div key={i} className="group border border-neutral-800 bg-black p-4 hover:border-neutral-600 transition-all flex flex-col justify-between h-full">
                <div>
                    <div className={`aspect-square ${item.color} border border-neutral-800 mb-4 relative overflow-hidden flex items-center justify-center`}>
                        {/* Placeholder Visual for Merch */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:10px_10px]"></div>
                        <div className="relative z-10 text-neutral-700 font-black text-6xl opacity-20 group-hover:opacity-40 transition-opacity">V</div>
                        
                        {/* Tag */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm border border-neutral-800">
                            <span className="text-[8px] font-mono text-neutral-400 uppercase">{item.id}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-white transition-colors">{item.name}</h3>
                            <p className="text-[10px] font-mono text-neutral-500 uppercase">{item.type}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-neutral-800 pt-3 mt-4">
                    <span className="text-sm font-mono text-white">{item.price}</span>
                    <button className="p-2 bg-white text-black hover:bg-neutral-200 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
    </div>
  </div>
);

// --- ABOUT PAGE ---
export const About: React.FC<PageProps> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" /> Return to Base
    </button>

    <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-6">
            <Users className="w-3 h-3 text-neutral-400" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Who We Are</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
            Accelerating <br/> <span className="text-neutral-500">Sonic Culture</span>
        </h1>
        <p className="max-w-2xl mx-auto font-mono text-sm text-neutral-400 leading-relaxed">
            Velocity was founded on a simple premise: Music production shouldn't be gated by technical skill or expensive hardware. We are building the neural infrastructure for the next generation of content creators.
        </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
            { icon: Zap, title: "Speed", desc: "Eliminating friction between idea and output." },
            { icon: Target, title: "Precision", desc: "Leveraging LLMs to understand cultural nuance." },
            { icon: Users, title: "Access", desc: "Democratizing studio-quality sound for everyone." }
        ].map((item, i) => (
            <div key={i} className="p-8 border border-neutral-800 bg-neutral-900/20 text-center group hover:bg-neutral-900/40 transition-colors">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-white transition-colors">
                    <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase mb-3">{item.title}</h3>
                <p className="text-xs font-mono text-neutral-500 leading-relaxed">{item.desc}</p>
            </div>
        ))}
    </div>
  </div>
);

// --- BLOG PAGE ---
export const Blog: React.FC<PageProps & { 
  selectedId?: string | null; 
  onSelect?: (id: string | null) => void;
  initialFilter?: { category?: string; tag?: string };
}> = ({ onBack, selectedId, onSelect, initialFilter }) => {
  const [internalSelectedPost, setInternalSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll progress and top button
  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      setIsScrolled(scrollY > 20);
      
      // Progress bar
      if (internalSelectedPost && scrollHeight > 0) {
        setScrollProgress((scrollY / scrollHeight) * 100);
      }
      
      // Scroll to top button visibility (appears after 50% scroll)
      if (scrollHeight > 0) {
        setShowScrollTop((scrollY / scrollHeight) > 0.5);
      }
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, [internalSelectedPost]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle initial filter
  useEffect(() => {
    if (initialFilter?.category) {
      setActiveCategory(initialFilter.category);
    }
    if (initialFilter?.tag) {
      setSearchQuery(initialFilter.tag);
      setActiveCategory('All');
    }
  }, [initialFilter]);

  // Sync external selectedId if provided (via props)
  useEffect(() => {
    if (selectedId) {
      const post = BLOG_POSTS.find(p => p.id === selectedId);
      if (post) setInternalSelectedPost(post);
    } else {
      setInternalSelectedPost(null);
    }
  }, [selectedId]);

  const selectedPost = internalSelectedPost;
  const setSelectedPost = (post: BlogPost | null) => {
    setInternalSelectedPost(post);
    if (onSelect) onSelect(post ? post.id : null);
    if (!post) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = BLOG_POSTS.filter(post => {
    const q = searchQuery.toLowerCase();
    const searchTarget = `${post.title} ${post.tags.join(' ')} ${post.category}`.toLowerCase();
    const matchesSearch = !searchQuery || searchTarget.includes(q);
    
    const matchesCategory = activeCategory === 'All' || 
      post.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    const generateId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const headings = selectedPost.content.split('\n')
      .filter(line => line.trim().startsWith('##'))
      .map(line => {
        const level = line.trim().startsWith('###') ? 3 : 2;
        const text = line.replace(/^#+/, '').trim();
        const id = generateId(text);
        return { level, text, id };
      });

    const relatedPosts = BLOG_POSTS
      .filter(p => p.id !== selectedPost.id)
      .map(p => {
        const sharedTags = p.tags.filter(tag => selectedPost.tags.includes(tag)).length;
        const categoryMatch = p.category === selectedPost.category ? 1 : 0;
        return { post: p, score: sharedTags * 10 + categoryMatch };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.post)
      .slice(0, 3);
    
    // Counter for heading display index
    let h2Idx = 0;
    let h3Idx = 0;

    return (
      <div className="relative min-h-screen bg-black text-neutral-300">
        <BlogSEO post={selectedPost} />
        
        {/* Article Progress Bar */}
        <div className={`fixed transition-all duration-500 left-0 w-full h-0.5 bg-neutral-900 z-50 ${isScrolled ? 'top-16' : 'top-20'}`}>
          <div 
            className="h-full bg-white opacity-60 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        <article className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
          <button 
            onClick={() => setSelectedPost(null)} 
            className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-16 text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Base Console
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
             {/* Left Rail: Metadata / TOC (Sticky) */}
             <aside className="lg:col-span-3 hidden lg:block">
                <div className="sticky top-40 space-y-12">
                   <div className="space-y-4">
                      <h5 className="text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-900 pb-2">Transmission Log</h5>
                      <div className="space-y-3 font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
                         <div className="flex justify-between">
                            <span className="text-neutral-600 italic">Auth</span>
                            <span>{selectedPost.author}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-neutral-600 italic">Date</span>
                            <span>{selectedPost.date}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-neutral-600 italic">Read</span>
                            <span>{selectedPost.readingTime || '~6 Minutes'}</span>
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

                   <div className="pt-6 border-t border-neutral-900">
                      <ShareSection title={selectedPost.title} showLabel={false} />
                   </div>
                </div>
             </aside>

             {/* Center: Article Body */}
             <div className="lg:col-span-9 max-w-3xl">
                <header className="mb-16">
                   <div className="inline-flex items-center gap-3 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                      {selectedPost.category}
                   </div>
                   <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 leading-[0.9] italic">
                      {selectedPost.title}
                   </h1>
                   <div className="aspect-[21/9] overflow-hidden border border-neutral-900 mb-12">
                      <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover grayscale opacity-80" />
                   </div>
                   <p className="font-mono text-xl md:text-3xl text-neutral-400 leading-[1.4] italic border-l-4 border-neutral-800 pl-10 mb-8 tracking-tight">
                      {selectedPost.excerpt}
                   </p>
                   
                   <div className="flex flex-wrap gap-2 mb-20 pl-10">
                      {selectedPost.tags.map(tag => (
                         <button 
                           key={tag}
                           onClick={(e) => {
                             e.stopPropagation();
                             setSearchQuery(tag);
                             setActiveCategory('All');
                             setSelectedPost(null);
                           }}
                           className="group/tag inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-[9px] font-mono font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-100 hover:text-black hover:border-white transition-all transform hover:-translate-y-0.5 active:scale-95"
                         >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover/tag:bg-cyan-600"></span>
                            {tag}
                         </button>
                      ))}
                   </div>
                </header>

                <div className="selection:bg-white selection:text-black article-body">
                   {(() => {
                     let paragraphCount = 0;
                     return selectedPost.content.split('\n').filter(p => p.trim()).map((para, i) => {
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
                                  <a href={`#${id}`} className="opacity-0 group-hover/anchor:opacity-40 hover:!opacity-100 transition-all text-white p-2">
                                    <Link className="w-8 h-8" />
                                  </a>
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
                              <a href={`#${id}`} className="opacity-0 group-hover/anchor:opacity-40 hover:!opacity-100 transition-all text-white p-1">
                                <Link className="w-6 h-6" />
                              </a>
                            </div>
                          );
                        }
                        
                        if (trimmedPara.startsWith('"') || trimmedPara.startsWith('“')) {
                          return (
                            <blockquote key={i} className="font-sans text-4xl md:text-6xl font-black text-white italic border-y border-neutral-900 py-24 md:py-32 my-24 text-center uppercase tracking-tighter leading-[0.9] relative group/quote">
                              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[160px] font-mono text-neutral-900 leading-none opacity-20 pointer-events-none transition-all group-hover/quote:opacity-40 group-hover/quote:-translate-y-2">“</div>
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
  
                        // Regular paragraph with stricter typographic scale
                        const isFirst = paragraphCount === 0;
                        paragraphCount++;
                        
                        return (
                          <p key={i} className={`font-sans text-xl md:text-[1.5rem] leading-[1.65] text-neutral-400 mb-14 tracking-tight font-light text-pretty selection:bg-white selection:text-black ${
                            isFirst ? 'first-letter:text-8xl first-letter:font-black first-letter:text-white first-letter:mr-4 first-letter:float-left first-letter:leading-[0.75] first-letter:pt-4' : ''
                          }`}>
                            {trimmedPara}
                          </p>
                        );
                     });
                   })()}
                </div>

                {/* "Why This Matters" Editorial Module */}
                <div className="mt-20 p-12 bg-white text-black relative">
                   <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                   <div className="flex flex-col md:flex-row gap-12 items-start">
                      <div className="shrink-0">
                         <h5 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] mb-4">Signal Insight</h5>
                         <Activity className="w-8 h-8" strokeWidth={3} />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black uppercase tracking-tighter mb-6 leading-none">Why This Sound Matters</h4>
                         <p className="text-sm font-mono leading-relaxed opacity-80 uppercase tracking-wider">
                            In the hyper-accelerated Indonesian youth market, sounds move faster than infrastructure. This artifact represents a fundamental shift in how {selectedPost.category === 'Engineering' ? 'machine intelligence' : 'cultural signals'} are processed and remixed by the next generation of mobile-first creators.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="mt-12">
                   <ShareSection title={selectedPost.title} />
                </div>

                {/* YouTube Shorts Section */}
                <div className="mt-20 pt-12 border-t border-neutral-900">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Shorts on Trend Signals</h4>
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">Immersive vertical insights</p>
                      </div>
                      <div className="hidden md:flex items-center gap-4">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-neutral-800"></div>)}
                        </div>
                        <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.3em]">REC // 00{selectedPost.id}</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      {[
                        { id: '8mYVAnl8EWA', title: 'Sonic Synthesis' },
                        { id: 'L_7pUnnS3U0', title: 'Velocity Labs' },
                        { id: 'vGZ2v2RkX6Y', title: 'Signal Decay' }
                      ].map((short, idx) => (
                        <div key={idx} className="group relative aspect-[9/16] bg-neutral-950 border border-neutral-900 overflow-hidden hover:border-neutral-700 transition-all shadow-2xl">
                           {/* Using embed link for shorts style */}
                           <iframe 
                              src={`https://www.youtube.com/embed/${short.id}?rel=0&modestbranding=1&autohide=1`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={short.title}
                           />
                           
                           {/* Overlay Accent */}
                           <div className="absolute inset-0 pointer-events-none border border-white/0 group-hover:border-white/5 transition-all z-20"></div>
                           <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-red-600 text-white text-[8px] font-mono px-2 py-1 uppercase font-bold tracking-widest">LIVE_FEED</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Pagination links */}
                {(() => {
                  const currentIndex = BLOG_POSTS.findIndex(p => p.id === selectedPost.id);
                  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
                  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

                  if (!prevPost && !nextPost) return null;

                  return (
                    <div className="mt-20 pt-12 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {prevPost ? (
                        <button 
                          onClick={() => setSelectedPost(prevPost)}
                          className="group flex flex-col items-start text-left p-6 border border-neutral-900 bg-neutral-950/30 hover:border-neutral-700 transition-all"
                        >
                          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Previous Article
                          </span>
                          <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors line-clamp-2 uppercase italic tracking-tight">{prevPost.title}</span>
                        </button>
                      ) : <div />}
                      
                      {nextPost ? (
                        <button 
                          onClick={() => setSelectedPost(nextPost)}
                          className="group flex flex-col items-end text-right p-6 border border-neutral-900 bg-neutral-950/30 hover:border-neutral-700 transition-all"
                        >
                          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Next Article <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                          </span>
                          <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors line-clamp-2 uppercase italic tracking-tight">{nextPost.title}</span>
                        </button>
                      ) : <div />}
                    </div>
                  );
                })()}

                {/* Article Footer Newsletter */}
                <div className="mt-24 p-10 bg-neutral-950 border border-neutral-900 text-center">
                   <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Join the Network</h4>
                   <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-8">Receive engineering updates directly to your terminal.</p>
                   <div className="flex gap-2 max-w-md mx-auto">
                      <input type="text" placeholder="OPERATOR@EMAIL" className="flex-1 bg-black border border-neutral-800 px-4 py-2 text-[10px] font-mono focus:outline-none focus:border-neutral-700" />
                      <button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase">Sync</button>
                   </div>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-20 pt-12 border-t border-neutral-900">
                     <h4 className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-[0.4em] mb-8">Related Transmissions</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPosts.map(post => (
                           <div 
                             key={post.id} 
                             onClick={() => setSelectedPost(post)}
                             className="group cursor-pointer space-y-4"
                           >
                              <div className="aspect-video overflow-hidden border border-neutral-900">
                                 <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 transition-all duration-500 hover:scale-105" />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[9px] font-mono text-neutral-600 uppercase">{post.category}</p>
                                 <h5 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-white transition-colors line-clamp-2">{post.title}</h5>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                {/* Comments Integration */}
                <CommentsSection postId={selectedPost.id} />
             </div>
          </div>
        </article>

        {/* Scroll To Top Button (Detail View) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 z-[60] w-10 h-10 bg-black/40 border border-neutral-800/50 backdrop-blur-xl flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-all group rounded-full"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        <section className="bg-neutral-950 border-t border-neutral-900 py-12 px-6">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 font-mono text-[10px] text-neutral-600 uppercase tracking-[0.4em]">
              <div className="flex items-center gap-6">
                 <span>Transmission: PRE_ALPHA</span>
                 <span>Signal: ENCRYPTED</span>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-white hover:text-neutral-400 transition-colors"
                >
                Navigate to Archives <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </section>
      </div>
    );
  }

  // LIST VIEW (If landing not used or for dedicated blog search)
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
      <BlogSEO />
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </button>

      <div className="mb-12 flex flex-col gap-8">
        <div className="border-b border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">{SITE_CONFIG.publicationTitle}</h1>
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest text-balance">{SITE_CONFIG.subtitle}</p>
            </div>
            
            <div className="w-full md:w-64 relative group">
                <input 
                  type="text"
                  placeholder="Search Archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-800 py-2 pl-8 pr-4 text-[10px] font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors uppercase tracking-widest"
                />
                <div className="absolute left-2.5 top-2.5">
                  {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="text-red-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <Search className="w-3 h-3 text-neutral-600 group-focus-within:text-white" />
                  )}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full py-1">
             {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="relative whitespace-nowrap px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors z-10"
                >
                  <span className={`relative z-10 ${activeCategory === cat ? 'text-black font-bold' : 'text-neutral-500 hover:text-white'}`}>
                    {cat}
                  </span>
                  {activeCategory === cat && (
                    <motion.div 
                      layoutId="blogCategory"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
             ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-12">
                {filteredPosts.map((post) => (
                    <article 
                      key={post.id} 
                      className="group flex flex-col md:flex-row gap-8 items-start cursor-pointer transition-opacity hover:opacity-90"
                      onClick={() => setSelectedPost(post)}
                    >
                        <div className="w-full md:w-1/3 aspect-[4/3] relative overflow-hidden bg-neutral-900 border border-neutral-900 flex-shrink-0">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm border border-neutral-800">
                              <span className="text-[8px] font-mono text-white uppercase tracking-widest">{post.category}</span>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-4 font-mono text-[10px] text-neutral-500 uppercase mb-3">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.date}</span>
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors tracking-tighter uppercase italic">
                                {post.title}
                            </h2>
                            <p className="font-mono text-xs text-neutral-500 leading-relaxed mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.slice(0, 3).map(tag => (
                                    <button 
                                      key={tag}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery(tag);
                                        setActiveCategory('All');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="px-3 py-1 bg-neutral-900/50 border border-neutral-800 text-[9px] font-mono font-bold text-neutral-500 hover:text-white hover:border-neutral-500 hover:bg-neutral-800 transition-all rounded-full flex items-center gap-1.5 uppercase tracking-widest"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-700/50"></span>
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 w-fit">
                                Open Transmission <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-neutral-900 bg-neutral-900/10">
              <div className="w-12 h-12 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Search className="w-5 h-5 text-neutral-600" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Null Result Detected</h3>
              <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">No transmissions matched your query in the neural logs.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-[10px] font-bold text-white uppercase border-b border-neutral-800 hover:border-white transition-all"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
            <div className="p-8 border border-neutral-900 bg-neutral-950/50 backdrop-blur-sm">
                <h4 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.4em] mb-8 border-b border-neutral-900 pb-4">Trending Signals</h4>
                <div className="flex flex-col gap-3">
                    {BLOG_POSTS.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4).map((post, i) => (
                        <div 
                          key={post.id} 
                          className="group/item cursor-pointer flex gap-3 items-center bg-neutral-900/40 border border-neutral-900 p-2 hover:bg-neutral-900 hover:border-neutral-800 transition-all rounded-sm"
                          onClick={() => setSelectedPost(post)}
                        >
                            <div className="w-10 h-10 relative shrink-0 overflow-hidden border border-neutral-900">
                                <img src={post.image} alt="" className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 bg-white/5 group-hover/item:bg-transparent"></div>
                                <div className="absolute bottom-0 right-0 bg-black/80 px-1 text-[6px] font-mono text-white/40">{i+1}</div>
                            </div>
                            <div className="space-y-1 min-w-0">
                                <p className="text-[7px] font-mono text-neutral-600 uppercase tracking-widest leading-none">{post.category}</p>
                                <h5 className="text-[10px] font-bold text-neutral-400 group-hover/item:text-white transition-colors uppercase leading-tight line-clamp-2">{post.title}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 border border-neutral-900 bg-white text-black">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-4 italic leading-none">Radar Alert</h4>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-6 opacity-60">Join 12k+ creators receiving weekly sonic transmissions.</p>
                <button className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all">
                  Sync Network
                </button>
            </div>
        </aside>

        {/* Scroll To Top Button (List View) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 z-[60] w-10 h-10 bg-black/40 border border-neutral-800/50 backdrop-blur-xl flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-all group rounded-full"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- CAREER PAGE ---
export const Career: React.FC<PageProps> = ({ onBack }) => (
  <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" /> Return to Base
    </button>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-900/30 bg-green-950/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-green-400">Hiring Active</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                Join The <br/> Neural Network
            </h1>
            <p className="font-mono text-sm text-neutral-400 leading-relaxed mb-8">
                We are looking for misfits, audio hackers, and full-stack wizards who want to disrupt the music industry. If you live at the intersection of Code and Culture, we want you.
            </p>
            <a href="mailto:careers@velocity.ai" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors">
                Send Resume <ArrowRight className="w-4 h-4" />
            </a>
        </div>
        
        <div className="border border-neutral-800 bg-neutral-900/20 p-8 relative">
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-neutral-800/50 blur-2xl rounded-full"></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 relative z-10">Why Join Velocity?</h3>
            <ul className="space-y-4 relative z-10">
                {[
                    "Remote-First Protocol (Work from anywhere)",
                    "Competitive Credits & Equity",
                    "Unlimited GPU Compute Access",
                    "Annual 'Rave Retreat' in Bali"
                ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 font-mono text-xs text-neutral-400">
                        <CheckCircle className="w-4 h-4 text-neutral-600" />
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
    </div>

    {/* Job Listings */}
    <div className="border-t border-neutral-800 pt-12">
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-[0.3em] mb-8">Open Positions</h2>
        <div className="grid grid-cols-1 gap-4">
            {[
                { role: "Senior Audio Synthesis Engineer", type: "Engineering", loc: "Remote / Jakarta" },
                { role: "Fullstack Developer (Next.js + WebGL)", type: "Product", loc: "Remote" },
                { role: "Growth Hacker (Dangdut Specialist)", type: "Marketing", loc: "Surabaya / Hybrid" },
                { role: "AI Model Trainer (Rhythm Focus)", type: "R&D", loc: "Remote" }
            ].map((job, i) => (
                <div key={i} className="group flex items-center justify-between p-6 border border-neutral-800 bg-black hover:bg-neutral-900 transition-colors cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{job.role}</h3>
                        <div className="flex gap-2">
                             <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase text-neutral-500">{job.type}</span>
                             <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase text-neutral-500">{job.loc}</span>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
            ))}
        </div>
    </div>
  </div>
);

// Helper Icon
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}

