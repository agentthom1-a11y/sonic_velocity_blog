'use client';

import { Shield, Lock, Activity, Server, Wifi, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </Link>
      
      <div className="border-b border-neutral-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-4">Terms of Service</h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Protocol: User Agreement v1.0</p>
      </div>

      <div className="space-y-12 font-mono text-sm leading-relaxed">
        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">01 // Usage License</h3>
          <p className="text-neutral-400">
            By initializing the Velocity Audio Engine, you are granted a non-exclusive, perpetual license to use the generated audio artifacts for both personal and commercial purposes on digital platforms including but not limited to TikTok, Instagram, and YouTube.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">02 // Liability Limits</h3>
          <p className="text-neutral-400">
            Velocity Systems is not liable for any content generated that mimics protected intellectual property inadvertently. The Neural Engine operates on stochastic processes. Users maintain full responsibility for the final deployment of audio assets.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">03 // Service Availability</h3>
          <p className="text-neutral-400">
            We do not guarantee 100% uptime. The system may undergo maintenance cycles during which the Synthesis API will be unreachable. Refunds are not issued for downtime less than 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
