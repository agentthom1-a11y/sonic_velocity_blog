import React from 'react';
import { Metadata } from 'next';
import { Link } from '@/components/Link';
import { Terminal, Activity, Zap, Search, Cpu, Globe, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { SITE_CONFIG } from '@/blogData';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';

  return {
    title: `AI Models Index | ${SITE_CONFIG.brand}`,
    description: 'A comprehensive index of AI music models, synthesis engines, and production tools for the Asian music market.',
    keywords: ['AI Models', 'Music AI', 'Suno AI', 'Udio AI', 'MiniMax', 'Stable Audio', 'Audio Synthesis', 'Music Trend Forecasting', 'Jaksel AI', 'Indonesian AI Music'],
    alternates: {
      canonical: `${baseUrl}/${locale}/models`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `${baseUrl}/${l}/models`])
      ),
    },
  };
}

const AI_MODELS = [
  {
    name: 'MiniMax Music-01',
    category: 'Full-Track Generation',
    description: 'State-of-the-art Chinese model optimized for high-fidelity music synthesis with vocal and instrumental separation.',
    tags: ['HQ Audio', 'Vocals', 'Asia Optimized'],
    relatedPostSlug: 'ai-music-generator-trends-2026-asian-music-production'
  },
  {
    name: 'Suno v4',
    category: 'Creative Synthesis',
    description: 'Leading model for multi-genre song generation with advanced lyrical understanding and emotional vocal delivery.',
    tags: ['Viral Hooks', 'Lyrical AI', 'Remixing'],
    relatedPostSlug: 'viral-tiktok-songs-indonesia-2026-predict-next-fyp-hit'
  },
  {
    name: 'Udio 1.5',
    category: 'Production Quality',
    description: 'High-fidelity audio generation with granular control over instrumentation and arrangement, ideal for professional demos.',
    tags: ['Pro Demos', 'Instrumentation', 'Logic Integration'],
    relatedPostSlug: 'ai-music-generator-trends-2026-asian-music-production'
  },
  {
    name: 'Stable Audio 2.0',
    category: 'Structural Synthesis',
    description: 'Diffusion-based model capable of generating up to 3 minutes of high-quality audio with coherent structure.',
    tags: ['Long-form', 'Coherent Structure', 'Remixing'],
    relatedPostSlug: 'southeast-asia-music-charts-explained-indonesia-thailand-vietnam-philippines-malaysia-singapore'
  },
  {
    name: 'Mochi-1',
    category: 'Vocal Transformation',
    description: 'Specialized in ultra-realistic vocal cloning and transformation, particularly effective for regional language adaptation.',
    tags: ['Vocal Clone', 'Localization', 'Regional Dialects'],
    relatedPostSlug: 'local-culture-global-sound-indonesian-internet-moments-asian-music-signals'
  },
  {
    name: 'Sonic Velocity: Genesis Core',
    category: 'Flagship Multimodal Engine',
    description: 'Our most advanced foundation model. Trained on pan-Asian music catalogs to deliver unprecedented semantic control across production, composition, and vocal synthesis.',
    tags: ['Foundation Model', 'Zero-Shot', 'Pan-Asian'],
    relatedPostSlug: 'ai-music-generator-trends-2026-asian-music-production',
    featured: true
  },
  {
    name: 'Sonic Velocity: Hallyu Spec',
    category: 'Genre-Specific Engine',
    description: 'Proprietary model fine-tuned for high-energy K-Pop arrangements, synchronized group vocals, and pristine commercial mixing.',
    tags: ['K-Pop', 'Group Vocals', 'Commercial'],
    relatedPostSlug: 'ai-music-generator-trends-2026-asian-music-production'
  },
  {
    name: 'Sonic Velocity: Nusantara Rhythm',
    category: 'Regional Rhythm Engine',
    description: 'Architecture explicitly designed for Indonesian Dangdut, featuring authentic Kendang rhythmic patterns and vocal cengkok modeling.',
    tags: ['Dangdut', 'Indonesia', 'Rhythm'],
    relatedPostSlug: 'southeast-asia-music-charts-explained-indonesia-thailand-vietnam-philippines-malaysia-singapore'
  },
  {
    name: 'Sonic Velocity: Shonen Spark',
    category: 'Instrumental & Vocal Synthesis',
    description: 'Model excelling in complex band instrumentation, distorted guitar harmonics, and dynamic anime-opening song structures.',
    tags: ['J-Rock', 'Band Sim', 'High Energy'],
    relatedPostSlug: 'local-culture-global-sound-indonesian-internet-moments-asian-music-signals'
  },
  {
    name: 'Sonic Velocity: Siam Wave',
    category: 'Genre-Specific Engine',
    description: 'Optimizing Thai Pop melodic sensibilities with lush synthesizer layers and emotional vocal delivery systems.',
    tags: ['T-Pop', 'Synth', 'Melodic'],
    relatedPostSlug: 'viral-tiktok-songs-indonesia-2026-predict-next-fyp-hit'
  },
  {
    name: 'Flux Audio',
    category: 'Fast Iteration',
    description: 'Optimized for speed, generating 15-30 second viral clips and hooks in seconds for rapid social media testing.',
    tags: ['Speed', 'Hooks', 'Social Media'],
    relatedPostSlug: 'viral-tiktok-songs-indonesia-2026-predict-next-fyp-hit'
  }
];

