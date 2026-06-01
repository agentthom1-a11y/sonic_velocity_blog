'use client';

import React from 'react';
import { ArrowUpRight, Twitter, Instagram, Music } from 'lucide-react';
import { Link } from './Link';
import { SITE_CONFIG } from '../blogData';

interface FooterProps {
  dict: any;
  locale: string;
}

export const Footer: React.FC<FooterProps> = ({ dict, locale }) => {
  return (
    <footer className="py-20 border-t border-neutral-900 bg-black relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1 space-y-6 text-left">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Sonic Velocity</h4>
              <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest leading-loose">
                {dict.common.platformSub}
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { Icon: Twitter, href: SITE_CONFIG.socials.twitter },
                { Icon: Instagram, href: SITE_CONFIG.socials.instagram },
                { Icon: Music, href: "#" }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center border border-neutral-800 hover:border-white hover:text-white text-neutral-600 transition-all">
                  <item.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2">{dict.common.platform}</h5>
            <div className="flex flex-col gap-2">
              <Link href={`/about`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.about}</Link>
              <Link href={`/models`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.models}</Link>
              <Link href={`/blog`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.blog}</Link>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2">{dict.common.intelligence}</h5>
            <div className="flex flex-col gap-2">
              <Link href={`/music-trends/indonesia/2026`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.indonesianTrends}</Link>
              <Link href={`/music-trends/asia/2026`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.asianTrends}</Link>
              <Link href={`/song-trend-signals`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.songSignals}</Link>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-2">{dict.common.glossary}</h5>
            <div className="flex flex-col gap-2">
              <Link href={`/glossary/ai-audio-synthesis`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.aiAudioSynthesis}</Link>
              <Link href={`/glossary/momentum-song`} className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-left hover:text-white transition-colors">{dict.common.momentumSongs}</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-neutral-900 font-mono text-[9px] text-neutral-700 uppercase tracking-[0.3em]">
          <span>OPERATIONAL_STATUS: OPTIMAL</span>
          <span>SONIC VELOCITY © 2026. ALL RIGHTS RESERVED.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 hover:text-white transition-colors">
            {dict.common.returnToTop} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
