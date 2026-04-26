'use client';

import { Shield, Lock, Activity, Server, Wifi, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-neutral-300 animate-[fadeIn_0.5s_ease-out]">
      <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-12 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </Link>

      <div className="border-b border-neutral-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-4">Privacy Protocols</h1>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Protocol: Data Encryption</p>
      </div>

      <div className="space-y-12 font-mono text-sm leading-relaxed">
        <section className="border border-neutral-800 bg-neutral-900/30 p-8">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="w-6 h-6 text-green-500" />
            <h3 className="text-white font-bold uppercase tracking-wider">Data Retention Policy</h3>
          </div>
          <p className="text-neutral-400">
            All inputs (Prompts, Mood Vectors) are processed ephemerally. We do not store user generation history longer than 30 days unless the user holds a "Studio Agency" tier account. Audio files are purged from cache after 24 hours.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">01 // Anonymity</h3>
          <p className="text-neutral-400">
            Velocity operates with a strict "No-Log" policy regarding IP addresses. Your creation patterns are not analyzed for advertising purposes.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">02 // Third Party Processors</h3>
          <p className="text-neutral-400">
            Payments are processed via encrypted gateways (Stripe/Midtrans). Velocity Systems does not have access to your raw financial instruments.
          </p>
        </section>
      </div>
    </div>
  );
}
