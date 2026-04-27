'use client';

import { ArrowLeft, Zap, Target, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 animate-[fadeIn_0.5s_ease-out] text-neutral-300">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </Link>

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
}
