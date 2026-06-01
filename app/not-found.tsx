import React from 'react';
import { Metadata } from 'next';
import { Terminal, Activity, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/blogData';

export const metadata: Metadata = {
  title: `Page Not Found | ${SITE_CONFIG.brand}`,
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="bg-black text-neutral-300 min-h-screen flex items-center justify-center px-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-cyan-950/20 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-xl w-full border border-neutral-900 bg-neutral-950/80 backdrop-blur-xl p-8 md:p-12 relative z-10 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-10 border-b border-neutral-900 pb-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                Protocol: Module Expansion
              </span>
            </div>
            <span className="text-[9px] font-mono text-cyan-500/80 px-2 py-0.5 border border-cyan-900/50 bg-cyan-950/30 uppercase tracking-widest rounded-sm">
              Node Expansion
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6 italic leading-none flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
            System Node: Under Development
          </h1>

          <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-8 border-l-2 border-neutral-800 pl-4">
            The requested system node is currently undergoing neural reconstruction or is under active development. Our engineers are expanding the synthesis channels.
          </p>

          <a 
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.1)] text-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Base Console
          </a>
        </div>
      </body>
    </html>
  );
}