export default async function ModelsIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonicvelocitymusic.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Music Models Index',
    description: 'A comprehensive index of AI music models, synthesis engines, and production tools for the Asian music market.',
    itemListElement: AI_MODELS.map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: model.name,
        applicationCategory: 'MultimediaApplication',
        description: model.description,
        url: `${baseUrl}/${locale}/transmissions/${model.relatedPostSlug}`,
        keywords: model.tags.join(', ')
      }
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-12 text-neutral-500 hover:text-white transition-colors">
        ← {SITE_CONFIG.brand} // Base Console
      </Link>

      <header className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-neutral-900 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-800 bg-neutral-900/50 rounded-full mb-6">
              <Cpu className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                Core Engine Index // Model Repository
              </span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 italic">
              AI Models
            </h1>
            <p className="font-mono text-xs md:text-sm text-neutral-500 uppercase tracking-widest leading-relaxed">
              Indexing high-signal synthesis engines powering the Asian music revolution.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search_Model_Database..." 
                 className="w-full md:w-80 bg-neutral-950 border border-neutral-900 py-3 pl-12 pr-6 text-[11px] font-mono text-white focus:outline-none focus:border-neutral-700 transition-all uppercase tracking-widest"
               />
             </div>
          </div>
        </div>
      </header>

      {/* Featured Model */}
      {AI_MODELS.filter(m => m.featured).map((model, i) => (
        <div key={`featured-${i}`} className="group relative border border-cyan-500/50 bg-cyan-950/20 p-8 md:p-12 hover:border-cyan-400 transition-all overflow-hidden mb-12 rounded-xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2 py-1 border border-cyan-500/30 bg-cyan-500/10">Primary Engine</span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{model.category}</span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 italic">
                {model.name}
              </h3>
              
              <p className="text-sm text-neutral-400 font-mono leading-relaxed mb-8 max-w-2xl">
                {model.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8 md:mb-0">
                {model.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-3 py-1 border border-cyan-900/50 text-cyan-500 uppercase tracking-widest bg-cyan-950/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-auto shrink-0 flex items-center justify-center pt-4 md:pt-0">
               <Link 
                  href={`/transmissions/${model.relatedPostSlug}`}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
                >
                  <Zap className="w-4 h-4" />
                  <span>Access Engine</span>
                </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Grid of Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AI_MODELS.filter(m => !m.featured).map((model, i) => (
          <div key={i} className="group relative border border-neutral-900 bg-neutral-950/20 p-8 hover:border-white transition-all overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">{model.category}</span>
                <Zap className="w-4 h-4 text-neutral-800 group-hover:text-cyan-400 transition-colors" />
              </div>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:italic transition-all">
                {model.name}
              </h3>
              
              <p className="text-xs text-neutral-500 font-mono leading-relaxed mb-8 h-12 overflow-hidden">
                {model.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-10">
                {model.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-mono px-2 py-1 border border-neutral-900 text-neutral-600 uppercase tracking-widest group-hover:border-neutral-700">
                    {tag}
                  </span>
                ))}
              </div>
              
              <Link 
                href={`/transmissions/${model.relatedPostSlug}`}
                className="flex items-center justify-between pt-6 border-t border-neutral-900/50 group-hover:border-neutral-700 transition-all"
              >
                <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Analyze Transmission</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Index Summary */}
      <div className="mt-32 p-12 border border-neutral-900 bg-neutral-950/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-20"></div>
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="shrink-0 text-center md:text-left">
            <Globe className="w-16 h-16 text-neutral-800 mb-4" strokeWidth={1} />
            <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em]">Global Coverage</div>
          </div>
          <div>
            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 leading-none italic">
              Indexing the Synthesis Era
            </h4>
            <p className="text-sm font-mono text-neutral-400 uppercase tracking-widest leading-relaxed max-w-3xl">
              This repository is a living index of the compute engines powering the next generation of Asian music. 
              We map the intersection of machine intelligence and cultural identity to detect the signals that move markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
